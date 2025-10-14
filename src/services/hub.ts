import * as React from 'react';
import WifiManager from 'react-native-wifi-reborn';
import TcpSocket from 'react-native-tcp-socket';
import {PermissionsAndroid} from 'react-native';
import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export type RequiredPermissions =
  | 'location-permissions'
  | 'wifi-permissions'
  | 'wifi-enabled';

export const checkPermissions = async (): Promise<{
  missingPermissions: RequiredPermissions[];
}> => {
  const missingPermissions: RequiredPermissions[] = [];
  if (Platform.OS === 'android') {
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES,
    ]);

    if (
      result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] !== 'granted'
    ) {
      missingPermissions.push('location-permissions');
    }

    if (!(await WifiManager.isEnabled())) {
      missingPermissions.push('wifi-enabled');
    }

    if (
      result[PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES] === 'denied'
    ) {
      missingPermissions.push('wifi-permissions');
    }
  } else if (Platform.OS === 'ios') {
    let networkPermissionsGranted = true;

    const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    networkPermissionsGranted = status === RESULTS.GRANTED;

    if (!networkPermissionsGranted) {
      const req = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (req !== RESULTS.GRANTED) {
        throw new Error('Location permission is required to read the Wi-Fi SSID.');
      }
    
      missingPermissions.push('wifi-permissions');
    }
  }

  return {missingPermissions};
};

export const getCurrentWifi = async () => {
  const ssid = await WifiManager.getCurrentWifiSSID();
  return ssid;
};

export const connectToMedsenseWifi = async () => {
  await WifiManager.connectToProtectedSSID('medsense', '', false, false);
};

const EOL = '\r\n\0';
const HUB_IP = '192.168.2.1';
const HUB_PORT = 50000;

type HubCommand = {
  friendlyName: string;
  command: string;
};

const setupCommandsFactory = (
  wifiName: string,
  wifiPassword: string,
): HubCommand[] => {
  return [
    {
      friendlyName: 'Start Session',
      command: 'start:',
    },
    {
      friendlyName: 'Configure Wifi',
      command: `gwconfig:medsense,50000,pass,${wifiName},${wifiPassword},18.210.114.31,50000,1,gateway.medsense.health,45000,1,MedGW32-123456,3.3.1`,
    },
    {
      friendlyName: 'Set Debug',
      command: 'debug:1',
    },
    {
      friendlyName: 'Set Mode',
      command: 'mode:2',
    },
    {
      friendlyName: 'Set Flash',
      command: 'flash:',
    },
    {
      friendlyName: 'Reboot',
      command: 'reboot:',
    },
  ];
};

const sendHubCommand = (socket: TcpSocket.Socket, command: string) => {
  return new Promise((resolve, reject) => {
    const fullCommand = `${command}${EOL}`;
    socket.write(fullCommand, 'ascii');
    socket.once('data', function (data) {
      resolve(data);
    });

    socket.once('error', function (error) {
      reject(error);
    });
  });
};

export type HubFailureResult = {
  error: Error;
  lastCommandFriendlyName?: string;
};

export type HubWifiStatus =
  | {state: 'idle'}
  | {state: 'starting-connect'}
  | {state: 'connecting'}
  | {state: 'connected'}
  | {state: 'failed'; result: HubFailureResult};

export const useConnectToHubWifiNetwork = () => {
  const [status, setStatus] = React.useState<HubWifiStatus>({
    state: 'idle',
  });

  const logs = React.useRef<string[]>([]);

  React.useEffect(() => {
    let checkInterval: any;
    const start = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location permission is required for WiFi connections',
            message:
              'This app needs location permission as this is required  ' +
              'to scan for wifi networks.',
            buttonNegative: 'DENY',
            buttonPositive: 'ALLOW',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          logs.current.push('Android location permissio granted');
        } else {
          logs.current.push('Android location permissio denied');
          return setStatus({
            state: 'failed',
            result: {
              error: new Error('Android location permission is required'),
            },
          });
        }
      }

      logs.current.push('Starting hub setup');
      try {
        logs.current.push('About to connect to medsense Wifi');
        setStatus({
          state: 'starting-connect',
        });
        await connectToMedsenseWifi();
        logs.current.push('Connected to medsense Wifi');

        setStatus({
          state: 'connecting',
        });

        checkInterval = setInterval(async () => {
          try {
            const ssid = await getCurrentWifi();
            const isConnected = ssid === 'medsense';
            if (isConnected) {
              setStatus({
                state: 'connected',
              });

              clearInterval(checkInterval);
            }
          } catch (error) {
            return setStatus({
              state: 'failed',
              result: {
                error: error as Error,
              },
            });
          }
        }, 15000);
      } catch (error) {
        logs.current.push(
          'Failed to connect to Wifi: ' + (error as Error).message,
        );
        return setStatus({
          state: 'failed',
          result: {
            error: error as Error,
          },
        });
      }
    };

    start();

    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  return {
    status,
  };
};
export type HubStatus =
  | {state: 'idle'}
  | {state: 'connecting-to-hub'}
  | {state: 'configuring-hub'; step: string; percentDone: number}
  | {state: 'rebooting-hub'}
  | {state: 'connection-closed'}
  | {state: 'failed'; result: HubFailureResult};

export const useHubSetupClient = (
  shouldConnect: boolean,
  wifiName: string,
  wifiPassword: string,
): {status: HubStatus; logs: any} => {
  const [status, setStatus] = React.useState<HubStatus>({
    state: 'idle',
  });
  const setupCommands = React.useMemo(
    () => setupCommandsFactory(wifiName, wifiPassword),
    [wifiName, wifiPassword],
  );

  const logs = React.useRef<string[]>([]);

  React.useEffect(() => {
    if (!shouldConnect) {
      return;
    }

    let connection: any = null;
    const start = async () => {
      logs.current.push('Updating UI to reflect about to connect to hub');
      setStatus({state: 'connecting-to-hub'});

      logs.current.push('Creating TCP Connection to Hub');
      connection = TcpSocket.createConnection(
        {
          port: HUB_PORT,
          host: HUB_IP,
          // reuseAddress: true,
          interface: 'wifi' as 'wifi',
        },
        () => {
          logs.current.push('Recd connect success in callback');
        },
      );

      connection.on('error', (error: any) => {
        logs.current.push('Connection Error');
        setStatus({
          state: 'failed',
          result: {
            error,
          },
        });
      });

      connection.on('close', function () {
        logs.current.push('Connection closed');
        setStatus({
          state: 'connection-closed',
        });
      });

      logs.current.push('About to register connection handler');
      connection.on('connect', async () => {
        logs.current.push('Recd connect event in emitter callback');
        for (let stepIndex in setupCommands) {
          const step = setupCommands[stepIndex];
          logs.current.push('Starting to process step ' + step.friendlyName);

          try {
            const percentDone = Math.round(
              (Number(stepIndex) / setupCommands.length) * 100,
            );
            setStatus({
              state: 'configuring-hub',
              step: step.friendlyName,
              percentDone,
            });

            logs.current.push('About to send command ' + step.friendlyName);
            await sendHubCommand(connection, step.command);
            logs.current.push(
              'Reached commnad success for command ' + step.friendlyName,
            );
          } catch (error) {
            logs.current.push(
              'Failed to send command (' +
                step.friendlyName +
                '): ' +
                (error as Error).message,
            );
            return setStatus({
              state: 'failed',
              result: {
                error: error as Error,
                lastCommandFriendlyName: step.friendlyName,
              },
            });
          }
        }

        logs.current.push('Finished sending all commands');
        setStatus({state: 'rebooting-hub'});
      });
    };

    start();

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      logs.current.push('Destroying connecting');
      connection?.destroy();
    };
  }, [setupCommands, shouldConnect, setStatus]);

  return {
    status,
    logs,
  };
};

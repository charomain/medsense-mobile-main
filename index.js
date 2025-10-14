import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { ErrorBoundary } from './src/dev/ErrorBoundary';

AppRegistry.registerComponent(appName, () => () => (
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
));

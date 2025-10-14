import {Colors} from '@app/appearance/colors';
import {useTheme} from '@app/contexts/theme';
import {Fonts} from '@app/appearance/fonts';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Circle, G, Line, Rect, Svg, Text} from 'react-native-svg';
import {format} from 'date-fns';
import {InsightRunChartDatum} from '@app/services/api/insights';
import {parseServerDateString} from '@app/shared/utils';

type RunChartGraphProps = {
  dateFormat: string;
  data: InsightRunChartDatum[];
  maxYLabel: number;
};

const WIDTH = 500;
const HEIGHT = 300;

const BAR_WIDTH = 10;
const BAR_HEIGHT_AREA = 250;

const GUIDE_MARKS = 13;

const X_LEGEND_WIDTH = 50;
const TOP_MARGIN = 20;

const getLabelForGuideIndex = (hour: number) => {
  if (hour === 0 || hour === 24) {
    return '12am';
  } else if (hour === 12) {
    return '12pm';
  } else if (hour > 12) {
    const afternoonHour = hour - 12;
    return `${afternoonHour}pm`;
  }
  return `${hour}am`;
};

type InsightRunChartGraphDatum = {
  yPercent: number;
  status: 'taken' | 'missed';
  time: string;
};

const parseTimeParts = (time: string) => {
  const [hours, minutes, seconds] = time.split(':').map(t => Number(t));
  return [hours, minutes, seconds];
};

const getTimeAsPercentOfDay = (time: string) => {
  const [hours, minutes, seconds] = parseTimeParts(time);
  const secondsIntoDay = hours * 60 * 60 + minutes * 60 + seconds;
  return secondsIntoDay / 86400;
};

export const RunChartGraph: React.FC<RunChartGraphProps> = ({
  data,
  dateFormat,
  maxYLabel,
}) => {
  const theme = useTheme();
  const bgLines = React.useMemo(() => {
    return new Array(GUIDE_MARKS).fill(0);
  }, []);

  const chartData = React.useMemo(() => {
    const byDate = data.reduce((accum, datum) => {
      if (!accum[datum.date]) {
        accum[datum.date] = [];
      }

      if (datum.status === 'fail') {
        accum[datum.date].push({
          yPercent: getTimeAsPercentOfDay(datum.actualTime),
          status: 'missed',
          time: datum.time,
        });
      } else {
        accum[datum.date].push({
          yPercent: getTimeAsPercentOfDay(datum.actualTime),
          status: 'taken',
          time: datum.actualTime,
        });
      }

      return accum;
    }, {} as {[date: string]: InsightRunChartGraphDatum[]});

    const list = Object.entries(byDate) as Array<
      [string, InsightRunChartGraphDatum[]]
    >;
    return list.map(([date, doses]) => {
      return [parseServerDateString(date), doses];
    });
  }, [data]) as Array<[Date, InsightRunChartGraphDatum[]]>;
  const datumColAreaWidth = (WIDTH - X_LEGEND_WIDTH) / chartData.length;

  const showEveryXLabel = chartData.length > maxYLabel ? maxYLabel : 1;

  const doseWindows = React.useMemo(() => {
    const byDate = Object.values(
      data.reduce((accum, datum) => {
        if (!accum[datum.date]) {
          accum[datum.date] = [];
        }

        accum[datum.date].push(datum);

        return accum;
      }, {} as {[date: string]: InsightRunChartDatum[]}),
    );

    if (byDate.length === 0) {
      return [];
    }

    return byDate[byDate.length - 1].map(p => {
      const doseTime = parseTimeParts(p.time);
      const min = [...doseTime];
      min[0] -= 2;

      const max = [...doseTime];
      max[0] += 3;

      return {
        minYPercent: 1 - getTimeAsPercentOfDay(min.join(':')),
        maxYPercent: 1 - getTimeAsPercentOfDay(max.join(':')),
      };
    });
  }, [data]);

  return (
    <View style={styles.self}>
      <Svg height="100%" width="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <Line
          x1={X_LEGEND_WIDTH}
          y1={TOP_MARGIN}
          x2={X_LEGEND_WIDTH}
          y2={BAR_HEIGHT_AREA + TOP_MARGIN}
          stroke={theme.mutedColor}
          strokeWidth="1"
        />
        <G>
          {bgLines.map((_, i) => {
            const y = i * (BAR_HEIGHT_AREA / (bgLines.length - 1)) + TOP_MARGIN;
            return (
              <G>
                <Line
                  key={i}
                  x1={X_LEGEND_WIDTH}
                  y1={y}
                  x2={WIDTH}
                  y2={y}
                  stroke={theme.mutedColor}
                  strokeWidth="1"
                />
                <Text
                  fontFamily={Fonts.primary}
                  fontSize={14}
                  x={X_LEGEND_WIDTH / 2}
                  y={y}
                  fill={theme.mutedColor}
                  textAnchor="middle">
                  {getLabelForGuideIndex(i * 2)}
                </Text>
              </G>
            );
          })}
        </G>
        <G>
          {doseWindows.map(window => (
            <Rect
              fill={'rgba(68, 214, 0, 0.3)'}
              x={X_LEGEND_WIDTH}
              width={WIDTH - X_LEGEND_WIDTH}
              y={
                BAR_HEIGHT_AREA -
                BAR_HEIGHT_AREA * window.maxYPercent +
                TOP_MARGIN
              }
              height={
                BAR_HEIGHT_AREA * (window.maxYPercent - window.minYPercent)
              }
            />
          ))}
        </G>
        <G>
          {chartData.map(([date, doses], index) => {
            const leftMostBarArea = datumColAreaWidth * index + X_LEGEND_WIDTH;
            const barCenter = leftMostBarArea + datumColAreaWidth / 2;
            const textY = BAR_HEIGHT_AREA + 20 + TOP_MARGIN;
            const shouldShowLabel = index % showEveryXLabel === 0;
            return (
              <G>
                {doses.map(dose => (
                  <Circle
                    x={barCenter - BAR_WIDTH / 2}
                    y={BAR_HEIGHT_AREA * dose.yPercent + TOP_MARGIN - 1.5}
                    r={5}
                    fill={
                      dose.status === 'missed' ? Colors.missedRed : Colors.blue
                    }
                  />
                ))}
                {shouldShowLabel && (
                  <Text
                    fontFamily={Fonts.primary}
                    fontSize={14}
                    x={barCenter}
                    y={textY}
                    fill={theme.mutedColor}
                    textAnchor="middle">
                    {format(date, dateFormat)}
                  </Text>
                )}
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  self: {
    aspectRatio: WIDTH / HEIGHT,
  },
});

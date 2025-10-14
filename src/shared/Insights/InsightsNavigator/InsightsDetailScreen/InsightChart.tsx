import {Colors} from '@app/appearance/colors';
import {useTheme} from '@app/contexts/theme';
import {Fonts} from '@app/appearance/fonts';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {G, Line, Rect, Svg, Text} from 'react-native-svg';
import {format} from 'date-fns';

type InsightChartDatum = {
  date: Date;
  percent: number;
};

type InsightChartProps = {
  dateFormat: string;
  data: InsightChartDatum[];
};

const WIDTH = 500;
const HEIGHT = 300;

const BAR_WIDTH = 10;
const BAR_HEIGHT_AREA = 250;

const GUIDE_MARKS = 5;

const X_LEGEND_WIDTH = 50;
const TOP_MARGIN = 20;

export const InsightChart: React.FC<InsightChartProps> = ({
  data,
  dateFormat,
}) => {
  const theme = useTheme();
  const bgLines = React.useMemo(() => {
    return new Array(GUIDE_MARKS).fill(0);
  }, []);

  const datumColAreaWidth = (WIDTH - X_LEGEND_WIDTH) / data.length;

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
            const y =
              BAR_HEIGHT_AREA -
              i * (BAR_HEIGHT_AREA / (bgLines.length - 1)) +
              TOP_MARGIN;
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
                  {Math.round((i / (GUIDE_MARKS - 1)) * 100)}%
                </Text>
              </G>
            );
          })}
        </G>
        <G>
          {data.map((point, index) => {
            const barHeight = BAR_HEIGHT_AREA * point.percent;
            const barY = BAR_HEIGHT_AREA - barHeight + TOP_MARGIN;
            const leftMostBarArea = datumColAreaWidth * index + X_LEGEND_WIDTH;
            const barCenter = leftMostBarArea + datumColAreaWidth / 2;
            const textY = BAR_HEIGHT_AREA + 20 + TOP_MARGIN;

            return (
              <G>
                <Rect
                  x={barCenter - BAR_WIDTH / 2}
                  y={barY}
                  height={barHeight}
                  width={BAR_WIDTH}
                  fill={Colors.blue}
                  rx={5}
                  ry={5}
                />
                <Text
                  fontFamily={Fonts.primary}
                  fontSize={14}
                  x={barCenter}
                  y={textY}
                  fill={theme.mutedColor}
                  textAnchor="middle">
                  {format(point.date, dateFormat)}
                </Text>
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

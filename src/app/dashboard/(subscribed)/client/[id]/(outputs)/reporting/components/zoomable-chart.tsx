"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceArea,
  LineChart,
  Line,
} from "recharts";
import { moneyFormatter } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface ReferenceLineConfig {
  year: string | number;
  label: string;
  color?: string;
  strokeDasharray?: string;
}

interface TooltipConfig {
  money?: boolean;
  indicator?: "line" | "dot";
  wrapperStyle?: React.CSSProperties;
}

interface ZoomableChartProps {
  data: Record<string, string | number>[];
  config: ChartConfig;
  height?: string | number;
  referenceLines?: ReferenceLineConfig[];
  yAxisWidth?: number;
  xAxisDataKey?: string;
  type?: "line" | "area";
  tooltipOptions?: TooltipConfig;
}

// Takes: Data as an array of records <string, string | number>, a ChartConfig object, a height value,
//        An array of ReferenceLineConfig objects, the yAxisWidth, a type string, and a tooltipOptions object.
// Defaults: height: 400, referenceLines: [], yAxisWidth: 60, type: "line", and tooltipOptions: {}.
export function ZoomableChart({
  data,
  config,
  height = 400,
  referenceLines = [],
  xAxisDataKey = "year",
  yAxisWidth = 60,
  type = "line",
  tooltipOptions = {},
}: ZoomableChartProps) {
  // Define state variables for the chart.
  const chartRef = useRef<HTMLDivElement>(null);
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [startX, setStartX] = useState<string | null>(null);
  const [endX, setEndX] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // On data change, set the start and end years.
  useEffect(() => {
    if (data?.length) {
      setStartX(data[0][xAxisDataKey].toString());
      setEndX(data[data.length - 1][xAxisDataKey].toString());
    }
  }, [data, xAxisDataKey]);

  // On mount, prevent default wheel event.
  useEffect(() => {
    // Prevent default wheel event.
    const preventDefault = (e: WheelEvent) => {
      if (chartRef.current?.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    // Add event listener for wheel event which unmounts on cleanup.
    window.addEventListener("wheel", preventDefault, { passive: false });
    return () => window.removeEventListener("wheel", preventDefault);
  }, []);

  // On change to startYear, endYear, or data set the zoomedData.
  const zoomedData = useMemo(() => {
    // If startYear or endYear are not set, return the data.
    if (!startX || !endX) {
      return data;
    }

    // Find the data points within the year range and return the first 3.
    const dataPointsInRange = data.filter(
      (point) =>
        Number(point[xAxisDataKey]) >= Number(startX) &&
        Number(point[xAxisDataKey]) <= Number(endX)
    );
    return dataPointsInRange.length > 1 ? dataPointsInRange : data.slice(0, 2);
  }, [startX, endX, data, xAxisDataKey]);

  const handleMouseDown = (e: { activeLabel?: string }) => {
    if (e.activeLabel) {
      setRefAreaLeft(e.activeLabel);
      setIsSelecting(true);
    }
  };

  const handleMouseMove = (e: { activeLabel?: string }) => {
    if (isSelecting && e.activeLabel) {
      setRefAreaRight(e.activeLabel);
    }
  };

  const handleMouseUp = () => {
    if (refAreaLeft && refAreaRight) {
      const [left, right] = [refAreaLeft, refAreaRight].sort();
      setStartX(left);
      setEndX(right);
    }
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setIsSelecting(false);
  };

  const handleReset = () => {
    setStartX(data[0][xAxisDataKey].toString());
    setEndX(data[data.length - 1][xAxisDataKey].toString());
  };

  const handleZoom = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!data.length || !chartRef.current) return;

    const zoomFactor = 0.1;
    const direction = e.deltaY < 0 ? 1 : -1;
    const clientX = e.clientX;

    const currentRange = Number(endX) - Number(startX);
    const zoomAmount = currentRange * zoomFactor * direction;

    const chartRect = chartRef.current.getBoundingClientRect();
    const mouseX = clientX - chartRect.left;
    const chartWidth = chartRect.width;
    const mousePercentage = mouseX / chartWidth;

    const currentStartX = Number(startX);
    const currentEndX = Number(endX);

    const newStartX = Math.round(currentStartX + zoomAmount * mousePercentage);
    const newEndX = Math.round(
      currentEndX - zoomAmount * (1 - mousePercentage)
    );

    if (newEndX - newStartX >= 2) {
      setStartX(newStartX.toString());
      setEndX(newEndX.toString());
    }
  };

  const ChartComponent = type === "line" ? LineChart : AreaChart;
  const SeriesComponent = type === "line" ? Line : Area;

  return (
    <>
      <div className="flex justify-end">
        <Button
          onClick={handleReset}
          disabled={!startX && !endX}
          className="text-xs sm:text-sm print:hidden"
        >
          Reset Zoom
        </Button>
      </div>
      <div className="relative w-full" style={{ height }}>
        <div className="h-full" onWheel={handleZoom} ref={chartRef}>
          <ChartContainer className="h-full w-full" config={config}>
            <ResponsiveContainer>
              <ChartComponent
                data={zoomedData}
                margin={{
                  left: 12,
                  right: 12,
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {referenceLines.map((line, index) => (
                  <ReferenceLine
                    key={index}
                    label={{ value: line.label, position: "left" }}
                    x={line.year.toString()}
                    stroke={line.color || "red"}
                    strokeDasharray={line.strokeDasharray || "3 3"}
                  />
                ))}
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey={xAxisDataKey}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={yAxisWidth}
                  tickFormatter={moneyFormatter.format}
                  domain={[0, (dataMax: number) => Math.round(dataMax * 1.15)]}
                />
                <ChartTooltip
                  wrapperStyle={tooltipOptions.wrapperStyle}
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      money={tooltipOptions.money}
                      indicator={tooltipOptions.indicator}
                    />
                  }
                />
                {Object.keys(config).map((key) => (
                  <SeriesComponent
                    key={key}
                    dataKey={key}
                    type="monotone"
                    fillOpacity={0.4}
                    stroke={`var(--color-${key})`}
                    strokeWidth={type === "line" ? 4 : 1}
                    dot={false}
                    isAnimationActive={false}
                  />
                ))}
                {refAreaLeft && refAreaRight && (
                  <ReferenceArea
                    x1={refAreaLeft}
                    x2={refAreaRight}
                    strokeOpacity={0.3}
                    fill="hsl(var(--foreground))"
                    fillOpacity={0.05}
                  />
                )}
                <ChartLegend content={<ChartLegendContent />} />
              </ChartComponent>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </>
  );
}

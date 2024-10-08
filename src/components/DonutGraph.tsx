import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface DonutGraphProps {
  data: number[];
  labels: string[];
}

const DonutGraph: React.FC<DonutGraphProps> = ({ data, labels }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let myChart: Chart<"doughnut">;

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            datasets: [
              {
                data,
                backgroundColor: [
                  '#d6980e',
                  '#C4C4C4',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF',
                ],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%',
          },
        });
      }
    }

    return () => {
      myChart.destroy()
    }
  }, [data]);

  return <canvas id="donut-graph" ref={canvasRef} />;
};

export default DonutGraph;

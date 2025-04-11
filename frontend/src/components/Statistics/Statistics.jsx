import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

function Statistics() {
  return (
    <div className="w-1/2 h-1/2 mx-auto mt-10 bg-white p-5 rounded-lg shadow-lg">
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: [
              "rendelesemhonapja1",
              "rendelesemhonapja2",
              "rendelesemhonapja3",
            ],
          },
        ]}
        // yAxis shows the times the product was ordered in months
        series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
      />
    </div>
  );
}

export default Statistics;

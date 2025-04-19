import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";

function Statistics() {
  const [stat, setStat] = useState({
    total: 0,
    "product-count": 0,
    "user-earnings": 0,
  });

  useEffect(() => {
    axios.get("/api/statistics").then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        setStat(res.data);
      }
    });
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 bg-white p-5 rounded-lg shadow-lg">
      <div className="w-full" style={{ height: 400 }}>
        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: [
                "Total earnings from sales",
                "Number of items sold",
                "Your total earnings",
              ],
            },
          ]}
          series={[
            {
              data: [stat.total, stat["product-count"], stat["user-earnings"]],
            },
          ]}
        />
      </div>
    </div>
  );
}

export default Statistics;

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import api from "../config/Api";
import { useEffect, useState } from "react";

const TurfBookingChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/api/analytics/turf-bookings").then((res) => setData(res.data));
  }, []);

  return (
    <BarChart width={600} height={300} data={data}>
      <XAxis dataKey="turf" />
      <YAxis />
      <Tooltip />
      <CartesianGrid stroke="#ccc" />
      <Bar dataKey="bookings" fill="#8884d8" />
    </BarChart>
  );
};

export default TurfBookingChart;

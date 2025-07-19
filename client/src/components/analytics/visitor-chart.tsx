"use client";
import { useGetlast10minStatsQuery } from "@/apis/event-api";
import React from "react";

const VisitorsChart = () => {
  const { data } = useGetlast10minStatsQuery();
  console.log("🚀 ~ VisitorsChart ~ data:", data);
  return <div className="col-span-2"></div>;
};

export default VisitorsChart;

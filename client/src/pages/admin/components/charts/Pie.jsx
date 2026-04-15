import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";

const data = [
  { name: "Completed", value: 45, color: "#10b981" },
  { name: "Pending",   value: 25, color: "#22d3ee" },
  { name: "Cancelled", value: 15, color: "#f43f5e" },
  { name: "Active",    value: 15, color: "#6366f1" },
];

const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{payload[0].name}</p>
        <p className="text-sm font-black text-white">
          {payload[0].value}{" "}
          <span className="text-slate-400 text-[10px]">
            ({((payload[0].value / totalValue) * 100).toFixed(1)}%)
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const PieComponent = () => {
  return (
    <div className="flex h-[320px] sm:h-[380px] w-full flex-col rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Booking Status</h3>
          <p className="text-[10px] font-medium text-slate-500">Real-time distribution</p>
        </div>
        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
        </div>
      </div>

      {/* Responsive height container — avoids width(-1)/height(-1) error */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="35%"
              outerRadius="55%"
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              animationBegin={200}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{ filter: `drop-shadow(0 0 8px ${entry.color}44)` }}
                />
              ))}
              <Label
                value={totalValue}
                position="center"
                content={({ viewBox: { cx, cy } }) => (
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
                    <tspan x={cx} dy="-8" fontSize="24" fontWeight="900" fill="white">
                      {totalValue}
                    </tspan>
                    <tspan x={cx} dy="22" fontSize="9" fontWeight="900" fill="#64748b" letterSpacing="2">
                      TOTAL
                    </tspan>
                  </text>
                )}
              />
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              content={({ payload }) => (
                <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-3">
                  {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieComponent;

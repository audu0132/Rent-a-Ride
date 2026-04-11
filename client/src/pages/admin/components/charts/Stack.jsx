import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const data = [
  { name: "Jan", SUV: 400, Sedan: 240, Luxury: 120 },
  { name: "Feb", SUV: 300, Sedan: 139, Luxury: 80 },
  { name: "Mar", SUV: 200, Sedan: 980, Luxury: 200 },
  { name: "Apr", SUV: 278, Sedan: 390, Luxury: 150 },
  { name: "May", SUV: 189, Sedan: 480, Luxury: 180 },
  { name: "Jun", SUV: 239, Sedan: 380, Luxury: 220 },
  { name: "Jul", SUV: 349, Sedan: 430, Luxury: 300 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">{label} Report</p>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs font-bold text-slate-300 capitalize">{entry.name}</span>
              </div>
              <span className="text-sm font-black text-white">{entry.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
           <span className="text-[10px] font-bold text-slate-500 uppercase">Total</span>
           <span className="text-xs font-black text-emerald-400">
             {payload.reduce((acc, curr) => acc + curr.value, 0)}
           </span>
        </div>
      </div>
    );
  }
  return null;
};

const Stack = () => {
  return (
    <div className="h-[450px] w-full rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-40 w-40 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="mb-10 flex items-center justify-between relative z-10">
        <div>
          <h3 className="text-xl font-black text-white tracking-tight">Revenue Breakdown</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Vehicle Category Distribution</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-2xl border border-white/5 bg-white/5 px-4 py-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Growth</span>
            <span className="text-xs font-black text-emerald-400">+12.5%</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="75%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSUV" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSedan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLuxury" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid 
            vertical={false} 
            strokeDasharray="0" 
            stroke="rgba(255,255,255,0.03)" 
          />
          
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#475569", fontSize: 10, fontWeight: 800 }}
            dy={15}
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#475569", fontSize: 10, fontWeight: 800 }}
          />

          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            content={({ payload }) => (
              <div className="flex gap-6 mb-8">
                {payload.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{entry.value}</span>
                  </div>
                ))}
              </div>
            )}
          />

          <Area
            type="monotone"
            dataKey="SUV"
            stackId="1"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#colorSUV)"
            animationDuration={2500}
          />
          <Area
            type="monotone"
            dataKey="Sedan"
            stackId="1"
            stroke="#22d3ee"
            strokeWidth={3}
            fill="url(#colorSedan)"
            animationDuration={2500}
          />
          <Area
            type="monotone"
            dataKey="Luxury"
            stackId="1"
            stroke="#6366f1"
            strokeWidth={3}
            fill="url(#colorLuxury)"
            animationDuration={2500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Stack;

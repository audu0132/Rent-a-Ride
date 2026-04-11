import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", bookings: 40 },
  { name: "Feb", bookings: 80 },
  { name: "Mar", bookings: 65 },
  { name: "Apr", bookings: 120 },
  { name: "May", bookings: 90 },
  { name: "Jun", bookings: 150 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-emerald-400">
          <span className="text-white">Bookings: </span>
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const LineChart = () => {
  return (
    <div className="h-[400px] w-full rounded-3xl border border-white/5 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Booking Analytics</h3>
          <p className="text-xs font-medium text-slate-500">Monthly performance overview</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {/* Gradient for the line stroke shadow */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
               <feGaussianBlur stdDeviation="4" result="blur" />
               <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Gradient for the fill under the line */}
            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            
            {/* Gradient for the stroke itself */}
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          <CartesianGrid 
            vertical={false} 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.05)" 
          />
          
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(16, 185, 129, 0.2)', strokeWidth: 2 }} />

          {/* Glowing Shadow Area (Subtle Blur Effect) */}
          <Area
            type="monotone"
            dataKey="bookings"
            stroke="none"
            fill="url(#colorBookings)"
            animationDuration={2000}
          />

          {/* The Main Glowing Line */}
          <Area
            type="monotone"
            dataKey="bookings"
            stroke="url(#strokeGradient)"
            strokeWidth={4}
            fill="transparent"
            filter="url(#glow)"
            dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#0f172a" }}
            activeDot={{ r: 6, fill: "#fff", strokeWidth: 0, shadow: "0 0 10px #10b981" }}
            animationDuration={2000}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;

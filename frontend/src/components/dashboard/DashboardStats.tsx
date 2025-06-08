import React, { useEffect, useState } from "react";

type Stat = {
  label: string;
  value: number;
  icon: React.ReactNode;
};

function useCountUp(to: number, duration = 1200): string {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / (duration / 16));
    let raf: number;
    function animate() {
      start += step;
      if (start >= to) {
        setValue(to);
      } else {
        setValue(start);
        raf = requestAnimationFrame(animate);
      }
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return value.toLocaleString();
}

const stats: Stat[] = [
  {
    label: "Total Songs",
    value: 101237890,
    icon: (
      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-white/10">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <rect x={4} y={4} width={16} height={16} rx={4} />
          <path d="M9 8h6M9 12h6M9 16h3" />
        </svg>
      </div>
    ),
  },
  {
    label: "Total Albums",
    value: 8540210,
    icon: (
      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-white/10">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <rect x={6} y={6} width={12} height={12} rx={2} />
          <path d="M9 9h6v6H9z" />
        </svg>
      </div>
    ),
  },
  {
    label: "Total Artists",
    value: 11364800,
    icon: (
      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-white/10">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx={12} cy={8} r={4} />
          <path d="M4 20v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
        </svg>
      </div>
    ),
  },
  {
    label: "Total Users",
    value: 410000000,
    icon: (
      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-white/10">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </div>
    ),
  },
];

const DashboardStats: React.FC = () => {
  const animatedValues = stats.map((stat) => useCountUp(stat.value, 1200));

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="w-full max-w-[1400px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="rounded-md p-6 flex flex-col gap-4 text-white bg-gradient-to-br from-[#2e1065] via-[#5b21b6] to-[#7e22ce]"
          >
            <div>{stat.icon}</div>
            <div className="text-sm font-medium text-white/80">{stat.label}</div>
            <div className="text-2xl font-bold tracking-tight">
              {animatedValues[i]} +
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;

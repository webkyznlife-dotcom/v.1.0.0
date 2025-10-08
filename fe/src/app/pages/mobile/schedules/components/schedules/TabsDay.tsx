import React, { useState, useEffect } from "react";

interface TabsDayProps {
  days: { day: string; date: string }[];
  children?: React.ReactNode;
}

const TabsDay: React.FC<TabsDayProps> = ({ days, children }) => {
  // Cari hari ini berdasarkan date
  const today = new Date().toLocaleDateString("en-GB"); // format dd/mm/yyyy
  const currentDay = days.find((d) => d.date === today)?.day || days[0].day;

  const [activeDay, setActiveDay] = useState(currentDay);

  return (
    <div className="w-full">
      {/* Tabs header */}
      <div className="flex justify-center gap-2.5 mb-4 flex-wrap">
        {days.map(({ day, date }) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex flex-col items-center
              ${
                activeDay === day
                  ? "bg-green-700 text-white shadow-sm" // aktif klik → hijau gelap
                  : date === today
                  ? "bg-green-400 text-gray-900 shadow-sm" // current day → hijau menengah, text gelap
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300" // default
              }
            `}
          >
            <span className="font-semibold">{day}</span>
            <span className="text-xs mt-0.5">{date}</span>
          </button>
        ))}
      </div>

      {/* Tabs content */}
      <div className="mt-2">
        {React.Children.map(children, (child: any) =>
          child.props.day === activeDay ? child : null
        )}
      </div>
    </div>
  );
};

interface TabPaneProps {
  day: string;
  children: React.ReactNode;
}

export const TabPane: React.FC<TabPaneProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default TabsDay;

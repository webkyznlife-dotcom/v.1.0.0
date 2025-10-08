import React, { useMemo } from "react";

export type ScheduleSlot = {
  program: string;
  age: string;
  time: string;       // "07:00"
  instructor: string;
  date: string;
  endTime?: string;
};

export type ScheduleRowOutput = {
  room: string;                     // court
  schedules: (ScheduleSlot | null)[]; // slot dari API
};

// helper untuk jam
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const hhmm = (h: number) => `${pad2(h)}:00`;

// buat labels jam 07:00–22:00
const buildHourLabels = (start = 7, end = 22) =>
  Array.from({ length: end - start + 1 }, (_, i) => hhmm(start + i));

interface CourtHourListProps {
  rows: ScheduleRowOutput[];
}

export const CourtHourList: React.FC<CourtHourListProps> = ({ rows }) => {
  const hours = useMemo(() => buildHourLabels(), []);

  return (
    <div className="space-y-6">
      {rows.map((row) => (
        <div key={row.room} className="bg-white rounded-lg shadow-md p-4">
          {/* Court */}
          {/* <div className="font-bold text-lg mb-3">{row.room}</div> */}

          {/* Jam */}
          {hours.map((h, idx) => {
            const item = row.schedules[idx] || null; // mapping index → jam
            return (
              <div key={h} className="mb-2">
                <div className="font-semibold text-gray-700">{h}</div>
                {item ? (
                  <div className="ml-4 bg-yellow-100 rounded p-2">
                    <div className="font-medium">{item.program}</div>
                    <div className="text-sm text-gray-600">
                      {item.age} - {item.instructor}
                    </div>
                  </div>
                ) : (
                  <div className="ml-4 text-gray-400">- (Empty)</div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

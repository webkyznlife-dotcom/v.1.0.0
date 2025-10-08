import React, { useMemo } from "react";

type ScheduleItem = {
  program: string;
  age: string;
  time: string;           // "07:00"
  instructor: string;
  date: string;
};
type ScheduleRow = {
  room: string;
  schedules: (ScheduleItem | null)[];
};

type EventItem = {
  room: string;
  program: string;
  age: string;
  time: string;
  instructor: string;
  date: string;
};

// helper buat jam
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const hhmm = (h: number) => `${pad2(h)}:00`;
const buildHourLabels = (start = 7, end = 22) =>
  Array.from({ length: end - start + 1 }, (_, i) => hhmm(start + i));

// flatten rows -> events
function flattenRows(rows: ScheduleRow[]): EventItem[] {
  const evts: EventItem[] = [];
  for (const row of rows) {
    for (const item of row.schedules) {
      if (item) {
        evts.push({
          room: row.room,
          program: item.program,
          age: item.age,
          time: item.time,
          instructor: item.instructor,
          date: item.date
        });
      }
    }
  }
  return evts.sort((a, b) =>
    a.time === b.time ? a.room.localeCompare(b.room) : a.time.localeCompare(b.time)
  );
}

// group by jam
function groupByHour(events: EventItem[]) {
  return events.reduce<Record<string, EventItem[]>>((acc, e) => {
    (acc[e.time] ||= []).push(e);
    return acc;
  }, {});
}

export const MobileHourList: React.FC<{ rows: ScheduleRow[] }> = ({ rows }) => {
  const events = useMemo(() => flattenRows(rows), [rows]);
  const byHour = useMemo(() => groupByHour(events), [events]);
  const hours = useMemo(() => buildHourLabels(7, 22), []);

  return (
    <div className="px-4 py-4 space-y-3">
      {hours.map((h) => {
        const items = byHour[h] || [];
        return (
          <div key={h} className="bg-white rounded-lg shadow-sm p-3">
            <div className="font-bold text-gray-800 mb-2">{h}</div>
            {items.length === 0 ? (
              <div className="text-sm text-gray-400 ml-2">- (kosong)</div>
            ) : (
              <ul className="space-y-2">
                {items.map((e, idx) => (
                  <li
                    key={`${h}-${idx}`}
                    className="flex flex-col sm:flex-row sm:justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-800">{e.room}</span>
                    <span className="text-gray-700 text-sm">
                      {e.program} ({e.age}) - {e.instructor}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

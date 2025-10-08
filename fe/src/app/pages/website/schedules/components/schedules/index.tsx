import React from "react";
import { Table } from "antd";

export type ScheduleItem = {
  program: string;
  age: string;
  time: string;
  instructor: string;
};

export type ScheduleRow = {
  room: string;
  schedules: (ScheduleItem | null)[];
};

export type ScheduleTableProps = {
  days?: string[];
  times: string[];
  rows: ScheduleRow[];
};

const ScheduleTable: React.FC<ScheduleTableProps> = ({ days, times, rows }) => {
  const columns = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: 120,
      fixed: "left" as const,
      onHeaderCell: () => ({
        style: { backgroundColor: "#E0E0E0", color: "#000", fontWeight: "bold" },
      }),
      onCell: () => ({
        style: { backgroundColor: "#F5F5F5", color: "#000", fontWeight: "bold" },
      }),
    },
    ...rows.map((row) => ({
      title: row.room,
      dataIndex: row.room,
      key: row.room,
      width: 280,
      onHeaderCell: () => ({
        style: { backgroundColor: "#1976D2", color: "#fff", fontWeight: "bold" },
      }),
      render: (schedule: ScheduleItem | null) =>
        schedule ? (
          <div
            style={{
              backgroundColor: "#FFF9C4",
              padding: "8px",
              borderRadius: "4px",
            }}
          >
            <div className="font-semibold text-sm">{schedule.program}</div>
            <div className="text-sm">{schedule.age}</div>
            <div className="text-sm">
              {schedule.time} - <span className="font-medium">{schedule.instructor}</span>
            </div>
          </div>
        ) : null,
    })),
  ];

  const dataSource = times.map((time, idx) => {
    const rowData: any = { key: time, time };
    rows.forEach((row) => {
      rowData[row.room] = row.schedules[idx];
    });
    return rowData;
  });

  // Hitung 80% dari tinggi viewport
  const tableHeight = window.innerHeight * 0.8;

  return (
    <Table
      className="custom-scroll-table"
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      bordered
      scroll={{ x: "max-content", y: tableHeight }}
      sticky
    />
  );
};

export default ScheduleTable;

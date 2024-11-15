import React from "react";
import { useTable, Column, CellProps } from "react-table";

// Project:     Reactjs Practice
// Module:      Attendance Module
// Component:   Attendance Component
// Author:      Advyta
// Date:        10 Nov 2024

// Logic:
// This component gets Table name and json data as props and renders a table using React-table.
// Generates table columns dynamically based on current month and year, correctly formatted date headers.
// Generates a row to display the correct day and displays Employee attendance. Absent cells have red background and 
// holidays have gray background
//


interface Employee {
  id: number;
  name: string;
  leaves: string; // Comma-separated leave dates
}

interface tableProps {
  tableName: string;
  mockData: Employee[];
}

// Utility function to get the last date of the given month and year
function getLastDateOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0); // Sets date to 0 to get the last day of the previous month
}

function generateDateColumns(year: number, month: number): Column<Employee>[] {
  const columns: Column<Employee>[] = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "name" },
  ];

  const existingColumnHeaders = new Set<string>();

  const startDate = new Date(year, month, 1);
  const endDate = getLastDateOfMonth(year, month);

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateKey = currentDate.getDate().toString().padStart(2, "0");
    const dayOfWeek = currentDate.getDay(); // 0 for Sunday, 6 for Saturday

    // Check for duplicate before adding
    if (!existingColumnHeaders.has(dateKey)) {
      columns.push({
        Header: dateKey,
        accessor: dateKey as keyof Employee,
        Cell: ({ row }: CellProps<Employee>) => {
          const leaveDays = row.original.leaves
            .split(",")
            .map((day: string) => day.trim());

          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const isLeaveDay = leaveDays.includes(dateKey);

          return <span>{isWeekend ? "-" : isLeaveDay ? "A" : "P"}</span>;
        },
      });
      // existingColumnHeaders.add(dateKey);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
  return columns;
}

function formatTableData(data: Employee[]): Employee[] {
  return data.map((employee) => {
    const formattedEmployee: any = { ...employee };
    for (let day = 1; day <= 31; day++) {
      const dayString = day.toString().padStart(2, "0");
      formattedEmployee[dayString] = "";
    }
    return formattedEmployee;
  });
}

const Table = ({ tableName, mockData }: tableProps) => {
  // dynamic value
  // Using current month and year
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // const startDate = new Date(year, month, 1);
  const endDate = getLastDateOfMonth(year, month);
  const data = React.useMemo(() => formatTableData(mockData), [mockData]);
  const columns = React.useMemo(
    () => generateDateColumns(year, month),
    [year, month]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div>
      <h1 className="name">{tableName}</h1>
      <div className="container">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
            {/* Days Row */}
            <tr>
              <th colSpan={2}></th> {/* Empty cells for ID and Name columns */}
              {Array.from({ length: endDate.getDate() }).map((_, index) => {
                const date = new Date(year, month, index + 1);
                const dayOfWeek = date.toLocaleString("en-US", {
                  weekday: "short",
                });
                return (
                  <th
                    key={index}
                    className={`${
                      dayOfWeek === "Sat" || dayOfWeek === "Sun" ? "bg-secondary" : ""
                    }`}
                  >
                    {dayOfWeek}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell) => {
                    const columnDay = parseInt(cell.column.id, 10);

                    // Check if columnDay is a valid date to prevent issues with ID/Name columns
                    if (!isNaN(columnDay)) {
                      const cellDate = new Date(year, month, columnDay);
                      const isWeekend =
                        cellDate.getDay() === 0 || cellDate.getDay() === 6;
                      // Check if the current day is in the leaveDays list
                      const leaveDays = row.original.leaves
                        .split(",")
                        .map((day: string) => day.trim());
                      const isLeaveDay = leaveDays.includes(cell.column.id);

                      // styling
                      const cellStyle =  `text-center ${
                        isWeekend ? "bg-secondary bg-opacity-50 text-white" : ""
                      } ${isLeaveDay ? "bg-danger bg-opacity-75 text-white" : ""}`;

                      return (
                        <td {...cell.getCellProps()} className={cellStyle}>
                          {cell.render("Cell")}
                        </td>
                      );
                    } else {
                      // Default cell rendering for non-date columns (e.g., ID, Name)
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

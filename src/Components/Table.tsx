import React from "react";
import mockData from "../Mock_Data.json";
import { useTable, Column, CellProps } from "react-table";

// Project:     Reactjs Practice
// Module:      Attendance Module
// Component:   Attendance Component
// Author:      Advyta
// Date:        10 Nov 2024

// Logic:
// - Generates table columns dynamically based on a date range, correctly formatted date headers.
// - Formats initial table data to include all days in the month, initializing values as empty strings.

// UI Behavior:
// - Renders a table with headers for each day of the month, alongside columns for employee ID and name.
// - Marks a cell with "A" if the employee was absent on that day, based on the leaves data provided in `mockData`.
// - Uses React hooks (useMemo) to optimize column and data generation for performance.

// Screen Data:
// - Data Source: Reads data from `Mock_Data.json`.
// - Column Generation: `generateDateColumns()` function creates date-specific columns from a given date range.
// - Data Formatting: `formatTableData()` ensures all employees have pre-initialized empty attendance fields.

// Screen Data Validation Rules:
// - Validates that each date is checked against a formatted, zero-padded string for consistency.

interface Employee {
  id: number;
  name: string;
  leaves: string; // Comma-separated leave dates
}

function generateDateColumns(
  startDate: Date,
  endDate: Date
): Column<Employee>[] {
  const columns: Column<Employee>[] = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "name" },
  ];

  const existingColumnHeaders = new Set<string>();

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateKey = currentDate.getDate().toString().padStart(2, "0");

    // Check for duplicate before adding
    if (!existingColumnHeaders.has(dateKey)) {
      columns.push({
        Header: dateKey,
        accessor: dateKey as keyof Employee,
        Cell: ({ row }: CellProps<Employee>) => {
          const leaveDays = row.original.leaves
            .split(",")
            .map((day: string) => day.trim());
          return <span>{leaveDays.includes(dateKey) ? "A" : ""}</span>;
        },
      });
      existingColumnHeaders.add(dateKey);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
  return columns;
}

function formatTableData(data: Employee[]): Employee[] {
  return data.map((employee) => {
    const formattedEmployee: any = { ...employee };
    for (let day = 0; day <= 31; day++) {
      const dayString = day.toString().padStart(2, "0");
      formattedEmployee[dayString] = "";
    }
    return formattedEmployee;
  });
}

const Table = () => {
  // dynamic value
  const startDate = new Date(2024, 10, 1);
  const endDate = new Date(2024, 10, 31);
  const data = React.useMemo(() => formatTableData(mockData), []);
  const columns = React.useMemo(
    () => generateDateColumns(startDate, endDate),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div>
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
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
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

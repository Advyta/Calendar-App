import fakeData from '../MOCK_DATA.json';
import * as React from "react";
import { useTable } from "react-table";

//
//

// function BuildColNames(my_data) {
//   let colArray = [];
//   //
//   for (const key of Object.keys(my_data)) {
//     const value = my_data[key];
//     console.log(key, value);
//     colArray.push({ Header: key, accessor: key });
//   }
//   return colArray;
// }

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  university: string;
}

function OriginalTable() {
  const data = React.useMemo(() => fakeData, []);
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id" as keyof Employee,
      },
      {
        Header: "First Name",
        accessor: "first_name" as keyof Employee,
      },
      {
        Header: "Last Name",
        accessor: "last_name" as keyof Employee,
      },
      {
        Header: "Email",
        accessor: "email" as keyof Employee,
      },
      {
        Header: "Gender",
        accessor: "gender" as keyof Employee,
      },
      {
        Header: "University",
        accessor: "university" as keyof Employee,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className="App">
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
                    <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OriginalTable;

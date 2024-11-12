import React from 'react';
import './App.css';
import Table from './Components/Table';
import mockData from './Mock_Data.json'

function App() {
  return (
    <div className="App">
      <Table tableName={"Attendance Table"} mockData={mockData}/>
    </div>
  );
}

export default App;

import React from 'react';
import './App.css';
import Table from './Components/MCalTable';
import mockData from './My_Mock_Data.json'

function App() {
  return (
    <div className="App">
      <Table tableName={"Attendance Table"} mockData={mockData}/>
    </div>
  );
}

export default App;

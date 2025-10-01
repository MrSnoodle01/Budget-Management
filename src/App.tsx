import './App.css';
import MoneyInput from './components/MoneyInput';
import DisplayTransactions from './components/DisplayTransactions';
import DateSortButtons from './components/DateSortButtons';
import Graphs from './components/Graphs';
import { useState } from 'react';

function App() {
  const [dateSelection, setDateSelection] = useState("");

  return (
    <div className='page'>
      <div className="left-section">
        <DateSortButtons onDateSelectionChange={setDateSelection} />
      </div>
      <div className='middle-section'>
        <MoneyInput />
        <DisplayTransactions dateSelection={dateSelection} />
      </div>
      <div className="right-section">
        <Graphs dateSelection={dateSelection} />
      </div>
    </div>
  )
}

export default App
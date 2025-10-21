import './App.css';
import MoneyInput from './components/MoneyInput';
import DisplayTransactions from './components/DisplayTransactions';
import DateSortButtons from './components/DateSortButtons';
import Graphs from './components/Graphs';
import FilterSelection from './components/FilterSelection';
import { useState, useEffect } from 'react';
import type { TransactionType } from './types/transaction';

function App() {
  const [dateSelection, setDateSelection] = useState("");
  const [transactions, setTransactions] = useState<TransactionType[]>([])
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/getUserTransactions/1');
        if (!res.ok) {
          throw new Error(`HTTP error, status: ${res.status}`);
        }
        const json = await res.json();
        setTransactions(json.transactions);
      } catch (error) {
        console.error("Error fetching transactions: ", error);
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, []);

  return (
    <div className='page'>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="left-section">
            <DateSortButtons onDateSelectionChange={setDateSelection} transactions={transactions} />
            <FilterSelection onChangeFilter={setFilter} transactions={transactions} dateSelection={dateSelection} />
          </div>
          <div className='middle-section'>
            <MoneyInput onChangeTransaction={setTransactions} />
            <DisplayTransactions dateSelection={dateSelection} transactions={transactions} filter={filter} onChangeTransaction={setTransactions} />
          </div>
          <div className="right-section">
            <Graphs dateSelection={dateSelection} transactions={transactions} />
          </div>
        </>
      )}
    </div>
  )
}

export default App
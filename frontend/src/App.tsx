import './App.css';
import MoneyInput from './components/MoneyInput';
import DisplayTransactions from './components/DisplayTransactions';
import DateSortButtons from './components/DateSortButtons';
import Graphs from './components/Graphs';
import { useState, useEffect } from 'react';

type TransactionType = {
  id: number;
  transactionType: string;
  transactionCategory?: string;
  categoryType?: string;
  subCategoryType?: string;
  amount: number;
  date: string;
}

function App() {
  const [dateSelection, setDateSelection] = useState("");
  const [transactions, setTransactions] = useState<TransactionType[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/getUserTransactions/3');
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
          </div>
          <div className='middle-section'>
            <MoneyInput onAddTransaction={setTransactions} />
            <DisplayTransactions dateSelection={dateSelection} transactions={transactions} />
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
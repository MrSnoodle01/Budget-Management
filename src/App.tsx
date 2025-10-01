import './App.css';
import MoneyInput from './components/MoneyInput';
import DisplayTransactions from './components/DisplayTransactions';
import DateSortButtons from './components/DateSortButtons';
import { PieChart } from '@mui/x-charts';
import { useEffect, useState } from 'react';
import { tempData } from './assets/tempData'

function App() {
  const [expenses, setExpenses] = useState(0);
  const [income, setIncome] = useState(0);
  const [dateSelection, setDateSelection] = useState("");

  useEffect(() => {
    let tempExpenses = 0;
    let tempIncome = 0;

    tempData.forEach(e => {
      if (e.transactionType == "Expense") {
        tempExpenses += e.amount;
      } else if (e.transactionType == "Income") {
        tempIncome += e.amount
      }
    });

    setExpenses(parseFloat(tempExpenses.toFixed(2)));
    setIncome(parseFloat(tempIncome.toFixed(2)));
  }, [])

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
        <PieChart series={[
          {
            data: [
              { id: 0, value: income, color: 'green' },
              { id: 1, value: expenses, color: 'red' },
            ],
          },
        ]} />
      </div>
    </div>
  )
}

export default App
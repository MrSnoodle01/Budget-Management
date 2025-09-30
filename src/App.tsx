import './App.css';
import MoneyInput from './components/MoneyInput';
import DisplayTransactions from './components/DisplayTransactions';
import { PieChart } from '@mui/x-charts';


function App() {
  return (
    <div>
      <div className='middle-section'>
        <MoneyInput />
        <DisplayTransactions />
      </div>
      <div className="right-col">
        <PieChart series={[
          {
            data: [
              { id: 0, value: 10, label: 'series A' },
              { id: 1, value: 20, label: 'series B' },
              { id: 2, value: 30, label: 'series C' },
            ],
          },
        ]} />
      </div>
    </div>
  )
}

export default App

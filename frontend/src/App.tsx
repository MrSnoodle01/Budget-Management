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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const token = localStorage.getItem("token");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("https://useful-catha-richardsonjosh03-4f8884d3.koyeb.app/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      alert("Email or password is incorrect");
      throw new Error("Email or password is incorrect");
    }

    const data = await res.json();

    localStorage.setItem("token", data.access_token);
    setLoggedIn(true);
    return data.user;
  }

  async function handleRegisterUser(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("https://useful-catha-richardsonjosh03-4f8884d3.koyeb.app/api/registerUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      alert("Email is already in use");
      throw new Error("Email is already in use");
    }

    const data = await res.json();

    localStorage.setItem("token", data.access_token);
    setLoggedIn(true);
    return data.user;
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://useful-catha-richardsonjosh03-4f8884d3.koyeb.app/api/getUserTransactions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
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
  }, [loggedIn]);

  return (
    <div className='page'>
      {localStorage.getItem("token") != null ? (
        loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="left-section">
              <DateSortButtons onDateSelectionChange={setDateSelection} transactions={transactions} />
              <FilterSelection onChangeFilter={setFilter} transactions={transactions} dateSelection={dateSelection} />
              <p>Logged in as {email}</p>
              <button onClick={handleLogout}>logout</button>
            </div>
            <div className='middle-section'>
              <MoneyInput onChangeTransaction={setTransactions} />
              <DisplayTransactions dateSelection={dateSelection} transactions={transactions} filter={filter} onChangeTransaction={setTransactions} />
            </div>
            <div className="right-section">
              <Graphs dateSelection={dateSelection} transactions={transactions} />
            </div>
          </>
        )
      ) : (
        <div className="login-page">
          <div className="login-input">
            <p>Email: </p>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-text"
            />
          </div>
          <div className="login-input">
            <p>Password: </p>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-text"
            />
          </div>
          <button onClick={handleLogin}> Log In </button>
          <button onClick={handleRegisterUser}> Sign up </button>
        </div>
      )
      }
    </div>
  )
}

export default App
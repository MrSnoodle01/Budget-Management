import './App.css';
import ReCAPTCHA from "react-google-recaptcha";
import MoneyInput from './components/MoneyInput';
import DisplayTransactions from './components/DisplayTransactions';
import DateSortButtons from './components/DateSortButtons';
import Graphs from './components/Graphs';
import FilterSelection from './components/FilterSelection';
import LineChart from './components/LineChart';
import { useState, useEffect } from 'react';
import type { TransactionType } from './types/transaction';
import type { FilterType } from './types/filter';

function App() {
  const [dateSelection, setDateSelection] = useState("");
  const [transactions, setTransactions] = useState<TransactionType[]>([])
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>({
    transactionType: 'All',
    transactionCategory: 'All',
    categoryType: 'All',
    subCategoryType: 'All'
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token") != null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const res = await fetch(API_URL + "/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      alert("Email or password is incorrect");
      throw new Error("Email or password is incorrect");
    }

    const data = await res.json();

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      setLoggedIn(true);
    } else {
      throw new Error("No access token reutrned from API (login)");
    }

    return data.user;
  }

  async function handleRegisterUser(e: React.FormEvent) {
    e.preventDefault();

    if (!recaptchaToken) {
      alert("Please complete the CAPTCHA first");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API_URL + "/api/registerUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, recaptcha_token: recaptchaToken }),
      });

      if (!res.ok) {
        alert("Email is already in use");
        throw new Error("Email is already in use");
      }

      const data = await res.json();

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        setLoggedIn(true);
      } else {
        throw new Error("No access token returned from API (registration)");
      }

      return data.user;
    } catch (err) {
      console.error("Error registering user: ", err);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found in localStorage before fetch");
          setLoggedIn(false);
          setLoading(false);
          return;
        }
        const res = await fetch(API_URL + '/api/getUserTransactions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error(`HTTP error, status: ${res.status}`);
        }
        const json = await res.json();
        setTransactions(json.transactions);
        setEmail(json.email);
      } catch (error) {
        console.error("Error fetching transactions: ", error);
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    if (loggedIn) {
      fetchData();
    }
  }, [loggedIn]);

  return (
    <div className='page'>
      {loggedIn ? (
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
              <MoneyInput onChangeTransaction={setTransactions} transactions={transactions} />
              <DisplayTransactions dateSelection={dateSelection} transactions={transactions} filter={filter} onChangeTransaction={setTransactions} />
              <LineChart transactions={transactions} filter={filter} />
            </div>
            <div className="right-section">
              <Graphs dateSelection={dateSelection} transactions={transactions} filter={filter} />
            </div>
          </>
        )
      ) : (
        <div className="login-page">
          <h1>Budget Tracker</h1>
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
          <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={(token) => setRecaptchaToken(token)} />
          <button onClick={handleLogin}> Log In </button>
          <button onClick={handleRegisterUser}> Sign up </button>
        </div>
      )
      }
    </div>
  )
}

export default App
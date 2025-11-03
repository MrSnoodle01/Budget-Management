import '../App.css';
import MoneyInput from '../components/MoneyInput';
import DisplayTransactions from '../components/DisplayTransactions';
import DateSortButtons from '../components/DateSortButtons';
import Graphs from '../components/Graphs';
import FilterSelection from '../components/FilterSelection';
import LineChart from '../components/LineChart';
import { useState, useEffect } from 'react';
import type { TransactionType } from '../types/transaction';
import type { FilterType } from '../types/filter';

type DashboardPageProps = {
    API_URL: string;
    onLogout: () => void;
}

export default function dashboardPage({ API_URL, onLogout }: DashboardPageProps) {
    const [dateSelection, setDateSelection] = useState("");
    const [transactions, setTransactions] = useState<TransactionType[]>([])
    const [filter, setFilter] = useState<FilterType>({
        transactionType: 'All',
        transactionCategory: 'All',
        categoryType: 'All',
        subCategoryType: 'All'
    });
    const [email, setEmail] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.warn("No token found in localStorage before fetch");
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
            }
        };

        fetchData();
    }, []);

    return (
        <div className='page'>
            <>
                <div className="left-section">
                    <DateSortButtons onDateSelectionChange={setDateSelection} transactions={transactions} />
                    <FilterSelection onChangeFilter={setFilter} transactions={transactions} dateSelection={dateSelection} />
                    <p>Logged in as {email}</p>
                    <button onClick={onLogout}>logout</button>
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
        </div>
    )
}

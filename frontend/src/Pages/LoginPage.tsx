import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, pieArcLabelClasses } from '@mui/x-charts';
import LineChart from "../components/LineChart";
import DateSortButtons from "../components/DateSortButtons";
import FilterSelection from "../components/FilterSelection";
import { tempData } from "../assets/tempData";
import type { FilterType } from "../types/filter";
import "./LoginPage.css";

type LoginPageProps = {
    API_URL: string;
    setLoggedIn: (value: boolean) => void;
};

const filter: FilterType = {
    transactionType: 'All',
    transactionCategory: 'All',
    categoryType: 'All',
    subCategoryType: 'All'
}

export default function LoginPage({ API_URL, setLoggedIn }: LoginPageProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const screenWidth: number = window.innerWidth;
    const screenHeight: number = window.innerHeight;
    const income = 4829.28;
    const needs = 2190.29;
    const wants = 1329.95;
    const savings = 890.00;

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        document.body.style.cursor = "wait";

        const res = await fetch(API_URL + "/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        document.body.style.cursor = "default";

        if (!res.ok) {
            alert("Email or password is incorrect");
            return;
        }

        const data = await res.json();
        if (data.access_token) {
            localStorage.setItem("token", data.access_token);
            setLoggedIn(true);
            navigate("/");
        }
    }

    return (
        <div className="bottom-section">
            <div className="left-container">
                <h2>Easily filter by date or by category</h2>
                <DateSortButtons onDateSelectionChange={() => null} transactions={tempData} />
                <FilterSelection onChangeFilter={() => null} transactions={tempData} />
            </div>
            <div className="login-container">
                <div className="login-card">
                    <h1 className="login-title">Login</h1>

                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="login-input"
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="login-input"
                            required
                        />
                        <button type="submit" className="login-button">
                            Log In
                        </button>
                    </form>

                    <p className="signup-text">
                        Don’t have an account?
                        <button
                            type="button"
                            className="signup-button"
                            onClick={() => navigate("/signup")}
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
            <div className="right-container">
                <h2>Graphs to show monthly spending</h2>
                <div className="graphs">
                    <PieChart
                        series={[
                            {
                                arcLabel: (item) => `${item.id} ${item.value}%`,
                                arcLabelMinAngle: 10,
                                arcLabelRadius: '50%',
                                data: [
                                    { id: 'Needs', value: parseFloat((needs / income * 100).toFixed(2)), color: '#82ff71ff' },
                                    { id: 'Wants', value: parseFloat((wants / income * 100).toFixed(2)), color: '#FF6B6B' },
                                    { id: 'Savings', value: parseFloat((savings / income * 100).toFixed(2)), color: '#FFE66D' },
                                    { id: 'Extra', value: parseFloat(((income - needs - wants - savings) / income * 100).toFixed(2)), color: 'gray' },
                                ],
                            },
                        ]}
                        width={screenWidth / 3}
                        height={screenHeight / 3}
                        sx={{
                            [`& .${pieArcLabelClasses.root}`]: {
                                fontSize: String(screenWidth / 120) + 'px',
                            },
                        }}
                    />
                    <p style={{ margin: 0 }}>
                        Needs: ${parseFloat((needs).toFixed(2))} <br />
                        Wants: ${parseFloat((wants).toFixed(2))} <br />
                        Savings: ${parseFloat((savings).toFixed(2))} <br />
                        Total: ${(parseFloat((needs).toFixed(2)) + parseFloat((wants).toFixed(2)) + parseFloat((savings).toFixed(2))).toFixed(2)} <br />
                        Extra: ${parseFloat(((income - needs - wants - savings)).toFixed(2))}<br />
                    </p>
                    <LineChart transactions={tempData} filter={filter} width={screenWidth * .35} height={screenHeight * .35} />
                </div>
            </div>
        </div>
    );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

type LoginPageProps = {
    API_URL: string;
    setLoggedIn: (value: boolean) => void;
};

export default function LoginPage({ API_URL, setLoggedIn }: LoginPageProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

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
    );
}

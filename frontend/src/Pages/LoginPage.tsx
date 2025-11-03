import { useState } from "react";
import { useNavigate } from "react-router-dom";

type LoginPageProps = {
    API_URL: string;
    setLoggedIn: (value: boolean) => void;
}

export default function LoginPage({ API_URL, setLoggedIn }: LoginPageProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch(API_URL + "/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

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
        <div className="login-page">
            <h1>Login</h1>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Log In</button>
            <p>
                Don't have an account?
                <button onClick={() => navigate("/signup")}>Sign up</button>
            </p>
        </div>
    )
}
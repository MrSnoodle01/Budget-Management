import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

type SignupPageProps = {
    API_URL: string;
    setLoggedIn: (value: boolean) => void;
}

export default function SignupPage({ API_URL, setLoggedIn }: SignupPageProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const navigate = useNavigate();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        if (!recaptchaToken) {
            alert("Please complete CAPTCHA first");
            return;
        }

        if (!email) {
            alert("Please enter an email");
            return;
        }

        if (!password) {
            alert("Please enter a password");
            return;
        }

        const res = await fetch(API_URL + "/api/registerUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, recaptcha_token: recaptchaToken }),
        });

        if (!res.ok) {
            alert("Email is already in use");
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
                <h1 className="login-title">Sign up</h1>

                <form onSubmit={handleRegister}>
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
                    <div className="captcha-container">
                        <ReCAPTCHA
                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                            onChange={setRecaptchaToken}
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Sign up
                    </button>
                </form>

                <p className="signup-text">
                    Already have an account?
                    <button
                        type="button"
                        className="signup-button"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';

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
        <div className="signup-page">
            <h1>Sign Up</h1>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={setRecaptchaToken} />
            <button onClick={handleRegister}>Register</button>
            <p>
                Already have an account?
                <button onClick={() => navigate("/login")}>Log in</button>
            </p>
        </div>
    )
}
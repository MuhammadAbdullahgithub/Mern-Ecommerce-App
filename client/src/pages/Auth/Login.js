import React, { useState } from 'react';
import Layout from "./../../components/Layout/Layout";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import "../../styles/AuthStyles.css";
import { useAuth } from '../../context/auth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);

    // Form submission function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sending a POST request to login the user
            const res = await axios.post("/api/v1/auth/login", {
                email,
                password,
            });

            // Checking if the login was successful
            if (res && res.data.success) {
                // Show success message with extended duration (5 seconds)
                toast.success(res.data.message, { duration: 5000 });

                // Set auth data and save to localStorage
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                });

                localStorage.setItem('auth', JSON.stringify({
                    user: res.data.user,
                    token: res.data.token
                }));

                // Navigate to the homepage
                navigate(location.state || "/");
            } else {
                // Show error message in case of failure
                toast.error(res.data.message, { duration: 8000 });
            }
        } catch (error) {
            // Improved error handling for debugging
            console.log("Error Details:", error.response ? error.response.data : error.message);
            toast.error(error.response?.data?.message || 'Something went wrong', { duration: 8000 });
        }
    };

    return (
        <Layout title="Login - Ecommerce Web">
            <div className="container-form">
                <form onSubmit={handleSubmit}>
                    <h1 className="title">Login Form</h1>

                    <div className="mb-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            placeholder="Enter Your Email"
                            required
                        />
                    </div>

                    <div className="mb-3 password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            placeholder="Enter Your Password"
                            required
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="toggle-password-icon"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <button type="button" className="btn btn-primary" onClick={() => { navigate('/forgot-password') }}>
                        Forgot Password
                    </button>
                    <button type="submit" className="btn btn-primary">
                        LOGIN
                    </button>
                </form>
            </div>
        </Layout>
    );
}

export default Login;

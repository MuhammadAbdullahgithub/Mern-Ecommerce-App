import React, { useState } from 'react';
import Layout from "./../../components/Layout/Layout";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import "../../styles/AuthStyles.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [answer, setAnswer] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    // Form submission function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sending a POST request to reset the password
            const res = await axios.post("/api/v1/auth/forgot-password", {
                email,
                answer,
                newPassword,
            });

            // Checking if the password reset was successful
            if (res && res.data.success) {
                // Show success message for password reset
                toast.success("Password reset successfully", { duration: 8000 });

                // Navigate to the login page
                navigate("/login");
            } else {
                // Show error message if password reset fails
                toast.error(res.data.message, { duration: 8000 });
            }
        } catch (error) {
            // Improved error handling for debugging
            console.log("Error Details:", error.response ? error.response.data : error.message);
            toast.error(error.response?.data?.message || 'Something went wrong', { duration: 8000 });
        }
    };

    return (
        <Layout title={'Forgot Password - Ecommerce APP'}>
            <div className="container-form">
                <form onSubmit={handleSubmit}>
                    <h1 className="title">RESET PASSWORD</h1>

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
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="form-control"
                            placeholder="Enter New Password"
                            required
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="toggle-password-icon"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="form-control"
                            placeholder="Enter Your Favourite Sport Name"
                            required
                        />
                    </div>


                    <button type="submit" className="btn btn-primary">
                        RESET
                    </button>
                </form>
            </div>
        </Layout>
    )
}

export default ForgotPassword;

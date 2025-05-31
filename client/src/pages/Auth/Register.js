import React, { useState } from 'react';
import Layout from "./../../components/Layout/Layout";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import "../../styles/AuthStyles.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Form submission function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending a POST request to register the user
      const res = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        address,
        answer
      });

      // Checking if the registration was successful
      if (res && res.data.success) {
        // Show success message with extended duration (8 seconds)
        toast.success(res.data.message, { duration: 8000 });
        navigate('/login');
      } else {
        // Show error message in case of failure
        toast.error(res.data.message, { duration: 8000 });
      }
    } catch (error) {
      // Log error and show generic error message
      console.log(error);
      toast.error('Something went wrong', { duration: 8000 });
    }
  };

  return (
    <Layout title="Register Ecommerce Web">
      <div className="container-form">
        <form onSubmit={handleSubmit}>
          <h1 className="title">Register Form</h1>

          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="Enter Your Name"
              required
            />
          </div>

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

          <div className="mb-3">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              placeholder="Enter Your Phone"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
              placeholder="Enter Your Address"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control"
              placeholder="Enter Your Favourite Sport Name "
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            REGISTER
          </button>
        </form>
      </div>
    </Layout>

  )
}

export default Register;
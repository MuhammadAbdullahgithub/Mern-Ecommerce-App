import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Puff } from 'react-loader-spinner';

const Spinner = ({path = "login"}) => {
    const [count, setCount] = useState(3);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevValue) => --prevValue);
        }, 1000)
        count === 0 &&
        navigate( `/${path}`, {
            state: location.pathname,
        });
        return () => clearInterval(interval)
    }, [count, navigate, location, path]);


    return (
        <>
            <div className="d-flex flex-column justify-content-center align-items-center"
                style={{ height: "100vh", backgroundColor: "#1c1c1c", transition: "background-color 0.5s ease" }}
            >
                {/* Countdown Timer */}
                <h1 className="text-center" style={{ fontSize: "2rem", color: "#e74c3c", fontWeight: "bold", transition: "color 0.5s ease" }}>
                    Redirecting to you in <span style={{ color: "white" }}>{count}</span> seconds...
                </h1>
                
                {/* Animated Loader */}
                <div className="text-white">
                    <Puff height="100" width="100" color={count % 2 === 0 ? "red" : "black"} ariaLabel="Loading..." />
                </div>

                {/* Up-and-Down Animated Message */}
                <div className="up-down-text mt-4" style={{ fontSize: "1.25rem", color: "#f5f5f5", fontStyle: "italic", animation: "upDown 2s infinite ease-in-out" }}>
                    Please wait while we prepare your login page...
                </div>
            </div>

            {/* CSS for Up-and-Down Animation */}
            <style jsx="true">{`
                @keyframes upDown {
                    0% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                    100% {
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
}

export default Spinner;

import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: "",
    });

    // Load auth from localStorage
    useEffect(() => {
        const data = localStorage.getItem("auth");
        if (data) {
            const parseData = JSON.parse(data);
            setAuth({
                user: parseData.user,
                token: parseData.token,
            });
            axios.defaults.headers.common["Authorization"] = parseData.token;
        }
    }, []);

    // Update axios headers when token changes
    useEffect(() => {
        if (auth?.token) {
            axios.defaults.headers.common["Authorization"] = auth.token;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [auth?.token]);

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };

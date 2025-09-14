import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import  HomePage  from "./pages/HomePage.jsx"
import  LoginPage  from './pages/LoginPage.jsx'
import  RegisterPage  from './pages/RegisterPage.jsx'
import { Toaster } from "react-hot-toast"
import { useEffect, useState } from 'react'

const App=() => {
  const [authUser, setAuthUser] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const data = sessionStorage.getItem("isAuth");
        if (data === "true") {
          setAuthUser(true);
        } else {
          setAuthUser(false);
        }
      } catch (error) {
        console.log(error.message);
        setAuthUser(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="bg-contain min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  console.log("authUser", authUser);

  return (
    <div className="bg-contain">
      <Toaster/>
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
          <Route path="/register" element={!authUser ? <RegisterPage /> : <Navigate to={"/"} />} />
      </Routes>
    </div>
  )
}

export default App 

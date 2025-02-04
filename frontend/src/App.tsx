import { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/HomePage";
import UserLayout from "./layouts/UserLayout";
import UserPage from "./pages/UserPage";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import { useAuthStore } from "./stores/authStore";

function App() {
  const { setToken } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setToken(token); 
    }
  }, [setToken]);

  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route path="/user" element={<UserLayout />}>
        <Route index element={<UserPage />} />
      </Route>
      {/* 
      <Route element={<AuthLayout />}> //layout component => routes with no "path" are for layouts
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="concerts">
        <Route index element={<ConcertsHome />} />
        <Route path=":city" element={<City />} />
        <Route path="trending" element={<Trending />} />
      </Route> */}
    </Routes>
  );
}

export default App;

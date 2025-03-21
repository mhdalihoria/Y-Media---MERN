import { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/HomePage";
import ProfileSelf from "./pages/auth/user-profile/ProfileSelf";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import { useAuthStore } from "./stores/authStore";
import useUserStore from "./stores/userStore";
import ProfileOther from "./pages/auth/user-profile/ProfileOther";
import apiClient from "./api/axiosInstance";
import EditProfile from "./pages/auth/user-profile/EditProfile";
import { useAlertStore } from "./stores/alertStore";
import { Alert, AlertColor } from "@mui/material";
import socket from "./socket";
import Notifications from "./pages/Notifications";
import { io } from "socket.io-client";
import Search from "./pages/Search";
import RequiresAuth from "./components/RequiresAuth";

function App() {
  const socket = io(import.meta.env.VITE_BACKEND_URL);
  // ----------------------------------
  const { userId, token, setToken } = useAuthStore();
  const {
    setUsername,
    setBio,
    setCoverImg,
    setProfileImg,
    setFollowers,
    setFollowing,
    setUserPosts,
    setNotifications,
    setLikedPosts,
  } = useUserStore();
  const { status, message, setAlert } = useAlertStore();
  // ----------------------------------

  // Token: Access Token onLoad
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setToken(token);
    }
  }, [setToken]);

  // User: Fetch User Data/Profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get(`/user/profile/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error();
        }

        const data = await response.data;
        const {
          username,
          bio,
          coverImg,
          profileImg,
          following,
          followers,
          userPosts,
          notifications,
          likedPosts,
        } = data.user;

        setUsername(username);
        setBio(bio);
        setCoverImg(coverImg);
        setProfileImg(profileImg);
        setFollowers(followers);
        setFollowing(following);
        setUserPosts(userPosts);
        setNotifications(notifications);
        setLikedPosts(likedPosts);
      } catch (err) {
        console.error(err);
      }
    };

    if (token && userId) {
      fetchUser();
    }
  }, [token, userId]);

  // Alert: Clear After Timeout
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setAlert(null, null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  // Socket IO: User's socket + notifications
  useEffect(() => {
    if (userId) {
      // Tell the server which user this socket belongs to
      socket.emit("join", userId);
    }

    // Listen for notifications from the server
    socket.on("notification", (notification) => {
      console.log("Received notification:", notification);
      setAlert("info", `A new ${notification.type}`);
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off("notification");
    };
  }, [userId]);

  return (
    <>
      <Routes>
        <Route element={<RequiresAuth />}>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/profile" element={<ProfileSelf />} />
            <Route path="/profile/:id" element={<ProfileOther />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/search" element={<Search />} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
      {!!status && (
        <Alert
          style={{ position: "fixed", bottom: "1rem", right: "1rem" }}
          severity={status as AlertColor}
        >
          {message}
        </Alert>
      )}
    </>
  );
}

export default App;

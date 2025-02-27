import { useEffect } from "react";
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

function App() {
  const { userId, token, setToken } = useAuthStore();
  const {
    setUsername,
    setBio,
    setCoverImg,
    setProfileImg,
    setFollowers,
    setFollowing,
    setUserPosts,
    setLikedPosts,
  } = useUserStore();
  const { status, message, setAlert } = useAlertStore();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setToken(token);
    }
  }, [setToken]);

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
          likedPosts,
          // notifications
        } = data.user;

        setUsername(username);
        setBio(bio);
        setCoverImg(coverImg);
        setProfileImg(profileImg);
        setFollowers(followers);
        setFollowing(following);
        setLikedPosts(likedPosts);
        setUserPosts(userPosts);
        // setNotifications(notifications)
      } catch (err) {
        console.error(err);
      }
    };

    if (token && userId) {
      fetchUser();
    }
  }, [token, userId]);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setAlert(null, null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status]);


  useEffect(() => {
    if (userId) {
      // Tell the server which user this socket belongs to
      socket.emit("join", userId);
    }

    // Listen for notifications from the server
    socket.on("notification", (notification) => {
      console.log("Received notification:", notification);
      // Here, update your local state or a notification context to display it
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off("notification");
    };
  }, [userId]);

  
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/profile" element={<ProfileSelf />} />
          <Route path="/profile/:id" element={<ProfileOther />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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

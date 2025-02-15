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
import axios from "axios";
import apiClient from "./api/axiosInstance";

function App() {
  const { userId, token, setToken } = useAuthStore();
  const {
    setUsername,
    setBio,
    setCoverImg,
    setProfileImg,
    setFriends,
    setUserPosts,
    setLikedPosts,
  } = useUserStore();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setToken(token);
    }
  }, [setToken]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get(`/user/profile/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error();
        }

        const data = await response.data;
        const {
          username,
          bio,
          coverImg,
          profileImg,
          friends,
          posts,
          likedPosts,
        } = data.user;

        setUsername(username);
        setBio(bio);
        setCoverImg(coverImg);
        setProfileImg(profileImg);
        setFriends(friends);
        setLikedPosts(likedPosts);
        setUserPosts(posts);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/profile" element={<ProfileSelf />} />
        <Route path="/profile/:id" element={<ProfileOther />} />
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
  );
}

export default App;

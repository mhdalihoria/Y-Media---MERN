import { Box, IconButton, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/system";
import React, { useState } from "react";
import LoadingPosts from "../LoadingPosts";
import LoadingFriends from "../LoadingFriends";
import Post from "../Post";
import { FiEdit } from "react-icons/fi";
import DefaultUser from "../../assets/default-user.jpg";
import useUserStore, { UserType } from "../../stores/userStore";
import Empty from "../Empty";
import NotFound from "../NotFound";
import { useNavigate } from "react-router";
import RenderPost from "../../pages/auth/user-profile/RenderPost";
import { CButton } from "../custom/form/CButton";
import { useAuthStore } from "../../stores/authStore";
import axios from "axios";

const StyledHeaderContainer = styled(Box)(({ theme }) => ({
  marginBottom: "2rem",
  "& .cover-img-container": {
    width: "100%",
    height: "250px",
    "& .cover-img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },

  "& .profile-img-container": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  },

  "& .profile-img": {
    width: "125px",
    height: "125px",
    objectFit: "cover",
    marginLeft: "1rem",
    borderRadius: "100%",
    border: `3px solid ${theme.palette.background.default}`,
    transform: "translateY(-50%)",
  },

  "& .edit-profile": {
    marginRight: "1rem",
    transform: "translateY(-340%)",
    "& path": {
      color: theme.palette.primary.main,
    },
  },

  "& .text-container": {
    margin: "-50px 1.5rem 0",

    "& h3": {
      fontWeight: 700,
      fontSize: "1.35rem",
    },
    "& p": {
      maxWidth: "300px",
      fontSize: "0.875rem",
      color: theme.palette.text.secondary,
      fontWeight: 400,
      marginTop: ".5em",
    },
  },

  "& .tab-container": {
    marginTop: "3rem",
  },
}));

export default function RenderProfile({
  token,
  userId,
  isOwnProfile,
  ...userProps
}: UserType & {
  token?: string | null;
  userId: string | null;
  isOwnProfile: boolean;
}) {
  const {
    username,
    bio,
    coverImg,
    profileImg,
    following,
    followers,
    userPosts,
    likedPosts,
  } = userProps;
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const { userId: viewingUserId, token: viewingUserToken } = useAuthStore();
  const { following: viewingUserFollowing, setFollowing } = useUserStore();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const followBtnHandler = async (
    userId: string,
    username: string,
    profileImg: string
  ) => {
    try {
      const isFollowing = viewingUserFollowing.some(
        (user) => user._id === userId
      );
      // ---------------------------------------------
      const followUser = async () => {
        const response = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/user/${viewingUserId}/follow/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${viewingUserToken}`,
            },
          }
        );

        // const notificationResponse = await axios.post(
        //   `${import.meta.env.VITE_BACKEND_URL}/notifications/add-notification`,
        //   {
        //     toUserId: userId,
        //     fromUserId: viewingUserId,
        //     type: "follow",
        //   },
        //   {
        //     headers: {
        //       Authorization: `Bearer ${viewingUserToken}`,
        //     },
        //   }
        // );

        // if (response.status !== 200 || notificationResponse.status !== 200) {
        if (response.status !== 200) {
          throw new Error("Somethiing Went Wrong Following User");
        }
        return;
      };

      const unfollowUser = async () => {
        const response = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/user/${viewingUserId}/unfollow/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${viewingUserToken}`,
            },
          }
        );

        const notificationResponse = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/notifications/remove-notification`,
          {
            toUserId: userId,
            fromUserId: viewingUserId,
            type: "follow",
          },
          {
            headers: {
              Authorization: `Bearer ${viewingUserToken}`,
            },
          }
        );

        if (response.status !== 200 || notificationResponse.status !== 200) {
          throw new Error("Somethiing Went Wrong Unfollowing User");
        }
        console.log("unfollowing", response.data);
        return;
      };
      // ---------------------------------------------

      if (isFollowing) {
        // Remove the user from the following list
        await unfollowUser();
        setFollowing(
          viewingUserFollowing.filter((user) => user._id !== userId)
        );
      } else {
        await followUser();
        // Add the user to the following list
        setFollowing([
          ...viewingUserFollowing,
          { _id: userId, username, profileImg }, // Ensure this matches the expected data structure
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Box>
      <StyledHeaderContainer>
        <div className="cover-img-container">
          <img
            src={coverImg || "https://placehold.co/600x400.png"}
            className="cover-img"
          />
        </div>
        <div className="profile-img-container">
          <img src={profileImg || DefaultUser} className="profile-img" />
          {isOwnProfile && (
            <IconButton
              className="edit-profile"
              size="small"
              onClick={() => navigate("/edit-profile")}
            >
              <FiEdit />
            </IconButton>
          )}
        </div>
        <div className="text-container">
          <h3>{username}</h3>
          <p
            style={{ fontSize: ".6rem" }}
          >{`${followers?.length} followers.${following.length} following`}</p>
          <p>{bio}</p>
          {!isOwnProfile &&
          viewingUserFollowing.some((user) => user._id === userId) ? (
            <CButton
              btnSize="xs"
              onClick={() => followBtnHandler(userId!, username!, profileImg!)}
              variant="outlined"
            >
              Unfollow
            </CButton>
          ) : (
            <CButton
              btnSize="xs"
              onClick={() => followBtnHandler(userId!, username!, profileImg!)}
            >
              Follow
            </CButton>
          )}
        </div>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered={true}
          className="tab-container"
        >
          <Tab label="Posts" />
          <Tab label="Likes" />
          <Tab label="Following" />
        </Tabs>
      </StyledHeaderContainer>

      {tabValue === 0 && (
        <>
          {isOwnProfile && <Post token={token!} userId={userId} />}
          {userPosts.length > 0 ? (
            userPosts.map((post, idx) => (
              // RenderPost(post, userId, `${idx}`, true)
              <RenderPost
                post={post}
                userId={userId}
                idx={idx.toString()}
                canDelete={true}
                key={idx}
              />
            ))
          ) : (
            <LoadingPosts />
          )}
        </>
      )}
      {tabValue === 1 &&
        (likedPosts.length > 0 ? (
          likedPosts.map((post, idx) => (
            <RenderPost
              post={post}
              userId={userId}
              idx={idx.toString()}
              key={idx}
            />
          ))
        ) : (
          // <LoadingPosts />
          <Empty />
        ))}
      {tabValue === 2 &&
        (following.length > 0 ? (
          following.map((user) => <div>{user.username}</div>)
        ) : (
          // <LoadingFriends />
          <NotFound />
        ))}
    </Box>
  );
}

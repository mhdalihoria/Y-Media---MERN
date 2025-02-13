import { Box, IconButton, Tab, Tabs } from "@mui/material";
import Post from "../../../components/Post";
import { useAuthStore } from "../../../stores/authStore";
import { styled } from "@mui/system";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import LoadingPosts from "../../../components/LoadingPosts";
import LoadingFriends from "../../../components/LoadingFriends";
import useUserStore from "../../../stores/userStore";
import RenderPost from "./RenderPost";
import DefaultUser from "../../../assets/default-user.jpg";

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

export default function ProfileSelf() {
  const { userId, token } = useAuthStore();
  const {
    username,
    bio,
    coverImg,
    profileImg,
    friends,
    userPosts,
    likedPosts,
  } = useUserStore();
  const [tabValue, setTabValue] = useState(0);

  console.log(userPosts);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  console.log(userPosts);
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
          <IconButton
            className="edit-profile"
            size="small"
            onClick={() => console.log("profile edited")}
          >
            <FiEdit />
          </IconButton>
        </div>
        <div className="text-container">
          <h3>{username}</h3>
          <p>{bio}</p>
        </div>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered={true}
          className="tab-container"
        >
          <Tab label="Posts" />
          <Tab label="Likes" />
          <Tab label="Friends" />
        </Tabs>
      </StyledHeaderContainer>

      {tabValue === 0 && (
        <>
          <Post token={token} userId={userId}/>
          {userPosts.length > 0 ? (
            userPosts.map((post) => RenderPost(post))
          ) : (
            <LoadingPosts />
          )}
        </>
      )}
      {tabValue === 1 &&
        (likedPosts.length > 0 ? (
          likedPosts.map((post) => RenderPost(post))
        ) : (
          <LoadingPosts />
        ))}
      {tabValue === 2 &&
        (friends.length > 0 ? (
          friends.map((friend) => <div>{friend.username}</div>)
        ) : (
          <LoadingFriends />
        ))}
    </Box>
  );
}

{
  /* <Post userId={userId} token={token} /> */
}

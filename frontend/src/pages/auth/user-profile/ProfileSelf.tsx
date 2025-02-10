import { Box, IconButton, Tab, Tabs } from "@mui/material";
import Post from "../../../components/Post";
import { useAuthStore } from "../../../stores/authStore";
import { borderRadius, fontWeight, maxWidth, styled, width } from "@mui/system";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import LoadingPosts from "../../../components/LoadingPosts";
import LoadingFriends from "../../../components/LoadingFriends";

const StyledHeaderContainer = styled(Box)(({ theme }) => ({
  "& .cover-img-container": {
    width: "100%",
    height: "250px",
    "& .cover-img": {
      width: "100%",
      height: "100%",
      "objectFit": "cover",
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
      maxWidth: "400px",
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
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box >
      <StyledHeaderContainer>
        <div className="cover-img-container">
          <img src="https://placehold.co/600x400.png" className="cover-img" />
        </div>
        <div className="profile-img-container">
          <img src="https://placehold.co/100x100.png" className="profile-img" />
          <IconButton
            className="edit-profile"
            size="small"
            onClick={() => console.log("profile edited")}
          >
            <FiEdit />
          </IconButton>
        </div>
        <div className="text-container">
          <h3>Username</h3>
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut l
          </p>
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

      {tabValue === 0 && <LoadingPosts />}
      {tabValue === 1 && <LoadingPosts />}
      {tabValue === 2 && <LoadingFriends />}
    </Box>
  );
}

{
  /* <Post userId={userId} token={token} /> */
}

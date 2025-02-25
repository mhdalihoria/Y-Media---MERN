import useUserStore, { Post } from "../../../stores/userStore";
import DefaultUser from "../../../assets/default-user.jpg";
import {
  Box,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import { NavLink, useLocation } from "react-router";
import { FaTrash } from "react-icons/fa6";
import axios from "axios";
import { useAuthStore } from "../../../stores/authStore";
import { useAlertStore } from "../../../stores/alertStore";

const PostContainerStyled = styled(Box)(({ theme }) => ({
  marginTop: "1.5rem",
  border: `2px solid`,
  borderColor: theme.palette.background.paper,
  borderRadius: "15px",
  display: "flex",
  flexDirection: "column",
  position: "relative",

  "&:hover": {
    "& .delete-btn": {
      visibility: "visible",
    },
  },

  "& .delete-btn": {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    background: "#dc3545",
    width: "25px",
    height: "25px",
    borderRadius: "4px",
    visibility: "visible",
    // Then override at 'md' and above:
    [theme.breakpoints.up("md")]: {
      visibility: "hidden",
    },
  },
  "& .delete-btn:hover": {
    filter: "brightness(70%)",
  },
}));

export default function RenderPost({
  post,
  userId,
  idx,
  canDelete,
}: {
  post: Post;
  userId: string | null;
  idx: string;
  canDelete?: boolean;
}) {
  const { pathname } = useLocation();
  const isOnProfilePage = pathname === "/profile";
  // -------------------------------------------
  const { token } = useAuthStore();
  const { userPosts, setUserPosts } = useUserStore();
  const { setAlert, message, status } = useAlertStore();
  const postId = post._id;
  // -------------------------------------------
  const date = new Date(post.createdAt);
  // Format as a readable date
  const readableDate = date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const deletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) {
        return; // Cancel deletion if the user cancels the confirmation
      }
      const serverResponse = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/user/delete-post`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            postId,
          },
        }
      );
      if (serverResponse.status !== 200) {
        throw new Error("Something Went Wrong");
      }
      const updatedLocalUserPosts = userPosts.filter(
        (post) => postId !== post._id
      );
      setUserPosts(updatedLocalUserPosts);
      setAlert("success", "Post Deleted Successfully");
    } catch (err) {
      console.error(err);
      setAlert("error", (err as Error).message);
    }
  };

  return (
    <PostContainerStyled key={idx}>
      {isOnProfilePage && canDelete && (
        <IconButton
          className={`delete-btn `}
          size="small"
          onClick={() => deletePost()}
        >
          <FaTrash style={{ width: "15px", height: "15px" }} />
        </IconButton>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          padding: "1rem ",
        }}
      >
        <img
          src={post.user.profileImg || DefaultUser}
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            borderRadius: "100%",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "90%",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <h3 style={{ marginTop: ".2em", cursor: "pointer" }}>
              <NavLink
                to={
                  userId === post.user._id
                    ? "/profile"
                    : `/profile/${post.user._id}`
                }
                style={{ textDecoration: "none" }}
              >
                {post.user.username}
              </NavLink>
            </h3>
            <Typography
              sx={{
                color: (theme) => theme.palette.text.secondary,
                fontSize: ".75rem",
              }}
            >
              {readableDate}
            </Typography>
          </div>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
      {post.img && (
        <img
          src={post.img}
          style={{
            objectFit: "fill",
            width: "100%",
            height: "300px",
            marginBottom: "2rem",
            marginTop: "-1rem",
          }}
        />
      )}
    </PostContainerStyled>
  );
}

import { useState } from "react";
import useUserStore, { Post } from "../../../stores/userStore";
import DefaultUser from "../../../assets/default-user.jpg";
import { Box, IconButton, styled, Typography } from "@mui/material";
import { NavLink, useLocation } from "react-router";
import { FaTrash } from "react-icons/fa6";
import axios from "axios";
import { useAuthStore } from "../../../stores/authStore";
import { useAlertStore } from "../../../stores/alertStore";
import { CiHeart } from "react-icons/ci";

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

const LikeBtnStyled = styled(IconButton)(({ theme }) => ({
  fontSize: "1.275rem",

  "& .btn-container": {
    display: "flex",
    justifyContent: "baseline",
    alignItems: "center",
    gap: ".3em",
    padding: ".5rem",
    borderRadius: "20px",
    fontWeight: "bold",
  },

  "& .liked": {
    background: theme.palette.primary.main,
  },
  "& .like-count": {
    fontSize: ".875rem",
  },
}));

export default function RenderPost({
  post,
  userId,
  idx,
  canDelete,
  isOwnProfile,
}: {
  post: Post;
  userId: string | null;
  idx: string;
  canDelete?: boolean;
  isOwnProfile?: boolean;
}) {
  const { pathname } = useLocation();
  const isOnProfilePage = pathname === "/profile";
  // -------------------------------------------
  const { token } = useAuthStore();
  const { userPosts, setUserPosts } = useUserStore();
  const { setAlert } = useAlertStore();
  const postId = post._id;
  const authorId = post.user._id;
  // -------------------------------------------
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
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
            postId: post._id,
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

  const likePost = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/like-post`,
        {
          postId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        setAlert("error", "Could not Like the Post, Try Again Later");
        throw new Error("Something went Wrong");
      }

      const { likesCount } = response.data;

      if (!liked) {
        setLiked((prevLiked) => !prevLiked);
        setLikeCount(likesCount);
      } else {
        setLiked(false);
        setLikeCount((prevLiked) => prevLiked - 1);
      }
    } catch (err) {
      console.error(err);
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
            width: "94%",
            height: "300px",
            margin: "1rem auto 2rem",
            borderRadius: "10px"
          }}
        />
      )}
      {authorId !== userId && isOwnProfile === false && (
        <div style={{ marginLeft: ".5rem" }}>
          <LikeBtnStyled onClick={() => likePost()}>
            <div className={`btn-container ${liked ? "liked" : ""}`}>
              <CiHeart />{" "}
              {!!likeCount && <span className="like-count">{likeCount}</span>}
            </div>
          </LikeBtnStyled>
        </div>
      )}
    </PostContainerStyled>
  );
}

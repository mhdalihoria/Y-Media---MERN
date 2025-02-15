import { Post } from "../../../stores/userStore";
import DefaultUser from "../../../assets/default-user.jpg";
import { Box, Typography } from "@mui/material";
import { NavLink } from "react-router";

export default function RenderPost(
  post: Post,
  userId: string | null,
  idx: string
) {
  const date = new Date(post.createdAt);

  // Format as a readable date
  const readableDate = date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <Box
      sx={{
        marginTop: "1.5rem",
        border: `2px solid`,
        borderColor: (theme) => theme.palette.background.paper,
        borderRadius: "15px",
        display: "flex",
        flexDirection: "column",
      }}
      key={idx}
    >
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
    </Box>
  );
}

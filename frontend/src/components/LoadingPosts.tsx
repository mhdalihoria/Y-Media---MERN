import { Skeleton } from "@mui/material";

export default function LoadingPosts() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1.5rem",
          gap: ".675rem",
        }}
      >
        <Skeleton variant="circular" width={50} height={50} />
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* <Skeleton variant="text" sx={{ fontSize: "1.25rem" }} /> */}
          <Skeleton variant="rounded" width={100} height={10} />
          <Skeleton variant="rounded" width={350} height={16} sx={{marginTop: ".4rem"}}/>
          <Skeleton variant="rounded" width={300} height={16} />
          <Skeleton variant="rounded" width={50} height={16} />
          <Skeleton variant="rounded" width={350} height={160} sx={{marginTop: "1rem"}}/>
        </div>
      </div>
    </div>
  );
}

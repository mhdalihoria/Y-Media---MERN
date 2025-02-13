import { Post } from "../../../stores/userStore";
import DefaultUser from "../../../assets/default-user.jpg";

export default function RenderPost(post: Post) {
  console.log(post);
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
        <img
          src={post.user.profileImg || DefaultUser}
          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "100%" }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "90%",
          }}
        >
          <h3 style={{marginTop: ".6em"}}>{post.user.username}</h3> <span>{post.createdAt}</span>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />

          {post.img && (
            <img
              src={post.img}
              style={{ objectFit: "fill", width: "100%", height: "300px" }}
            />
          )}
          {/* <Skeleton variant="text" sx={{ fontSize: "1.25rem" }} /> */}
          {/* <Skeleton variant="rounded" width={100} height={10} />
          <Skeleton
            variant="rounded"
            width={350}
            height={16}
            sx={{ marginTop: ".4rem" }}
          />
          <Skeleton variant="rounded" width={300} height={16} />
          <Skeleton variant="rounded" width={50} height={16} />
          <Skeleton
            variant="rounded"
            width={350}
            height={160}
            sx={{ marginTop: "1rem" }}
          /> */}
        </div>
      </div>
    </div>
  );
}

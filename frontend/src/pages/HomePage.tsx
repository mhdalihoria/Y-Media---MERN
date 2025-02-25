import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import RenderPost from "./auth/user-profile/RenderPost";
import apiClient from "../api/axiosInstance";

type Post = {
  _id: string;
  content: string;
  img: string;
  createdAt: string;
  user: string;
};

export default function HomePage() {
  const { userId, token } = useAuthStore();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  console.log(posts);
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/user/get-all-posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data as Post[];

        if (response.status !== 200) {
          console.error("Failed to fetch posts");
          setLoading(false);
          return;
        }

        setPosts(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, [token]);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post, idx) => (
          <RenderPost
            key={post._id}
            post={post}
            userId={userId}
            idx={idx.toString()}
            canDelete={false}
          />
        ))
      ) : (
        <div>no posts here</div>
      )}
    </div>
  );
}

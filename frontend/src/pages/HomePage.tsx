import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import RenderPost from "./auth/user-profile/RenderPost";

type post = {
  _id: string;
  content: string;
  img: string;
  createdAt: string;
  user: string;
};

export default function HomePage() {
  const { userId, token } = useAuthStore();

  const [posts, setPosts] = useState<post[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/get-all-posts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = (await response.data) as post[];

        if (response.status !== 200) {
          return;
        }

        // console.log(data);
        setPosts(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllPosts();
  }, []);

  return (
    <div>
      {loading && !posts
        ? "loading..."
        : posts?.map((post, idx) => (
            RenderPost(post)
          ))}
    </div>
  );
}

import axios from "axios";
import { useEffect, useState } from "react";

type post = {
  _id: string;
  content: string;
  img: string;
  createdAt: string;
};

export default function HomePage() {
  const [posts, setPosts] = useState<post[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/get-all-posts`
        );

        const data = (await response.data) as post[];

        if (response.status !== 200) {
          return;
        }

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
            <div key={idx}>
              <span style={{ fontSize: "0.6rem" }}>{post.createdAt}</span>
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
              <img src={post.img} />
            </div>
          ))}
    </div>
  );
}

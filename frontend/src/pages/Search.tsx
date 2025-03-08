import { useState } from "react";
import { CButton } from "../components/custom/form/CButton";
import { CInputField } from "../components/custom/form/CInputField";
import { FaMagnifyingGlass } from "react-icons/fa6";
import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import RenderPost from "./auth/user-profile/RenderPost";

export default function Search() {
  const { token, userId } = useAuthStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/search`,
        {
          params: { q: query },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResults(response.data.results);
    } catch (error) {
      console.error("Search error", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    <p>loading...</p>;
  }

  return (
    <div style={{ paddingTop: "2.5rem", width: "100%" }}>
      <div
        style={{
          display: "flex",
          width: "100%",
          position: "relative",
        }}
      >
        <CInputField
          sx={{ width: "100%" }}
          placeholder="Search..."
          name="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <CButton btnSize="sm" sx={{ width: "25%" }} onClick={handleSearch}>
          <FaMagnifyingGlass />
        </CButton>
      </div>

      {results.length > 0 ? (
        results.map((post, idx) => (
          <RenderPost
            key={post._id}
            post={post}
            userId={userId}
            idx={idx.toString()}
            canDelete={false}
            isOwnProfile={post.user._id === userId}
          />
        ))
      ) : (
        <div>Nothing here</div>
      )}
    </div>
  );
}

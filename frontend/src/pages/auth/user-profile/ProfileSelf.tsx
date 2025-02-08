import Post from "../../../components/Post";
import { useAuthStore } from "../../../stores/authStore";

export default function ProfileSelf() {
  const { userId, token } = useAuthStore();

  return (
    <div>
      <Post userId={userId} token={token} />
    </div>
  );
}

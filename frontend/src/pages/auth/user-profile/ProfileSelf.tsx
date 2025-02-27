import { useAuthStore } from "../../../stores/authStore";
import useUserStore from "../../../stores/userStore";
import RenderProfile from "../../../components/profile/RenderProfile";

export default function ProfileSelf() {
  const { userId, token } = useAuthStore();
  const {
    username,
    bio,
    coverImg,
    profileImg,
    following,
    followers,
    userPosts,
    likedPosts,
  } = useUserStore();

  return (
    <RenderProfile
      token={token}
      userId={userId}
      isOwnProfile={true}
      username={username}
      bio={bio}
      coverImg={coverImg}
      profileImg={profileImg}
      following={following}
      followers={followers}
      userPosts={userPosts}
      likedPosts={likedPosts}
    />
  );
}

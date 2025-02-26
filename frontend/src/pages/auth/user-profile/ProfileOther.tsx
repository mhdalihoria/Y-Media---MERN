import { useParams } from "react-router";
import RenderProfile from "../../../components/profile/RenderProfile";
import { useEffect, useState } from "react";
import apiClient from "../../../api/axiosInstance";
import { UserType } from "../../../stores/userStore";

export default function ProfileOther() {
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<UserType>();

  console.log(user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient(`/user/profile/${id}/`);
        const data = response.data;

        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Destructure after ensuring user is defined
  const {
    username,
    bio,
    coverImg,
    profileImg,
    following,
    userPosts,
    likedPosts,
  } = user;

  return (
    <RenderProfile
      userId={id}
      isOwnProfile={false}
      username={username}
      bio={bio}
      coverImg={coverImg}
      profileImg={profileImg}
      following={following}
      userPosts={userPosts}
      likedPosts={likedPosts}
    />
  );
}

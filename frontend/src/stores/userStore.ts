import { create } from "zustand";

type User = {
  _id: string;
  username: string;
  profileImg: string;
};


export type Post = {
  _id: string;
  content: string;
  img: string | null;
  user: User;
  createdAt: string; // or Date if you plan to convert it
  // __v: number;
};

export interface UserType {
  username: string | null; // Nullable in case the user is not logged in
  bio: string | null;
  profileImg: string | null;
  coverImg: string | null;
  friends: User[]; // Array of friend IDs
  likedPosts: Post[]; // Array of post IDs
  userPosts: Post[]; // Array of post IDs
}

interface UserStore extends UserType {
  setUsername: (username: string) => void;
  setBio: (bio: string) => void;
  setProfileImg: (profileImg: string) => void;
  setCoverImg: (coverImg: string) => void;
  setFriends: (friends: User[]) => void;
  setLikedPosts: (posts: Post[]) => void;
  setUserPosts: (posts: Post[]) => void;
  //   addFriend: (friendId: string) => void;
  // likePost: (postId: string) => void;
  clearUser: () => void; // Clear the user state
}

const useUserStore = create<UserStore>((set) => ({
  // Initial State
  username: null,
  bio: null,
  profileImg: null,
  coverImg: null,
  friends: [],
  likedPosts: [],
  userPosts: [],

  // Setters
  setUsername: (username: string) => set((state) => ({ ...state, username })),
  setBio: (bio: string) => set((state) => ({ ...state, bio })),
  setProfileImg: (profileImg: string) =>
    set((state) => ({ ...state, profileImg })),
  setCoverImg: (coverImg: string) => set((state) => ({ ...state, coverImg })),
  setFriends: (friends: User[]) => set((state) => ({ ...state, friends })),
  setLikedPosts: (likedPosts: Post[]) => set((state) => ({ ...state, likedPosts })),
  setUserPosts: (userPosts: Post[]) => set((state) => ({ ...state, userPosts })),

  // Friends Management
  //   addFriend: (friendId: string) =>
  //     set((state) => ({ friends: [...state.friends, friendId] })),
  //   removeFriend: (friendId: string) =>
  //     set((state) => ({
  //       friends: state.friends.filter((id) => id !== friendId),
  //     })),

  // Liked Posts Management
  //   likePost: (postId: string) =>
  //     set((state) => ({ likedPosts: [...state.likedPosts, postId] })),
  //   unlikePost: (postId: string) =>
  //     set((state) => ({
  //       likedPosts: state.likedPosts.filter((id) => id !== postId),
  //     })),

  // Clear User State
  clearUser: () =>
    set({
      username: null,
      bio: null,
      profileImg: null,
      coverImg: null,
      friends: [],
      userPosts: [],
      likedPosts: [],
    }),
}));

export default useUserStore;

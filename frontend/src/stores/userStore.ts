import { create } from "zustand";

interface UserState {
  username: string | null; // Nullable in case the user is not logged in
  bio: string | null;
  profileImg: string | null;
  coverImg: string | null;
  friends: string[]; // Array of friend IDs
//   likedPosts: string[]; // Array of post IDs
}

interface UserStore extends UserState {
  setUsername: (username: string) => void;
  setBio: (bio: string) => void;
  setProfileImg: (profileImg: string) => void;
  setCoverImg: (coverImg: string) => void;
  setFriends: (friendId: string[]) => void;
//   addFriend: (friendId: string) => void;
//   likePost: (postId: string) => void;
  clearUser: () => void; // Clear the user state
}

const useUserStore = create<UserStore>((set) => ({
  // Initial State
  username: null,
  bio: null,
  profileImg: null,
  coverImg: null,
  friends: [],
//   likedPosts: [],

  // Setters
  setUsername: (username: string) => set((state) => ({ ...state, username })),
  setBio: (bio: string) => set((state) => ({ ...state, bio })),
  setProfileImg: (profileImg: string) =>
    set((state) => ({ ...state, profileImg })),
  setCoverImg: (coverImg: string) => set((state) => ({ ...state, coverImg })),
  setFriends: (friends: string[])=> set((state) =>({...state, friends})),
//   setLikedPosts: (posts: string[])=> set((state) =>({...state, friends})),

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
    //   likedPosts: [],
    }),
}));

export default useUserStore;

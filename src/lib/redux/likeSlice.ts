import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LikeState {
  likedPosts: { [postId: string]: boolean };
  likeCounts: { [postId: string]: number };
}

const initialState: LikeState = {
  likedPosts: {},
  likeCounts: {}
};

const likeSlice = createSlice({
  name: 'like',
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      state.likedPosts[postId] = !state.likedPosts[postId];
      state.likeCounts[postId] = (state.likeCounts[postId] || 0) + (state.likedPosts[postId] ? 1 : -1);
    },
    setLikeCount: (state, action: PayloadAction<{postId: string, count: number}>) => {
      state.likeCounts[action.payload.postId] = action.payload.count;
    },
    setLikedStatus: (state, action: PayloadAction<{postId: string, isLiked: boolean}>) => {
      state.likedPosts[action.payload.postId] = action.payload.isLiked;
    }
  }
});

export const { toggleLike, setLikeCount, setLikedStatus } = likeSlice.actions;
export default likeSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  id: string;
  username: string;
  name: string;
  avatar: string;
  cover_photo: string;
  bio: string;
  follower_count: number;
  following_count: number;
}

const initialState: ProfileState = {
  id: '',
  username: '',
  name: '',
  avatar: '',
  cover_photo: '',
  bio: '',
  follower_count: 0,
  following_count: 0
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (action: PayloadAction<ProfileState>) => {
      return { ...action.payload };
    },
    updateProfile: (state, action: PayloadAction<Partial<ProfileState>>) => {
      return { ...state, ...action.payload };
    }
  }
});

export const { setProfile, updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
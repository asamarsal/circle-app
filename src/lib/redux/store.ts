import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import likeReducer from './likeSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    like: likeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
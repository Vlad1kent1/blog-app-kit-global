import { configureStore } from '@reduxjs/toolkit';
import postsSlice from '../features/posts/store/postsSlice';
import commentsSlice from '../features/comments/store/commentsSlice';

export const store = configureStore({
  reducer: {
    posts: postsSlice.reducer,
    comments: commentsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
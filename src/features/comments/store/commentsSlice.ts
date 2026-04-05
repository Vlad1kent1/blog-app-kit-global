import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../../api/config';
import type { Comment } from '../../../types';

export const fetchComments = createAsyncThunk('comments/fetchComments', async (postId: string) => {
  const querySnapshot = await getDocs(collection(db, 'posts', postId, 'comments'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
});

export const addComment = createAsyncThunk('comments/addComment', async ({ postId, commentData }: { postId: string, commentData: Omit<Comment, 'id' | 'createdAt'> }) => {
  const docRef = await addDoc(collection(db, 'posts', postId, 'comments'), { ...commentData, createdAt: serverTimestamp() });
  return { id: docRef.id, ...commentData, createdAt: Timestamp.fromDate(new Date()) } as Comment;
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [] as Comment[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch comments';
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      });
  },
});

export default commentsSlice;
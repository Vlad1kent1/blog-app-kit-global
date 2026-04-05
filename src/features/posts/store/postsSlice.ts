import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, getDoc, updateDoc, doc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../../api/config';
import type { Post } from '../../../types';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const querySnapshot = await getDocs(collection(db, 'posts'));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
});

export const createPost = createAsyncThunk('posts/createPost', async (postData: Omit<Post, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'posts'), { ...postData, createdAt: serverTimestamp() });
  const snapshot = await getDoc(docRef);
  const data = snapshot.data();

  if (!data) {
    throw new Error('Failed to retrieve created post');
  }

  return { id: docRef.id, ...data } as Post;
});

export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, ...data }: Partial<Post> & { id: string }) => {
  await updateDoc(doc(db, 'posts', id), { ...data, updatedAt: serverTimestamp() });
  return { id, ...data } as Post;
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id: string) => {
  const commentsSnapshot = await getDocs(collection(db, 'posts', id, 'comments'));

  if (!commentsSnapshot.empty) {
    const batch = writeBatch(db);

    commentsSnapshot.docs.forEach((commentDoc) => {
      batch.delete(commentDoc.ref);
    });

    await batch.commit();
  }

  await deleteDoc(doc(db, 'posts', id));
  return id;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [] as Post[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create post';
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = { ...state.posts[index], ...action.payload };
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.id !== action.payload);
      });
  },
});

export default postsSlice;
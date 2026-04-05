import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../../store';
import { fetchPosts, deletePost } from '../store/postsSlice';
import type { Post } from '../../../types';
import PostCard from './PostCard';

const PostList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading } = useSelector((state: RootState) => state.posts);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const filteredPosts = selectedCategory ? posts.filter((post) => post.category === selectedCategory) : posts;
  const categories = [...new Set(posts.map((post) => post.category))];

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(id));
    }
  };

  return (
    <div className="px-4 py-6 md:max-w-150 md:mx-auto">
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('')}
          className={`rounded-full border px-4 py-2 text-sm ${selectedCategory === '' ? 'border-slate-900 bg-slate-100 text-slate-900' : 'border-slate-700 bg-slate-950 text-slate-200'}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full border px-4 py-2 text-sm ${selectedCategory === cat ? 'border-slate-900 bg-slate-100 text-slate-900' : 'border-slate-700 bg-slate-950 text-slate-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center text-sm text-slate-400">Loading posts...</div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post: Post) => (
            <PostCard key={post.id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;

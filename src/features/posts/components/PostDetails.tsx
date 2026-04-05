import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../../store';
import { deletePost } from '../store/postsSlice';
import CommentSection from '../../comments/components/CommentSection';
import PostCard from './PostCard';

const PostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const post = useSelector((state: RootState) => state.posts.posts.find(p => p.id === id));

  if (!post) return <div className="text-center py-4 text-white">Post not found</div>;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(post.id));
      navigate('/');
    }
  };

  return (
    <div className="px-4 py-6 md:max-w-150 md:mx-auto">
      <PostCard post={post} onDelete={handleDelete} />
      <CommentSection postId={post.id} />
    </div>
  );
};

export default PostDetails;
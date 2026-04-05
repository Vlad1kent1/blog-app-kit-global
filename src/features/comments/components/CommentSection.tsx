import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../../store';
import { fetchComments, addComment } from '../store/commentsSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema } from '../../../utils/validation';
import type { CommentFormData } from '../../../utils/validation';
import { CircleUser, Pencil, Trash2 } from 'lucide-react';
import DropdownMenu from '../../../components/DropdownMenu';

interface CommentSectionProps {
  postId: string;
}

const CommentCard = ({ comment }: { comment: any }) => {
  return (
    <div className="flex gap-3 border-[0.5px] border-slate-200/80 bg-slate-950 p-4 rounded-xl">
      <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-300">
        <CircleUser className="h-4 w-4 md:h-5 md:w-5" />
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-100">{comment.author}</p>
            <p className="text-xs text-slate-500">{comment.createdAt.toDate().toLocaleDateString()}</p>
          </div>
          <DropdownMenu
            items={[
              {
                label: 'Edit',
                icon: <Pencil className="h-4 w-4" />,
                onSelect: () => window.alert('Edit comment feature not implemented'),
              },
              {
                label: 'Delete',
                icon: <Trash2 className="h-4 w-4" />,
                onSelect: () => window.alert('Delete comment feature not implemented'),
              },
            ]}
          />
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-300 text-justify">{comment.text}</p>
      </div>
    </div>
  );
};

const CommentSection = ({ postId }: CommentSectionProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { comments, loading } = useSelector((state: RootState) => state.comments);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({ resolver: zodResolver(commentSchema) });

  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  const onSubmit = (data: CommentFormData) => {
    dispatch(addComment({ postId, commentData: data }));
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Comments</h3>
        <span className="text-xs text-slate-500">{comments.length} replies</span>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center text-sm text-slate-500">Loading comments...</div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment: any) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border-[0.5px] border-slate-200/80 bg-slate-950 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-300">
            <CircleUser className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <label className="sr-only" htmlFor="comment-author">Your name</label>
              <input
                id="comment-author"
                {...register('author')}
                placeholder="Your name"
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-base md:text-sm text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
              />
              {errors.author && <p className="mt-1 text-xs text-slate-400">{errors.author.message}</p>}
            </div>
            <div>
              <label className="sr-only" htmlFor="comment-text">Comment</label>
              <input
                id="comment-text"
                {...register('text')}
                placeholder="Write a reply…"
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-base md:text-sm text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
              />
              {errors.text && <p className="mt-1 text-xs text-slate-400">{errors.text.message}</p>}
            </div>
            <button
              type="submit"
              className="inline-flex rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              Post comment
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;

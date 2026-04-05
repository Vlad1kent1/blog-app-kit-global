import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { createPost, updatePost } from '../store/postsSlice';
import { postSchema, type PostFormData } from '../../../utils/validation';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { AlignLeft, CircleUser, Type } from 'lucide-react';

const PostForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const post = id ? useAppSelector((state) => state.posts.posts.find((item) => item.id === id)) : undefined;
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: post
      ? {
          title: post.title,
          content: post.content,
          author: post.author,
          category: post.category,
        }
      : {},
  });

  const onSubmit = async (data: PostFormData) => {
    setSubmitError(null);

    try {
      if (post) {
        await dispatch(updatePost({ id: post.id, ...data })).unwrap();
      } else {
        await dispatch(createPost(data)).unwrap();
      }

      navigate('/', { replace: true });
    } catch (error) {
      setSubmitError((error as Error).message || 'Unable to save post. Please try again.');
    }
  };

  if (id && !post) {
    return (
      <div className="min-h-screen bg-black px-4 py-6 md:flex md:items-center md:justify-center md:bg-black/50 md:backdrop-blur-sm">
        <div className="rounded-3xl border-[0.5px] border-slate-200/80 bg-slate-950 p-8 text-center text-slate-200 md:max-w-2xl">
          Post not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-6 md:flex md:items-center md:justify-center md:bg-black/50 md:backdrop-blur-sm">
      <div className="rounded-3xl border-[0.5px] border-slate-200/80 bg-slate-950 p-6 shadow-sm shadow-black/20 md:max-w-2xl w-full">
        <div className="mb-6 flex items-center gap-3 text-slate-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-900">
            <CircleUser className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold">{post ? 'Edit Post' : 'Create a new post'}</p>
            <p className="text-xs text-slate-500">Write a clean, monochromatic blog entry.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-100" htmlFor="title">
              <Type className="h-4 w-4 text-slate-400" />
              Title
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              placeholder="Enter post title"
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-base md:text-sm text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-600"
            />
            {errors.title && <p className="mt-2 text-xs text-slate-400">{errors.title.message}</p>}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-100" htmlFor="content">
              <AlignLeft className="h-4 w-4 text-slate-400" />
              Content
            </label>
            <textarea
              id="content"
              rows={5}
              {...register('content')}
              placeholder="Write your post content"
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-base md:text-sm text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-600"
            />
            {errors.content && <p className="mt-2 text-xs text-slate-400">{errors.content.message}</p>}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-100" htmlFor="author">
                <CircleUser className="h-4 w-4 text-slate-400" />
                Author
              </label>
              <input
                id="author"
                type="text"
                {...register('author')}
                placeholder="Author name"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-base md:text-sm text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-600"
              />
              {errors.author && <p className="mt-2 text-xs text-slate-400">{errors.author.message}</p>}
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-100" htmlFor="category">
                <CircleUser className="h-4 w-4 text-slate-400" />
                Category
              </label>
              <input
                id="category"
                type="text"
                {...register('category')}
                placeholder="Post category"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-base md:text-sm text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-600"
              />
              {errors.category && <p className="mt-2 text-xs text-slate-400">{errors.category.message}</p>}
            </div>
          </div>

          {submitError && <p className="text-sm text-slate-400">{submitError}</p>}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl border border-slate-700 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : post ? 'Update post' : 'Create post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;

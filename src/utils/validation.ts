import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title cannot exceed 100 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  author: z.string().min(2, 'Author name is required'),
  category: z.string().nonempty('Category is required')
});

export type PostFormData = z.infer<typeof postSchema>;

export const commentSchema = z.object({
  text: z.string().min(1, 'Comment cannot be empty'),
  author: z.string().min(2, 'Author name is required')
});

export type CommentFormData = z.infer<typeof commentSchema>;

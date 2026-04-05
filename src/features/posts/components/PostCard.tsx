import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Post } from '../../../types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../api/config';
import { CircleUser, MessageCircle, Pencil, Trash2 } from 'lucide-react';
import DropdownMenu from '../../../components/DropdownMenu';

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const navigate = useNavigate();
  const [commentCount, setCommentCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    const loadCommentCount = async () => {
      const snapshot = await getDocs(collection(db, 'posts', post.id, 'comments'));
      if (isMounted) {
        setCommentCount(snapshot.size);
      }
    };

    loadCommentCount();

    return () => {
      isMounted = false;
    };
  }, [post.id]);

  return (
    <article className="border-[0.5px] border-slate-200/80 bg-slate-950 p-4 md:p-5 shadow-sm shadow-black/20 rounded-xl">
      <div className="flex items-start gap-3 md:gap-4">
        <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-200">
          <CircleUser className="h-5 w-5 md:h-6 md:w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-100 ">{post.author}</p>
              <p className="text-xs text-slate-500 ">{post.createdAt.toDate().toLocaleDateString()}</p>
            </div>
            <DropdownMenu
              items={[
                {
                  label: 'Edit',
                  icon: <Pencil className="h-4 w-4" />,
                  onSelect: () => navigate(`/edit/${post.id}`),
                },
                {
                  label: 'Delete',
                  icon: <Trash2 className="h-4 w-4" />,
                  onSelect: () => onDelete(post.id),
                },
              ]}
            />
          </div>
          <div className="flex flex-col my-3 md:my-4 gap-2 items-start">
            <h2 className="text-base md:text-lg font-semibold leading-6 text-slate-100 items-start">{post.title}</h2>
            <p className="text-sm leading-6 text-slate-300 text-justify">{post.content}</p>
            <span className="inline-flex rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-500">
              {post.category}
            </span>
          </div>
            <Link
              to={`/post/${post.id}`}
              className="flex items-center gap-2 text-slate-500 transition hover:text-slate-200 py-2 px-2 -m-2 md:py-0 md:px-0 md:m-0"
            >
              <MessageCircle className="h-5 w-5 md:h-4 md:w-4" />
              <span className="text-sm md:text-xs">{commentCount} comments</span>
            </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
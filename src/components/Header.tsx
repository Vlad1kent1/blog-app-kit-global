import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, SquarePen } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleCreate = () => {
    navigate('/create');
  };

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b-[0.5px] border-neutral-200/20">
      <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {!isHome && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="flex items-center">
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            aria-label="Create new post"
          >
            <SquarePen className="h-5 w-5" />
            <span className="hidden md:inline">New Post</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
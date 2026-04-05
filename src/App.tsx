import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostList from './features/posts/components/PostList';
import PostDetails from './features/posts/components/PostDetails';
import PostForm from './features/posts/components/PostForm';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="px-4 py-8 md:max-w-150 md:mx-auto">
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/post/:id" element={<PostDetails />} />
            <Route path="/create" element={<PostForm />} />
            <Route path="/edit/:id" element={<PostForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

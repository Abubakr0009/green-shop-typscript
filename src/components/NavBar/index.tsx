import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, User2, Search, Bell, ShoppingCart } from 'lucide-react';
import Auth from '../Auth';
import { useAppDispatch, useAppSelector } from '../../hooks/useLocalStorage/store';
import { loginUser, logoutUser } from '../../hooks/useLocalStorage/AuthSlice';

const Navbar: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Safeguard against undefined state
  const { user, isLogged } = useAppSelector((state) => state.auth || { user: null, isLogged: false });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      dispatch(loginUser(parsedUser.user));
    }
  }, [dispatch]);

  return (
    <nav className="w-full z-50 bg-white">
      <div className="flex justify-between items-center max-w-[1240px] mx-auto py-5">
        {/* Logo */}
        <Link to="/">
          <img src="/images/logo.svg" alt="logo" width={150} height={35} />
        </Link>

        {/* Links */}
        <ul className="flex gap-8 text-lg text-black-700">
          <li><Link to="/" className='hover:text-[#46A358] transition-colors'>Home</Link></li>
          <li><Link to="/blog" className='hover:text-[#46A358] transition-colors'>Blog</Link></li>
        </ul>

        {/* Icons & Auth */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:text-[#46A358] transition-colors">
            <Search size={20} />
          </button>
          <button className="p-2 hover:text-[#46A358] transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 hover:text-[#46A358] transition-colors">
            <ShoppingCart size={20} />
          </button>

          {isLogged ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/profile/account')}
                className="bg-[#46A358] px-4 py-1.5 text-sm rounded text-white flex items-center gap-1 hover:bg-[#3b8b4a]"
              >
                <User2 size={18} /> {user?.name || 'User'}
              </button>
              <button
                onClick={() => dispatch(logoutUser())}
                className="text-red-500 hover:underline text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-[#46A358] font-semibold text-base px-4 py-2 rounded-md text-white flex items-center gap-2 hover:bg-[#3b8b4a] transition-all"
            >
              <User2 size={18} /> <LogIn size={18} /> Login
            </button>
          )}
        </div>
      </div>

      <hr className="max-w-[1280px] mx-auto bg-[#46A35880] border-none h-[1px]" />

      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <div className="flex justify-center items-center gap-3 text-xl font-semibold my-4">
          {['Login', 'Register'].map((text, index) => (
            <button
              key={text}
              type="button"
              onClick={() => setIsLoginOpen(index === 0)}
              className={isLoginOpen === (index === 0) ? 'text-[#46A358]' : ''}
            >
              {text}
            </button>
          ))}
        </div>

        <Auth
          isLoginOpen={isLoginOpen}
          isRegisterOpen={!isLoginOpen}
          setIsModalOpen={setIsModalOpen}
          setIsLogged={(status: boolean) => {
            if (status) {
              const storedUser = localStorage.getItem('user');
              if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                dispatch(loginUser(parsedUser.user));
              }
            }
          }}
        />
      </Modal>
    </nav>
  );
};

export default Navbar;

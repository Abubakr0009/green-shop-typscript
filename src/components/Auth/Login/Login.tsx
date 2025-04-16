import axios from 'axios';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Chrome, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  setIsModalOpen: (value: boolean) => void;
  setIsLogged: (value: boolean) => void;
}

interface UserState {
  email: string;
  password: string;
}

interface ErrorState {
  email?: string;
  password?: string;
  apiError?: string;
}

const Login: React.FC<LoginProps> = ({ setIsModalOpen, setIsLogged }) => {
  const api = import.meta.env.VITE_API;
  const token = import.meta.env.VITE_PUBLIC_ACCESS_TOKEN;
  const [user, setUser] = useState<UserState>({ email: '', password: '' });
  const [errors, setErrors] = useState<ErrorState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSetValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleLoginCheck = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: ErrorState = {};

    if (!user.email.trim()) newErrors.email = 'Please enter your email';
    if (!user.password.trim()) newErrors.password = 'Please enter your password';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${api}user/sign-in?access_token=${token}`, user);
      const data = response?.data?.data;

      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('wishlist', JSON.stringify(data?.user?.wishlist || []));

      setUser({ email: '', password: '' });
      setIsLogged(true);
      setIsModalOpen(false);
      toast.success(`You successfully logged in as ${data?.user?.name}`);
      navigate('/');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.extraMessage || 'Login failed.';
      setErrors({ apiError: errorMessage });
      toast.error('Login failed. Please make sure you entered the correct email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleLoginCheck} className='px-10'>
        <p className='font-medium text-gray-600 mb-4'>Enter your email and password to login.</p>

        <div className='relative mb-4'>
          <label htmlFor='email' className='block text-sm font-medium mb-1'>Email Address</label>
          <input
            type='email'
            name='email'
            id='email'
            placeholder='Enter your email address'
            value={user.email}
            onChange={handleSetValue}
            className={`w-full border rounded p-2 outline-none ${
              errors.email ? 'border-red-500' : 'border-green-500'
            }`}
          />
          {errors.email && <span className='text-red-500 text-xs'>{errors.email}</span>}
        </div>

        <div className='relative mb-4'>
          <label htmlFor='password' className='block text-sm font-medium mb-1'>Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            id='password'
            placeholder='Enter your password'
            value={user.password}
            onChange={handleSetValue}
            className={`w-full border rounded p-2 outline-none ${
              errors.password ? 'border-red-500' : 'border-green-500'
            }`}
          />
          <button
            type='button'
            className='absolute right-2 top-9 text-gray-600'
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && <span className='text-red-500 text-xs'>{errors.password}</span>}
        </div>

        {errors.apiError && <p className='text-red-500 text-sm mt-2'>{errors.apiError}</p>}

        <button
          type='submit'
          disabled={isLoading}
          className='w-full bg-[#46A358] text-lg font-semibold text-white rounded p-2 mt-3 hover:bg-[#3b8b4a] transition-all'
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <div className='mt-4'>
          <button
            type='button'
            className='flex items-center justify-center gap-2 w-full border border-gray-300 rounded p-2 text-gray-700 hover:bg-gray-100 transition-all'
          >
            <Chrome size={20} /> Login with Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

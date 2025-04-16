import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

interface RegisterProps {
  setIsModalOpen: (value: boolean) => void;
  setIsLogged: (value: boolean) => void;
}

interface UserData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

interface ErrorMessages {
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  apiError?: string;
}

const Register: React.FC<RegisterProps> = ({ setIsModalOpen, setIsLogged }) => {
  const api = import.meta.env.VITE_API as string;
  const token = import.meta.env.VITE_PUBLIC_ACCESS_TOKEN as string;

  const [user, setUser] = useState<UserData>({
    name: '',
    surname: '',
    email: '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ErrorMessages>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSetValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: ErrorMessages = {};

    if (!user.name) newErrors.name = 'Enter your name';
    if (!user.surname) newErrors.surname = 'Enter your surname';
    if (!user.email) newErrors.email = 'Enter your email';
    if (user.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (user.password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${api}user/sign-up?access_token=${token}`, user);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      setIsLogged(true);
      setIsModalOpen(false);
      toast.success(`${response.data.data.user.name} registered successfully!`);
      navigate('/');
    } catch (err: any) {
      setErrors({ apiError: err?.response?.data?.extraMessage || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="px-10">
      <p className="font-medium mb-2">Register with your email and password.</p>

      {['name', 'surname', 'email'].map((field) => (
        <div key={field} className="relative">
          <input
            type="text"
            className={`w-full border rounded my-2 p-2 outline-none ${
              errors[field as keyof ErrorMessages] ? 'border-red-500' : 'border-green-500'
            }`}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={user[field as keyof UserData]}
            onChange={handleSetValue}
          />
          {errors[field as keyof ErrorMessages] && (
            <span className="absolute left-0 mt-12 text-red-500 text-xs">
              {errors[field as keyof ErrorMessages]}
            </span>
          )}
        </div>
      ))}

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className={`w-full border rounded my-2 p-2 outline-none ${
            errors.password ? 'border-red-500' : 'border-green-500'
          }`}
          name="password"
          placeholder="Create Password"
          value={user.password}
          onChange={handleSetValue}
        />
        <span
          className="absolute right-3 top-4 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
        {errors.password && (
          <span className="absolute left-0 mt-12 text-red-500 text-xs">{errors.password}</span>
        )}
      </div>

      <div className="relative">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          className={`w-full border rounded my-2 p-2 outline-none ${
            errors.confirmPassword ? 'border-red-500' : 'border-green-500'
          }`}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <span
          className="absolute right-3 top-4 cursor-pointer"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
        {errors.confirmPassword && (
          <span className="absolute left-0 mt-12 text-red-500 text-xs">{errors.confirmPassword}</span>
        )}
      </div>

      {/* API Error */}
      {errors.apiError && <p className="text-red-500 text-xs mt-2">{errors.apiError}</p>}

      <button
        type="submit"
        className="w-full bg-[#46A358] text-lg font-semibold text-white rounded p-2 mt-5"
        disabled={isLoading}
      >
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default Register;

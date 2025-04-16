import React, { useEffect } from 'react';
import Register from './Register/Register';
import Login from './Login/Login';
import '../../index.css';

interface AuthProps {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  setIsLogged: (value: boolean) => void;
}

const Auth: React.FC<AuthProps> = ({ isLoginOpen, isRegisterOpen, setIsModalOpen, setIsLogged }) => {
  useEffect(() => {
    const Login = document.getElementById('login');
    const Register = document.getElementById('register');

    if (login && register) {
      if (isLoginOpen) {
        register.style.opacity = '0';
        setTimeout(() => {
          login.style.opacity = '1';
        }, 100);
      }

      if (isRegisterOpen) {
        login.style.opacity = '0';
        setTimeout(() => {
          register.style.opacity = '1';
        }, 100);
      }
    }
  }, [isLoginOpen, isRegisterOpen]);

  return (
    <div className="auth-container">
      <div id="login" className="transi">
        {isLoginOpen && <Login setIsModalOpen={setIsModalOpen} setIsLogged={setIsLogged} />}
      </div>
      <div id="register" className="transi">
        {isRegisterOpen && <Register setIsModalOpen={setIsModalOpen} setIsLogged={setIsLogged} />}
      </div>
    </div>
  );
};

export default Auth;

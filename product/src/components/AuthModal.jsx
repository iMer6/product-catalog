import React, { useState, useEffect } from 'react';

import modalStyles from "../styles/modal.module.css";
import formStyles from  "../styles/authForm.module.css";

const AuthModal = ({ isOpen, onClose, setName }) => {
  // state for switching Sign-up/Log-in form
  // true – Log in
  // false – Sign up
  const [isLogin, setIsLogin] = useState(false); 
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  useEffect(() => {
    const handleKeyDown = (event) => { if (event.key === 'Escape') { onClose(); } };
    if (isOpen) { window.addEventListener('keydown', handleKeyDown); } // add listener when modal form is open
    return () => { window.removeEventListener('keydown', handleKeyDown); }; // remove listener when modal form is close 
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents a "Submit" button from refreshing the page

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Паролі не збігаються");
      return;
    }

    try {
      const link = isLogin
        ? 'http://localhost:3000/log-in'
        : 'http://localhost:3000/sign-up';
      
      const response = await fetch(link, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData, ['name', 'email', 'password']),
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json();

        if (data.user) {
          sessionStorage.setItem('userName', data.user.name);
          sessionStorage.setItem('userEmail', data.user.email);
        }

        !isLogin
          ? alert("Successfully sign up")
          : alert("Successfully log in");

        // change username without reload entire page
        setName(sessionStorage.getItem('userName'));
      } else if (response.status === 409) { 
        alert("Цей імейл вже зайнятий!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Щось пішло не так");
      }
    } catch (err) {
      console.error("Помилка:", err);
    }

    setFormData({ username: '', email: '', password: '', confirmPassword: '' }); // clears the data
    onClose();
  };

  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.modal} style={{ maxWidth: '450px' }}>
        <div className={modalStyles.header}>
          <h2>{isLogin ? "Вхід" : "Реєстрація"}</h2>
          <button onClick={onClose} className={modalStyles['close-btn']}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={modalStyles.content}>
          {!isLogin && (
            <div className={formStyles['form-group']}>
            <label>Ім'я користувача</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required className={formStyles['form-input']}/>
          </div>
          )}

          <div className={formStyles['form-group']}>
            <label>Електронна пошта</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className={formStyles['form-input']}/>
          </div>

          <div className={formStyles['form-group']}>
            <label>Пароль</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className={formStyles['form-input']}/>
          </div>

          {!isLogin && (
            <div className={formStyles['form-group']}>
            <label>Підтвердіть пароль</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className={formStyles['form-input']}/>
          </div>
          )}

          <div className={modalStyles.footer} style={{ textAlign: 'center' }}>
            <button type="submit" className={modalStyles.btn} style={{ width: '100%' }}>
              {isLogin ? "Увійти" : "Створити акаунт"}
            </button>
            <p style={{ marginTop: '10px', fontSize: '14px' }}>
              {isLogin ? "Ще не маєте акаунт?" : "Вже майте акаунт?"}
              <span className={formStyles['sU-lI']} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Зареєструватися" : "Увійти"}
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
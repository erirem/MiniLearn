// src/pages/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Navigasyon için

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Giriş başarılı!');
      navigate('/dashboard'); // Başarılı giriş sonrası yönlendirme
    } catch (error) {
      alert(`Giriş Hatası: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl mb-4">Giriş Yap</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full p-2 mb-2 border rounded"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full p-2 mb-4 border rounded"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded"
          >
            Giriş Yap
          </button>
        </form>

        {/* Kayıt Ol butonu */}
        <button
          onClick={() => navigate('/register')}
          className="mt-4 text-blue-500 underline"
        >
          Hesabın yok mu? Kayıt Ol
        </button>
      </div>
    </div>
  );
}

export default Login;

// src/pages/Register.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName }); // Kullanıcıya isim ekleme
      alert('Kayıt başarılı!');
      navigate('/dashboard');
    } catch (error) {
      alert(`Kayıt Hatası: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl mb-4">Kayıt Ol</h1>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="İsim"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="block w-full p-2 mb-2 border rounded"
          />
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
            className="w-full px-4 py-2 bg-green-500 text-white rounded"
          >
            Kayıt Ol
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;

// src/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig';

function ProtectedRoute({ children }) {
  const user = auth.currentUser; // Kullanıcının oturum durumu

  // Eğer kullanıcı yoksa Login sayfasına yönlendir
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Kullanıcı varsa, korunan içeriği göster
  return children;
}

export default ProtectedRoute;

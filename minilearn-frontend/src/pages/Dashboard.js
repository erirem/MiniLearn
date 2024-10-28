// src/pages/Dashboard.js
import React from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

// Destructure the backendMessage from props
function Dashboard({ backendMessage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  const dailyGoals = [
    { id: 1, title: 'Matematik Modülünü Bitir', completed: false },
    { id: 2, title: '10 Dakika Kitap Oku', completed: true },
  ];

  const recentActivities = [
    { id: 1, title: 'Bilim Modülü', date: '23 Ekim' },
    { id: 2, title: 'Matematik Modülü', date: '22 Ekim' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <h2 className="text-xl mb-4">
        Hoş Geldin, {auth.currentUser?.displayName || 'Kullanıcı'}!
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Backend Mesajı</h3>
        <p className="text-lg text-green-500">
          {backendMessage ? backendMessage : 'Bağlantı kurulamadı.'}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Günlük Hedefler</h3>
        <ul>
          {dailyGoals.map((goal) => (
            <li
              key={goal.id}
              className={`p-4 mb-2 rounded ${
                goal.completed ? 'bg-green-100' : 'bg-yellow-100'
              }`}
            >
              {goal.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Son Tamamlanan Aktiviteler</h3>
        <ul>
          {recentActivities.map((activity) => (
            <li key={activity.id} className="p-4 mb-2 border rounded">
              {activity.title} – Tamamlanma Tarihi: {activity.date}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Çıkış Yap
      </button>
    </div>
  );
}

export default Dashboard;

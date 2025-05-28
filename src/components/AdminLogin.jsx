// components/AdminLogin.jsx
import React from 'react';

const AdminLogin = ({ 
  showAdminLogin, 
  adminPassword, 
  setAdminPassword, 
  onLogin, 
  onCancel 
}) => {
  if (!showAdminLogin) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-sm w-full mx-4">
        <h3 className="text-xl font-bold text-white mb-4">Admin Login</h3>
        <input
          type="password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          placeholder="Nhập mật khẩu admin"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 mb-4"
          onKeyPress={(e) => e.key === 'Enter' && onLogin()}
        />
        <div className="flex space-x-2">
          <button
            onClick={onLogin}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
          >
            Đăng nhập
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
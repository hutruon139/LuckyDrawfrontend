// components/CheckinForm.jsx
import React from 'react';
import { Users, Phone, Mail, User } from 'lucide-react';

const CheckinForm = ({ 
  checkinData, 
  setCheckinData, 
  onSubmit, 
  onBack, 
  loading, 
  message 
}) => {
  return (
    <div className="max-w-md mx-auto px-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
        <div className="text-center mb-6">
          <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Thông tin gia đình</h2>
          <p className="text-blue-200">Điền thông tin để tham gia</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              <User className="inline h-4 w-4 mr-1" />
              Tên gia đình *
            </label>
            <input
              type="text"
              required
              value={checkinData.name}
              onChange={(e) =>
                setCheckinData({ ...checkinData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-md"
              placeholder="Nhập tên gia đình"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Số điện thoại *
            </label>
            <input
              type="tel"
              required
              value={checkinData.phone}
              onChange={(e) =>
                setCheckinData({ ...checkinData, phone: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-md"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              Email (không bắt buộc)
            </label>
            <input
              type="email"
              value={checkinData.email}
              onChange={(e) =>
                setCheckinData({ ...checkinData, email: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-md"
              placeholder="Nhập email"
            />
          </div>

          <button
            onClick={onSubmit}
            disabled={loading || !checkinData.name || !checkinData.phone}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '🎰 Đang xử lý...' : '🎲 CHECK-IN & SPIN!'}
          </button>
        </div>

        {message && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-center">
            {message}
          </div>
        )}

        <button
          onClick={onBack}
          className="w-full mt-4 text-white/60 hover:text-white transition"
        >
          ← Quay lại
        </button>
      </div>
    </div>
  );
};

export default CheckinForm;
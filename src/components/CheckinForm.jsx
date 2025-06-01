import React, { useState } from 'react';

const CheckinForm = ({ 
  checkinData, 
  setCheckinData, 
  onSubmit, 
  onBack, 
  loading, 
  message 
}) => {
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-start justify-center"
      style={{
        backgroundImage: `url('/assets/background.jpg')`,
      }}
    >
      {/* Main Form Container - Kéo xuống bằng cách tăng mt */}
      <div className="w-full max-w-4xl mx-auto mt-40">
        <div className="bg-white rounded-4xl p-12 shadow-lg min-h-96">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-black p-20">
              Vui lòng nhập thông tin
            </h1>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Name Field */}
            <div>
              <label className="block text-gray-400 text-4xl mb-3">
                Họ và tên
              </label>
              <input
                type="text"
                required
                value={checkinData.name}
                onChange={(e) =>
                  setCheckinData({ ...checkinData, name: e.target.value })
                }
                className="w-full px-4 py-10 bg-gray-100 border-0 rounded-lg text-gray-800 focus:outline-none transition-all text-4xl"
                placeholder=""
              />
            </div>

            {/* Employee ID Field */}
            <div>
              <label className="block text-gray-400 text-4xl mb-3">
                ID nhân viên
              </label>
              <input
                type="text"
                required
                value={checkinData.phone}
                onChange={(e) =>
                  setCheckinData({ ...checkinData, phone: e.target.value })
                }
                className="w-full px-4 py-10 bg-gray-100 border-0 rounded-lg text-gray-800 focus:outline-none transition-all text-4xl"
                placeholder=""
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={onSubmit}
              disabled={loading || !checkinData.name || !checkinData.phone}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-10 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8 text-5xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang xử lý...
                </span>
              ) : (
                'Xác nhận'
              )}
            </button>
          </div>

          {/* Error/Success Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg text-center text-lg ${
              message.includes('thành công') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-full mt-6 text-gray-500 hover:text-gray-700 transition text-4xl py-2"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckinForm;
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
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-start justify-center px-12 py-24"
      style={{
        backgroundImage: `url('/assets/background.jpg')`,
      }}
    >
      {/* Main Form Container - Optimized for 9:16 vertical ratio */}
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-4xl p-9 shadow-lg">
          {/* Form Header - Reduced padding */}
          <div className="text-center mb-4">
            <h1 className="font-bold text-black p-3" style={{ fontSize: '26px' }}>
              Vui lòng nhập thông tin
            </h1>
          </div>

          {/* Form Fields - Compact spacing */}
          <div className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-gray-400 text-base mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                required
                value={checkinData.name}
                onChange={(e) =>
                  setCheckinData({ ...checkinData, name: e.target.value })
                }
                className="w-full px-3 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
                placeholder=""
              />
            </div>

            {/* Employee ID Field */}
            <div>
              <label className="block text-gray-400 text-base mb-1">
                ID nhân viên
              </label>
              <input
                type="text"
                required
                value={checkinData.phone}
                onChange={(e) =>
                  setCheckinData({ ...checkinData, phone: e.target.value })
                }
                className="w-full px-3 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
                placeholder=""
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={onSubmit}
              disabled={loading || !checkinData.name || !checkinData.phone}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-base"
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
            <div className={`mt-3 p-2 rounded-lg text-center text-xs ${
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
            className="w-full mt-3 text-gray-500 hover:text-gray-700 transition text-sm py-1"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckinForm;
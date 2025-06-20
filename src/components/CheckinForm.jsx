import React, { useState } from "react";
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const CheckinForm = ({
  checkinData,
  setCheckinData,
  onSubmit,
  onBack,
  loading,
  message,
}) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState('');
  const [layoutName, setLayoutName] = useState('default');

  const onKeyPress = (button) => {
    if (button === "{enter}") {
      setShowKeyboard(false);
      setActiveInput('');
      return;
    }
    if (button === "{caps}") {
      const nextLayout = layoutName === "default" ? "shift" : "default";
      setLayoutName(nextLayout);
      return;
    }
    if (button === "{bksp}") {
      // Backspace handled automatically
      return;
    }
  };

  const onChangeInput = (input) => {
    if (activeInput === 'name') {
      setCheckinData({ ...checkinData, name: input });
    } else if (activeInput === 'phone') {
      setCheckinData({ ...checkinData, phone: input });
    }
    
    // Auto-disable caps after typing first letter
    if (layoutName === 'shift') {
      setLayoutName('default');
    }
  };

  const handleInputFocus = (inputType) => {
    setActiveInput(inputType);
    setShowKeyboard(true);
  };

  const closeKeyboard = () => {
    setShowKeyboard(false);
    setActiveInput('');
  };

  // Handle physical keyboard input
  const handlePhysicalKeyboard = (e, fieldName) => {
    const value = e.target.value;
    setCheckinData({ ...checkinData, [fieldName]: value });
    
    // Update virtual keyboard if it's open for this field
    if (activeInput === fieldName && showKeyboard) {
      // Sync virtual keyboard with physical input
      // This ensures both keyboards stay in sync
    }
  };

  // Handle form submission with Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading && checkinData.name && checkinData.phone) {
      onSubmit();
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col px-12 py-24 tv-container-padding relative"
      style={{
        backgroundImage: `url('/assets/background.jpg')`,
      }}
    >
      {/* Main Form Container - Fixed position when keyboard is open */}
      <div className="w-full max-w-md mx-auto tv-form-width mb-4">
  <div className="bg-white rounded-4xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 3xl:p-24 tv-padding shadow-lg w-full">
          {/* Form Header - Reduced padding */}
          <div className="text-center mb-4">
            <h1 className="font-bold text-black p-3 text-2xl tv-header-text">
              Vui lòng nhập thông tin
            </h1>
          </div>

          {/* Form Fields - Compact spacing */}
          <div className="space-y-5">
            {/* Name Field */}
            <div className="relative">
              <label className="block text-gray-400 text-base mb-1 tv-label-text">
                Họ và tên
              </label>
              <input
                type="text"
                required
                value={checkinData.name}
                onChange={(e) => handlePhysicalKeyboard(e, 'name')}
                onFocus={() => handleInputFocus('name')}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm tv-input-text tv-input-padding cursor-text"
                placeholder="Nhập họ và tên"
                autoComplete="name"
                autoCapitalize="words"
              />
            </div>

            {/* Employee ID Field */}
            <div className="relative">
              <label className="block text-gray-400 text-base mb-1 tv-label-text">
                ID nhân viên
              </label>
              <input
                type="text"
                required
                value={checkinData.phone}
                onChange={(e) => handlePhysicalKeyboard(e, 'phone')}
                onFocus={() => handleInputFocus('phone')}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm tv-input-text tv-input-padding cursor-text"
                placeholder="Nhập ID nhân viên"
                autoComplete="off"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={onSubmit}
              disabled={loading || !checkinData.name || !checkinData.phone}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-base tv-button-text tv-button-padding"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 tv-spinner-size"></div>
                  Đang xử lý...
                </span>
              ) : (
                "Xác nhận"
              )}
            </button>
          </div>

          {/* Error/Success Message */}
          {message && (
            <div
              className={`mt-3 p-2 rounded-lg text-center text-xs tv-message-text tv-message-padding ${
                message.includes("thành công")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-full mt-3 text-gray-500 hover:text-gray-700 transition text-sm py-1 tv-back-button-text tv-back-button-padding"
          >
            ← Quay lại
          </button>
        </div>
      </div>

      {/* Bottom Keyboard - Fixed at bottom of screen */}
      {showKeyboard && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-t-4 border-blue-500 p-4 shadow-2xl">
            <div className="flex justify-between items-center mb-3 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 tv-keyboard-title">
                {activeInput === 'name' ? 'Nhập họ và tên' : 'Nhập ID nhân viên'}
              </h3>
              <button
                onClick={closeKeyboard}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium tv-keyboard-close"
              >
                Đóng
              </button>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Keyboard
                onChange={onChangeInput}
                onKeyPress={onKeyPress}
                layoutName={layoutName}
                theme="hg-theme-default tv-keyboard"
                inputName={activeInput}
                layout={{
                  default: [
                    "1 2 3 4 5 6 7 8 9 0 {bksp}",
                    "q w e r t y u i o p",
                    "a s d f g h j k l",
                    "{caps} z x c v b n m",
                    "{space} {enter}"
                  ],
                  shift: [
                    "1 2 3 4 5 6 7 8 9 0 {bksp}",
                    "Q W E R T Y U I O P",
                    "A S D F G H J K L",
                    "{caps} Z X C V B N M",
                    "{space} {enter}"
                  ]
                }}
                display={{
                  '{bksp}': 'Xóa ⌫',
                  '{enter}': 'Xong ✓',
                  '{caps}': layoutName === 'default' ? 'CAPS' : 'caps',
                  '{space}': 'Khoảng trắng'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Overlay when keyboard is open */}
      {showKeyboard && (
        <div 
          className="fixed inset-0 z-30"
          onClick={closeKeyboard}
        />
      )}
    </div>
  );
};

export default CheckinForm;
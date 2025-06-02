// components/StandbyScreen.jsx - FIXED IMAGE LOADING
import React, { useState, useEffect } from "react";

const StandbyScreen = ({ onTouchToSpin, familyName }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  // Try multiple image paths
  const imagePaths = [
    "/assets/Standby.jpeg",
    "./assets/Standby.jpeg",
    "/public/assets/Standby.jpeg",
    "/assets/standby.jpeg", // lowercase
    "/assets/Standby.jpg", // different extension
  ];

  // Preload image with fallback
  useEffect(() => {
    let imageIndex = 0;

    const tryLoadImage = () => {
      if (imageIndex >= imagePaths.length) {
        console.error("❌ Could not load standby image from any path");
        setImageError(true);
        setImageLoaded(true); // Show fallback
        return;
      }

      const img = new Image();
      const currentPath = imagePaths[imageIndex];

      img.onload = () => {
        console.log("✅ Image loaded successfully from:", currentPath);
        setImageLoaded(true);
        setImageError(false);
      };

      img.onerror = () => {
        console.log("❌ Failed to load image from:", currentPath);
        imageIndex++;
        tryLoadImage();
      };

      img.src = currentPath;
    };

    tryLoadImage();
  }, []);

  // Pulse animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowPulse((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (!imageLoaded) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-700 font-medium mb-2">Đang tải...</div>
          <div className="text-gray-500 text-sm">
            {imageError ? "Không thể tải hình ảnh" : "Vui lòng đợi"}
          </div>
        </div>
      </div>
    );
  }

  // Fallback design if image fails to load
  if (imageError) {
    return (
      <div
        className="min-h-screen w-full relative cursor-pointer bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center"
        onClick={onTouchToSpin}
      >
        {/* Techcombank Header */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center justify-center">
            <span className="text-red-600 font-bold text-3xl tracking-tight">
              TECHCOM
            </span>
            <span className="text-gray-800 font-bold text-3xl tracking-tight">
              BANK
            </span>
            <div className="ml-3 flex items-center">
              <div className="w-5 h-5 bg-red-600 transform rotate-45"></div>
              <div className="w-5 h-5 bg-red-600 transform rotate-45 -ml-1"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center">
          <h1 className="text-gray-800 text-3xl font-medium mb-4">
            NGÀY HỘI GIA ĐÌNH 2025
          </h1>
          <h2 className="text-red-600 text-5xl font-bold mb-8">
            PHIÊN BẢN VƯỢT TRỘI
            <br />
            CỦA GIA ĐÌNH MÌNH
          </h2>

          {/* Touch instruction */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-xl border border-gray-200 max-w-md mx-auto tv-standby-container">
            <div className="text-gray-600 animate-pulse text-4xl tv-standby-text">
              Chạm vào màn hình để bắt đầu
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-gray-800 font-bold text-lg">VƯỢT TRỘI</span>
            <div className="w-4 h-4 bg-red-600 transform rotate-45"></div>
            <span className="text-gray-800 font-bold text-lg">MỖI NGÀY</span>
          </div>
        </div>
      </div>
    );
  }

  // Main standby screen with image
  return (
    <div
      className="min-h-screen w-full relative cursor-pointer bg-cover bg-center bg-no-repeat flex items-center justify-center"
      onClick={onTouchToSpin}
      style={{
        backgroundImage: `url('${imagePaths[0]}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Touch interaction overlay */}
      <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-all duration-500"></div>

      {/* Interactive pulse effect */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
          showPulse ? "opacity-20" : "opacity-0"
        }`}
      >
        <div className="w-full h-full border-8 border-white/30 rounded-lg animate-pulse"></div>
      </div>

      {/* Family name greeting - TRANSPARENT & SIMPLE */}
      {familyName && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="bg-transparent px-10 py-6">
            <div className="text-center">
              <div className="text-gray-800 font-bold text-center text-2xl mb-2 drop-shadow-lg">
                Cảm ơn{" "}
                <span className="text-red-600 font-extrabold animate-pulse">
                  {familyName}
                </span>
                !
              </div>
              <div className="text-gray-700 text-center text-lg font-medium drop-shadow-md animate-pulse">
                Gia đình tiếp theo, vui lòng chạm vào màn hình
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Default touch instruction - TRANSPARENT & SIMPLE */}
{/* Default touch instruction - TRANSPARENT & SIMPLE */}
{!familyName && (
  <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20">
    <div className="bg-transparent px-10 py-6 hover:scale-105 transition-transform tv-standby-container">
      <div className="text-center">
        <div className="text-gray-700 text-center animate-pulse text-lg font-medium drop-shadow-md tv-standby-text">
          Chạm vào màn hình để bắt đầu
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default StandbyScreen;

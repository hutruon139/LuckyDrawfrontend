// components/ResultScreen.jsx
import React from "react";

const ResultScreen = ({ spinResult, checkinData, onNewFamily, onGoHome }) => {
  // Determine which card design to show based on challenges
  const getCardContent = () => {
    switch (spinResult.challenges) {
      case 0:
        return {
          title: "Chúc mừng!",
          subtitle: "Gia đình bạn đã may mắn nhận phần thưởng đặc biệt!",
          bgColor: "bg-red-50",
          bgImage: "/assets/prize.png",
        };
      case 1:
        return {
          title: "1 thử thách",
          subtitle: "Hoàn thành 1 thử thách để rình quà về.",
          bgColor: "bg-blue-50",
          bgImage: "/assets/onechallenge.png",
        };
      case 2:
        return {
          title: "2 thử thách",
          subtitle:
            "Cùng nhau vượt qua 2 thử thách để nhận phần thưởng hấp dẫn.",
          bgColor: "bg-purple-50",
          bgImage: "/assets/twochallenge.png",
        };
      case 3:
        return {
          title: "3 thử thách",
          subtitle:
            "Đoàn kết, phối hợp và cùng nhau chinh phục 3 thử thách để dược nhận quà",
          bgColor: "bg-orange-50",
          bgImage: "/assets/threechallenge.png",
        };
      default:
        return {
          title: "",
          subtitle: "",
          bgColor: "bg-gray-50",
          bgImage: "/assets/prize.png",
        };
    }
  };

  const cardContent = getCardContent();

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{
        backgroundImage: `url('/assets/resultbg.png')`,
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Main Card - Matching the design from images */}
        <div className="bg-transparent rounded-4xl p-12 relative overflow-hidden mt-32">
          {/* Result Card */}
          <div
            className={`bg-white rounded-2xl py-10 px-24 mt-20 mb-12 text-center border border-gray-200 bg-cover bg-center min-h-[600px] flex flex-col justify-center`}
            style={{
              backgroundImage: `url('${cardContent.bgImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Title */}
            <h3 className="text-6xl font-bold mt-50 mb-5 drop-shadow-lg">
              {cardContent.title}
            </h3>

            {/* Description */}
            <p className="text-5xl leading-relaxed drop-shadow-lg px-10">
              {cardContent.subtitle}
            </p>
          </div>

          {/* Family Info Section */}
          <div className="bg-white rounded-4xl p-20 mb-12">
            <h4 className="text-3xl font-semibold text-center text-gray-700 mb-8">
              Thông tin gia đình:
            </h4>
            <div className="text-3xl text-gray-600 max-w-md mx-auto">
              <div className="flex gap-4">
                <span>Họ và tên:</span>
                <span className="font-medium">{checkinData.name}</span>
              </div>
              <div className="flex gap-4">
                <span>ID nhân viên:</span>
                <span className="font-medium">{checkinData.phone}</span>
              </div>
            </div>
          </div>
          {/* Back to Home Button - Red style matching design */}
          <button
            onClick={onGoHome}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-12 rounded-full transition-all duration-300 mb-6 text-5xl"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;

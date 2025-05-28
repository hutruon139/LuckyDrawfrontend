// components/ResultScreen.jsx
import React from 'react';
import { Sparkles } from 'lucide-react';

const ResultScreen = ({ spinResult, checkinData, onNewFamily, onGoHome }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 text-center">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
        <Sparkles className="h-16 w-16 text-yellow-400 mx-auto mb-6 animate-pulse" />

        <h2 className="text-4xl font-bold text-white mb-4">🎉 KẾT QUẢ 🎉</h2>

        <div
          className={`p-6 rounded-2xl mb-6 border-2`}
          style={{
            backgroundColor: `${spinResult.color}20`,
            borderColor: `${spinResult.color}60`,
          }}
        >
          <div className="text-6xl mb-4">
            {spinResult.challenges === 0
              ? '🎁'
              : spinResult.challenges === 1
              ? '🎯'
              : spinResult.challenges === 2
              ? '🏆'
              : '👑'}
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">
            {spinResult.label}
          </h3>
          <p className="text-xl text-white/90">
            {spinResult.challenges === 0
              ? 'Chúc mừng bạn đã nhận được phần thưởng!'
              : `Hoàn thành ${spinResult.challenges} thử thách để nhận quà!`}
          </p>
        </div>

        <div className="bg-blue-500/20 rounded-xl p-4 mb-6 border border-blue-500/30">
          <h4 className="text-lg font-semibold text-blue-300 mb-2">
            Thông tin gia đình:
          </h4>
          <p className="text-white">{checkinData.name}</p>
          <p className="text-white/80">{checkinData.phone}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onNewFamily}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-lg font-bold py-3 rounded-xl transition-all duration-300"
          >
            🔄 Gia đình mới tham gia
          </button>

          <button
            onClick={onGoHome}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-all duration-300 border border-white/20"
          >
            🏠 Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
// components/WelcomeScreen.jsx
import React from 'react';
import { Gift } from 'lucide-react';

const WelcomeScreen = ({ onStartClick }) => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20">
          <Gift className="h-16 w-16 text-yellow-400 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Chào mừng đến với Lucky Draw!
          </h2>
          <p className="text-xl text-blue-200 mb-6">
            Check-in để biết bạn sẽ nhận được gì!
          </p>

          {/* Prize explanation with current stats */}
          <div className="grid md:grid-cols-4 gap-4 text-center mb-6">
            <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
              <div className="text-2xl mb-2">🎁</div>
              <div className="text-green-300 font-semibold">FREE GIFT</div>
              <div className="text-sm text-green-200">Nhận quà ngay!</div>
              <div className="text-xs text-green-400 mt-1">
              </div>
            </div>
            <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-blue-300 font-semibold">1 CHALLENGE</div>
              <div className="text-sm text-blue-200">1 thử thách = Quà</div>
              <div className="text-xs text-blue-400 mt-1">
              </div>
            </div>
            <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-purple-300 font-semibold">2 CHALLENGES</div>
              <div className="text-sm text-purple-200">2 thử thách = Quà lớn</div>
              <div className="text-xs text-purple-400 mt-1">
              </div>
            </div>
            <div className="bg-red-500/20 rounded-xl p-4 border border-red-500/30">
              <div className="text-2xl mb-2">👑</div>
              <div className="text-red-300 font-semibold">3 CHALLENGES</div>
              <div className="text-sm text-red-200">3 thử thách = Quà VIP</div>
              <div className="text-xs text-red-400 mt-1">
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onStartClick}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-xl font-bold py-4 px-8 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-xl"
        >
          🚀 BẮT ĐẦU NGAY!
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
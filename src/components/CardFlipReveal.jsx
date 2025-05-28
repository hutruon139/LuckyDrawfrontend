// components/CardFlipReveal.jsx
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Sparkles } from 'lucide-react';

const CardFlipReveal = forwardRef(({ isRevealing, prizeResult, onRevealComplete }, ref) => {
  const [countdown, setCountdown] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  // Expose control methods to parent
  useImperativeHandle(ref, () => ({
    startReveal: () => {
      console.log('🎴 Starting card reveal...');
      setIsFlipped(false);
      setShowSparkles(false);
      startCountdownSequence();
    },
    reset: () => {
      setIsFlipped(false);
      setShowSparkles(false);
      setCountdown(0);
    }
  }));

  const startCountdownSequence = async () => {
    // 5-second countdown (longer buildup)
    for (let i = 5; i > 0; i--) {
      setCountdown(i);
      await new Promise(resolve => setTimeout(resolve, 1200)); // Slightly slower countdown
    }
    
    setCountdown(0);
    
    // Longer dramatic pause before flip
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Flip the card
    setIsFlipped(true);
    
    // Delay sparkles for more dramatic effect
    setTimeout(() => {
      setShowSparkles(true);
    }, 400);
    
    // Much longer wait before completing - let people absorb the result
    setTimeout(() => {
      if (onRevealComplete) onRevealComplete();
    }, 3000); // Extended from 600ms to 3000ms
  };

  // Auto-start when prizeResult is provided
  useEffect(() => {
    if (prizeResult && isRevealing) {
      startCountdownSequence();
    }
  }, [prizeResult, isRevealing]);

  return (
    <div className="max-w-2xl mx-auto px-4 text-center">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">
          {countdown > 0 ? `${countdown}` : isFlipped ? '🎉 KẾT QUẢ 🎉' : '🎴 CHUẨN BỊ...'}
        </h2>
        <p className="text-xl text-blue-200">
          {countdown > 0 ? 'Đang đếm ngược để tiết lộ...' : 
           isFlipped ? 'Chúc mừng! Đây là phần thưởng của bạn!' :
           'Thẻ may mắn sắp được lật... Hãy chuẩn bị!'}
        </p>
      </div>

      {/* Card Container */}
      <div className="relative mx-auto w-80 h-96 mb-8 perspective-1000">
        {/* Floating sparkles */}
        {showSparkles && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping text-yellow-400"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              >
                <Sparkles className="h-4 w-4" />
              </div>
            ))}
          </div>
        )}

        {/* The Card */}
        <div 
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Card Front (Face Down) */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden rounded-3xl border-4 border-white shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <div className="flex flex-col items-center justify-center h-full text-white p-8">
              {/* Card pattern */}
              <div className="absolute inset-4 border-2 border-white/30 rounded-2xl"></div>
              <div className="absolute inset-8 border border-white/20 rounded-xl"></div>
              
              {/* Main content */}
              <div className="text-center z-10">
                <div className="text-6xl mb-4 animate-pulse">❓</div>
                <h3 className="text-2xl font-bold mb-2">Lucky Card</h3>
                <p className="text-lg opacity-90">Phần thưởng đặc biệt</p>
                <p className="text-sm mt-4 opacity-70">Đang đếm ngược để tiết lộ...</p>
                
                {/* Animated dots for suspense */}
                <div className="flex justify-center space-x-1 mt-4">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '200ms'}}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '400ms'}}></div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 left-4 text-white/30">⭐</div>
              <div className="absolute top-4 right-4 text-white/30">⭐</div>
              <div className="absolute bottom-4 left-4 text-white/30">⭐</div>
              <div className="absolute bottom-4 right-4 text-white/30">⭐</div>
            </div>
          </div>

          {/* Card Back (Face Up - Prize Revealed) */}
          <div 
            className={`absolute inset-0 w-full h-full backface-hidden rounded-3xl border-4 border-white shadow-2xl rotate-y-180`}
            style={{
              backfaceVisibility: 'hidden',
              background: prizeResult ? `linear-gradient(135deg, ${prizeResult.color}40, ${prizeResult.color}80)` : '#333'
            }}
          >
            {prizeResult && (
              <div className="flex flex-col items-center justify-center h-full text-white p-8">
                {/* Prize content */}
                <div className="text-center">
                  <div className="text-8xl mb-6 animate-bounce">
                    {prizeResult.challenges === 0 ? '🎁' : 
                     prizeResult.challenges === 1 ? '🎯' :
                     prizeResult.challenges === 2 ? '🏆' : '👑'}
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-4" style={{ color: prizeResult.color }}>
                    {prizeResult.label}
                  </h3>
                  
                  <div className="bg-white/20 rounded-2xl p-4 mb-4">
                    <p className="text-lg font-semibold">
                      {prizeResult.challenges === 0 ? 'Chúc mừng! Bạn nhận quà miễn phí!' :
                       `Hoàn thành ${prizeResult.challenges} thử thách để nhận quà!`}
                    </p>
                  </div>

                  {/* Prize details */}
                  <div className="text-sm opacity-90">
                    {prizeResult.challenges === 0 && (
                      <p>✨ Không cần làm gì thêm - Nhận quà ngay!</p>
                    )}
                    {prizeResult.challenges === 1 && (
                      <p>🎯 Thực hiện 1 thử thách đơn giản</p>
                    )}
                    {prizeResult.challenges === 2 && (
                      <p>🏆 Hoàn thành 2 thử thách để nhận quà lớn</p>
                    )}
                    {prizeResult.challenges === 3 && (
                      <p>👑 Vượt qua 3 thử thách để nhận quà VIP</p>
                    )}
                  </div>
                </div>

                {/* Confetti effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 animate-bounce"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'][Math.floor(Math.random() * 4)],
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${1 + Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card shadow */}
        <div className="absolute inset-0 bg-black/20 rounded-3xl transform translate-y-4 -z-10"></div>
      </div>

      {/* Countdown Display - Enhanced */}
      {countdown > 0 && (
        <div className="mb-8">
          <div className="text-9xl font-bold text-yellow-400 animate-pulse mb-4 drop-shadow-2xl">
            {countdown}
          </div>
          <div className="text-xl text-white/80 mb-4 animate-bounce">
            {countdown === 5 && "Chuẩn bị tiết lộ phần thưởng..."}
            {countdown === 4 && "Thẻ may mắn đang được chọn..."}
            {countdown === 3 && "Gần đến lúc tiết lộ rồi..."}
            {countdown === 2 && "Sắp biết kết quả..."}
            {countdown === 1 && "Hãy chuẩn bị nhé!"}
          </div>
          <div className="flex justify-center space-x-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
          </div>
        </div>
      )}

      {/* Status */}
      {isFlipped && prizeResult && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mx-auto max-w-md border border-white/20">
          <div className="text-white space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🎊</span>
              <span className="font-bold text-lg">Kết quả đã được tiết lộ!</span>
            </div>
            
            <div className="border-t border-white/20 pt-3">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <span>🎁</span>
                <span>Nhóm: <span className="font-semibold">{prizeResult.label}</span></span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm mt-2">
                <span>⚡</span>
                <span>Thử thách: <span className="font-semibold">{prizeResult.challenges || 0}</span></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prize Legend */}
      <div className="mt-8 grid grid-cols-2 gap-3 max-w-md mx-auto">
        <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-2 rounded-lg border border-green-500/30">
          <span className="text-lg">🎁</span>
          <span className="text-green-300 text-sm font-medium">Free Gift</span>
        </div>
        <div className="flex items-center space-x-2 bg-blue-500/20 px-3 py-2 rounded-lg border border-blue-500/30">
          <span className="text-lg">🎯</span>
          <span className="text-blue-300 text-sm font-medium">1 Challenge</span>
        </div>
        <div className="flex items-center space-x-2 bg-purple-500/20 px-3 py-2 rounded-lg border border-purple-500/30">
          <span className="text-lg">🏆</span>
          <span className="text-purple-300 text-sm font-medium">2 Challenges</span>
        </div>
        <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-2 rounded-lg border border-red-500/30">
          <span className="text-lg">👑</span>
          <span className="text-red-300 text-sm font-medium">3 Challenges</span>
        </div>
      </div>
    </div>
  );
});

CardFlipReveal.displayName = 'CardFlipReveal';

export default CardFlipReveal;
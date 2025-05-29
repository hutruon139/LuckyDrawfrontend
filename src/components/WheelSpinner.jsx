import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { RotateCw } from "lucide-react";

const WheelSpinner = forwardRef(
  ({ isSpinning, prizeResult, onSpinComplete, onSpinStart }, ref) => {
    const [finalAngle, setFinalAngle] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isInternalSpinning, setIsInternalSpinning] = useState(false);
    const wheelRef = useRef(null);

    // Wheel segments - YOUR ORIGINAL ANGLES
    const segments = [
      {
        id: 1,
        group: "group_1",
        label: "FREE BIB!",
        color: "#10B981",
        challenges: 0,
        startAngle: 0,
        endAngle: 15,
      },
      {
        id: 2,
        group: "group_2",
        label: "1 Challenge",
        color: "#3B82F6",
        challenges: 1,
        startAngle: 15,
        endAngle: 150,
      },
      {
        id: 3,
        group: "group_3",
        label: "2 Challenges",
        color: "#8B5CF6",
        challenges: 2,
        startAngle: 150,
        endAngle: 315,
      },
      {
        id: 4,
        group: "group_4",
        label: "3 Challenges",
        color: "#EF4444",
        challenges: 3,
        startAngle: 315,
        endAngle: 360,
      },
    ];

    // Expose control methods to parent
    useImperativeHandle(ref, () => ({
      startSpin: (targetResult) => {
        startSpin(targetResult);
      },
      reset: () => {
        const wheelElement = wheelRef.current;
        if (wheelElement) {
          wheelElement.style.transition = "none";
          wheelElement.style.transform = "rotate(0deg)";
          void wheelElement.offsetWidth;
        }
        setFinalAngle(0);
        setShowResult(false);
        setIsInternalSpinning(false);
      },
    }));

    const calculateTargetAngle = (targetSegment) => {
      // Get the center of the target segment
      const segmentCenter =
        (targetSegment.startAngle + targetSegment.endAngle) / 2;

      // Fixed spins for consistency
      const spins = 15;
      const baseRotation = spins * 360; // 1800 degrees

      // To land on the segment center, we need to rotate so that
      // the segment center aligns with the pointer (at 0°/top)
      // Since the wheel rotates clockwise, we need: 360 - segmentCenter
      const targetAngle = baseRotation + (360 - segmentCenter);

      console.log("🎯 Target:", targetSegment.label);
      console.log("📐 Segment Center:", segmentCenter + "°");
      console.log("🎪 Target Angle:", targetAngle + "°");

      return targetAngle;
    };

    const startSpin = (targetResult) => {
      console.log("🎪 Starting spin with:", targetResult);
      setShowResult(false);

      if (!targetResult) {
        // Random fallback for testing
        const randomSegment =
          segments[Math.floor(Math.random() * segments.length)];
        targetResult = {
          group: randomSegment.group,
          label: randomSegment.label,
          challenges: randomSegment.challenges,
        };
      }

      // Find matching segment
      const targetSegment = segments.find(
        (s) => s.group === targetResult.group
      );
      if (!targetSegment) {
        console.error(
          "❌ No matching segment found for group:",
          targetResult.group
        );
        setIsInternalSpinning(false);
        return;
      }

      const targetAngle = calculateTargetAngle(targetSegment);
      setFinalAngle(targetAngle);

      const wheelElement = wheelRef.current;
      if (wheelElement) {
        // Always reset to 0 first
        wheelElement.style.transition = "none";
        wheelElement.style.transform = "rotate(0deg)";
        void wheelElement.offsetWidth;

        // Apply spin animation
        requestAnimationFrame(() => {
          wheelElement.style.transition =
            "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)";
          wheelElement.style.transform = `rotate(${targetAngle}deg)`;
        });
      }

      // Show result after spin completes
      setTimeout(() => {
        setIsInternalSpinning(false);
        setShowResult(true);
        if (onSpinComplete) {
          onSpinComplete({
            ...targetSegment,
            label: targetResult.label,
          });
        }
      }, 4000);
    };

    const currentlySpinning = isSpinning || isInternalSpinning;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              {isInternalSpinning
                ? "🎰 ĐANG QUAY..."
                : showResult
                ? "🎉 KẾT QUẢ 🎉"
                : "🎯 SẴN SÀNG QUAY!"}
            </h2>
            <p className="text-xl text-blue-200">
              {isInternalSpinning
                ? "Bánh xe đang xoay để chọn thử thách cho bạn!"
                : showResult
                ? "Chúc mừng! Đây là thử thách của bạn!"
                : "Nhấn quay để biết thử thách của bạn!"}
            </p>
          </div>

          {/* Spinning Wheel Container */}
          <div className="relative mx-auto w-96 h-96 mb-8">
            {/* Main Wheel */}
            <div
              ref={wheelRef}
              className="w-full h-full rounded-full border-8 border-white shadow-2xl relative overflow-hidden"
              style={{
                transformOrigin: "center center",
                willChange: "transform",
                // YOUR ORIGINAL GRADIENT - not equal segments
                background: `conic-gradient(
                    #10B981 0deg 15deg,
                    #3B82F6 15deg 150deg, 
                    #8B5CF6 150deg 315deg,
                    #EF4444 315deg 360deg
                  )`,
              }}
            >
              {/* Segment dividers - YOUR ORIGINAL ANGLES */}
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute inset-0 border-r-2 border-white/50"
                  style={{
                    transform: "rotate(15deg)",
                    transformOrigin: "center",
                  }}
                ></div>
                <div
                  className="absolute inset-0 border-r-2 border-white/50"
                  style={{
                    transform: "rotate(150deg)",
                    transformOrigin: "center",
                  }}
                ></div>
                <div
                  className="absolute inset-0 border-r-2 border-white/50"
                  style={{
                    transform: "rotate(315deg)",
                    transformOrigin: "center",
                  }}
                ></div>
              </div>

              {/* Center Hub */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white font-bold text-xs bg-gradient-to-br from-gray-900 to-black rounded-full w-16 h-16 flex items-center justify-center border-4 border-white/40 shadow-xl cursor-pointer hover:bg-gray-800">
                  <div className="text-center leading-tight">
                    <div className="text-yellow-400 text-sm">⭐</div>
                    <div className="text-[9px]">SPIN</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Pointer at top (0°) */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-30">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-yellow-400 drop-shadow-xl"></div>
            </div>

            {/* Wheel shadow */}
            <div className="absolute inset-0 rounded-full shadow-2xl bg-black/20 transform translate-y-2 -z-10"></div>
          </div>

          {/* Main Spin Button */}
          <div className="text-center mb-6">
            <button
              onClick={() => {
                if (isInternalSpinning) return;

                let targetResult = prizeResult;
                if (!targetResult) {
                  const randomSegment =
                    segments[Math.floor(Math.random() * segments.length)];
                  targetResult = {
                    group: randomSegment.group,
                    label: randomSegment.label,
                    challenges: randomSegment.challenges,
                  };
                }

                if (onSpinStart) onSpinStart();
                setIsInternalSpinning(true);
                startSpin(targetResult);
              }}
              disabled={isInternalSpinning}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                isInternalSpinning
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 hover:scale-105"
              } text-white shadow-xl`}
            >
              {isInternalSpinning ? (
                <span className="flex items-center justify-center gap-2">
                  <RotateCw className="animate-spin" />
                  Đang quay...
                </span>
              ) : (
                "QUAY NGAY!"
              )}
            </button>
          </div>

          {/* Result Display */}
          {showResult && prizeResult && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mx-auto max-w-md border border-white/20 mb-6">
              <div className="text-white space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">🎊</span>
                  <span className="font-bold text-lg">
                    Kết quả đã được tiết lộ!
                  </span>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <span>🎁</span>
                    <span>
                      Nhóm:{" "}
                      <span className="font-semibold">{prizeResult.label}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm mt-2">
                    <span>⚡</span>
                    <span>
                      Thử thách:{" "}
                      <span className="font-semibold">
                        {prizeResult.challenges || 0}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Segment Guide */}
          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto text-xs">
            <div className="flex items-center space-x-1 text-green-300">
              <span>🎁</span>
              <span>Green = Free BIB</span>
            </div>
            <div className="flex items-center space-x-1 text-blue-300">
              <span>🎯</span>
              <span>Blue = 1 Challenge</span>
            </div>
            <div className="flex items-center space-x-1 text-purple-300">
              <span>🏆</span>
              <span>Purple = 2 Challenges</span>
            </div>
            <div className="flex items-center space-x-1 text-red-300">
              <span>👑</span>
              <span>Red = 3 Challenges</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

WheelSpinner.displayName = "WheelSpinner";

export default WheelSpinner;

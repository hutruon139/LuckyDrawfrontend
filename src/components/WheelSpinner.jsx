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
    const [hasBeenPressed, setHasBeenPressed] = useState(false);
    const wheelRef = useRef(null);

    // Updated segments to match your 8-segment wheel (2 segments per group)
    const segments = [
      // Segment 1 - Group 1
      {
        id: 1,
        group: "group_1",
        label: "PHẦN THƯỞNG",
        challenges: 0,
        startAngle: 337.5,
        endAngle: 22.5,
      },

      // Segment 2 - Group 2
      {
        id: 2,
        group: "group_2",
        label: "THAM GIA THỬ THÁCH",
        challenges: 1,
        startAngle: 22.5,
        endAngle: 67.5,
      },

      // Segment 3 - Group 3
      {
        id: 3,
        group: "group_3",
        label: "THAM GIA THỬ THÁCH",
        challenges: 2,
        startAngle: 67.5,
        endAngle: 112.5,
      },

      // Segment 4 - Group 4
      {
        id: 4,
        group: "group_4",
        label: "THAM GIA THỬ THÁCH",
        challenges: 3,
        startAngle: 112.5,
        endAngle: 157.5,
      },

      // Segment 5 - Group 1 (duplicate)
      {
        id: 5,
        group: "group_1",
        label: "PHẦN THƯỞNG",
        challenges: 0,
        startAngle: 157.5,
        endAngle: 202.5,
      },

      // Segment 6 - Group 2 (duplicate)
      {
        id: 6,
        group: "group_2",
        label: "THAM GIA THỬ THÁCH",
        challenges: 1,
        startAngle: 202.5,
        endAngle: 247.5,
      },

      // Segment 7 - Group 3 (duplicate)
      {
        id: 7,
        group: "group_3",
        label: "THAM GIA THỬ THÁCH",
        challenges: 2,
        startAngle: 247.5,
        endAngle: 292.5,
      },

      // Segment 8 - Group 4 (duplicate)
      {
        id: 8,
        group: "group_4",
        label: "THAM GIA THỬ THÁCH",
        challenges: 3,
        startAngle: 292.5,
        endAngle: 337.5,
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
        setHasBeenPressed(false);
      },
    }));

    const calculateTargetAngle = (targetSegment) => {
      // Get the center of the target segment
      let segmentCenter;

      if (targetSegment.startAngle > targetSegment.endAngle) {
        // Crosses the 360° mark
        segmentCenter =
          (targetSegment.startAngle + (targetSegment.endAngle + 360)) / 2;
        if (segmentCenter >= 360) segmentCenter -= 360;
      } else {
        segmentCenter = (targetSegment.startAngle + targetSegment.endAngle) / 2;
      }

      // More dynamic spins based on segment
      const minSpins = 12;
      const maxSpins = 18;
      const spins =
        minSpins + Math.floor(Math.random() * (maxSpins - minSpins + 1));
      const baseRotation = spins * 360;

      const segmentRange = targetSegment.endAngle - targetSegment.startAngle;
      const randomOffset = (Math.random() - 0.5) * segmentRange * 0.6;
      const targetPosition = segmentCenter + randomOffset;

      const targetAngle = baseRotation + (360 - targetPosition);

      console.log("🎯 Target Segment:", targetSegment.label);
      console.log("📐 Segment Center:", segmentCenter + "°");
      console.log("🎲 Random Offset:", randomOffset + "°");
      console.log("🎪 Final Target Angle:", targetAngle + "°");
      console.log("🌀 Total Spins:", spins);

      return targetAngle;
    };

    const startSpin = (targetResult) => {
      console.log("🎪 Starting spin with predetermined result:", targetResult);
      setShowResult(false);
      setIsInternalSpinning(true);

      if (!targetResult) {
        console.warn("⚠️ No target result provided, using random fallback");
        const randomSegment =
          segments[Math.floor(Math.random() * segments.length)];
        targetResult = {
          group: randomSegment.group,
          label: randomSegment.label,
          challenges: randomSegment.challenges,
        };
      }

      // Find ALL matching segments for this group (FIXED - handles multiple segments per group)
      const matchingSegments = segments.filter(
        (s) => s.group === targetResult.group
      );

      if (matchingSegments.length === 0) {
        console.error(
          "❌ No matching segments found for group:",
          targetResult.group
        );
        console.log(
          "Available groups:",
          segments.map((s) => s.group)
        );
        setIsInternalSpinning(false);
        return;
      }

      // Randomly pick one of the matching segments
      const targetSegment =
        matchingSegments[Math.floor(Math.random() * matchingSegments.length)];

      console.log(
        `✅ Found ${matchingSegments.length} segments for ${targetResult.group}, selected segment ${targetSegment.id}`
      );

      const targetAngle = calculateTargetAngle(targetSegment);
      setFinalAngle(targetAngle);

      const wheelElement = wheelRef.current;
      if (wheelElement) {
        // Reset wheel to starting position
        wheelElement.style.transition = "none";
        wheelElement.style.transform = "rotate(0deg)";
        void wheelElement.offsetWidth; // Force reflow

        // Apply the spin animation with more dynamic timing
        requestAnimationFrame(() => {
          const spinDuration = 3500 + Math.random() * 1000; // 3.5-4.5 seconds
          wheelElement.style.transition = `transform ${spinDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
          wheelElement.style.transform = `rotate(${targetAngle}deg)`;
        });

        // Complete the spin after animation
        setTimeout(() => {
          setIsInternalSpinning(false);
          setShowResult(true);

          if (onSpinComplete) {
            onSpinComplete({
              ...targetSegment,
              label: targetResult.label, // Use the original label from the rigged result
            });
          }
        }, 4500); // Wait slightly longer than the longest possible spin
      }
    };

    const currentlySpinning = isSpinning || isInternalSpinning;

    return (
      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url('/assets/wheelbg.png')`,
        }}
      >
        <div className="mx-auto px-4 text-center flex flex-col items-center">
          {/* Spinning Wheel Container */}
          <div className="relative mx-auto w-[1000px] h-[1000px] mt-65">
            {/* Main Wheel - Only this spins */}
            <img
              ref={wheelRef}
              src="/assets/Wheel.png"
              alt="Spinning Wheel"
              className="w-full h-full rounded-full shadow-2xl"
              style={{
                transformOrigin: "center center",
                willChange: "transform",
              }}
            />

            {/* Center Arrow Pointer - Fixed position, larger size */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 -mt-25 ml-5">
              <img
                src="/assets/arrow.png"
                alt="Arrow Pointer"
                className="drop-shadow-xl"
                style={{
                  width: "360px",
                  height: "360px",
                  minWidth: "180px",
                  minHeight: "180px",
                  objectFit: "contain",
                  imageRendering: "crisp-edges",
                  filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.6))",
                }}
              />
            </div>

            {/* CSS Arrow Fallback - Always available as backup */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
              <div
                className="bg-red-600 shadow-xl"
                style={{
                  width: "0",
                  height: "0",
                  borderLeft: "20px solid transparent",
                  borderRight: "20px solid transparent",
                  borderBottom: "60px solid #dc2626",
                  filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.6))",
                  opacity: "0.8", // Slightly transparent so image arrow takes precedence
                }}
              />
            </div>

            {/* Wheel shadow */}
            <div className="absolute inset-0 rounded-full shadow-2xl bg-black/20 transform translate-y-2 -z-10"></div>
          </div>

          {/* Main Spin Button */}
          <div className="text-center mb-6">
            <button
              onClick={() => {
                if (isInternalSpinning || hasBeenPressed) return;

                setHasBeenPressed(true); // Disable the button immediately

                if (onSpinStart) onSpinStart();
                startSpin(prizeResult);
              }}
              disabled={isInternalSpinning || !prizeResult || hasBeenPressed}
              className="border-0 bg-transparent cursor-pointer transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 hover:scale-110 active:scale-95 hover:drop-shadow-2xl"
            >
              <img
                src="/assets/quay-button.png"
                alt="Quay Button"
                className={`w-auto h-auto pt-20 max-w-[500px] transition-all duration-200 ${
                  isInternalSpinning || hasBeenPressed
                    ? "animate-pulse opacity-50"
                    : "hover:brightness-110"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

WheelSpinner.displayName = "WheelSpinner";

export default WheelSpinner;

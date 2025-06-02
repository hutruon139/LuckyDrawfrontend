// App.jsx - OPTIMIZED FOR VERTICAL TV (9:16 ASPECT RATIO)
import React, { useState, useRef } from "react";
import { Trophy, Star } from "lucide-react";

// Components
import StandbyScreen from "./components/StandbyScreen";
import CheckinForm from "./components/CheckinForm";
import WheelSpinner from "./components/WheelSpinner";
import ResultScreen from "./components/ResultScreen";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";

// Hooks
import { usePrizeStats } from "./hooks/usePrizeStats";
import { useAPI } from "./hooks/useAPI";

// Utils and Services
import { determineRiggedResult } from "./utils/wheelCalculations";
import { INITIAL_CHECKIN_DATA, ADMIN_PASSWORD } from "./utils/constants";
import apiService from "./services/api";

const App = () => {
  // State management
  const [currentStep, setCurrentStep] = useState("standby");
  const [checkinData, setCheckinData] = useState(INITIAL_CHECKIN_DATA);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizeResult, setPrizeResult] = useState(null);
  const [message, setMessage] = useState("");
  const [families, setFamilies] = useState([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  // Custom hooks
  const { prizeStats, refetch: refetchPrizeStats } = usePrizeStats();
  const { loading, executeRequest } = useAPI();

  // Refs
  const wheelRef = useRef(null);

  // MAIN RESET - Always go back to standby
  const resetToStandby = () => {
    setCurrentStep("standby");
    setCheckinData(INITIAL_CHECKIN_DATA);
    setPrizeResult(null);
    setMessage("");
    setIsSpinning(false);
    if (wheelRef.current) {
      wheelRef.current.reset();
    }
  };

  // Handle check-in and move to wheel
  const handleCheckinAndSpin = async () => {
    try {
      setMessage("");
      console.log("🎯 Starting check-in and spin process...");

      // Refresh prize stats first
      await refetchPrizeStats();

      // Check in the family
      console.log("📝 Checking in family:", checkinData);
      const checkinResult = await executeRequest(() =>
        apiService.checkinFamily(checkinData)
      );
      console.log("✅ Check-in successful:", checkinResult);

      // Determine rigged result based on prize availability
      const riggedResult = determineRiggedResult(prizeStats);
      console.log("🎰 Rigged result determined:", riggedResult);

      // Set up the result
      setPrizeResult({
        ...riggedResult,
        familyData: checkinResult.data,
      });

      // Go directly to wheel spin
      setCurrentStep("spin");
      setIsSpinning(true);

      // Start the wheel animation
      if (wheelRef.current) {
        wheelRef.current.startSpin(riggedResult);
      }

      // Update family with result in database
      try {
        console.log("💾 Updating family spin result in database...");

        await executeRequest(() =>
          apiService.updateFamilySpin(checkinResult.data._id, {
            spinResult: riggedResult.group,
            requiredChallenges: riggedResult.challenges,
          })
        );

        console.log("💾 Database updated successfully");
      } catch (updateError) {
        console.error("❌ Failed to update database:", updateError);
        setMessage(
          "⚠️ Cập nhật cơ sở dữ liệu thất bại, nhưng kết quả vẫn hợp lệ"
        );
      }

      // Update stats after successful spin
      await refetchPrizeStats();
      console.log("🎉 Spin process completed successfully!");
    } catch (error) {
      console.error("❌ Spin process failed:", error);
      setMessage(`❌ ${error.message}`);
      setIsSpinning(false);
    }
  };

  // Handle when wheel spin is complete
  const handleSpinComplete = (segmentResult) => {
    console.log("🎡 Wheel spin animation completed:", segmentResult);
    setIsSpinning(false);
    // Show result briefly, then go back to standby
    setTimeout(() => {
      setCurrentStep("result");
    }, 2000);
  };

  // Handle wheel spin start
  const handleSpinStart = () => {
    console.log("🎡 Wheel spin started by user");
  };

  // Admin functions
  const fetchFamilies = async () => {
    try {
      const data = await executeRequest(() => apiService.getFamilies());
      setFamilies(data);
    } catch (error) {
      console.error("Error fetching families:", error);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setCurrentStep("admin");
      fetchFamilies();
      refetchPrizeStats();
      setShowAdminLogin(false);
      setAdminPassword("");
    } else {
      alert("Sai mật khẩu!");
    }
  };

  const handleAdminCancel = () => {
    setShowAdminLogin(false);
    setAdminPassword("");
  };

  const deleteFamily = async (id) => {
    if (!confirm("Xóa gia đình này?")) return;
    try {
      await executeRequest(() => apiService.deleteFamily(id));
      fetchFamilies();
      refetchPrizeStats();
    } catch (error) {
      alert(`Lỗi xóa: ${error.message}`);
    }
  };

  const resetFamily = async (id) => {
    try {
      await executeRequest(() => apiService.resetFamily(id));
      fetchFamilies();
      refetchPrizeStats();
    } catch (error) {
      alert(`Lỗi reset: ${error.message}`);
    }
  };

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* This wrapper forces 9:16 aspect ratio */}
      <div className="h-screen max-w-[calc(100vh*9/16)] w-full bg-white overflow-hidden shadow-xl">
        <div className="vertical-tv-container">
          {/* MAIN CONTENT - VERTICAL TV LAYOUT */}
          <div
            className={`min-h-screen w-full ${
              currentStep !== "standby"
                ? "bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900"
                : ""
            } relative overflow-hidden`}
          >
            {/* Animated background - only show on non-standby screens */}
            {currentStep !== "standby" && (
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                  >
                    <Star className="h-3 w-3 text-yellow-300 opacity-40" />
                  </div>
                ))}
              </div>
            )}

            <div className="relative z-10 h-full">
              {/* Header - COMPACT for vertical layout */}
              {currentStep !== "standby" && currentStep !== "checkin" && (
                <header className="text-center py-4 px-4 flex-shrink-0">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Trophy className="h-8 w-8 text-yellow-400" />
                    <h1 className="tv-text-4xl font-bold text-white">
                      Lucky Draw Challenge
                    </h1>
                    <Trophy className="h-8 w-8 text-yellow-400" />
                  </div>
                  <p className="tv-text-xl text-blue-200">
                    Check-in và quay vòng may mắn để nhận thử thách!
                  </p>

                  {/* Admin button - positioned for vertical layout */}
                  <button
                    onClick={() => setShowAdminLogin(true)}
                    className="absolute top-4 right-4 text-white/50 hover:text-white tv-text-xl bg-white/10 px-3 py-1 rounded"
                  >
                    Admin
                  </button>
                </header>
              )}

              {/* Main Content - FILLS REMAINING SPACE */}
              <main className="flex-1 h-full">
                {/* STANDBY SCREEN - OPTIMIZED FOR VERTICAL */}
                {currentStep === "standby" && (
                  <div className="standby-vertical">
                    <StandbyScreen
                      onTouchToSpin={() => setCurrentStep("checkin")}
                      familyName={null}
                    />
                  </div>
                )}

                {/* CHECK-IN FORM - VERTICAL LAYOUT */}
                {currentStep === "checkin" && (
                  <div className="checkin-vertical">
                    <CheckinForm
                      checkinData={checkinData}
                      setCheckinData={setCheckinData}
                      onSubmit={handleCheckinAndSpin}
                      onBack={resetToStandby}
                      loading={loading}
                      message={message}
                    />
                  </div>
                )}

                {/* WHEEL SPINNER - CENTERED VERTICALLY */}
                {currentStep === "spin" && (
                  <div className="wheel-vertical">
                    <WheelSpinner
                      ref={wheelRef}
                      isSpinning={isSpinning}
                      prizeResult={prizeResult}
                      onSpinComplete={handleSpinComplete}
                      onSpinStart={handleSpinStart}
                    />
                  </div>
                )}

                {/* RESULT SCREEN - VERTICAL LAYOUT */}
                {currentStep === "result" && prizeResult && (
                  <div className="result-vertical">
                    <ResultScreen
                      spinResult={prizeResult}
                      checkinData={checkinData}
                      onNewFamily={resetToStandby}
                      onGoHome={resetToStandby}
                    />
                  </div>
                )}

                {/* ADMIN PANEL - SCROLLABLE VERTICAL */}
                {currentStep === "admin" && (
                  <div className="admin-vertical">
                    <AdminPanel
                      prizeStats={prizeStats}
                      families={families}
                      onGoHome={resetToStandby}
                      onResetFamily={resetFamily}
                      onDeleteFamily={deleteFamily}
                    />
                  </div>
                )}
              </main>

              {/* Admin Login Modal - CENTERED */}
              <AdminLogin
                showAdminLogin={showAdminLogin}
                adminPassword={adminPassword}
                setAdminPassword={setAdminPassword}
                onLogin={handleAdminLogin}
                onCancel={handleAdminCancel}
              />

              {/* Admin button overlay for standby screen */}
              {currentStep === "standby" && (
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 tv-text-xl bg-white/50 px-4 py-2 rounded z-30"
                >
                  Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

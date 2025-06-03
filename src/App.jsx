// App.jsx - PRODUCTION READY - All console logs removed for better performance
import React, { useState, useRef } from "react";

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

      // Check in the family
      const checkinResult = await executeRequest(() =>
        apiService.checkinFamily(checkinData)
      );

      // Get rigged result from backend (atomic assignment)
      const spinAssignment = await executeRequest(() =>
        apiService.assignSpinResult(checkinResult.data._id)
      );

      // Convert backend response to frontend format
      const getColorForGroup = (group) => {
        const colors = {
          group_1: "#10B981",
          group_2: "#3B82F6",
          group_3: "#8B5CF6",
          group_4: "#EF4444",
        };
        return colors[group] || "#6B7280";
      };

      const riggedResult = {
        group: spinAssignment.data.spinResult,
        challenges: spinAssignment.data.requiredChallenges,
        label:
          spinAssignment.data.spinResult === "group_1"
            ? "CHÚC MỪNG BẠN ĐÃ NHẬN ĐƯỢC PHẦN THƯỞNG"
            : "THAM GIA THỬ THÁCH",
        color: getColorForGroup(spinAssignment.data.spinResult),
      };

      // Set up the result
      setPrizeResult({
        ...riggedResult,
        familyData: spinAssignment.data,
      });

      // Go directly to wheel spin
      setCurrentStep("spin");
      setIsSpinning(true);

      // Start the wheel animation
      if (wheelRef.current) {
        wheelRef.current.startSpin(riggedResult);
      }

      // Update stats after successful spin
      await refetchPrizeStats();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      setIsSpinning(false);
    }
  };

  // Handle when wheel spin is complete
  const handleSpinComplete = (segmentResult) => {
    setIsSpinning(false);
    // Show result briefly, then go back to standby
    setTimeout(() => {
      setCurrentStep("result");
    }, 2000);
  };

  // Handle wheel spin start
  const handleSpinStart = () => {
    // Wheel spin started
  };

  // Admin functions
  const fetchFamilies = async () => {
    try {
      const data = await executeRequest(() => apiService.getFamilies());
      setFamilies(data);
    } catch (error) {
      // Error handled by useAPI hook
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
          <div className="min-h-screen w-full relative overflow-hidden">
            <div className="relative z-10 h-full">
              {/* Header - COMPACT for vertical layout */}
              {currentStep !== "standby" && currentStep !== "checkin" && (
                <header className="absolute top-0 left-0 w-full z-50 p-4">
                  <button
                    onClick={() => setShowAdminLogin(true)}
                    className="text-white/70 hover:text-white text-lg bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
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
                  <div 
                    className="admin-vertical min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 py-8"
                  >
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
                  className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 tv-text-xl bg-white/50 px-4 py-2 rounded z-30"
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
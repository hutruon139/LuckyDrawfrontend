// App.jsx - FIXED WITH PROPER IMPORTS
import React, { useState, useRef } from 'react';
import { Trophy, Star } from 'lucide-react';

// Components
import StandbyScreen from './components/StandbyScreen';
import CheckinForm from './components/CheckinForm';
import WheelSpinner from './components/WheelSpinner';
import ResultScreen from './components/ResultScreen';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';

// Hooks
import { usePrizeStats } from './hooks/usePrizeStats';
import { useAPI } from './hooks/useAPI';

// Utils and Services
import { determineRiggedResult } from './utils/wheelCalculations';
import { INITIAL_CHECKIN_DATA, ADMIN_PASSWORD } from './utils/constants'; // IMPORT THESE
import apiService from './services/api';

const App = () => {
  // State management
  const [currentStep, setCurrentStep] = useState('standby'); // START WITH STANDBY
  const [checkinData, setCheckinData] = useState(INITIAL_CHECKIN_DATA);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizeResult, setPrizeResult] = useState(null);
  const [message, setMessage] = useState('');
  const [families, setFamilies] = useState([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // Custom hooks
  const { prizeStats, refetch: refetchPrizeStats } = usePrizeStats();
  const { loading, executeRequest } = useAPI();

  // Refs
  const wheelRef = useRef(null);

  // MAIN RESET - Always go back to standby
  const resetToStandby = () => {
    setCurrentStep('standby');
    setCheckinData(INITIAL_CHECKIN_DATA);
    setPrizeResult(null);
    setMessage('');
    setIsSpinning(false);
    if (wheelRef.current) {
      wheelRef.current.reset();
    }
  };

  // Handle check-in and move to wheel
  const handleCheckinAndSpin = async () => {
    try {
      setMessage('');
      console.log('🎯 Starting check-in and spin process...');

      // Refresh prize stats first
      await refetchPrizeStats();

      // Check in the family
      console.log('📝 Checking in family:', checkinData);
      const checkinResult = await executeRequest(() =>
        apiService.checkinFamily(checkinData)
      );
      console.log('✅ Check-in successful:', checkinResult);

      // Determine rigged result based on prize availability
      const riggedResult = determineRiggedResult(prizeStats);
      console.log('🎰 Rigged result determined:', riggedResult);

      // Set up the result
      setPrizeResult({
        ...riggedResult,
        familyData: checkinResult.data,
      });

      // Go directly to wheel spin
      setCurrentStep('spin');
      setIsSpinning(true);

      // Start the wheel animation
      if (wheelRef.current) {
        wheelRef.current.startSpin(riggedResult);
      }

      // Update family with result in database
      try {
        console.log('💾 Updating family spin result in database...');
        
        await executeRequest(() =>
          apiService.updateFamilySpin(checkinResult.data._id, {
            spinResult: riggedResult.group,
            requiredChallenges: riggedResult.challenges,
          })
        );
        
        console.log('💾 Database updated successfully');
      } catch (updateError) {
        console.error('❌ Failed to update database:', updateError);
        setMessage('⚠️ Cập nhật cơ sở dữ liệu thất bại, nhưng kết quả vẫn hợp lệ');
      }

      // Update stats after successful spin
      await refetchPrizeStats();
      console.log('🎉 Spin process completed successfully!');

    } catch (error) {
      console.error('❌ Spin process failed:', error);
      setMessage(`❌ ${error.message}`);
      setIsSpinning(false);
    }
  };

  // Handle when wheel spin is complete
  const handleSpinComplete = (segmentResult) => {
    console.log('🎡 Wheel spin animation completed:', segmentResult);
    setIsSpinning(false);
    // Show result briefly, then go back to standby
    setTimeout(() => {
      setCurrentStep('result');
    }, 2000);
  };

  // Handle wheel spin start
  const handleSpinStart = () => {
    console.log('🎡 Wheel spin started by user');
  };

  // Admin functions
  const fetchFamilies = async () => {
    try {
      const data = await executeRequest(() => apiService.getFamilies());
      setFamilies(data);
    } catch (error) {
      console.error('Error fetching families:', error);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setCurrentStep('admin');
      fetchFamilies();
      refetchPrizeStats();
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('Sai mật khẩu!');
    }
  };

  const handleAdminCancel = () => {
    setShowAdminLogin(false);
    setAdminPassword('');
  };

  const deleteFamily = async (id) => {
    if (!confirm('Xóa gia đình này?')) return;
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
    <div className="min-h-screen">
      {/* MAIN CONTENT */}
      <div className={`min-h-screen ${currentStep !== 'standby' ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' : ''} relative overflow-hidden`}>
        
        {/* Animated background - only show on non-standby screens */}
        {currentStep !== 'standby' && (
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
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
                <Star className="h-2 w-2 text-yellow-300 opacity-40" />
              </div>
            ))}
          </div>
        )}

        <div className="relative z-10 min-h-screen">
          {/* Header - hide on standby screen */}
          {currentStep !== 'standby' && currentStep !== 'checkin' &&(
            <header className="text-center py-6 px-4">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <Trophy className="h-10 w-10 text-yellow-400" />
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Lucky Draw Challenge
                </h1>
                <Trophy className="h-10 w-10 text-yellow-400" />
              </div>
              <p className="text-lg text-blue-200">
                Check-in và quay vòng may mắn để nhận thử thách!
              </p>

              {/* Admin button */}
              <button
                onClick={() => setShowAdminLogin(true)}
                className="absolute top-4 right-4 text-white/50 hover:text-white text-sm"
              >
                Admin
              </button>
            </header>
          )}

          {/* Main Content */}
          <main>
            {/* STANDBY SCREEN - MAIN HUB */}
            {currentStep === 'standby' && (
              <StandbyScreen
                onTouchToSpin={() => setCurrentStep('checkin')}
                familyName={null} // No name on initial standby
              />
            )}

            {currentStep === 'checkin' && (
              <CheckinForm
                checkinData={checkinData}
                setCheckinData={setCheckinData}
                onSubmit={handleCheckinAndSpin}
                onBack={resetToStandby}
                loading={loading}
                message={message}
              />
            )}

            {currentStep === 'spin' && (
              <WheelSpinner
                ref={wheelRef}
                isSpinning={isSpinning}
                prizeResult={prizeResult}
                onSpinComplete={handleSpinComplete}
                onSpinStart={handleSpinStart}
              />
            )}

            {currentStep === 'result' && prizeResult && (
              <ResultScreen
                spinResult={prizeResult}
                checkinData={checkinData}
                onNewFamily={resetToStandby}
                onGoHome={resetToStandby}
              />
            )}

            {currentStep === 'admin' && (
              <AdminPanel
                prizeStats={prizeStats}
                families={families}
                onGoHome={resetToStandby}
                onResetFamily={resetFamily}
                onDeleteFamily={deleteFamily}
              />
            )}
          </main>

          {/* Admin Login Modal */}
          <AdminLogin
            showAdminLogin={showAdminLogin}
            adminPassword={adminPassword}
            setAdminPassword={setAdminPassword}
            onLogin={handleAdminLogin}
            onCancel={handleAdminCancel}
          />

          {/* Admin button overlay for standby screen */}
          {currentStep === 'standby' && (
            <button
              onClick={() => setShowAdminLogin(true)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-sm bg-white/50 px-3 py-1 rounded z-30"
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
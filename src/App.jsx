// App.jsx - FIXED VERSION
import React, { useState, useRef } from 'react';
import { Trophy, Star } from 'lucide-react';

// Components
import WelcomeScreen from './components/WelcomeScreen';
import CheckinForm from './components/CheckinForm';
import CardFlipReveal from './components/CardFlipReveal';
import ResultScreen from './components/ResultScreen';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';

// Hooks
import { usePrizeStats } from './hooks/usePrizeStats';
import { useAPI } from './hooks/useAPI';

// Utils and Services
import { determineRiggedResult } from './utils/wheelCalculations';
import { INITIAL_CHECKIN_DATA, ADMIN_PASSWORD } from './utils/constants';
import apiService from './services/api';

const App = () => {
  // State management
  const [currentStep, setCurrentStep] = useState('welcome');
  const [checkinData, setCheckinData] = useState(INITIAL_CHECKIN_DATA);
  const [isRevealing, setIsRevealing] = useState(false);
  const [prizeResult, setPrizeResult] = useState(null);
  const [message, setMessage] = useState('');
  const [families, setFamilies] = useState([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // Custom hooks
  const { prizeStats, refetch: refetchPrizeStats } = usePrizeStats();
  const { loading, executeRequest } = useAPI();

  // Refs
  const cardRef = useRef(null);

  // Reset card and go to welcome
  const resetToWelcome = () => {
    setCurrentStep('welcome');
    setCheckinData(INITIAL_CHECKIN_DATA);
    setPrizeResult(null);
    setMessage('');
    setIsRevealing(false);
    if (cardRef.current) {
      cardRef.current.reset();
    }
  };

  // Handle check-in and card reveal
  const handleCheckinAndReveal = async () => {
    try {
      setMessage('');
      console.log('🎯 Starting check-in and reveal process...');

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

      // Set up the card reveal
      setPrizeResult({
        ...riggedResult,
        familyData: checkinResult.data,
      });

      // Start card reveal animation
      setCurrentStep('reveal');
      setIsRevealing(true);

      // Update family with result in database - FIXED VERSION
      try {
        console.log('💾 Updating family spin result in database...');
        
        // Use the correct API service method instead of manual fetch
        await executeRequest(() =>
          apiService.updateFamilySpin(checkinResult.data._id, {
            spinResult: riggedResult.group,
            requiredChallenges: riggedResult.challenges,
          })
        );
        
        console.log('💾 Database updated successfully');
      } catch (updateError) {
        console.error('❌ Failed to update database:', updateError);
        // Don't throw here - let the user experience continue
        setMessage('⚠️ Cập nhật cơ sở dữ liệu thất bại, nhưng kết quả vẫn hợp lệ');
      }

      // Update stats after successful reveal
      await refetchPrizeStats();
      console.log('🎉 Reveal process completed successfully!');

    } catch (error) {
      console.error('❌ Reveal process failed:', error);
      setMessage(`❌ ${error.message}`);
      setIsRevealing(false);
    }
  };

  // Handle when card reveal is complete
  const handleRevealComplete = () => {
    console.log('🎴 Card reveal animation completed');
    setIsRevealing(false);
    // Longer delay before showing result screen - let them enjoy the moment
    setTimeout(() => {
      setCurrentStep('result');
    }, 2000); // Extended from 1000ms to 2000ms
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background */}
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

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="text-center py-6 px-4">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Trophy className="h-10 w-10 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Lucky Card Challenge
            </h1>
            <Trophy className="h-10 w-10 text-yellow-400" />
          </div>
          <p className="text-lg text-blue-200">
            Check-in và lật thẻ may mắn để nhận thử thách!
          </p>

          {/* Admin button */}
          <button
            onClick={() => setShowAdminLogin(true)}
            className="absolute top-4 right-4 text-white/50 hover:text-white text-sm"
          >
            Admin
          </button>
        </header>

        {/* Main Content */}
        <main>
          {currentStep === 'welcome' && (
            <WelcomeScreen
              prizeStats={prizeStats}
              onStartClick={() => setCurrentStep('checkin')}
            />
          )}

          {currentStep === 'checkin' && (
            <CheckinForm
              checkinData={checkinData}
              setCheckinData={setCheckinData}
              onSubmit={handleCheckinAndReveal}
              onBack={() => setCurrentStep('welcome')}
              loading={loading}
              message={message}
            />
          )}

          {currentStep === 'reveal' && (
            <CardFlipReveal
              ref={cardRef}
              isRevealing={isRevealing}
              prizeResult={prizeResult}
              onRevealComplete={handleRevealComplete}
            />
          )}

          {currentStep === 'result' && prizeResult && (
            <ResultScreen
              spinResult={prizeResult}
              checkinData={checkinData}
              onNewFamily={resetToWelcome}
              onGoHome={resetToWelcome}
            />
          )}

          {currentStep === 'admin' && (
            <AdminPanel
              prizeStats={prizeStats}
              families={families}
              onGoHome={resetToWelcome}
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

        {/* Debug Panel - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 bg-black/50 text-white p-2 rounded text-xs">
            <div>Step: {currentStep}</div>
            <div>Revealing: {isRevealing ? 'Yes' : 'No'}</div>
            <div>Result: {prizeResult?.label || 'None'}</div>
            <div>Loading: {loading ? 'Yes' : 'No'}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
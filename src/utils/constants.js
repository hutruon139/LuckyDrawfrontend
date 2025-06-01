// utils/constants.js - UPDATED WITH VIETNAMESE TEXT
export const API_BASE = import.meta.env.VITE_API_URL;

export const WHEEL_SEGMENTS = [
  {
    id: 1,
    label: 'CHÚC MỪNG BẠN ĐÃ NHẬN ĐƯỢC PHẦN THƯỞNG', // Vietnamese text from your design
    group: 'group_1',
    color: '#10B981',
    challenges: 0,
    startAngle: 0,
    endAngle: 45, // Smaller segment for gift
    limit: 5,
  },
  {
    id: 2,
    label: 'THAM GIA 1 THỬ THÁCH', // Vietnamese text from your design
    group: 'group_2',
    color: '#3B82F6',
    challenges: 1,
    startAngle: 45,
    endAngle: 135, // 90 degrees
    limit: 45,
  },
  {
    id: 3,
    label: 'THAM GIA 2 THỬ THÁCH', // Vietnamese text from your design
    group: 'group_3',
    color: '#8B5CF6',
    challenges: 2,
    startAngle: 135,
    endAngle: 270, // Largest segment - 135 degrees
    limit: 55,
  },
  {
    id: 4,
    label: 'THAM GIA 3 THỬ THÁCH', // Vietnamese text from your design
    group: 'group_4',
    color: '#EF4444',
    challenges: 3,
    startAngle: 270,
    endAngle: 360, // 90 degrees
    limit: 15,
  },
];

export const INITIAL_PRIZE_STATS = {
  group1: { current: 0, limit: 5 },
  group2: { current: 0, limit: 45 },
  group3: { current: 0, limit: 55 },
  group4: { current: 0, limit: 15 },
};

export const INITIAL_CHECKIN_DATA = {
  name: '',
  phone: '',
  email: '', // Keep email field for future use
};

export const ADMIN_PASSWORD = 'admin123';

// Additional constants for the wheel display
export const WHEEL_COLORS = {
  group_1: '#10B981', // Green for free gift
  group_2: '#3B82F6', // Blue for 1 challenge
  group_3: '#8B5CF6', // Purple for 2 challenges
  group_4: '#EF4444', // Red for 3 challenges
};

export const CHALLENGE_EMOJIS = {
  0: '🎁', // Free gift
  1: '🎯', // 1 challenge
  2: '🏆', // 2 challenges
  3: '👑', // 3 challenges
};
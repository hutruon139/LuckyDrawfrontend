// utils/constants.js - FIXED VERSION
export const API_BASE = 'http://localhost:3000/api'; // FIXED: Changed from 5000 to 3000

export const WHEEL_SEGMENTS = [
  {
    id: 1,
    label: 'FREE BIB!',
    group: 'group_1',
    color: '#10B981',
    challenges: 0,
    startAngle: 0,
    endAngle: 45, // Smaller segment for BIB
    limit: 5,
  },
  {
    id: 2,
    label: '1 Challenge',
    group: 'group_2',
    color: '#3B82F6',
    challenges: 1,
    startAngle: 45,
    endAngle: 135, // 90 degrees
    limit: 45,
  },
  {
    id: 3,
    label: '2 Challenges',
    group: 'group_3',
    color: '#8B5CF6',
    challenges: 2,
    startAngle: 135,
    endAngle: 270, // Largest segment - 135 degrees
    limit: 55,
  },
  {
    id: 4,
    label: '3 Challenges',
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
  email: '',
};

export const ADMIN_PASSWORD = 'admin123';
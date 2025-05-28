// utils/wheelCalculations.js - CLEANED FOR CARD FLIP
import { WHEEL_SEGMENTS } from './constants';

// Determine which prize group to assign based on availability
export const determineRiggedResult = (prizeStats) => {
  console.log('🎯 Current prize stats:', prizeStats);

  // Create array of available groups
  const availableGroups = [];

  // Add groups that haven't reached their limit
  if (prizeStats.group1.current < prizeStats.group1.limit) {
    availableGroups.push(WHEEL_SEGMENTS[0]); // Free gift
  }
  if (prizeStats.group2.current < prizeStats.group2.limit) {
    availableGroups.push(WHEEL_SEGMENTS[1]); // 1 challenge
  }
  if (prizeStats.group3.current < prizeStats.group3.limit) {
    availableGroups.push(WHEEL_SEGMENTS[2]); // 2 challenges
  }
  if (prizeStats.group4.current < prizeStats.group4.limit) {
    availableGroups.push(WHEEL_SEGMENTS[3]); // 3 challenges
  }

  // If no groups available, default to group 4 (3 challenges)
  if (availableGroups.length === 0) {
    console.log('⚠️ All prize groups full, defaulting to group 4');
    return WHEEL_SEGMENTS[3];
  }

  // Weighted selection - prefer groups with more slots available
  const weightedGroups = [];
  availableGroups.forEach((group) => {
    const groupKey = `group${group.id}`;
    const remaining = prizeStats[groupKey].limit - prizeStats[groupKey].current;

    // Add multiple copies based on remaining slots (more remaining = higher chance)
    for (let i = 0; i < Math.max(1, Math.floor(remaining / 10)); i++) {
      weightedGroups.push(group);
    }
  });

  // Select random group from weighted array
  const selectedGroup = weightedGroups[Math.floor(Math.random() * weightedGroups.length)];
  console.log('🎴 Selected rigged result:', selectedGroup.label);

  return selectedGroup;
};

// Note: calculateTargetAngle function removed - not needed for card flip system
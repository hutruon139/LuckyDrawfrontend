// services/api.js - FIXED VERSION
import { API_BASE } from '../utils/constants';

class APIService {
  // Check-in family
  async checkinFamily(familyData) {
    const response = await fetch(`${API_BASE}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(familyData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  }

  // Update family spin result - FIXED: Use correct endpoint
  async updateFamilySpin(familyId, spinData) {
    const response = await fetch(`${API_BASE}/family/${familyId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spinData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`Failed to update family spin result: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  // Get prize statistics
  async getPrizeStats() {
    const response = await fetch(`${API_BASE}/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch prize stats');
    }
    return response.json();
  }

  // Get all families
  async getFamilies() {
    const response = await fetch(`${API_BASE}/family`);
    if (!response.ok) {
      throw new Error('Failed to fetch families');
    }
    return response.json();
  }

  // Delete family
  async deleteFamily(familyId) {
    const response = await fetch(`${API_BASE}/family/${familyId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete family');
    }
    return response.json();
  }

  // Reset family
  async resetFamily(familyId) {
    const response = await fetch(`${API_BASE}/family/${familyId}/reset`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to reset family');
    }
    return response.json();
  }
  
  async assignSpinResult(familyId) {
    const response = await fetch(`${API_BASE}/family/${familyId}/assign-spin`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Failed to assign spin result');
    }
    return response.json();
  }
}


export default new APIService();
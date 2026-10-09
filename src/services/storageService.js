import { INITIAL_FICTIONAL_PATIENTS, PATIENT_STATUS } from '../constants/triageConstants.js';

const STORAGE_KEY = 'smartcare_patients_demo_v1';
const SETTINGS_KEY = 'smartcare_settings_demo_v1';

export const storageService = {
  getPatients: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Initialize with default fictional patients
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FICTIONAL_PATIENTS));
        return INITIAL_FICTIONAL_PATIENTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage access failed, falling back to in-memory demo data:', e);
      return INITIAL_FICTIONAL_PATIENTS;
    }
  },

  savePatients: (patients) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    } catch (e) {
      console.error('Failed to save patients to localStorage:', e);
    }
  },

  resetDemoData: () => {
    try {
      // Re-timestamp relative to current time so the queue feels freshly active
      const now = Date.now();
      const refreshedPatients = INITIAL_FICTIONAL_PATIENTS.map((p, idx) => ({
        ...p,
        arrivalTimestamp: now - (idx * 7 + 10) * 60 * 1000,
        consultationStartTimestamp: p.status !== PATIENT_STATUS.WAITING ? now - (idx * 4 + 5) * 60 * 1000 : null,
        completionTimestamp: p.status === PATIENT_STATUS.COMPLETED ? now - 10 * 60 * 1000 : null,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshedPatients));
      return refreshedPatients;
    } catch (e) {
      console.error('Error resetting demo data:', e);
      return INITIAL_FICTIONAL_PATIENTS;
    }
  },

  generateMrn: () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `SC-2026-${randomSuffix}`;
  },
};

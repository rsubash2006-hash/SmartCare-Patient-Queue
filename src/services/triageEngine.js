import { URGENCY_LEVELS, PATIENT_STATUS } from '../constants/triageConstants.js';

/**
 * Evaluates vital signs and chief complaint to generate PRELIMINARY WARNING FLAGS.
 * SAFETY MANDATE: These flags are algorithmic screening signals only, NEVER medical diagnoses.
 * They serve to alert triage nurses and physicians to physiological abnormalities.
 */
export function analyzePreliminaryWarningFlags(vitals = {}, chiefComplaint = '') {
  const flags = [];
  const text = (chiefComplaint || '').toLowerCase();

  // Vitals checks
  const sys = Number(vitals.bloodPressureSystolic);
  const dia = Number(vitals.bloodPressureDiastolic);
  const hr = Number(vitals.heartRate);
  const rr = Number(vitals.respiratoryRate);
  const spo2 = Number(vitals.spO2);
  const temp = Number(vitals.temperatureC);
  const pain = Number(vitals.painScore);

  if (spo2 && spo2 < 90) {
    flags.push('Critical Hypoxia: SpO2 < 90%');
  } else if (spo2 && spo2 <= 93) {
    flags.push('Low Oxygen Saturation: SpO2 ≤ 93%');
  }

  if (sys && sys >= 180) {
    flags.push('Severe Hypertensive Urgency: Systolic ≥ 180 mmHg');
  } else if (dia && dia >= 110) {
    flags.push('Severe Hypertensive Urgency: Diastolic ≥ 110 mmHg');
  } else if (sys && sys < 90) {
    flags.push('Hypotension / Shock Warning: Systolic < 90 mmHg');
  }

  if (hr && hr >= 130) {
    flags.push('Marked Tachycardia: Heart Rate ≥ 130 bpm');
  } else if (hr && hr > 105) {
    flags.push('Elevated Heart Rate: > 105 bpm');
  } else if (hr && hr < 50) {
    flags.push('Severe Bradycardia: Heart Rate < 50 bpm');
  }

  if (rr && rr >= 28) {
    flags.push('Severe Tachypnea: Respiratory Rate ≥ 28 bpm');
  } else if (rr && rr >= 22) {
    flags.push('Elevated Respiratory Rate: ≥ 22 bpm');
  }

  if (temp && temp >= 39.0) {
    flags.push('High Grade Hyperthermia: Temp ≥ 39.0 °C');
  } else if (temp && temp <= 35.0) {
    flags.push('Hypothermia Risk: Temp ≤ 35.0 °C');
  }

  if (pain && pain >= 8) {
    flags.push(`Severe Intractable Pain: Score ${pain}/10`);
  }

  // Symptom keyword flags
  if (text.includes('chest pain') || text.includes('radiating') || text.includes('diaphoresis') || text.includes('heart attack')) {
    flags.push('Potential Acute Coronary Syndrome Flag');
  }
  if (text.includes('facial droop') || text.includes('slurred') || text.includes('weakness') || text.includes('stroke') || text.includes('numbness')) {
    flags.push('Stroke Protocol Flag (FAST Signs)');
  }
  if (text.includes('stridor') || text.includes('choking') || text.includes('unable to breathe') || text.includes('anaphylaxis') || text.includes('cyanosis')) {
    flags.push('Airway / Severe Breathing Compromise Flag');
  }
  if (text.includes('unresponsive') || text.includes('syncope') || text.includes('passed out') || text.includes('collapse') || text.includes('seizure')) {
    flags.push('Altered Consciousness / Neurologic Warning');
  }
  if (text.includes('massive bleeding') || text.includes('hemorrhage') || text.includes('tourniquet') || text.includes('gunshot') || text.includes('stab')) {
    flags.push('Major Trauma / Hemorrhage Warning');
  }

  // Compute suggested preliminary screener level (Advisory Only)
  let suggestedLevel = 4;
  const isImmediate = 
    (spo2 && spo2 < 88) || 
    (sys && sys < 80) || 
    text.includes('unresponsive') || 
    text.includes('stridor') || 
    text.includes('massive bleeding');

  const isEmergency = 
    (spo2 && spo2 <= 92) || 
    (sys && sys >= 180) || 
    (hr && hr >= 125) || 
    (pain && pain >= 8) || 
    text.includes('chest pain') || 
    text.includes('facial droop');

  const isUrgent = 
    (spo2 && spo2 <= 94) || 
    (rr && rr >= 22) || 
    (temp && temp >= 38.5) || 
    (pain && pain >= 6) || 
    text.includes('abdominal pain') || 
    text.includes('fracture');

  if (isImmediate) {
    suggestedLevel = 1;
  } else if (isEmergency) {
    suggestedLevel = 2;
  } else if (isUrgent) {
    suggestedLevel = 3;
  } else if (pain && pain <= 3 && !flags.length) {
    suggestedLevel = 5;
  } else {
    suggestedLevel = 4;
  }

  return {
    flags,
    suggestedLevel,
    isCritical: suggestedLevel <= 2,
    disclaimer: 'Algorithmic screener suggestions are preliminary warnings for clinical triage and do not constitute a clinical diagnosis.',
  };
}

/**
 * Sorts patients according to clinician-confirmed urgency, with arrival time breaking ties.
 * Allows user-selected sort overrides.
 */
export function sortPatients(patients, sortKey = 'urgency_arrival') {
  return [...patients].sort((a, b) => {
    switch (sortKey) {
      case 'urgency_arrival':
      default: {
        // Primary: Urgency Level ascending (1 is highest priority)
        const urgencyDiff = (a.urgencyLevel || 5) - (b.urgencyLevel || 5);
        if (urgencyDiff !== 0) return urgencyDiff;
        // Tie-breaker: Arrival time ascending (earliest arrival first)
        return (a.arrivalTimestamp || 0) - (b.arrivalTimestamp || 0);
      }

      case 'arrival_asc':
        return (a.arrivalTimestamp || 0) - (b.arrivalTimestamp || 0);

      case 'arrival_desc':
        return (b.arrivalTimestamp || 0) - (a.arrivalTimestamp || 0);

      case 'name_asc':
        return a.fullName.localeCompare(b.fullName);

      case 'wait_time_desc': {
        const waitA = a.consultationStartTimestamp ? a.consultationStartTimestamp - a.arrivalTimestamp : Date.now() - a.arrivalTimestamp;
        const waitB = b.consultationStartTimestamp ? b.consultationStartTimestamp - b.arrivalTimestamp : Date.now() - b.arrivalTimestamp;
        return waitB - waitA;
      }
    }
  });
}

/**
 * Filter patients by query, department, status, and urgency level
 */
export function filterPatients(patients, { search = '', department = 'All', status = 'All', urgencyLevel = 'All' } = {}) {
  const query = search.trim().toLowerCase();

  return patients.filter((patient) => {
    // Search filter
    if (query) {
      const matchName = patient.fullName?.toLowerCase().includes(query);
      const matchMrn = patient.mrn?.toLowerCase().includes(query);
      const matchComplaint = patient.chiefComplaint?.toLowerCase().includes(query);
      const matchDept = patient.department?.toLowerCase().includes(query);
      if (!matchName && !matchMrn && !matchComplaint && !matchDept) return false;
    }

    // Department filter
    if (department !== 'All' && patient.department !== department) {
      return false;
    }

    // Status filter
    if (status !== 'All' && patient.status !== status) {
      return false;
    }

    // Urgency filter
    if (urgencyLevel !== 'All' && Number(patient.urgencyLevel) !== Number(urgencyLevel)) {
      return false;
    }

    return true;
  });
}

/**
 * Compute all dashboard metrics dynamically from patient state
 */
export function computeDashboardMetrics(patients = []) {
  const total = patients.length;
  const waiting = patients.filter((p) => p.status === PATIENT_STATUS.WAITING);
  const inConsultation = patients.filter((p) => p.status === PATIENT_STATUS.IN_CONSULTATION);
  const completed = patients.filter((p) => p.status === PATIENT_STATUS.COMPLETED);

  const criticalAndEmergency = patients.filter(
    (p) => (p.urgencyLevel === 1 || p.urgencyLevel === 2) && p.status !== PATIENT_STATUS.COMPLETED
  );

  // Compute average wait time in minutes for currently waiting or consulted patients
  const waitedMinutesList = patients
    .map((p) => {
      if (p.consultationStartTimestamp && p.arrivalTimestamp) {
        return Math.max(0, Math.round((p.consultationStartTimestamp - p.arrivalTimestamp) / 60000));
      }
      if (p.status === PATIENT_STATUS.WAITING && p.arrivalTimestamp) {
        return Math.max(0, Math.round((Date.now() - p.arrivalTimestamp) / 60000));
      }
      return null;
    })
    .filter((n) => n !== null);

  const avgWaitTimeMinutes =
    waitedMinutesList.length > 0
      ? Math.round(waitedMinutesList.reduce((acc, curr) => acc + curr, 0) / waitedMinutesList.length)
      : 0;

  // Urgency distribution (Levels 1 to 5)
  const urgencyDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  patients.forEach((p) => {
    if (urgencyDistribution[p.urgencyLevel] !== undefined) {
      urgencyDistribution[p.urgencyLevel]++;
    }
  });

  // Department distribution
  const departmentBreakdown = {};
  patients.forEach((p) => {
    departmentBreakdown[p.department] = (departmentBreakdown[p.department] || 0) + 1;
  });

  // Triage alerts: patients waiting who have critical vitals or high urgency
  const triageAlerts = waiting
    .filter((p) => {
      const hasCriticalVitals =
        (p.vitals?.spO2 && p.vitals.spO2 < 93) ||
        (p.vitals?.bloodPressureSystolic && p.vitals.bloodPressureSystolic >= 170) ||
        (p.vitals?.heartRate && p.vitals.heartRate >= 120) ||
        (p.vitals?.painScore && p.vitals.painScore >= 8);
      const isHighUrgency = p.urgencyLevel === 1 || p.urgencyLevel === 2;
      return hasCriticalVitals || isHighUrgency;
    })
    .map((p) => {
      const elapsedMins = Math.round((Date.now() - p.arrivalTimestamp) / 60000);
      let alertReason = 'High urgency triage assignment';
      if (p.vitals?.spO2 && p.vitals.spO2 < 93) {
        alertReason = `Critical SpO2 reading (${p.vitals.spO2}%)`;
      } else if (p.vitals?.bloodPressureSystolic && p.vitals.bloodPressureSystolic >= 180) {
        alertReason = `Hypertensive urgency (${p.vitals.bloodPressureSystolic}/${p.vitals.bloodPressureDiastolic} mmHg)`;
      } else if (p.urgencyLevel === 1) {
        alertReason = 'Immediate Level 1 intervention pending clinician review';
      } else if (p.urgencyLevel === 2) {
        alertReason = 'Level 2 Emergency awaiting consultation room';
      }

      return {
        patientId: p.id,
        patientName: p.fullName,
        mrn: p.mrn,
        department: p.department,
        urgencyLevel: p.urgencyLevel,
        elapsedMins,
        alertReason,
        roomOrBed: p.roomOrBed,
      };
    });

  return {
    total,
    waitingCount: waiting.length,
    inConsultationCount: inConsultation.length,
    completedCount: completed.length,
    criticalAlertCount: criticalAndEmergency.length,
    avgWaitTimeMinutes,
    urgencyDistribution,
    departmentBreakdown,
    triageAlerts,
  };
}

/**
 * Format relative elapsed time from timestamp
 */
export function formatElapsedTime(timestamp) {
  if (!timestamp) return '—';
  const elapsedMinutes = Math.floor((Date.now() - timestamp) / 60000);
  if (elapsedMinutes < 1) return 'Just now';
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  const hours = Math.floor(elapsedMinutes / 60);
  const remainingMins = elapsedMinutes % 60;
  return `${hours}h ${remainingMins}m ago`;
}

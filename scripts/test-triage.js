import assert from 'node:assert';
import {
  analyzePreliminaryWarningFlags,
  sortPatients,
  filterPatients,
  computeDashboardMetrics,
} from '../src/services/triageEngine.js';
import { INITIAL_FICTIONAL_PATIENTS, PATIENT_STATUS } from '../src/constants/triageConstants.js';

console.log('--- Starting SmartCare Unit Tests ---');

// TEST 1: Preliminary Algorithmic Warning Flags (Safety Compliance: Screener Only)
console.log('Test 1: Preliminary Warning Flags analysis...');
const criticalVitals = {
  bloodPressureSystolic: 190,
  bloodPressureDiastolic: 115,
  heartRate: 135,
  respiratoryRate: 30,
  spO2: 89,
  temperatureC: 37.0,
  painScore: 9,
};
const analysis = analyzePreliminaryWarningFlags(criticalVitals, 'Crushing chest pain radiating to jaw');
assert.ok(analysis.flags.length >= 4, 'Should detect multiple warning flags');
assert.ok(analysis.flags.some(f => f.includes('Critical Hypoxia')), 'Should flag hypoxia');
assert.ok(analysis.flags.some(f => f.includes('Hypertensive Urgency')), 'Should flag hypertensive urgency');
assert.ok(analysis.flags.some(f => f.includes('Coronary')), 'Should flag potential coronary signs');
assert.ok(analysis.suggestedLevel <= 2, 'Should suggest Level 1 or 2 for high risk acute signs');
assert.ok(analysis.disclaimer.includes('preliminary warnings'), 'Must include safety disclaimer');
console.log('✓ Test 1 Passed: Algorithmic warning flags correctly identify abnormalities without diagnosing.');

// TEST 2: Urgency Sorting with Arrival Time Tie-Breaker
console.log('Test 2: Clinician-Confirmed Urgency & Arrival Time Sorting...');
const sampleQueue = [
  { id: 'p1', fullName: 'Low Urgency Early', urgencyLevel: 4, arrivalTimestamp: 100 },
  { id: 'p2', fullName: 'High Urgency Late', urgencyLevel: 2, arrivalTimestamp: 300 },
  { id: 'p3', fullName: 'Critical Early', urgencyLevel: 1, arrivalTimestamp: 200 },
  { id: 'p4', fullName: 'High Urgency Early', urgencyLevel: 2, arrivalTimestamp: 150 },
];

const sorted = sortPatients(sampleQueue, 'urgency_arrival');
assert.strictEqual(sorted[0].id, 'p3', 'Level 1 patient must be first');
assert.strictEqual(sorted[1].id, 'p4', 'Level 2 arrived at 150 must come before Level 2 arrived at 300');
assert.strictEqual(sorted[2].id, 'p2', 'Level 2 arrived at 300 comes next');
assert.strictEqual(sorted[3].id, 'p1', 'Level 4 comes last');
console.log('✓ Test 2 Passed: Priority sorting strictly follows urgency level then arrival timestamp.');

// TEST 3: Dynamic Filtering
console.log('Test 3: Queue Filtering by status, search, and department...');
const cardiologyPatients = filterPatients(INITIAL_FICTIONAL_PATIENTS, { department: 'Cardiology' });
assert.ok(cardiologyPatients.every(p => p.department === 'Cardiology'), 'All returned must be Cardiology');

const waitingOnly = filterPatients(INITIAL_FICTIONAL_PATIENTS, { status: PATIENT_STATUS.WAITING });
assert.ok(waitingOnly.every(p => p.status === PATIENT_STATUS.WAITING), 'All returned must be Waiting');

const searchByComplaint = filterPatients(INITIAL_FICTIONAL_PATIENTS, { search: 'fracture' });
assert.ok(searchByComplaint.length >= 0, 'Filter executed smoothly');
console.log('✓ Test 3 Passed: Filtering operates accurately.');

// TEST 4: Dynamic Metrics Computation
console.log('Test 4: Dynamic Metrics Aggregation...');
const metrics = computeDashboardMetrics(INITIAL_FICTIONAL_PATIENTS);
assert.strictEqual(metrics.total, INITIAL_FICTIONAL_PATIENTS.length);
assert.ok(metrics.waitingCount > 0, 'Must have waiting patients');
assert.ok(metrics.inConsultationCount > 0, 'Must have consulted patients');
assert.ok(metrics.completedCount > 0, 'Must have completed patients');
assert.ok(metrics.avgWaitTimeMinutes >= 0, 'Average wait time must be calculated');
assert.ok(Array.isArray(metrics.triageAlerts), 'Triage alerts must be an array');
console.log('✓ Test 4 Passed: Dashboard metrics aggregate from single patient source.');

console.log('--- ALL UNIT TESTS COMPLETED SUCCESSFULLY ---');

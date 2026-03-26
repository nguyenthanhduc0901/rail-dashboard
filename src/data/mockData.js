export const trains = [
  {
    id: 'T01',
    name: 'Northline Express',
    status: 'healthy',
    openIssues: 1,
    efficiency: 97,
    healthyCarriages: 7,
  },
  {
    id: 'T02',
    name: 'Delta Commuter',
    status: 'warning',
    openIssues: 3,
    efficiency: 89,
    healthyCarriages: 5,
  },
  {
    id: 'T03',
    name: 'Harbor Intercity',
    status: 'critical',
    openIssues: 6,
    efficiency: 74,
    healthyCarriages: 3,
  },
  {
    id: 'T04',
    name: 'Metro Link',
    status: 'healthy',
    openIssues: 0,
    efficiency: 99,
    healthyCarriages: 8,
  },
  {
    id: 'T05',
    name: 'East Freight',
    status: 'warning',
    openIssues: 2,
    efficiency: 85,
    healthyCarriages: 6,
  },
  {
    id: 'T06',
    name: 'Sunset Regional',
    status: 'critical',
    openIssues: 4,
    efficiency: 78,
    healthyCarriages: 4,
  },
]

export const carriagesByTrain = {
  T01: [
    { id: 'C01', type: 'Head', status: 'healthy', issues: 0 },
    { id: 'C02', type: 'Passenger', status: 'healthy', issues: 0 },
    { id: 'C03', type: 'Passenger', status: 'warning', issues: 1 },
    { id: 'C04', type: 'Passenger', status: 'healthy', issues: 0 },
    { id: 'C05', type: 'Power', status: 'healthy', issues: 0 },
  ],
  T02: [
    { id: 'C01', type: 'Head', status: 'healthy', issues: 0 },
    { id: 'C02', type: 'Passenger', status: 'warning', issues: 1 },
    { id: 'C03', type: 'Passenger', status: 'warning', issues: 1 },
    { id: 'C04', type: 'Passenger', status: 'critical', issues: 1 },
    { id: 'C05', type: 'Power', status: 'healthy', issues: 0 },
  ],
  T03: [
    { id: 'C01', type: 'Head', status: 'warning', issues: 1 },
    { id: 'C02', type: 'Passenger', status: 'critical', issues: 2 },
    { id: 'C03', type: 'Passenger', status: 'critical', issues: 1 },
    { id: 'C04', type: 'Passenger', status: 'warning', issues: 1 },
    { id: 'C05', type: 'Power', status: 'critical', issues: 1 },
  ],
  T04: [
    { id: 'C01', type: 'Head', status: 'healthy', issues: 0 },
    { id: 'C02', type: 'Passenger', status: 'healthy', issues: 0 },
    { id: 'C03', type: 'Passenger', status: 'healthy', issues: 0 },
    { id: 'C04', type: 'Passenger', status: 'healthy', issues: 0 },
    { id: 'C05', type: 'Power', status: 'healthy', issues: 0 },
  ],
  T05: [
    { id: 'C01', type: 'Head', status: 'healthy', issues: 0 },
    { id: 'C02', type: 'Cargo', status: 'warning', issues: 1 },
    { id: 'C03', type: 'Cargo', status: 'healthy', issues: 0 },
    { id: 'C04', type: 'Cargo', status: 'warning', issues: 1 },
    { id: 'C05', type: 'Power', status: 'healthy', issues: 0 },
  ],
  T06: [
    { id: 'C01', type: 'Head', status: 'warning', issues: 1 },
    { id: 'C02', type: 'Passenger', status: 'critical', issues: 1 },
    { id: 'C03', type: 'Passenger', status: 'healthy', issues: 0 },
    { id: 'C04', type: 'Passenger', status: 'warning', issues: 1 },
    { id: 'C05', type: 'Power', status: 'critical', issues: 1 },
  ],
}

const baseSystems = [
  { key: 'brakes', label: 'Brakes' },
  { key: 'hvac', label: 'HVAC' },
  { key: 'doors', label: 'Doors' },
  { key: 'power', label: 'Power' },
  { key: 'network', label: 'Network' },
]

export const getCarriageSystems = (trainId, carriageId) => {
  const seed = Number(trainId.replace('T', '')) * 10 + Number(carriageId.replace('C', ''))

  return baseSystems.map((system, index) => {
    const health = Math.max(52, 97 - ((seed + index * 7) % 43))

    return {
      id: `${trainId}-${carriageId}-${system.key}`,
      name: system.label,
      health,
      trend: Array.from({ length: 7 }).map((_, day) => ({
        day: `D${day + 1}`,
        value: Math.max(35, health - 7 + ((seed + day + index * 2) % 12)),
      })),
    }
  })
}

export const issues = [
  {
    id: 'ISS-1001',
    trainId: 'T01',
    carriageId: 'C03',
    system: 'Doors',
    description: 'Door 2 intermittent closure delay',
    priority: 'high',
    status: 'open',
    assignee: { name: 'Linh Tran', initials: 'LT', color: 'bg-cyan-500/80' },
    date: '2026-03-23',
  },
  {
    id: 'ISS-1002',
    trainId: 'T02',
    carriageId: 'C02',
    system: 'HVAC',
    description: 'Cabin temperature oscillation above threshold',
    priority: 'medium',
    status: 'in-progress',
    assignee: { name: 'Minh Le', initials: 'ML', color: 'bg-fuchsia-500/80' },
    date: '2026-03-22',
  },
  {
    id: 'ISS-1003',
    trainId: 'T02',
    carriageId: 'C03',
    system: 'Network',
    description: 'Telemetry packet drop in tunnel section',
    priority: 'medium',
    status: 'open',
    assignee: null,
    date: '2026-03-24',
  },
  {
    id: 'ISS-1004',
    trainId: 'T02',
    carriageId: 'C04',
    system: 'Brakes',
    description: 'Pressure build-up slower than baseline',
    priority: 'high',
    status: 'open',
    assignee: { name: 'Bao Vu', initials: 'BV', color: 'bg-orange-500/80' },
    date: '2026-03-20',
  },
  {
    id: 'ISS-1005',
    trainId: 'T03',
    carriageId: 'C02',
    system: 'Power',
    description: 'Battery module 4 capacity degradation',
    priority: 'high',
    status: 'open',
    assignee: { name: 'Gia Nguyen', initials: 'GN', color: 'bg-emerald-500/80' },
    date: '2026-03-19',
  },
  {
    id: 'ISS-1006',
    trainId: 'T03',
    carriageId: 'C02',
    system: 'Doors',
    description: 'Manual override sensor mismatch',
    priority: 'high',
    status: 'in-progress',
    assignee: null,
    date: '2026-03-21',
  },
  {
    id: 'ISS-1007',
    trainId: 'T03',
    carriageId: 'C03',
    system: 'Brakes',
    description: 'Wheel slip signal spikes under load',
    priority: 'medium',
    status: 'open',
    assignee: { name: 'Phuc Do', initials: 'PD', color: 'bg-indigo-500/80' },
    date: '2026-03-25',
  },
  {
    id: 'ISS-1008',
    trainId: 'T03',
    carriageId: 'C04',
    system: 'HVAC',
    description: 'Airflow distribution imbalance at rear zone',
    priority: 'low',
    status: 'open',
    assignee: null,
    date: '2026-03-24',
  },
  {
    id: 'ISS-1009',
    trainId: 'T03',
    carriageId: 'C05',
    system: 'Power',
    description: 'Generator coupling vibration exceeds limit',
    priority: 'high',
    status: 'open',
    assignee: { name: 'Tuan Pham', initials: 'TP', color: 'bg-rose-500/80' },
    date: '2026-03-18',
  },
  {
    id: 'ISS-1010',
    trainId: 'T05',
    carriageId: 'C02',
    system: 'Network',
    description: 'Cargo sensor uplink latency anomaly',
    priority: 'low',
    status: 'closed',
    assignee: { name: 'Lam Bui', initials: 'LB', color: 'bg-sky-500/80' },
    date: '2026-03-15',
  },
  {
    id: 'ISS-1011',
    trainId: 'T05',
    carriageId: 'C04',
    system: 'Doors',
    description: 'Cargo hatch lock actuator timeout',
    priority: 'medium',
    status: 'open',
    assignee: { name: 'Khoa Ho', initials: 'KH', color: 'bg-violet-500/80' },
    date: '2026-03-22',
  },
  {
    id: 'ISS-1012',
    trainId: 'T06',
    carriageId: 'C02',
    system: 'Brakes',
    description: 'Disc wear threshold reached on axle 2',
    priority: 'high',
    status: 'open',
    assignee: null,
    date: '2026-03-23',
  },
  {
    id: 'ISS-1013',
    trainId: 'T06',
    carriageId: 'C04',
    system: 'HVAC',
    description: 'Compressor restart count above safety profile',
    priority: 'medium',
    status: 'open',
    assignee: { name: 'Nhi Dang', initials: 'ND', color: 'bg-teal-500/80' },
    date: '2026-03-24',
  },
  {
    id: 'ISS-1014',
    trainId: 'T06',
    carriageId: 'C05',
    system: 'Power',
    description: 'Primary inverter thermal drift detected',
    priority: 'high',
    status: 'in-progress',
    assignee: { name: 'Son Vu', initials: 'SV', color: 'bg-amber-500/80' },
    date: '2026-03-25',
  },
]

export const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/issues', label: 'Issues' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
]

export const getTrainById = (trainId) => trains.find((train) => train.id === trainId)

export const getCarriagesByTrain = (trainId) => carriagesByTrain[trainId] || []

export const getActiveIssuesByCarriage = (trainId, carriageId) =>
  issues.filter(
    (issue) => issue.trainId === trainId && issue.carriageId === carriageId && issue.status !== 'closed',
  )

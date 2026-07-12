import '../styles/StatusBadge.css';

const STATUS_COLOR_MAP = {
  // Vehicle statuses
  Available: 'green',
  'On Trip': 'amber',
  'In Shop': 'red',
  Retired: 'gray',

  // Driver statuses
  'Off Duty': 'gray',
  Suspended: 'red',

  // Trip statuses
  Draft: 'gray',
  Dispatched: 'amber',
  Completed: 'blue',
  Cancelled: 'red',

  // Maintenance statuses
  Active: 'amber',
  Closed: 'blue',
};

export default function StatusBadge({ status }) {
  const color = STATUS_COLOR_MAP[status] || 'gray';
  return <span className={`status-badge ${color}`}>{status}</span>;
}
import React from 'react';
import { STATUS_COLORS } from '../utils/helpers';

const StatusBadge = ({ status }) => (
  <span className={`badge ${STATUS_COLORS[status] || 'bg-slate-100 text-slate-600'}`}>
    {status}
  </span>
);

export default StatusBadge;
import React, { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { FiUsers, FiTrendingUp, FiCheckCircle, FiXCircle, FiDollarSign, FiStar, FiArrowRight } from 'react-icons/fi';

const StatCard = ({ label, value, icon, color, sub }) => (
  <div className="card flex items-start gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (!data) return <p className="text-center text-slate-400 py-16">Failed to load dashboard.</p>;

  const { stats, recentLeads } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Your sales pipeline at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Leads" value={stats.total_leads} icon={<FiUsers />} color="bg-blue-50 text-blue-500" />
        <StatCard label="New Leads" value={stats.new_leads} icon={<FiTrendingUp />} color="bg-yellow-50 text-yellow-500" />
        <StatCard label="Qualified" value={stats.qualified_leads} icon={<FiStar />} color="bg-purple-50 text-purple-500" />
        <StatCard label="Won" value={stats.won_leads} icon={<FiCheckCircle />} color="bg-green-50 text-green-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Lost Leads" value={stats.lost_leads} icon={<FiXCircle />} color="bg-red-50 text-red-500" />
        <StatCard label="Total Pipeline Value" value={formatCurrency(stats.total_deal_value)} icon={<FiDollarSign />} color="bg-indigo-50 text-indigo-500" sub="All leads combined" />
        <StatCard label="Won Deal Value" value={formatCurrency(stats.won_deal_value)} icon={<FiDollarSign />} color="bg-green-50 text-green-500" sub="Closed won deals" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Recent Leads</h2>
          <Link to="/leads" className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1">
            View all <FiArrowRight />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No leads yet. <Link to="/leads/new" className="text-primary-500">Create one →</Link></p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">Lead</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">Company</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">Status</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">Value</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-2">
                      <Link to={`/leads/${lead.id}`} className="font-medium text-slate-800 hover:text-primary-600">
                        {lead.lead_name}
                      </Link>
                    </td>
                    <td className="py-3 px-2 text-slate-500">{lead.company_name || '—'}</td>
                    <td className="py-3 px-2"><StatusBadge status={lead.status} /></td>
                    <td className="py-3 px-2 text-slate-700">{formatCurrency(lead.deal_value)}</td>
                    <td className="py-3 px-2 text-slate-400">{formatDate(lead.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
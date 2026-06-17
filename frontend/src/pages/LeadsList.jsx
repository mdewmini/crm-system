import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getLeads, deleteLead, getUsers } from '../services/api';
import { STATUSES, LEAD_SOURCES, formatCurrency, formatDate } from '../utils/helpers';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiFilter } from 'react-icons/fi';

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', lead_source: '', assigned_to: '', search: '' });
  const [deleteId, setDeleteId] = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const res = await getLeads(params);
      setLeads(res.data);
    } catch {
      toast.error('Failed to load leads.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  useEffect(() => {
    getUsers().then((res) => setUsers(res.data)).catch(() => {});
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteLead(id);
      toast.success('Lead deleted.');
      setDeleteId(null);
      fetchLeads();
    } catch {
      toast.error('Failed to delete lead.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Leads</h1>
          <p className="text-slate-400 text-sm mt-1">{leads.length} lead{leads.length !== 1 ? 's' : ''} found</p>
        </div>
        <Link to="/leads/new" className="btn-primary">
          <FiPlus /> New Lead
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-3 text-slate-600">
          <FiFilter className="text-sm" />
          <span className="text-sm font-medium">Filter & Search</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              className="input-field pl-9 text-sm"
              placeholder="Search leads..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <select
            className="input-field text-sm"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            className="input-field text-sm"
            value={filters.lead_source}
            onChange={(e) => setFilters({ ...filters, lead_source: e.target.value })}
          >
            <option value="">All Sources</option>
            {LEAD_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            className="input-field text-sm"
            value={filters.assigned_to}
            onChange={(e) => setFilters({ ...filters, assigned_to: e.target.value })}
          >
            <option value="">All Salespeople</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        {Object.values(filters).some(Boolean) && (
          <button
            onClick={() => setFilters({ status: '', lead_source: '', assigned_to: '', search: '' })}
            className="text-xs text-primary-500 hover:text-primary-600 mt-3"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : leads.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 mb-3">No leads found.</p>
            <Link to="/leads/new" className="btn-primary inline-flex">
              <FiPlus /> Create your first lead
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Lead</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Company</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Source</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Assigned To</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Deal Value</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Updated</th>
                  <th className="text-right py-3 px-4 text-slate-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <Link to={`/leads/${lead.id}`} className="font-medium text-slate-800 hover:text-primary-600">
                        {lead.lead_name}
                      </Link>
                      <p className="text-xs text-slate-400">{lead.email}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{lead.company_name || '—'}</td>
                    <td className="py-3 px-4 text-slate-500">{lead.lead_source || '—'}</td>
                    <td className="py-3 px-4 text-slate-500">{lead.assigned_name || '—'}</td>
                    <td className="py-3 px-4"><StatusBadge status={lead.status} /></td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{formatCurrency(lead.deal_value)}</td>
                    <td className="py-3 px-4 text-slate-400">{formatDate(lead.updated_at)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/leads/${lead.id}`} className="p-1.5 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors" title="View">
                          <FiEye />
                        </Link>
                        <Link to={`/leads/${lead.id}/edit`} className="p-1.5 text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors" title="Edit">
                          <FiEdit2 />
                        </Link>
                        <button
                          onClick={() => setDeleteId(lead.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Delete Lead?</h3>
            <p className="text-slate-500 text-sm mb-6">This will permanently delete this lead and all its notes.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsList;
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createLead, updateLead, getLeadById, getUsers } from '../services/api';
import { STATUSES, LEAD_SOURCES } from '../utils/helpers';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    lead_name: '', company_name: '', email: '', phone: '',
    lead_source: '', assigned_to: '', status: 'New', deal_value: '',
  });

  useEffect(() => {
    getUsers().then((res) => setUsers(res.data)).catch(() => {});
    if (isEdit) {
      getLeadById(id).then((res) => {
        const l = res.data;
        setForm({
          lead_name: l.lead_name || '',
          company_name: l.company_name || '',
          email: l.email || '',
          phone: l.phone || '',
          lead_source: l.lead_source || '',
          assigned_to: l.assigned_to || '',
          status: l.status || 'New',
          deal_value: l.deal_value || '',
        });
      }).catch(() => toast.error('Failed to load lead.'));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.lead_name.trim()) return toast.error('Lead name is required.');
    setLoading(true);
    try {
      if (isEdit) {
        await updateLead(id, form);
        toast.success('Lead updated successfully.');
        navigate(`/leads/${id}`);
      } else {
        const res = await createLead(form);
        toast.success('Lead created successfully.');
        navigate(`/leads/${res.data.id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save lead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 text-sm">
        <FiArrowLeft /> Back
      </button>

      <div className="card">
        <h1 className="text-xl font-bold text-slate-800 mb-6">
          {isEdit ? 'Edit Lead' : 'Create New Lead'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Lead Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="lead_name"
                className="input-field"
                value={form.lead_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                name="company_name"
                className="input-field"
                value={form.company_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                className="input-field"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                className="input-field"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lead Source</label>
              <select name="lead_source" className="input-field" value={form.lead_source} onChange={handleChange}>
                <option value="">Select source</option>
                {LEAD_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assigned To</label>
              <select name="assigned_to" className="input-field" value={form.assigned_to} onChange={handleChange}>
                <option value="">Unassigned</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select name="status" className="input-field" value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deal Value (USD)</label>
              <input
                type="number"
                name="deal_value"
                min="0"
                step="0.01"
                className="input-field"
                placeholder="0.00"
                value={form.deal_value}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary">
              <FiSave /> {loading ? 'Saving...' : isEdit ? 'Update Lead' : 'Create Lead'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
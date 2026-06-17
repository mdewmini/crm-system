import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLeadById, addNote, deleteNote, deleteLead, updateLead } from '../services/api';
import { formatCurrency, formatDate, STATUSES } from '../utils/helpers';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiArrowLeft, FiEdit2, FiTrash2, FiPlus, FiMessageSquare } from 'react-icons/fi';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchLead = () => {
    setLoading(true);
    getLeadById(id)
      .then((res) => setLead(res.data))
      .catch(() => toast.error('Failed to load lead.'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchLead, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setAddingNote(true);
    try {
      await addNote(id, { content: noteText });
      toast.success('Note added.');
      setNoteText('');
      fetchLead();
    } catch {
      toast.error('Failed to add note.');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      toast.success('Note deleted.');
      fetchLead();
    } catch {
      toast.error('Failed to delete note.');
    }
  };

  const handleDeleteLead = async () => {
    if (!window.confirm('Delete this lead and all its notes?')) return;
    try {
      await deleteLead(id);
      toast.success('Lead deleted.');
      navigate('/leads');
    } catch {
      toast.error('Failed to delete lead.');
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await updateLead(id, { ...lead, status: newStatus, assigned_to: lead.assigned_to });
      toast.success(`Status updated to ${newStatus}`);
      fetchLead();
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!lead) return <p className="text-center py-16 text-slate-400">Lead not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/leads" className="text-slate-400 hover:text-slate-600 transition-colors">
          <FiArrowLeft className="text-lg" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 flex-1">{lead.lead_name}</h1>
        <Link to={`/leads/${id}/edit`} className="btn-secondary text-sm">
          <FiEdit2 /> Edit
        </Link>
        <button onClick={handleDeleteLead} className="btn-danger text-sm flex items-center gap-2">
          <FiTrash2 /> Delete
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Lead Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Lead Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['Company', lead.company_name],
                ['Email', lead.email],
                ['Phone', lead.phone],
                ['Lead Source', lead.lead_source],
                ['Assigned To', lead.assigned_name],
                ['Deal Value', formatCurrency(lead.deal_value)],
                ['Created', formatDate(lead.created_at)],
                ['Last Updated', formatDate(lead.updated_at)],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                  <p className="text-sm text-slate-700 font-medium">{value || '—'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="card">
            <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FiMessageSquare /> Notes ({lead.notes?.length || 0})
            </h2>

            <form onSubmit={handleAddNote} className="mb-5">
              <textarea
                rows={3}
                className="input-field text-sm resize-none mb-2"
                placeholder="Add a note about this lead (e.g., after a call or meeting)..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <button type="submit" disabled={addingNote || !noteText.trim()} className="btn-primary text-sm">
                <FiPlus /> {addingNote ? 'Adding...' : 'Add Note'}
              </button>
            </form>

            {lead.notes?.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">No notes yet.</p>
            ) : (
              <div className="space-y-3">
                {lead.notes.map((note) => (
                  <div key={note.id} className="bg-slate-50 rounded-lg p-4 relative group">
                    <p className="text-sm text-slate-700 leading-relaxed">{note.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-slate-400">
                        by <span className="font-medium">{note.created_by_name}</span> · {formatDate(note.created_at)}
                      </p>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Status Panel */}
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Pipeline Status</h2>
            <div className="mb-4">
              <p className="text-xs text-slate-400 mb-2">Current Status</p>
              <StatusBadge status={lead.status} />
            </div>
            <p className="text-xs text-slate-400 mb-2">Update Status</p>
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updatingStatus || s === lead.status}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition-colors ${
                    s === lead.status
                      ? 'border-primary-200 bg-primary-50 text-primary-600 font-medium cursor-default'
                      : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {s === lead.status ? `✓ ${s}` : s}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-base font-semibold text-slate-800 mb-3">Deal Value</h2>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(lead.deal_value)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
export const STATUS_COLORS = {
    'New': 'bg-blue-100 text-blue-700',
    'Contacted': 'bg-yellow-100 text-yellow-700',
    'Qualified': 'bg-purple-100 text-purple-700',
    'Proposal Sent': 'bg-orange-100 text-orange-700',
    'Won': 'bg-green-100 text-green-700',
    'Lost': 'bg-red-100 text-red-700',
  };
  
  export const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
  
  export const LEAD_SOURCES = ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event', 'Other'];
  
  export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
  };
  
  export const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };
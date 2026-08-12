export const formatSalary = (min, max) => {
  if (!min && !max) return 'Negotiable';

  const formatAmount = (num) => {
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)} LPA`;
    }
    if (num >= 1000) {
      return `₹${(num / 1000).toFixed(0)}k`;
    }
    return `₹${num}`;
  };

  if (min && max) {
    return `${formatAmount(min)} - ${formatAmount(max)}`;
  }
  if (min) return `From ${formatAmount(min)}`;
  return `Up to ${formatAmount(max)}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return formatDate(dateString);
};

export const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Applied':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    case 'Under Review':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    case 'Shortlisted':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'Interview':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'Selected':
      return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
    case 'Rejected':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    case 'Active':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'Closed':
      return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    default:
      return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
  }
};

import React, { useState, useEffect } from 'react';
import { savedJobService } from '../../services/savedJobService';
import JobCard from '../../components/JobCard';
import { CardSkeleton } from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import { Bookmark } from 'lucide-react';

const SeekerSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await savedJobService.getSavedJobs();
      if (res.success) {
        setSavedJobs(res.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = (jobId) => {
    setSavedJobs((prev) => prev.filter((item) => item.job?._id !== jobId));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Saved Jobs</h1>
        <p className="text-slate-400 text-sm mt-1">
          Your bookmarked positions to review and apply to when ready.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs yet"
          message="Bookmark job postings while browsing to save them for later."
          actionText="Explore Jobs"
          onAction={() => window.location.href = '/jobs'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((item) => (
            item.job && (
              <JobCard
                key={item._id}
                job={item.job}
                isSavedInitial={true}
                onUnsave={handleUnsave}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default SeekerSavedJobs;

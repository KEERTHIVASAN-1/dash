import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MessageSquare } from 'lucide-react';
import GradientHeading from '../components/ui/GradientHeading';
import GlowButton from '../components/ui/GlowButton';
import GlassCard from '../components/ui/GlassCard';
import QuestionCard from '../components/QuestionCard';
import { questionsAPI } from '../utils/api';

const AllQuestions = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priority: '',
    page: 1,
    limit: 10
  });

  const { data, isLoading, error, refetch } = useQuery(
    ['all-questions', filters],
    () => questionsAPI.getAll(filters),
    {
      keepPreviousData: true,
      refetchInterval: 30000,
      staleTime: 10000,
    }
  );

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleLike = async (questionId) => {
    try {
      await questionsAPI.like(questionId);
      refetch();
    } catch {}
  };

  const handleView = (questionId) => {
    navigate(`/question/${questionId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <GradientHeading>All Questions</GradientHeading>
          <p className="text-gray-600">Browse and search across all questions</p>
        </div>
        <GlowButton as={Link} to="/ask" className="px-4 py-2">Ask Question</GlowButton>
      </div>

      <GlassCard className="space-y-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search questions..."
            value={filters.search}
            onChange={handleSearch}
            className="input-field pl-10 w-full"
          />
          <GlowButton 
            onClick={() => refetch()}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1"
          >
            <Search className="w-4 h-4" />
          </GlowButton>
        </div>
      </GlassCard>

      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">Failed to load questions</div>
            <button onClick={() => refetch()} className="btn-primary">Try Again</button>
          </div>
        ) : data?.questions?.length > 0 ? (
          <>
            {data.questions.map((question) => (
              <QuestionCard
                key={question._id}
                question={question}
                onLike={handleLike}
                onView={handleView}
                onAnswered={() => refetch()}
                showActions={true}
              />
            ))}

            {data.pagination?.pages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="text-sm text-gray-700">
                  Showing {((data.pagination.current - 1) * data.pagination.limit) + 1} to{' '}
                  {Math.min(data.pagination.current * data.pagination.limit, data.pagination.total)} of{' '}
                  {data.pagination.total} results
                </div>
                <div className="flex space-x-2">
                  <GlowButton
                    onClick={() => handlePageChange(data.pagination.current - 1)}
                    disabled={data.pagination.current === 1}
                    variant="secondary"
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </GlowButton>
                  <span className="px-3 py-2 text-sm text-gray-700">
                    Page {data.pagination.current} of {data.pagination.pages}
                  </span>
                  <GlowButton
                    onClick={() => handlePageChange(data.pagination.current + 1)}
                    disabled={data.pagination.current === data.pagination.pages}
                    variant="secondary"
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </GlowButton>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllQuestions;
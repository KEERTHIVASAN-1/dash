import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MessageSquare, CheckCircle, Clock, User, Tag, X } from 'lucide-react';
import { questionsAPI } from '../utils/api';
import QuestionCard from '../components/QuestionCard';
import toast from 'react-hot-toast';
import GradientHeading from '../components/ui/GradientHeading';
import GlowButton from '../components/ui/GlowButton';
import GlassCard from '../components/ui/GlassCard';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('unanswered');
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    category: ''
  });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    isResolved: '',
    priority: '',
    page: 1,
    limit: 10
  });

  // Update filters based on active tab
  useEffect(() => {
    if (activeTab === 'unanswered') {
      setFilters(prev => ({ ...prev, isResolved: 'false', page: 1 }));
    } else if (activeTab === 'answered') {
      setFilters(prev => ({ ...prev, isResolved: 'true', page: 1 }));
    } else {
      setFilters(prev => ({ ...prev, isResolved: '', page: 1 }));
    }
  }, [activeTab]);

  const { data, isLoading, error, refetch } = useQuery(
    ['questions', filters],
    () => questionsAPI.getAll(filters),
    {
      keepPreviousData: true,
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 10000, // Consider data stale after 10 seconds
    }
  );

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleLike = async (questionId) => {
    try {
      await questionsAPI.like(questionId);
      refetch();
      toast.success('Question liked!');
    } catch (error) {
      toast.error('Failed to like question');
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    try {
      await questionsAPI.create(newQuestion);
      toast.success('Question posted successfully!');
      setNewQuestion({ title: '', content: '', category: '' });
      setShowInlineForm(false);
      refetch();
    } catch (error) {
      toast.error('Failed to post question');
    }
  };

  const handleView = (questionId) => {
    navigate(`/question/${questionId}`);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Failed to load questions</div>
        <button onClick={() => refetch()} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <GradientHeading>Questions & Answers</GradientHeading>
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-600">Ask questions and get help from your peers and teachers</p>
        </div>
        <GlowButton 
          onClick={() => setShowInlineForm(!showInlineForm)} 
          className="flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Ask Question</span>
        </GlowButton>
      </div>

      {/* Inline Question Form */}
      {showInlineForm && (
        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-sky-900">Ask a New Question</h3>
            <button onClick={() => setShowInlineForm(false)} className="text-gray-600 hover:text-gray-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-800">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                className="mt-1 input-field w-full"
                placeholder="Enter your question title"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-800">Description</label>
              <textarea
                id="content"
                name="content"
                rows="3"
                value={newQuestion.content}
                onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
                className="mt-1 textarea-field w-full"
                placeholder="Provide details about your question"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-800">Category</label>
              <select
                id="category"
                name="category"
                value={newQuestion.category}
                onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                className="mt-1 input-field w-full"
                required
              >
                <option value="">Select a category</option>
                <option value="General">General</option>
                <option value="Technical">Technical</option>
                <option value="Academic">Academic</option>
                <option value="Administrative">Administrative</option>
              </select>
            </div>
            <div className="flex justify-end">
              <GlowButton type="submit">Post Question</GlowButton>
            </div>
          </form>
        </GlassCard>
      )}


      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {/* Removed All Questions tab per request */}
          <button
            onClick={() => setActiveTab('unanswered')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'unanswered'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Unanswered
          </button>
          <button
            onClick={() => setActiveTab('answered')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'answered'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Answered
          </button>
        </nav>
      </div>

      {/* Search and Filters */}
      <GlassCard className="space-y-4">
        {/* Search */}
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

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              <option value="academic">Academic</option>
              <option value="general">General</option>
              <option value="technical">Technical</option>
              <option value="administrative">Administrative</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="input-field"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="flex items-end">
            <GlowButton
              onClick={() => {
                setFilters({
                  search: '',
                  category: '',
                  isResolved: '',
                  priority: '',
                  page: 1,
                  limit: 10
                });
                setActiveTab('unanswered');
              }}
              variant="secondary"
              className="w-full"
            >
              Clear Filters
            </GlowButton>
          </div>
        </div>
      </GlassCard>

      {/* Questions List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
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
              />
            ))}

            {/* Pagination */}
            {data.pagination.pages > 1 && (
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
            <p className="text-gray-600 mb-6">
              {filters.search || filters.category || filters.isResolved || filters.priority
                ? 'Try adjusting your search criteria'
                : 'Be the first to ask a question!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

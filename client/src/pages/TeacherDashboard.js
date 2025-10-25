import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Clock,
  UserCheck,
  UserX,
  Archive,
  Trash2,
  GraduationCap,
  BookOpen,
  Target,
  Award,
  BrainCircuit,
  TrendingDown,
  Zap,
  FileQuestion,
  Mic,
  PenTool,
  BarChart,
  LineChart,
  Lightbulb
} from 'lucide-react';
import { adminAPI, notificationsAPI } from '../utils/api';
import { formatRole, formatDate, formatRelativeTime } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import GradientHeading from '../components/ui/GradientHeading';
import GlassCard from '../components/ui/GlassCard';

const TeacherDashboard = () => {
  const { isAdmin, isTeacher, user } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();

  const { data: stats, isLoading: statsLoading } = useQuery(
    'teacher-stats',
    adminAPI.getStats,
    {
      enabled: isAdmin() || isTeacher(),
    }
  );

  const { data: users, isLoading: usersLoading } = useQuery(
    ['teacher-users', { page: 1, limit: 20 }],
    () => adminAPI.getUsers({ page: 1, limit: 20 }),
    {
      enabled: isAdmin() || isTeacher(),
    }
  );

  const { data: questions, isLoading: questionsLoading } = useQuery(
    ['teacher-questions', { page: 1, limit: 20, isResolved: false }],
    () => adminAPI.getQuestions({ page: 1, limit: 20, isResolved: false }),
    {
      enabled: isAdmin() || isTeacher(),
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 10000, // Consider data stale after 10 seconds
    }
  );

  const { data: notifications, isLoading: notificationsLoading } = useQuery(
    'teacher-notifications',
    () => notificationsAPI.getAll().then(res => res.data.notifications),
    {
      enabled: isAdmin() || isTeacher(),
      refetchInterval: 30000,
      staleTime: 10000,
    }
  );

  const updateUserRoleMutation = useMutation(
    ({ userId, role }) => adminAPI.updateUserRole(userId, role),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teacher-users');
        toast.success('User role updated successfully');
      },
      onError: () => {
        toast.error('Failed to update user role');
      }
    }
  );

  const toggleUserStatusMutation = useMutation(
    adminAPI.toggleUserStatus,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teacher-users');
        toast.success('User status updated successfully');
      },
      onError: () => {
        toast.error('Failed to update user status');
      }
    }
  );

  const archiveQuestionMutation = useMutation(
    adminAPI.archiveQuestion,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teacher-questions');
        toast.success('Question status updated');
      },
      onError: () => {
        toast.error('Failed to update question status');
      }
    }
  );

  const deleteQuestionMutation = useMutation(
    adminAPI.deleteQuestion,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teacher-questions');
        toast.success('Question deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete question');
      }
    }
  );

  const markNotificationAsReadMutation = useMutation(
    notificationsAPI.markAsRead,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teacher-notifications');
      },
      onError: () => {
        toast.error('Failed to mark notification as read');
      }
    }
  );

  const markAllNotificationsAsReadMutation = useMutation(
    notificationsAPI.markAllAsRead,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teacher-notifications');
        toast.success('All notifications marked as read');
      },
      onError: () => {
        toast.error('Failed to mark all notifications as read');
      }
    }
  );

  const deleteNotificationMutation = useMutation(
    notificationsAPI.delete,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teacher-notifications');
        toast.success('Notification deleted');
      },
      onError: () => {
        toast.error('Failed to delete notification');
      }
    }
  );

  const handleRoleChange = (userId, newRole) => {
    updateUserRoleMutation.mutate({ userId, role: newRole });
  };

  const handleStatusToggle = (userId) => {
    toggleUserStatusMutation.mutate(userId);
  };

  const handleArchiveQuestion = (questionId) => {
    archiveQuestionMutation.mutate(questionId);
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      deleteQuestionMutation.mutate(questionId);
    }
  };

  const handleMarkNotificationAsRead = (notificationId) => {
    markNotificationAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllNotificationsAsRead = () => {
    markAllNotificationsAsReadMutation.mutate();
  };

  const handleDeleteNotification = (notificationId) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  if (!isAdmin() && !isTeacher()) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white-900 mb-2">Access Denied</h2>
        <p className="text-white-600">You don't have permission to access the teacher dashboard.</p>
        <a href="/login" className="text-blue-600 hover:text-blue-800 underline mt-4 inline-block">
          Go to Student Portal
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 text-gray-900 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <GradientHeading className="text-2xl font-bold">Teacher Dashboard</GradientHeading>
            <p className="text-gray-600">Welcome back, {user?.name}! Manage your Q&A platform</p>
          </div>
          <GraduationCap className="w-12 h-12 text-blue-600" />
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <Link
            to="/teacher-dashboard"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/teacher-dashboard'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </Link>
          <Link
            to="/teacher-dashboard/students"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/teacher-dashboard/students'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Students
          </Link>
          <Link
            to="/teacher-dashboard/questions"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/teacher-dashboard/questions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Questions
          </Link>
          <Link
            to="/teacher-dashboard/analytics"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/teacher-dashboard/analytics'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Analytics
          </Link>
        </nav>
      </div>

      {/* Content */}
      <Routes>
        <Route 
          path="/" 
          element={
            <TeacherOverview 
              stats={stats} 
              statsLoading={statsLoading}
              notifications={notifications}
              notificationsLoading={notificationsLoading}
              onMarkNotificationAsRead={handleMarkNotificationAsRead}
              onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
              onDeleteNotification={handleDeleteNotification}
            />
          } 
        />
        <Route 
          path="/students" 
          element={
            <StudentsManagement 
              users={users} 
              usersLoading={usersLoading}
              onRoleChange={handleRoleChange}
              onStatusToggle={handleStatusToggle}
            />
          } 
        />
        <Route 
          path="/questions" 
          element={
            <QuestionsManagement 
              questions={questions} 
              questionsLoading={questionsLoading}
              onArchive={handleArchiveQuestion}
              onDelete={handleDeleteQuestion}
            />
          } 
        />
        <Route 
          path="/analytics" 
          element={<Analytics stats={stats} statsLoading={statsLoading} />} 
        />
      </Routes>
    </div>
  );
};

// Teacher Overview Component
const TeacherOverview = ({ 
  stats, 
  statsLoading, 
  notifications, 
  notificationsLoading, 
  onMarkNotificationAsRead, 
  onMarkAllNotificationsAsRead, 
  onDeleteNotification 
}) => {
  if (statsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-white-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-white-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 glass-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-blue-700 truncate">Total Students</dt>
                <dd className="text-lg font-medium text-blue-900">{stats?.stats?.users?.total || 0}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-green-50 to-green-100 border-green-200 glass-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-green-700 truncate">Questions Asked</dt>
                <dd className="text-lg font-medium text-green-900">{stats?.stats?.content?.questions || 0}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 glass-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-purple-700 truncate">Resolved</dt>
                <dd className="text-lg font-medium text-purple-900">{stats?.stats?.content?.resolved || 0}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 glass-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-orange-700 truncate">Active Students</dt>
                <dd className="text-lg font-medium text-orange-900">{stats?.stats?.users?.active || 0}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card glass-xl transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white-900">Recent Notifications</h3>
          <div className="flex items-center space-x-2">
            {notifications && notifications.length > 0 && (
              <button
                onClick={onMarkAllNotificationsAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark all as read
              </button>
            )}
            <AlertCircle className="w-5 h-5 text-white-400" />
          </div>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {notificationsLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-white-200 rounded"></div>
              ))}
            </div>
          ) : notifications && notifications.length > 0 ? (
            notifications.slice(0, 10).map((notification) => (
              <div 
                key={notification._id} 
                className={`flex items-start justify-between py-3 px-3 rounded-lg border-l-4 ${
                  notification.isRead 
                    ? 'bg-white-50 border-white-300' 
                    : 'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className={`text-sm font-medium ${
                      notification.isRead ? 'text-white-700' : 'text-white-900'
                    }`}>
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        New
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${
                    notification.isRead ? 'text-white-500' : 'text-white-600'
                  } mb-1`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-white-400">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-4 flex space-x-1">
                  {!notification.isRead && (
                    <button
                      onClick={() => onMarkNotificationAsRead(notification._id)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteNotification(notification._id)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                    title="Delete notification"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-white-300 mx-auto mb-4" />
              <p className="text-white-500">No notifications yet</p>
              <p className="text-xs text-white-400 mt-1">You'll see notifications here when students ask questions</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Questions */}
      <div className="card glass-xl transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white-900">Recent Questions</h3>
          <BookOpen className="w-5 h-5 text-white-400" />
        </div>
        <div className="space-y-3">
          {stats?.stats?.recentQuestions?.map((question) => (
            <div key={question._id} className="flex items-center justify-between py-3 border-b border-white-100 last:border-b-0 hover:bg-white-50 rounded-lg px-3 -mx-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white-900 truncate">{question.title}</p>
                <p className="text-xs text-white-500">by {question.author?.name}</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <span className="text-xs text-white-500">{formatRelativeTime(question.createdAt)}</span>
              </div>
            </div>
          )) || (
            <p className="text-white-500 text-center py-4">No recent questions</p>
          )}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="card glass-xl transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white-900">Top Contributors</h3>
          <Award className="w-5 h-5 text-white-400" />
        </div>
        <div className="space-y-3">
          {stats?.stats?.topContributors?.map((user, index) => (
            <div key={user._id} className="flex items-center justify-between py-3 border-b border-white-100 last:border-b-0">
              <div className="flex items-center min-w-0">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                  {index + 1}
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-white-900 truncate">{user.name}</p>
                  <p className="text-xs text-white-500">{formatRole(user.role)}</p>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <span className="text-sm font-medium text-white-900">{user.contributions} answers</span>
              </div>
            </div>
          )) || (
            <p className="text-white-500 text-center py-4">No contributors yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Students Management Component
const StudentsManagement = ({ users, usersLoading, onRoleChange, onStatusToggle }) => {
  if (usersLoading) {
    return (
      <div className="card glass-xl animate-fadeIn">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-white-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white-900">Student Management</h3>
        <Users className="w-5 h-5 text-white-400" />
      </div>
      {users?.users?.map((user) => (
        <div key={user._id} className="card glass-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white-900 mb-2">{user.name}</h3>
              <p className="text-white-600 mb-3">{user.email}</p>
              <div className="flex items-center space-x-4 text-sm text-white-500">
                <span>Joined: {formatDate(user.createdAt)}</span>
                <span>•</span>
                <span>Role: {formatRole(user.role)}</span>
                <span>•</span>
                <span className={user.isActive ? 'text-green-600' : 'text-red-600'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <select
                value={user.role}
                onChange={(e) => onRoleChange(user._id, e.target.value)}
                className="input-field text-sm py-1"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={() => onStatusToggle(user._id)}
                className={`btn-icon ${
                  user.isActive ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}
              >
                {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Questions Management Component
const QuestionsManagement = ({ questions, questionsLoading, onArchive, onDelete }) => {
  if (questionsLoading) {
    return (
      <div className="card glass-xl animate-fadeIn">
        <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-white-200 rounded"></div>
            ))}
        </div>
      </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white-900">Question Management</h3>
          <MessageSquare className="w-5 h-5 text-white-400" />
        </div>
        {questions?.questions?.map((question) => (
            <div key={question._id} className="card glass-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white-900 mb-2">{question.title}</h3>
                <p className="text-white-600 mb-3 line-clamp-2">{question.content}</p>
                <div className="flex items-center space-x-4 text-sm text-white-500">
                  <span>by {question.author?.name}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(question.createdAt)}</span>
                  <span>•</span>
                  <span>{question.views || 0} views</span>
                  {question.isResolved && (
                    <>
                      <span>•</span>
                      <span className="text-green-600">Resolved</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onArchive(question._id)}
                  className="btn-icon bg-yellow-100 text-yellow-600"
                >
                  <Archive className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(question._id)}
                  className="btn-icon bg-red-100 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
};

// All Questions Component
const AllQuestions = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">All Questions</h3>
        <MessageSquare className="w-5 h-5 text-gray-400" />
      </div>
      <p className="text-gray-600">This section shows all questions from the platform.</p>
      <div className="card glass-xl">
        <p className="text-center py-4">Loading questions...</p>
      </div>
    </div>
  );
};

// Teaching Insights Component
const TeachingInsights = ({ stats, statsLoading }) => {
  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card glass-xl">
              <div className="h-8 bg-white-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-32 bg-white-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Teaching Insights</h3>
        <BrainCircuit className="w-5 h-5 text-blue-500" />
      </div>
      <p className="text-gray-600">AI-powered insights to help improve your teaching effectiveness.</p>
      
      {/* Misunderstood Concepts */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Frequently Misunderstood Concepts</h3>
          <TrendingDown className="w-5 h-5 text-red-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-900 mb-2">Object-Oriented Programming</h4>
            <p className="text-sm text-red-800">Students struggle with inheritance and polymorphism concepts</p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs text-red-700">12 related questions</span>
              <span className="text-xs font-medium bg-red-200 text-red-800 px-2 py-1 rounded">High Priority</span>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-900 mb-2">Database Normalization</h4>
            <p className="text-sm text-orange-800">Confusion about 3NF and BCNF normalization forms</p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs text-orange-700">8 related questions</span>
              <span className="text-xs font-medium bg-orange-200 text-orange-800 px-2 py-1 rounded">Medium Priority</span>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-900 mb-2">Asynchronous Programming</h4>
            <p className="text-sm text-yellow-800">Difficulty understanding promises and async/await</p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs text-yellow-700">6 related questions</span>
              <span className="text-xs font-medium bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Medium Priority</span>
            </div>
          </div>
        </div>
      </GlassCard>
      
      {/* Trending Topics */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Trending Topics by Department</h3>
          <TrendingUp className="w-5 h-5 text-blue-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Computer Science</h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-blue-600" />
                Machine Learning Algorithms
              </li>
              <li className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-blue-600" />
                Web Development Frameworks
              </li>
              <li className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-blue-600" />
                Cloud Computing Services
              </li>
            </ul>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">Mathematics</h4>
            <ul className="text-sm text-purple-800 space-y-2">
              <li className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-purple-600" />
                Linear Algebra Applications
              </li>
              <li className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-purple-600" />
                Differential Equations
              </li>
              <li className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-purple-600" />
                Statistical Analysis Methods
              </li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">Business</h4>
            <ul className="text-sm text-green-800 space-y-2">
              <li className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-green-600" />
                Market Analysis Techniques
              </li>
              <li className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-green-600" />
                Financial Statement Analysis
              </li>
              <li className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-green-600" />
                Strategic Management Models
              </li>
            </ul>
          </div>
        </div>
      </GlassCard>
      
      {/* Priority Questions */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Priority Questions for Upcoming Exams</h3>
          <FileQuestion className="w-5 h-5 text-purple-500" />
        </div>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-900">How do I implement a binary search tree in Java?</h4>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">Exam Priority</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">This concept appears in 80% of past exams</p>
            <div className="mt-3 flex items-center space-x-3">
              <button className="flex items-center text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                <Mic className="w-3 h-3 mr-1" />
                Voice Note
              </button>
              <button className="flex items-center text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                <PenTool className="w-3 h-3 mr-1" />
                Whiteboard
              </button>
              <button className="flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                <MessageSquare className="w-3 h-3 mr-1" />
                Text Response
              </button>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-900">Explain normalization in database design</h4>
              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded">High Interest</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Multiple students asking similar questions</p>
            <div className="mt-3 flex items-center space-x-3">
              <button className="flex items-center text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                <Mic className="w-3 h-3 mr-1" />
                Voice Note
              </button>
              <button className="flex items-center text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                <PenTool className="w-3 h-3 mr-1" />
                Whiteboard
              </button>
              <button className="flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                <MessageSquare className="w-3 h-3 mr-1" />
                Text Response
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
      
      {/* Teaching Analytics */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Teaching Analytics</h3>
          <BarChart className="w-5 h-5 text-indigo-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h4 className="font-medium text-indigo-900 mb-2">Response Time</h4>
            <div className="h-40 flex items-center justify-center">
              <LineChart className="w-8 h-8 text-indigo-400" />
              <p className="text-sm text-indigo-700 ml-2">Analytics visualization coming soon</p>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-indigo-600">Average</p>
                <p className="font-medium text-indigo-900">4.2 hrs</p>
              </div>
              <div>
                <p className="text-xs text-indigo-600">Fastest</p>
                <p className="font-medium text-indigo-900">15 min</p>
              </div>
              <div>
                <p className="text-xs text-indigo-600">Pending</p>
                <p className="font-medium text-indigo-900">3</p>
              </div>
            </div>
          </div>
          
          <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
            <h4 className="font-medium text-pink-900 mb-2">Student Satisfaction</h4>
            <div className="h-40 flex items-center justify-center">
              <BarChart className="w-8 h-8 text-pink-400" />
              <p className="text-sm text-pink-700 ml-2">Analytics visualization coming soon</p>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-pink-600">Rating</p>
                <p className="font-medium text-pink-900">4.8/5</p>
              </div>
              <div>
                <p className="text-xs text-pink-600">Helpful</p>
                <p className="font-medium text-pink-900">92%</p>
              </div>
              <div>
                <p className="text-xs text-pink-600">Clarity</p>
                <p className="font-medium text-pink-900">4.6/5</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
      
      {/* Gamification Stats */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Teaching Impact</h3>
          <Award className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-yellow-200 p-3">
                <Lightbulb className="h-6 w-6 text-yellow-600" />
              </div>
              <h4 className="font-medium text-yellow-900 mt-2">Doubts Cleared</h4>
              <p className="text-2xl font-bold text-yellow-700">124</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-green-200 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-green-900 mt-2">Helpful Votes</h4>
              <p className="text-2xl font-bold text-green-700">287</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-blue-200 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-blue-900 mt-2">Students Helped</h4>
              <p className="text-2xl font-bold text-blue-700">56</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-purple-200 p-3">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-purple-900 mt-2">Current Streak</h4>
              <p className="text-2xl font-bold text-purple-700">14 days</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

// Analytics Component
const Analytics = ({ stats, statsLoading }) => {
  if (statsLoading) {
    return (
      <div className="card glass-xl animate-fadeIn">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-white-200 rounded"></div>
        </div>
      </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="card glass-xl transition-all duration-300 hover:shadow-xl">
          <h3 className="text-lg font-semibold text-white-900 mb-4">Platform Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Engagement Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">Total Questions:</span>
                  <span className="font-medium text-blue-900">{stats?.stats?.content?.questions || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Total Answers:</span>
                  <span className="font-medium text-blue-900">{stats?.stats?.content?.answers || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Resolved Questions:</span>
                  <span className="font-medium text-blue-900">{stats?.stats?.content?.resolved || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Average Response Time:</span>
                  <span className="font-medium text-blue-900">4.2 hours</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">User Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-700">Total Users:</span>
                  <span className="font-medium text-purple-900">{stats?.stats?.users?.total || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Active Users:</span>
                  <span className="font-medium text-purple-900">{stats?.stats?.users?.active || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Teachers:</span>
                  <span className="font-medium text-purple-900">{stats?.stats?.users?.teachers || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Students:</span>
                  <span className="font-medium text-purple-900">{stats?.stats?.users?.students || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default TeacherDashboard;













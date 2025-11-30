import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useAuth } from '../context/AuthContext';
import { authAPI, questionsAPI, answersAPI } from '../../utils/api';
import { formatRole, getInitials, getAvatarUrl } from '../utils/helpers';
import toast from 'react-hot-toast';
import { User, Mail, GraduationCap, Edit3, Save, X, RefreshCw } from 'lucide-react';

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    studentId: user?.studentId || ''
  });
  const [activity, setActivity] = useState({
    questions: 0,
    answers: 0,
    helpfulVotes: 0,
    loading: false,
    error: null
  });

  const updateProfileMutation = useMutation(authAPI.updateProfile, {
    onSuccess: (data) => {
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update profile');
    }
  });

  // Fetch activity summary
  React.useEffect(() => {
    const fetchActivity = async () => {
      if (!user?._id) return;
      setActivity(prev => ({ ...prev, loading: true, error: null }));
      try {
        const [qRes, aRes] = await Promise.all([
          questionsAPI.getUserQuestions(user._id, { page: 1, limit: 1 }),
          answersAPI.getByUser(user._id, { page: 1, limit: 1 })
        ]);
        const qData = qRes.data || {};
        const aData = aRes.data || {};
        const questionsCount = qData.pagination?.total ?? qData.total ?? 0;
        const answersCount = aData.pagination?.total ?? aData.total ?? 0;
        const helpfulVotes = aData.summary?.totalLikes ?? 0;
        setActivity({ questions: questionsCount, answers: answersCount, helpfulVotes, loading: false, error: null });
      } catch (err) {
        console.error('Failed to load activity summary', err);
        setActivity(prev => ({ ...prev, loading: false, error: 'Failed to load activity' }));
      }
    };
    fetchActivity();
  }, [user?._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      department: user?.department || '',
      studentId: user?.studentId || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>
        {!isEditing && (
          <div className="flex space-x-3">
            <button
              onClick={refreshProfile}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Profile</span>
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
              {!avatarError && getAvatarUrl(user?.avatar, user?.email) ? (
                <img
                  className="h-24 w-24 rounded-full"
                  src={getAvatarUrl(user?.avatar, user?.email)}
                  alt={user?.name}
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <span className="text-2xl font-medium text-primary-600">
                  {getInitials(user?.name)}
                </span>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                      Student ID
                    </label>
                    <input
                      type="text"
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Computer Science, Engineering"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isLoading}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{updateProfileMutation.isLoading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`badge badge-${user?.role === 'admin' ? 'danger' : user?.role === 'teacher' ? 'success' : 'primary'}`}>
                      {formatRole(user?.role)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{user?.email}</span>
                  </div>
                  
                  {user?.department && (
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{user.department}</span>
                    </div>
                  )}
                  
                  {user?.studentId && (
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">ID: {user.studentId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Account Status</h4>
            <span className={`badge ${user?.isActive ? 'badge-success' : 'badge-danger'}`}>{user?.isActive ? 'Active' : 'Inactive'}</span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Member Since</h4>
            <p className="text-gray-600">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Last Login</h4>
            <p className="text-gray-600">
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Authentication</h4>
            <span className="badge badge-primary">Google OAuth</span>
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
        {activity.loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-6 bg-gray-200 rounded mx-auto w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mx-auto w-24"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{activity.questions}</div>
              <div className="text-sm text-gray-600">Questions Asked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activity.answers}</div>
              <div className="text-sm text-gray-600">Answers Given</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{activity.helpfulVotes}</div>
              <div className="text-sm text-gray-600">Helpful Votes</div>
            </div>
          </div>
        )}
        {activity.error && (
          <p className="text-sm text-red-600 mt-3">{activity.error}</p>
        )}
      </div>
    </div>
  );
};

export default Profile;

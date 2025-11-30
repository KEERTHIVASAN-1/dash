import React, { useState } from 'react';
import { formatRelativeTime, getInitials } from '../utils/helpers';
import { answersAPI } from "../../utils/api";

import toast from 'react-hot-toast';

const QuestionCard = ({ question, onLike, onView, onAnswered, showActions = true }) => {
  const [showAnswerBox, setShowAnswerBox] = useState(false);
  const [answerContent, setAnswerContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    onLike?.(question._id);
  };

  const handleView = () => {
    onView?.(question._id);
  };
  
  const toggleAnswerBox = (e) => {
    e.stopPropagation();
    setShowAnswerBox(!showAnswerBox);
  };
  
  const handleSubmitAnswer = async (e) => {
    e.stopPropagation();
    if (!answerContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      await answersAPI.create({
        question: question._id,
        content: answerContent
      });
      setAnswerContent('');
      setShowAnswerBox(false);
      onAnswered?.(question._id);
      toast.success('Answer submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 animate-fadeIn"
    >
      <div className="flex items-start justify-between cursor-pointer group" onClick={handleView}>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700">
            {question.title}
          </h3>
          <p className="text-gray-700 mb-3 line-clamp-3">
            {question.content}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {question.views || 0} views
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {question.answerCount || 0} answers
            </span>
            <span>{formatRelativeTime(question.createdAt)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300">
                  {question.author?.avatar ? (
                    <img
                      className="h-6 w-6 rounded-full"
                      src={question.author.avatar}
                      alt={question.author.name}
                    />
                  ) : (
                    <span className="text-xs font-medium text-gray-700">
                      {getInitials(question.author?.name)}
                    </span>
                  )}
                </div>
                <span className="ml-2 text-sm text-gray-600">{question.author?.name}</span>
              </div>
              
              <span className={`badge badge-secondary`}>
                {question.category}
              </span>
              
              {question.isResolved && (
                <span className="badge badge-success">Resolved</span>
              )}
            </div>

            <div className="flex space-x-2">
              {showActions && (
                <>
                  <button
                    onClick={handleLike}
                    className={`btn-like-red flex items-center space-x-1 ring-transparent hover:ring-2 ring-primary-300 active:ring-1`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                    <span>{question.likes?.length || 0}</span>
                  </button>
                  {!question.isResolved && (
                    <button
                      onClick={toggleAnswerBox}
                      className="px-3 py-1 text-sm bg-primary-50 text-primary-700 border border-primary-200 rounded hover:bg-primary-100"
                      title="Reply to this question"
                    >
                      Reply
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAnswerBox && (
        <div className="mt-4">
          <textarea
            className="textarea-field"
            placeholder="Write your answer..."
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmitAnswer}
              disabled={isSubmitting || !answerContent.trim()}
              className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;

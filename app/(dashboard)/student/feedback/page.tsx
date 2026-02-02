"use client";

import { useState, useEffect } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';

interface Allocation {
  _id: string;
  internship: {
    _id: string;
    title: string;
    organization: {
      name: string;
    };
  };
  status: string;
  rated?: boolean;
}

interface RatingForm {
  overallScore: number;
  learningExperience: number;
  mentorship: number;
  workEnvironment: number;
  feedback: string;
  wouldRecommend: boolean;
}

export default function FeedbackPage() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedAllocation, setSelectedAllocation] = useState<string | null>(null);

  const [ratingForm, setRatingForm] = useState<RatingForm>({
    overallScore: 0,
    learningExperience: 0,
    mentorship: 0,
    workEnvironment: 0,
    feedback: '',
    wouldRecommend: true,
  });

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      
      const response = await fetch(`http://localhost:3000/api/v1/ratings/pending/student`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAllocations(data.allocations || []);
      }
    } catch (error) {
      console.error('Error fetching allocations:', error);
    }
    setLoading(false);
  };

  const handleRatingChange = (field: keyof RatingForm, value: number) => {
    setRatingForm(prev => ({ ...prev, [field]: value }));
  };

  const submitRating = async (allocationId: string) => {
    if (ratingForm.overallScore === 0) {
      alert('Please provide an overall rating');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/ratings/internship/${allocationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ratingForm),
      });

      if (response.ok) {
        setSuccessMessage('Thank you for your feedback!');
        setSelectedAllocation(null);
        setRatingForm({
          overallScore: 0,
          learningExperience: 0,
          mentorship: 0,
          workEnvironment: 0,
          feedback: '',
          wouldRecommend: true,
        });
        fetchAllocations();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating');
    }
    setSubmitting(false);
  };

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (val: number) => void; label: string }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`h-8 w-8 ${
                star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-gray-600 font-medium">{value > 0 ? `${value}/5` : 'Not rated'}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate Your Internship Experience</h1>
      <p className="text-gray-600 mb-8">
        Your feedback helps improve future internship matches and helps other students make informed decisions.
      </p>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
          <CheckCircle className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      {allocations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Star className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Feedback</h3>
          <p className="text-gray-600">
            You don't have any completed internships that need feedback at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {allocations.map((allocation) => (
            <div key={allocation._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {allocation.internship.title}
                </h3>
                <p className="text-gray-600">at {allocation.internship.organization.name}</p>
              </div>

              {selectedAllocation === allocation._id ? (
                <div className="p-6">
                  <form onSubmit={(e) => { e.preventDefault(); submitRating(allocation._id); }}>
                    <StarRating
                      label="Overall Experience"
                      value={ratingForm.overallScore}
                      onChange={(val) => handleRatingChange('overallScore', val)}
                    />
                    
                    <StarRating
                      label="Learning Experience"
                      value={ratingForm.learningExperience}
                      onChange={(val) => handleRatingChange('learningExperience', val)}
                    />
                    
                    <StarRating
                      label="Mentorship Quality"
                      value={ratingForm.mentorship}
                      onChange={(val) => handleRatingChange('mentorship', val)}
                    />
                    
                    <StarRating
                      label="Work Environment"
                      value={ratingForm.workEnvironment}
                      onChange={(val) => handleRatingChange('workEnvironment', val)}
                    />

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Feedback (Optional)
                      </label>
                      <textarea
                        value={ratingForm.feedback}
                        onChange={(e) => setRatingForm(prev => ({ ...prev, feedback: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Share your experience, what you learned, and any suggestions..."
                      />
                    </div>

                    <div className="mb-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={ratingForm.wouldRecommend}
                          onChange={(e) => setRatingForm(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          I would recommend this internship to other students
                        </span>
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={submitting || ratingForm.overallScore === 0}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="h-4 w-4" />
                        {submitting ? 'Submitting...' : 'Submit Feedback'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedAllocation(null)}
                        className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-6">
                  <button
                    onClick={() => setSelectedAllocation(allocation._id)}
                    className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Star className="h-5 w-5" />
                    Rate This Internship
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

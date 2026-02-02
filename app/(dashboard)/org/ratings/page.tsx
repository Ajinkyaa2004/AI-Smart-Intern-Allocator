"use client";

import { useState, useEffect } from 'react';
import { Star, Send, CheckCircle, User } from 'lucide-react';

interface Allocation {
  _id: string;
  student: {
    _id: string;
    personal: {
      name: string;
      email: string;
    };
  };
  internship: {
    title: string;
  };
  status: string;
  studentRated?: boolean;
}

interface RatingForm {
  overallScore: number;
  technicalSkills: number;
  communication: number;
  professionalism: number;
  workEthic: number;
  feedback: string;
  wouldHireAgain: boolean;
}

export default function RateCandidatesPage() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedAllocation, setSelectedAllocation] = useState<string | null>(null);

  const [ratingForm, setRatingForm] = useState<RatingForm>({
    overallScore: 0,
    technicalSkills: 0,
    communication: 0,
    professionalism: 0,
    workEthic: 0,
    feedback: '',
    wouldHireAgain: true,
  });

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3000/api/v1/ratings/pending/org`, {
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
      const response = await fetch(`http://localhost:3000/api/v1/ratings/student/${allocationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ratingForm),
      });

      if (response.ok) {
        setSuccessMessage('Rating submitted successfully!');
        setSelectedAllocation(null);
        setRatingForm({
          overallScore: 0,
          technicalSkills: 0,
          communication: 0,
          professionalism: 0,
          workEthic: 0,
          feedback: '',
          wouldHireAgain: true,
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
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate Intern Performance</h1>
      <p className="text-gray-600 mb-8">
        Your feedback helps students improve and assists the matching algorithm in making better allocations.
      </p>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
          <CheckCircle className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      {allocations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Ratings</h3>
          <p className="text-gray-600">
            You don't have any completed internships that need ratings at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {allocations.map((allocation) => (
            <div key={allocation._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {allocation.student.personal.name}
                </h3>
                <p className="text-gray-600">{allocation.student.personal.email}</p>
                <p className="text-sm text-gray-500 mt-1">Position: {allocation.internship.title}</p>
              </div>

              {selectedAllocation === allocation._id ? (
                <div className="p-6">
                  <form onSubmit={(e) => { e.preventDefault(); submitRating(allocation._id); }}>
                    <StarRating
                      label="Overall Performance"
                      value={ratingForm.overallScore}
                      onChange={(val) => handleRatingChange('overallScore', val)}
                    />
                    
                    <StarRating
                      label="Technical Skills"
                      value={ratingForm.technicalSkills}
                      onChange={(val) => handleRatingChange('technicalSkills', val)}
                    />
                    
                    <StarRating
                      label="Communication Skills"
                      value={ratingForm.communication}
                      onChange={(val) => handleRatingChange('communication', val)}
                    />
                    
                    <StarRating
                      label="Professionalism"
                      value={ratingForm.professionalism}
                      onChange={(val) => handleRatingChange('professionalism', val)}
                    />

                    <StarRating
                      label="Work Ethic"
                      value={ratingForm.workEthic}
                      onChange={(val) => handleRatingChange('workEthic', val)}
                    />

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Performance Feedback (Optional)
                      </label>
                      <textarea
                        value={ratingForm.feedback}
                        onChange={(e) => setRatingForm(prev => ({ ...prev, feedback: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Share specific feedback about their performance, strengths, and areas for improvement..."
                      />
                    </div>

                    <div className="mb-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={ratingForm.wouldHireAgain}
                          onChange={(e) => setRatingForm(prev => ({ ...prev, wouldHireAgain: e.target.checked }))}
                          className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          I would consider hiring this student again or for a full-time position
                        </span>
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={submitting || ratingForm.overallScore === 0}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="h-4 w-4" />
                        {submitting ? 'Submitting...' : 'Submit Rating'}
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
                    className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Star className="h-5 w-5" />
                    Rate This Intern
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

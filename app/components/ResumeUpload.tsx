"use client";

import { useState } from 'react';
import { Upload, FileText, CheckCircle, X, Loader, Download, Trash2 } from 'lucide-react';

interface ExtractedData {
  skills: Array<{ name: string; level: string }>;
  education: any;
  experience: any[];
  totalSkillsExtracted: number;
}

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/v1/resume/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadSuccess(true);
        setExtractedData(data.extractedData);
        setResumeUrl(data.resumeUrl);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('Failed to upload resume. Please try again.');
      console.error(err);
    }

    setUploading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your resume?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/v1/resume/delete', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setResumeUrl('');
        setFile(null);
        setExtractedData(null);
        setUploadSuccess(false);
        window.location.reload();
      } else {
        setError('Failed to delete resume');
      }
    } catch (err) {
      setError('Failed to delete resume');
    }
  };

  const handleDownload = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:3000/api/v1/resume/download?token=${token}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Resume</h2>
        <p className="text-gray-600 mb-6">
          Our AI will automatically extract your skills, education, and experience to complete your profile.
        </p>

        {/* Upload Area */}
        {!uploadSuccess && (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                file ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <input
                type="file"
                id="resume-upload"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="h-16 w-16 text-blue-600" />
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setFile(null);
                      }}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="h-16 w-16 text-gray-400" />
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-600">PDF files only (Max 5MB)</p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-800">
                <X className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Uploading & Parsing...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Upload Resume
                </>
              )}
            </button>
          </div>
        )}

        {/* Success Message */}
        {uploadSuccess && extractedData && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-bold text-green-900">
                    Resume Uploaded Successfully!
                  </h3>
                  <p className="text-sm text-green-700">
                    Your profile has been automatically updated with extracted information.
                  </p>
                </div>
              </div>
            </div>

            {/* Extracted Skills */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                🎯 Extracted Skills ({extractedData.totalSkillsExtracted})
              </h4>
              <div className="flex flex-wrap gap-2">
                {extractedData.skills.slice(0, 20).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill.name}
                  </span>
                ))}
                {extractedData.totalSkillsExtracted > 20 && (
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                    +{extractedData.totalSkillsExtracted - 20} more
                  </span>
                )}
              </div>
            </div>

            {/* Education */}
            {extractedData.education && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  🎓 Education Detected
                </h4>
                <p className="text-gray-700">
                  {extractedData.education.gpa && `GPA: ${extractedData.education.gpa}`}
                </p>
              </div>
            )}

            {/* Experience */}
            {extractedData.experience && extractedData.experience.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  💼 Experience Found ({extractedData.experience.length} entries)
                </h4>
                <ul className="space-y-2">
                  {extractedData.experience.map((exp, index) => (
                    <li key={index} className="text-gray-700 text-sm">
                      • {exp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                Download
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-100 text-red-700 py-3 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="h-5 w-5" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Tips for Best Results</h3>
        <ul className="space-y-2 text-gray-700 text-sm">
          <li>• Use a well-formatted PDF resume with clear sections</li>
          <li>• Ensure your skills are listed in a dedicated "Skills" section</li>
          <li>• Include your GPA in the education section if applicable</li>
          <li>• List your experience with clear job titles and descriptions</li>
          <li>• The AI will automatically update your profile - review the extracted data!</li>
        </ul>
      </div>
    </div>
  );
}

'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
const ReportWaste = () => {
  const { userId, isSignedIn, isLoaded } = useAuth();
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState(null);
  // Get the user's location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        (error) => {
          setError('Unable to retrieve your location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Redirect to sign-in page if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setError('You must be signed in to report waste.');
    }
  }, [isSignedIn, isLoaded]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      setError('Please sign in to report waste');
      return;
    }

    if (!lat || !lng) {
      setError('Location is required. Please enable location services.');
      return;
    }

    if (!image) {
      setError('Please provide an image of the waste.');
      return;
    }

    setError('');
    setIsLoading(true);

    // Prepare the form data
    const formData = new FormData();
    formData.append('lat', lat);
    formData.append('lng', lng);
    formData.append('image', image);
    formData.append('userId',userId);
    if (description.trim()) {
      formData.append('description', description);
    }
    try {
      // Send the form data to the backend API
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/report`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('Waste reported successfully! You earned points for your contribution.');
        setGeminiResponse(result.analysis); 
        setDescription('');
        setImage(null);
        setPreviewImage(null);
        // Clear the file input
        const fileInput = document.getElementById('image');
        if (fileInput) fileInput.value = '';
      } else {
        setError(result.error || 'An error occurred while reporting waste.');
      }
    } catch (err) {
      setError('Failed to report waste. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-lg text-green-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-2xl shadow-lg px-8 py-10 mb-12 text-center">
        <h1 className="text-3xl font-bold mb-3">Report Waste</h1>
        <p className="text-green-100 text-xl max-w-2xl mx-auto">
          Help us identify waste locations by submitting photos and details. Every report makes a difference!
        </p>
      </div>

      {!isSignedIn && (
        <div className="mb-8 bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-xl shadow-sm">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-base">
              <strong>Authentication required:</strong> Please sign in to report waste and earn points!
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-base">{error}</p>
          </div>
        </div>
      )}
      
      {message && (
        <div className="mb-8 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl shadow-sm">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-base">{message}</p>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Location Section */}
          <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Location Information</h3>
            {lat && lng ? (
              <div className="flex items-center bg-white p-3 rounded-lg border border-green-100 shadow-sm">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">Your Current Location</p>
                  <p className="text-sm text-gray-900">Latitude: {lat.toFixed(6)}, Longitude: {lng.toFixed(6)}</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-base text-gray-900">Retrieving your location...</p>
              </div>
            )}
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-900">Upload Waste Image</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                required
                disabled={isLoading}
              />
              <label 
                htmlFor="image" 
                className="cursor-pointer block"
              >
                {!previewImage ? (
                  <div className="space-y-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-900 text-lg font-medium">Click to upload an image</p>
                    <p className="text-gray-900">JPG, PNG or GIF (max 10MB)</p>
                  </div>
                ) : null}
              </label>
              
              {/* Image Preview */}
              {previewImage && (
                <div className="mt-4">
                  <div className="relative rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={previewImage} 
                      alt="Waste Preview" 
                      className="w-full max-h-80 object-contain" 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setPreviewImage(null);
                        document.getElementById('image').value = '';
                      }}
                      className="absolute top-3 right-3 bg-white bg-opacity-75 text-red-500 p-2 rounded-full hover:bg-opacity-100 hover:text-red-600 transition-colors"
                      aria-label="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-900">Description</h3>
            <div>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the waste (type, amount, location details, etc.)"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 min-h-[120px] text-base text-gray-900"
                disabled={isLoading}
              />
              <p className="mt-2 text-sm text-gray-900">Optional: Add any additional information that might be helpful.</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className={`w-full px-6 py-4 text-white font-medium rounded-xl text-base shadow-sm ${
                isLoading || !isSignedIn
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300'
              }`}
              disabled={isLoading || !isSignedIn}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Display Gemini AI Analysis Response */}
      {geminiResponse && (
        <div className="mt-12 bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
          <div className="bg-green-600 text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Waste Analysis Results</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-sm font-medium text-green-900 mb-1">Waste Type</p>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-lg font-semibold text-gray-900">{geminiResponse.wasteType}</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-sm font-medium text-green-900 mb-1">Points Earned</p>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <p className="text-lg font-semibold text-green-700">+{geminiResponse.points} points</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-900 mb-2">Analysis Confidence</p>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    geminiResponse.confidence > 90
                      ? 'bg-green-600'
                      : geminiResponse.confidence > 75
                      ? 'bg-blue-600'
                      : geminiResponse.confidence > 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, geminiResponse.confidence)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-900">0%</span>
                <span className="text-xs font-medium text-gray-900">{geminiResponse.confidence}%</span>
                <span className="text-xs text-gray-900">100%</span>
              </div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-900 font-medium">
                Thank you for your contribution to a cleaner environment!
              </p>
              <p className="text-sm text-gray-900 mt-1">
                Your report has been submitted successfully and points have been added to your profile.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportWaste;

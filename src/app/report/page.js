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
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-6">Report Waste</h1>

      {!isSignedIn && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p>Please sign in to report waste and earn points!</p>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {message && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
          <p>{message}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Section */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-lg text-black font-semibold mb-2">Location</h3>
            {lat && lng ? (
              <div className="text-sm">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <p className='text-black'>Your Location: Latitude {lat.toFixed(6)}, Longitude {lng.toFixed(6)}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Retrieving your location...</p>
            )}
          </div>

          {/* Image Upload Section */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Waste Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isLoading}
            />
            
            {/* Image Preview */}
            {previewImage && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                <div className="relative">
                  <img 
                    src={previewImage} 
                    alt="Waste Preview" 
                    className="w-full max-h-60 object-cover rounded-lg" 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreviewImage(null);
                      document.getElementById('image').value = '';
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
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

          {/* Description Section */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the waste (type, amount, etc.)"
              className="w-full p-2 border border-gray-300 rounded-md min-h-[100px] resize-y"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className={`px-6 py-3 text-white font-medium rounded-lg text-sm ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
              }`}
              disabled={isLoading || !isSignedIn}
            >
              {isLoading ? (
                <span className="flex items-center">
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
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">Waste Analysis</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Waste Type</p>
              <p className="text-lg font-semibold">{geminiResponse.wasteType}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Points Earned</p>
              <p className="text-lg font-semibold text-green-600">+{geminiResponse.points}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">Confidence Level</p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${
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
            <p className="text-right text-sm mt-1">{geminiResponse.confidence}%</p>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Thank you for your contribution to a cleaner environment!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportWaste;

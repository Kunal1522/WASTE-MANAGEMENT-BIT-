'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import Dialog from '@/components/ui/dialog';

export default function CollectPage() {
  const [entries, setEntries] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [image, setImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchEntries = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/collect`);
      const data = await res.json();
      console.log(data.entries);
      setEntries(data.entries);
    };
    
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ latitude, longitude });
        },
        (err) => console.error(err)
      );
    };
    
    fetchEntries();
    getLocation();
  }, []);
  
  const isNearby = (entryCoords) => {
    if (!userLocation) return false;
    const latDiff = Math.abs(entryCoords[1] - userLocation.latitude);
    const lngDiff = Math.abs(entryCoords[0] - userLocation.longitude);
    return latDiff < 0.001 && lngDiff < 0.001; // Approximate check
  };
  
  const handleUpload = async () => {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('collectorId', user.id);
      formData.append('wasteId', selectedEntry._id);
    
    const resUpload = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/collect`, {
      method: 'POST',
      body: formData,
    });
    const result = await resUpload.json();
    const uploadedUrl = result.imageUrl;
    console.log(uploadedUrl);
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gemini-compare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl1:uploadedUrl, // URL of the uploaded image
        imageUrl2: selectedEntry.imageURL // URL of the stored image
      }),
    });
    
    const data = await response.json();
    if (response.ok) {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/update-user-points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          points: 10,
        }),
      });
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/mark-true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wasteId:selectedEntry._id
        }),
      });
      alert('Waste collected and points updated!');

    } else {
      alert('Mismatch in analysis. Collection rejected.');
    }
    
    setDialogOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-8 rounded-lg shadow-lg mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Nearby Waste to Collect</h1>
        <p className="text-white text-lg">
          Find and collect waste items near you to earn points and help the environment.
        </p>
        
        {userLocation ? (
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-800 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-white">Your Location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}</span>
          </div>
        ) : (
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-yellow-600 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-white">Locating your position...</span>
          </div>
        )}
      </div>

      {/* Waste Card Grid */}
      {entries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xl mt-4 text-black font-medium">No waste entries found nearby</p>
          <p className="text-black mt-2">Check back later or try a different location</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <div
              key={entry._id}
              className="border border-green-100 p-4 rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
                <Image
                  src={entry.imageURL}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{objectFit: "cover"}}
                  alt="Waste"
                  className="rounded-lg"
                />
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <p className="font-medium text-black">Waste Type: {entry.wasteType}</p>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <p className="font-medium text-black">Amount: {['Low', 'Medium', 'High'][entry.amount]}</p>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <p className="font-medium text-black">Confidence: {entry.confidence}%</p>
                </div>
              </div>
              
              {isNearby(entry.location.coordinates) ? (
                <button
                  onClick={() => {
                    setSelectedEntry(entry);
                    setDialogOpen(true);
                  }}
                  className="w-full mt-2 px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mark as Collected
                </button>
              ) : (
                <div className="w-full mt-2 px-4 py-3 bg-gray-200 rounded-lg flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-black">Go near this location to collect</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <div className="p-6 bg-white rounded-xl">
          <h2 className="text-2xl font-semibold text-black mb-4">Upload Collection Proof</h2>
          <p className="text-black mb-6">Take a photo of the waste you've collected to verify your contribution</p>
          
          <div className="border-2 border-dashed border-green-200 rounded-lg p-6 text-center">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
            <label 
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-black font-medium mb-1">Click to upload an image</span>
              <span className="text-black text-sm">JPG, PNG, or GIF files accepted</span>
            </label>
            {image && <p className="mt-4 text-black">Image selected: {image.name}</p>}
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setDialogOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!image}
              className={`px-6 py-2 rounded-lg text-white ${image ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Submit
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

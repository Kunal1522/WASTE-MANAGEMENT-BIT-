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
      const res = await fetch('/api/collect');
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
  
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gemini-analyze`, {
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
    if (
      response.ok
    ) {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/update-user-points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          points: parsed.points,
        }),
      });
      
        alert('Waste collected and points updated!');
      } else {
      alert('Mismatch in analysis. Collection rejected.');
      }
      setDialogOpen(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nearby Waste to Collect</h1>
      {userLocation && <p>Your Location: {userLocation.latitude}, {userLocation.longitude}</p>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <div
            key={entry._id}
            className="border p-4 rounded-lg shadow-md bg-white"
          >
            <Image
              src={entry.imageURL}
              width={400}
              height={300}
              alt="Waste"
              className="rounded"
            />
            <p className="mt-2">Waste Type: {entry.wasteType}</p>
            <p>Amount: {['low', 'medium', 'high'][entry.amount]}</p>
            <p>Confidence: {entry.confidence}%</p>
            {isNearby(entry.location.coordinates) ? (
              <button
                onClick={() => {
                  setSelectedEntry(entry);
                  setDialogOpen(true);
                }}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Mark as Collected
              </button>
            ) : (
              <p className="text-red-600 mt-2">Go near this location to collect</p>
            )}
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <div className="p-4">
          <h2 className="text-xl font-semibold">Upload Collection Proof</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="mt-2"
          />
          <button
            onClick={handleUpload}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </Dialog>
    </div>
  );
}

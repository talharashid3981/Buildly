// Livesite.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';

const Livesite = () => {
  const { id } = useParams();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/website/public/site/${id}`);
        setCode(response.data.latestCode);
      } catch (err) {
        console.error("Error fetching site:", err);
        setError("Website not found or unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchWebsite();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading website...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <iframe 
      srcDoc={code} 
      className="w-full h-screen border-0"
      title="Live Website"
    />
  );
};

export default Livesite;
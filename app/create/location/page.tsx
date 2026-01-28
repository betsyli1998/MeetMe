'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VenueSuggestion } from '@/types';

export default function CreateEventStep3() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [approximateLocation, setApproximateLocation] = useState('');
  const [suggestions, setSuggestions] = useState<VenueSuggestion[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<VenueSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState('');

  useEffect(() => {
    const savedIdea = sessionStorage.getItem('eventIdea');
    const savedDate = sessionStorage.getItem('eventDate');
    const savedTime = sessionStorage.getItem('eventTime');

    if (!savedIdea || !savedDate || !savedTime) {
      router.push('/create');
      return;
    }
    setIdea(savedIdea);
  }, [router]);

  const handleGetSuggestions = async () => {
    if (!approximateLocation.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/venues/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          approximateLocation,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuggestions(data.data);
      }
    } catch (error) {
      console.error('Error fetching venue suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVenue = (venue: VenueSuggestion) => {
    setSelectedVenue(venue);
    setLocation(venue.address);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      sessionStorage.setItem('eventLocation', location);
      if (selectedVenue) {
        sessionStorage.setItem('eventVenue', JSON.stringify(selectedVenue));
      }
      router.push('/create/details');
    }
  };

  const handleBack = () => {
    router.push('/create/datetime');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Event</h1>
          <span className="text-sm text-gray-500">Step 3 of 4</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Where will your event be?</h2>
          <p className="text-gray-600">Enter a location or let us suggest venues for you</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!showSuggestions ? (
            <>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 123 Main St, Los Angeles, CA"
                />
              </div>

              <div className="text-center">
                <p className="text-gray-500 mb-3">OR</p>
                <button
                  type="button"
                  onClick={() => setShowSuggestions(true)}
                  className="text-primary font-medium hover:underline"
                >
                  Get venue suggestions from AI
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="approximateLocation" className="block text-sm font-medium text-gray-700 mb-2">
                  Approximate Location (e.g., "West LA", "Downtown Chicago")
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="approximateLocation"
                    value={approximateLocation}
                    onChange={(e) => setApproximateLocation(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., West LA, Downtown, Brooklyn"
                  />
                  <button
                    type="button"
                    onClick={handleGetSuggestions}
                    disabled={loading || !approximateLocation.trim()}
                    className="bg-secondary text-white px-6 py-3 rounded-md font-semibold hover:bg-secondary-dark transition-colors disabled:bg-gray-300"
                  >
                    {loading ? 'Loading...' : 'Suggest'}
                  </button>
                </div>
              </div>

              {suggestions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Suggested Venues:</h3>
                  {suggestions.map((venue, index) => (
                    <div
                      key={index}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedVenue === venue
                          ? 'border-primary bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleSelectVenue(venue)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{venue.name}</h4>
                          <p className="text-gray-600 text-sm mt-1">{venue.address}</p>
                          <p className="text-gray-500 text-sm mt-1">
                            <span className="font-medium">Type:</span> {venue.type}
                          </p>
                          <p className="text-gray-700 text-sm mt-2">{venue.description}</p>
                        </div>
                        {selectedVenue === venue && (
                          <div className="bg-primary text-white rounded-full p-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuggestions(false);
                    setSuggestions([]);
                    setSelectedVenue(null);
                  }}
                  className="text-gray-600 hover:underline"
                >
                  Enter location manually instead
                </button>
              </div>
            </>
          )}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!location.trim()}
              className="bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors disabled:bg-gray-300"
            >
              Next: Generate Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

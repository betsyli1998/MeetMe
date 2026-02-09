'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VenueSuggestion } from '@/types';
import Image from 'next/image';

declare global {
  interface Window {
    google: any;
  }
}

export default function CreateEventStep3() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [approximateLocation, setApproximateLocation] = useState('');
  const [suggestions, setSuggestions] = useState<VenueSuggestion[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<VenueSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState('');
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState<number | null>(null);
  const [autocompleteService, setAutocompleteService] = useState<any>(null);

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

  // Load Google Maps script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if script already exists in DOM (more robust check)
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api"]'
    );
    if (existingScript || window.google) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    // Add onload handler to trigger autocomplete initialization
    script.onload = () => {
      // Trigger a state update to re-run autocomplete initialization
      setAutocompleteService(null);
    };

    document.head.appendChild(script);
  }, []);

  // Initialize Autocomplete
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.google) return;  // Wait for Google Maps to load
    if (autocompleteService) return;  // Already initialized

    const input = document.getElementById('location') as HTMLInputElement;
    if (!input) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ['address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        setLocation(place.formatted_address);
      }
    });

    setAutocompleteService(autocomplete);
  }, [autocompleteService]);

  const handleSearchPlaces = async () => {
    if (!searchQuery.trim() || !approximateLocation.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/places/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          location: approximateLocation,
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        // Rate limit exceeded
        setError(data.error || 'Daily search limit reached. Please try again tomorrow.');
        setSuggestions([]);
        setRemaining(0);
        return;
      }

      if (data.success && data.data) {
        setSuggestions(data.data.venues);
        setRemaining(data.data.remaining);
        if (data.data.venues.length === 0) {
          setError('No venues found. Try a different search term or location.');
        }
      } else {
        setError('Failed to search venues. Please try again.');
      }
    } catch (error) {
      console.error('Error searching venues:', error);
      setError('An error occurred while searching. Please try again.');
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
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-gray-900" style={{fontSize: '32px'}}>Create Your Event</h1>
          <span className="text-gray-500" style={{fontSize: '14px'}}>Step 3 of 4</span>
        </div>
        <div className="w-full bg-purple-100 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-gray-900" style={{fontSize: '32px', lineHeight: '1.4'}}>Where will your event be?</h2>
            <p className="text-gray-600" style={{fontSize: '17px', lineHeight: '1.5', opacity: 0.85}}>Enter a location or let us give you some suggestions!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!showSuggestions ? (
              <>
                <div>
                  <label htmlFor="location" className="block font-medium text-gray-700 mb-2" style={{fontSize: '14px'}}>
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{fontSize: '17px'}}
                    placeholder="e.g., 123 Main St, Los Angeles, CA"
                  />
                </div>

                <div className="text-center">
                  <p className="text-gray-500 mb-3" style={{fontSize: '16px'}}>OR</p>
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(true)}
                    className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                    style={{fontSize: '16px'}}
                  >
                    Search real venues with Google Maps
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="searchQuery" className="block font-medium text-gray-700 mb-2" style={{fontSize: '14px'}}>
                      What are you looking for? (e.g., "restaurant", "rooftop bar", "art gallery")
                    </label>
                    <input
                      type="text"
                      id="searchQuery"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      style={{fontSize: '17px'}}
                      placeholder="e.g., gothic venue, casual restaurant, outdoor space"
                    />
                  </div>

                  <div>
                    <label htmlFor="approximateLocation" className="block font-medium text-gray-700 mb-2" style={{fontSize: '14px'}}>
                      Location (e.g., "West LA", "Downtown Chicago")
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="approximateLocation"
                        value={approximateLocation}
                        onChange={(e) => setApproximateLocation(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        style={{fontSize: '17px'}}
                        placeholder="e.g., West LA, Downtown, Brooklyn"
                      />
                      <button
                        type="button"
                        onClick={handleSearchPlaces}
                        disabled={loading || !approximateLocation.trim() || !searchQuery.trim()}
                        className="bg-secondary text-white px-6 py-3 rounded-md font-semibold hover:bg-secondary-dark transition-colors disabled:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-secondary focus:ring-offset-2"
                        style={{fontSize: '16px'}}
                      >
                        {loading ? 'Searching...' : 'Search'}
                      </button>
                    </div>
                  </div>

                  {remaining !== null && (
                    <div className="text-gray-600 bg-blue-50 p-3 rounded-md" style={{fontSize: '14px'}}>
                      <span className="font-medium">Searches remaining today:</span> {remaining}/10
                    </div>
                  )}

                  {error && (
                    <div className="text-red-600 bg-red-50 p-3 rounded-md" style={{fontSize: '14px'}}>
                      {error}
                    </div>
                  )}
                </div>

                {suggestions.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold" style={{fontSize: '32px', lineHeight: '1.4'}}>Found Venues:</h3>
                    {suggestions.map((venue, index) => (
                      <div
                        key={venue.placeId || index}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2 ${
                          selectedVenue === venue
                            ? 'border-primary bg-purple-50'
                            : 'border-purple-100 hover:border-purple-200'
                        }`}
                        onClick={() => handleSelectVenue(venue)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectVenue(venue);
                          }
                        }}
                      >
                        <div className="flex items-start gap-4">
                          {venue.photoUrl && (
                            <div className="flex-shrink-0">
                              <Image
                                src={venue.photoUrl}
                                alt={venue.name}
                                width={120}
                                height={120}
                                className="rounded-lg object-cover"
                                unoptimized
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold" style={{fontSize: '17px'}}>{venue.name}</h4>
                                {venue.rating && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="text-yellow-500">★</span>
                                    <span className="font-medium" style={{fontSize: '14px'}}>{venue.rating.toFixed(1)}</span>
                                  </div>
                                )}
                                <p className="text-gray-600 mt-1" style={{fontSize: '14px', opacity: 0.85}}>{venue.address}</p>
                                <p className="text-gray-500 mt-1 capitalize" style={{fontSize: '14px'}}>
                                  <span className="font-medium">Type:</span> {venue.type}
                                </p>
                              </div>
                              {selectedVenue === venue && (
                                <div className="bg-primary text-white rounded-full p-2 flex-shrink-0">
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
                    className="text-gray-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-sm"
                    style={{fontSize: '16px'}}
                  >
                    Enter location manually instead
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Sticky CTA at bottom */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="bg-secondary text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-secondary-dark transition-colors focus:outline-none focus:ring-4 focus:ring-secondary focus:ring-offset-2"
              style={{fontSize: '16px'}}
            >
              Back
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!location.trim()}
              className="bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors disabled:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2"
              style={{fontSize: '16px'}}
            >
              Next: Generate Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

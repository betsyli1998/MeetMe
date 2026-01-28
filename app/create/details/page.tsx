'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CreateEventStep4() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [itinerary, setItinerary] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [keepItinerary, setKeepItinerary] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const idea = sessionStorage.getItem('eventIdea');
    const date = sessionStorage.getItem('eventDate');
    const time = sessionStorage.getItem('eventTime');
    const location = sessionStorage.getItem('eventLocation');

    if (!idea || !date || !time || !location) {
      router.push('/create');
      return;
    }

    generateEventDetails(idea, date, time, location);
  }, [router]);

  const generateEventDetails = async (
    idea: string,
    date: string,
    time: string,
    location: string
  ) => {
    setLoading(true);
    try {
      // Get AI suggestions
      const aiResponse = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, date, time, location }),
      });
      const aiData = await aiResponse.json();

      if (aiData.success) {
        setTitle(aiData.data.title);
        setDescription(aiData.data.description);
        setItinerary(aiData.data.itinerary);
      }

      // Get GIPHY image
      const giphyResponse = await fetch('/api/giphy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: idea }),
      });
      const giphyData = await giphyResponse.json();

      if (giphyData.success && giphyData.data.length > 0) {
        setImageUrl(giphyData.data[0].images.downsized.url);
      }
    } catch (error) {
      console.error('Error generating event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const idea = sessionStorage.getItem('eventIdea');
      const date = sessionStorage.getItem('eventDate');
      const time = sessionStorage.getItem('eventTime');
      const location = sessionStorage.getItem('eventLocation');
      const venueStr = sessionStorage.getItem('eventVenue');
      const venue = venueStr ? JSON.parse(venueStr) : undefined;

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          title,
          description,
          date,
          time,
          location,
          venue,
          imageUrl,
          itinerary: keepItinerary ? itinerary : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Clear session storage
        sessionStorage.removeItem('eventIdea');
        sessionStorage.removeItem('eventDate');
        sessionStorage.removeItem('eventTime');
        sessionStorage.removeItem('eventLocation');
        sessionStorage.removeItem('eventVenue');

        // Redirect to event page
        router.push(`/events/${data.data.id}`);
      } else {
        alert('Failed to create event. Please try again.');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleBack = () => {
    router.push('/create/location');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">Creating your event...</h2>
          <p className="text-gray-600">Our AI is generating the perfect details for your event</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Event</h1>
          <span className="text-sm text-gray-500">Step 4 of 4</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Review Your Event Details</h2>
          <p className="text-gray-600">Edit any details below before creating your event</p>
        </div>

        <form onSubmit={handleCreateEvent} className="space-y-6">
          {/* Event Image */}
          {imageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt="Event"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}

          {/* Event Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Event Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Event Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Event Itinerary */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="itinerary" className="block text-sm font-medium text-gray-700">
                Event Itinerary (Optional)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepItinerary}
                  onChange={(e) => setKeepItinerary(e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">Include itinerary</span>
              </label>
            </div>
            {keepItinerary && (
              <textarea
                id="itinerary"
                value={itinerary}
                onChange={(e) => setItinerary(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            )}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-gray-700">
              <strong>What happens next?</strong> After creating your event, you'll be able to share
              it via link, email, or SMS, and track RSVPs from your guests.
            </p>
          </div>

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
              disabled={creating}
              className="bg-secondary text-white px-8 py-3 rounded-md font-semibold hover:bg-secondary-dark transition-colors disabled:bg-gray-300"
            >
              {creating ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

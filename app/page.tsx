'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const sessionFilter = searchParams.get('session');

  useEffect(() => {
    fetchEvents();
  }, [sessionFilter]);

  const fetchEvents = async () => {
    try {
      const url = sessionFilter === 'mine' ? '/api/events?session=mine' : '/api/events';
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const truncateTitle = (title: string, maxLength: number = 60) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-[calc(100vh-10rem)]">
      {/* Hero Section with Blob Gradient Animation */}
      <div className="relative bg-gradient-to-br from-[#e4b9d7] via-[#9a5ded] to-[#15128f] text-white py-32 overflow-hidden">
        {/* Nested container to ensure overflow containment */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Blob Layer 1 - Large purple blob */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute blob blob-1"></div>
          </div>

          {/* Blob Layer 2 - Medium blue blob */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute blob blob-2"></div>
          </div>

          {/* Blob Layer 3 - Small pink blob */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute blob blob-3"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-rakkas font-bold mb-2 text-white" style={{fontSize: '32px', lineHeight: '1.25'}}>
              Turn Event Ideas into Real Events
            </h1>
            <p className="mb-8 max-w-2xl mx-auto text-white/95" style={{fontSize: '17px', lineHeight: '1.5'}}>
              Automate your event planning so you can focus on the vibes.
            </p>
            <Link
              href="/create"
              className="inline-block bg-[#15128f] text-white px-10 py-5 rounded-lg font-bold hover:bg-[#0d0a5c] transition-colors shadow-2xl focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-4 focus:ring-offset-[#15128f]"
              style={{fontSize: '16px'}}
            >
              Create Your Event →
            </Link>
            <p className="mt-4 text-white/90" style={{fontSize: '16px'}}>
              No login required. Two minutes to create an event.
            </p>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#9a5ded] to-transparent opacity-30"></div>

      {/* Events Grid */}
      <div className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-bold mb-8 text-gray-900" style={{fontSize: '20px'}}>
            {sessionFilter === 'mine' ? 'My Events' : 'Recent Events'}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600" style={{opacity: 0.85}}>Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4" style={{opacity: 0.85}}>
                {sessionFilter === 'mine'
                  ? 'No events yet. Create your first one!'
                  : 'No events yet. Create your first one!'}
              </p>
              <Link
                href="/create"
                className="inline-block bg-[#15128f] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#0d0a5c] transition-colors focus:outline-none focus:ring-4 focus:ring-[#15128f] focus:ring-offset-2"
              >
                Create Event
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow focus:outline-none focus:ring-4 focus:ring-[#9a5ded] focus:ring-offset-2"
                >
                  {/* Event Image */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {truncateTitle(event.title)}
                    </h3>
                    <div className="space-y-2 text-sm" style={{color: 'rgb(75, 85, 99)', opacity: 0.90}}>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{formatDate(event.date)} at {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </div>
                      {event.guestCount > 0 && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          <span>{event.guestCount} {event.guestCount === 1 ? 'guest' : 'guests'}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 text-primary font-semibold flex items-center gap-1">
                      View Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

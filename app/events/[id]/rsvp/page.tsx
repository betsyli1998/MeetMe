'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Event } from '@/types';
import { format, parse } from 'date-fns';

export default function RSVPPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState<boolean>(true);
  const [plusOne, setPlusOne] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${id}`);
      const data = await response.json();
      if (data.success) {
        setEvent(data.data);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: id,
          name,
          email,
          attending,
          plusOne,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        alert('Failed to submit RSVP. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {attending ? "You're Going!" : "Thanks for letting us know"}
          </h1>
          <p className="text-gray-600 mb-8">
            {attending
              ? `Your RSVP has been recorded. We look forward to seeing you at ${event.title}!`
              : "We're sorry you can't make it. Hope to see you at the next event!"}
          </p>
          <button
            onClick={() => router.push(`/events/${id}`)}
            className="bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors"
          >
            View Event Details
          </button>
        </div>
      </div>
    );
  }

  const dateTime = parse(`${event.date} ${event.time}`, 'yyyy-MM-dd HH:mm', new Date());
  const formattedDate = format(dateTime, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(dateTime, 'h:mm a');

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">RSVP to Event</h1>
          <div className="bg-blue-50 border-l-4 border-primary p-4 mt-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h2>
            <p className="text-gray-700">
              <strong>Date:</strong> {formattedDate}
            </p>
            <p className="text-gray-700">
              <strong>Time:</strong> {formattedTime}
            </p>
            <p className="text-gray-700">
              <strong>Location:</strong> {event.location}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Your Email *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Will you be attending? *
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="attending"
                  checked={attending === true}
                  onChange={() => setAttending(true)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="text-gray-700">Yes, I'll be there!</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="attending"
                  checked={attending === false}
                  onChange={() => setAttending(false)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="text-gray-700">Sorry, I can't make it</span>
              </label>
            </div>
          </div>

          {attending && (
            <div>
              <label htmlFor="plusOne" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Additional Guests (+1s)
              </label>
              <select
                id="plusOne"
                value={plusOne}
                onChange={(e) => setPlusOne(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={0}>Just me</option>
                <option value={1}>+1</option>
                <option value={2}>+2</option>
                <option value={3}>+3</option>
                <option value={4}>+4</option>
              </select>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push(`/events/${id}`)}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors disabled:bg-gray-300"
            >
              {submitting ? 'Submitting...' : 'Submit RSVP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

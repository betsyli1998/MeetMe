'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Event } from '@/types';
import { generateICSFile, generateGoogleCalendarLink, downloadICSFile } from '@/lib/calendar';

export default function ShareEventPage() {
  const params = useParams();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [copied, setCopied] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [smsTo, setSmsTo] = useState('');

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

  const eventUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/events/${id}`;
  const rsvpUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/events/${id}/rsvp`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Mock: Sending email invite to ${emailTo}`);
    console.log(`Event: ${event?.title}`);
    console.log(`RSVP Link: ${rsvpUrl}`);
    alert(`Email invite sent to ${emailTo} (mocked - check console)`);
    setEmailTo('');
  };

  const handleSendSMS = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Mock: Sending SMS invite to ${smsTo}`);
    console.log(`Event: ${event?.title}`);
    console.log(`RSVP Link: ${rsvpUrl}`);
    alert(`SMS invite sent to ${smsTo} (mocked - check console)`);
    setSmsTo('');
  };

  const handleDownloadCalendar = () => {
    if (!event) return;
    const icsContent = generateICSFile(event);
    downloadICSFile(icsContent, `${event.title.replace(/\s+/g, '-')}.ics`);
  };

  const handleGoogleCalendar = () => {
    if (!event) return;
    const link = generateGoogleCalendarLink(event);
    window.open(link, '_blank');
  };

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Link
          href={`/events/${id}`}
          className="text-primary hover:underline flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Event
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Share & Invite Guests</h1>
        <p className="text-gray-600 mb-8">Spread the word about: <span className="font-medium">{event.title}</span></p>

        {/* Shareable Link */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Shareable Link</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={eventUrl}
              readOnly
              className="flex-1 px-4 py-3 border border-purple-200 rounded-md bg-purple-50"
            />
            <button
              onClick={handleCopyLink}
              className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">Share this link with anyone to view the event details</p>
        </div>

        {/* RSVP Link */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">RSVP Link</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={rsvpUrl}
              readOnly
              className="flex-1 px-4 py-3 border border-purple-200 rounded-md bg-purple-50"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(rsvpUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="bg-secondary text-white px-6 py-3 rounded-md font-semibold hover:bg-secondary-dark transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">Direct link for guests to RSVP</p>
        </div>

        {/* Email Invite */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Send Email Invite</h2>
          <form onSubmit={handleSendEmail} className="flex gap-2">
            <input
              type="email"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              placeholder="recipient@example.com"
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors"
            >
              Send
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-2">
            (Mock implementation - check browser console for details)
          </p>
        </div>

        {/* SMS Invite */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Send SMS Invite</h2>
          <form onSubmit={handleSendSMS} className="flex gap-2">
            <input
              type="tel"
              value={smsTo}
              onChange={(e) => setSmsTo(e.target.value)}
              placeholder="+1 (555) 123-4567"
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors"
            >
              Send
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-2">
            (Mock implementation - check browser console for details)
          </p>
        </div>

        {/* Calendar Options */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Add to Calendar</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={handleDownloadCalendar}
              className="flex items-center justify-center gap-2 bg-purple-50 border-2 border-purple-200 px-6 py-4 rounded-md font-semibold hover:bg-purple-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download .ics File
            </button>
            <button
              onClick={handleGoogleCalendar}
              className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-md font-semibold hover:bg-primary-dark transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.48-7-3.85-7-7.93 0-.62.08-1.22.22-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              Add to Google Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEventStep2() {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [idea, setIdea] = useState('');

  useEffect(() => {
    const savedIdea = sessionStorage.getItem('eventIdea');
    if (!savedIdea) {
      router.push('/create');
      return;
    }
    setIdea(savedIdea);

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time) {
      sessionStorage.setItem('eventDate', date);
      sessionStorage.setItem('eventTime', time);
      router.push('/create/location');
    }
  };

  const handleBack = () => {
    router.push('/create');
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Event</h1>
          <span className="text-sm text-gray-500">Step 2 of 4</span>
        </div>
        <div className="w-full bg-purple-100 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">When is your event?</h2>
          <p className="text-gray-600">Select the date and time for: <span className="font-medium">{idea}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={minDate}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
              Time
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="bg-secondary text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-secondary-dark transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors"
            >
              Next: Choose Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

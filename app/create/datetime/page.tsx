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
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-gray-900" style={{fontSize: '32px'}}>Create Your Event</h1>
          <span className="text-gray-500" style={{fontSize: '14px'}}>Step 2 of 4</span>
        </div>
        <div className="w-full bg-purple-100 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-gray-900" style={{fontSize: '32px', lineHeight: '1.4'}}>When is your event?</h2>
            <p className="text-gray-600" style={{fontSize: '17px', lineHeight: '1.5', opacity: 0.85}}>Select the date and time for: <span className="font-medium">{idea}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="date" className="block font-medium text-gray-700 mb-2" style={{fontSize: '14px'}}>
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
                style={{fontSize: '17px'}}
              />
            </div>

            <div>
              <label htmlFor="time" className="block font-medium text-gray-700 mb-2" style={{fontSize: '14px'}}>
                Time
              </label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{fontSize: '17px'}}
              />
            </div>
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
              className="bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2"
              style={{fontSize: '16px'}}
            >
              Next: Choose Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

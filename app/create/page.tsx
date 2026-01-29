'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEventStep1() {
  const router = useRouter();
  const [idea, setIdea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) {
      sessionStorage.setItem('eventIdea', idea);
      router.push('/create/datetime');
    }
  };

  const examples = [
    'My gothic birthday party',
    'Casual team building event',
    'Elegant wedding reception',
    'Fun summer BBQ gathering',
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Event</h1>
          <span className="text-sm text-gray-500">Step 1 of 4</span>
        </div>
        <div className="w-full bg-purple-100 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">What's your event idea?</h2>

        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="text-2xl text-gray-700 flex items-center gap-3 w-full max-w-fit">
            <span className="font-medium">I want to</span>
            <div className="relative h-10 w-96 overflow-hidden">
              <div className="animate-scroll-text">
                <div className="h-10 flex items-center font-semibold">
                  <span className="inline-block bg-gradient-to-r from-[#7c48c4] via-[#9a5ded] via-[#b67ef2] via-[#d896ff] to-[#9a5ded] bg-clip-text text-transparent whitespace-nowrap">
                    host a galentines at a park
                  </span>
                </div>
                <div className="h-10 flex items-center font-semibold">
                  <span className="inline-block bg-gradient-to-r from-[#7c48c4] via-[#9a5ded] via-[#b67ef2] via-[#d896ff] to-[#9a5ded] bg-clip-text text-transparent whitespace-nowrap">
                    throw a summer party
                  </span>
                </div>
                <div className="h-10 flex items-center font-semibold">
                  <span className="inline-block bg-gradient-to-r from-[#7c48c4] via-[#9a5ded] via-[#b67ef2] via-[#d896ff] to-[#9a5ded] bg-clip-text text-transparent whitespace-nowrap">
                    host a board game night
                  </span>
                </div>
                <div className="h-10 flex items-center font-semibold">
                  <span className="inline-block bg-gradient-to-r from-[#7c48c4] via-[#9a5ded] via-[#b67ef2] via-[#d896ff] to-[#9a5ded] bg-clip-text text-transparent whitespace-nowrap">
                    organize a birthday celebration
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 w-full max-w-fit">
            ✨ Type what you want to plan and get started!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">
              Event Idea
            </label>
            <textarea
              id="idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="e.g., My gothic birthday party, Casual team event, Elegant dinner..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors"
            >
              Next: Choose Date & Time
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

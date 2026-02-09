'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEventStep1() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [idea, setIdea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && idea.trim()) {
      sessionStorage.setItem('creatorName', name);
      sessionStorage.setItem('creatorEmail', email);
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
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-gray-900" style={{fontSize: '32px'}}>Create Your Event</h1>
          <span className="text-gray-500" style={{fontSize: '14px'}}>Step 1 of 4</span>
        </div>
        <div className="w-full bg-purple-100 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 flex-1 flex flex-col">
        <div className="flex-1">
          <h2 className="font-semibold mb-6 text-gray-900" style={{fontSize: '32px', lineHeight: '1.4'}}>What's your event idea?</h2>

          <div className="mb-6 flex flex-col gap-2">
            <div className="text-gray-700 flex items-center gap-3" style={{fontSize: '32px', lineHeight: '1.4'}}>
              <span className="font-medium">I want to host ....</span>
              <div className="relative h-10 w-96 overflow-hidden">
                <div className="animate-scroll-text">
                  <div className="h-10 flex items-center font-semibold">
                    <span className="inline-block bg-gradient-to-r from-[#7c48c4] via-[#9a5ded] via-[#b67ef2] via-[#d896ff] to-[#9a5ded] bg-clip-text text-transparent whitespace-nowrap" style={{fontSize: '32px', lineHeight: '1.4'}}>
                      a galentines at a park
                    </span>
                  </div>
                  <div className="h-10 flex items-center font-semibold">
                    <span className="inline-block bg-gradient-to-r from-[#7c48c4] via-[#9a5ded] via-[#b67ef2] via-[#d896ff] to-[#9a5ded] bg-clip-text text-transparent whitespace-nowrap" style={{fontSize: '32px', lineHeight: '1.4'}}>
                      a summer party
                    </span>
                  </div>
                  <div className="h-10 flex items-center font-semibold">
                    <span className="inline-block bg-gradient-to-r from-[#7c48c4] via-[#9a5ded] via-[#b67ef2] via-[#d896ff] to-[#9a5ded] bg-clip-text text-transparent whitespace-nowrap" style={{fontSize: '32px', lineHeight: '1.4'}}>
                      a board game night
                    </span>
                  </div>
                  <div className="h-10 flex items-center font-semibold">
                    <span className="inline-block bg-gradient-to-r from-[#7c48c4] via-[#9a5ded] via-[#b67ef2] via-[#d896ff] to-[#9a5ded] bg-clip-text text-transparent whitespace-nowrap" style={{fontSize: '32px', lineHeight: '1.4'}}>
                      a birthday celebration
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-600" style={{fontSize: '16px', opacity: 0.85}}>
              ✨ Type what you want to plan and get started!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block font-medium text-gray-700 mb-2" style={{fontSize: '14px'}}>
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  style={{fontSize: '17px'}}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-medium text-gray-700 mb-2" style={{fontSize: '14px'}}>
                  Your Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  style={{fontSize: '17px'}}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="idea" className="block font-medium text-gray-700 mb-2" style={{fontSize: '14px'}}>
                Event Idea *
              </label>
              <textarea
                id="idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                style={{fontSize: '17px', lineHeight: '1.5'}}
                placeholder="e.g., 25th birthday, 15 people, casual dinner, outdoors"
              />
            </div>
          </form>
        </div>

        {/* Sticky CTA at bottom */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2"
              style={{fontSize: '16px'}}
            >
              Next: Choose Date & Time
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

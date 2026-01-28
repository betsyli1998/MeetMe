import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect('/create');
  }

  return (
    <div className="min-h-[calc(100vh-10rem)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Turn Your Event Ideas Into Reality
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Have a vague idea for an event? Let our AI help you plan every detail.
              From venue suggestions to custom itineraries, we've got you covered.
            </p>
            <p className="text-lg mb-12 italic">
              "Let us create the event, so you can enjoy it"
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Share Your Idea</h3>
              <p className="text-gray-600 text-sm">
                Enter a vague event idea like "gothic birthday party"
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Pick Date & Location</h3>
              <p className="text-gray-600 text-sm">
                Choose when and where, or get AI suggestions
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">AI Magic</h3>
              <p className="text-gray-600 text-sm">
                Get title, description, image, and itinerary
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Share & Enjoy</h3>
              <p className="text-gray-600 text-sm">
                Invite guests and track RSVPs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Get Started</h2>
            <form action="/api/auth/login" method="POST" className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="demo@meetme.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="password123"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors"
              >
                Sign In
              </button>
            </form>
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-gray-700 text-center">
                <strong>Demo Credentials:</strong>
                <br />
                Email: demo@meetme.com
                <br />
                Password: password123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

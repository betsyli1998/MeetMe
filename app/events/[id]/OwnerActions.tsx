'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OwnerActions({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    checkOwnership();
  }, [eventId]);

  const checkOwnership = async () => {
    try {
      // Get event to check sessionId match
      const response = await fetch(`/api/events/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Check if we have a session cookie
          // The server will automatically set/check this
          setIsOwner(true); // Simplified - in production, compare sessionIds
        }
      }
    } catch (error) {
      setIsOwner(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        router.push('/?deleted=true');
      } else {
        alert(data.error || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Only show owner actions if user created this event
  // This is a simplified check - in production, compare session cookies properly
  if (!isOwner) {
    return null;
  }

  return (
    <>
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-4">Event Creator Options</p>
        <div className="flex flex-wrap gap-4">
          <Link
            href={`/events/${eventId}/edit`}
            className="flex-1 bg-purple-100 text-purple-700 px-6 py-3 rounded-md font-semibold text-center hover:bg-purple-200 transition-colors"
          >
            Edit Event
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex-1 bg-red-100 text-red-700 px-6 py-3 rounded-md font-semibold hover:bg-red-200 transition-colors"
          >
            Cancel Event
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Event?</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to cancel this event? This action cannot be undone. All RSVPs will be lost.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Canceling...' : 'Yes, Cancel Event'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep Event
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

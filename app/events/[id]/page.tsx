import { getStorage } from '@/lib/storage';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format, parse } from 'date-fns';

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const storage = getStorage();
  const event = storage.getEvent(id);

  if (!event) {
    notFound();
  }

  const rsvps = storage.getRSVPsByEventId(id);
  const attendees = rsvps.filter(r => r.attending);

  const dateTime = parse(`${event.date} ${event.time}`, 'yyyy-MM-dd HH:mm', new Date());
  const formattedDate = format(dateTime, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(dateTime, 'h:mm a');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Event Image */}
        {event.imageUrl && (
          <div className="relative w-full max-h-[500px] rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={event.imageUrl}
              alt={event.title}
              width={800}
              height={450}
              className="object-contain w-full h-auto max-h-[500px]"
              unoptimized
            />
          </div>
        )}

        <div className="p-8">
          {/* Event Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>

          {/* Event Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="bg-primary text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Date & Time</p>
                <p className="text-gray-900">{formattedDate}</p>
                <p className="text-gray-900">{formattedTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-secondary text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Location</p>
                <p className="text-gray-900">{event.location}</p>
                {event.venue && (
                  <p className="text-sm text-gray-600 mt-1">{event.venue.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Event Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">About This Event</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
          </div>

          {/* Event Itinerary */}
          {event.itinerary && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-3">Event Schedule</h2>
              <div className="bg-purple-50 rounded-lg p-6">
                <pre className="text-gray-700 whitespace-pre-wrap font-sans">{event.itinerary}</pre>
              </div>
            </div>
          )}

          {/* Guest List */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">
              Guests ({event.guestCount} attending)
            </h2>
            {attendees.length > 0 ? (
              <div className="bg-purple-50 rounded-lg p-6">
                <ul className="space-y-2">
                  {attendees.map((rsvp) => (
                    <li key={rsvp.id} className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        {rsvp.name}
                        {rsvp.plusOne > 0 && ` +${rsvp.plusOne}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-600">No RSVPs yet. Be the first to RSVP!</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/events/${event.id}/share`}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-md font-semibold text-center hover:bg-primary-dark transition-colors"
            >
              Share & Invite Guests
            </Link>
            <Link
              href={`/events/${event.id}/rsvp`}
              className="flex-1 bg-secondary text-white px-6 py-3 rounded-md font-semibold text-center hover:bg-secondary-dark transition-colors"
            >
              RSVP to Event
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

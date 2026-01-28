import { Event } from '@/types';
import { format, parse } from 'date-fns';

export function generateICSFile(event: Event): string {
  const dateTime = parse(`${event.date} ${event.time}`, 'yyyy-MM-dd HH:mm', new Date());
  const formattedStart = format(dateTime, "yyyyMMdd'T'HHmmss");

  // Add 2 hours for end time
  const endTime = new Date(dateTime.getTime() + 2 * 60 * 60 * 1000);
  const formattedEnd = format(endTime, "yyyyMMdd'T'HHmmss");

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MeetMe//Event Calendar//EN
BEGIN:VEVENT
UID:${event.id}@meetme.com
DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss")}
DTSTART:${formattedStart}
DTEND:${formattedEnd}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:${event.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  return icsContent;
}

export function generateGoogleCalendarLink(event: Event): string {
  const dateTime = parse(`${event.date} ${event.time}`, 'yyyy-MM-dd HH:mm', new Date());
  const formattedStart = format(dateTime, "yyyyMMdd'T'HHmmss");

  // Add 2 hours for end time
  const endTime = new Date(dateTime.getTime() + 2 * 60 * 60 * 1000);
  const formattedEnd = format(endTime, "yyyyMMdd'T'HHmmss");

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formattedStart}/${formattedEnd}`,
    details: event.description,
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadICSFile(icsContent: string, filename: string) {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

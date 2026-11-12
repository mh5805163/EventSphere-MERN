import BookLink from "@/components/landing/BookLink";
import { ArrowUpRight, CalendarDays, Clock, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isPastEvent } from '@/lib/eventDates';
import { isExpo } from '@/hooks/useExpos';
import { getListingPhoto } from './listingPhoto';
import { eventPhoto, expoPhoto } from './landingPhotos';
import EventPhoto from './EventPhoto';
import './catalog-finishes.css';

const fullDateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' });
const timeFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });

function formatTime(value) {
  if (!value) return '';
  const time = new Date(`2000-01-01T${value}:00Z`);
  return Number.isFinite(time.getTime()) ? timeFormat.format(time) : '';
}

export default function EventCard({ event }) {
  const date = new Date(event.date);
  const hasDate = Boolean(event.date) && Number.isFinite(date.getTime());
  const kind = isExpo(event) ? 'Expo' : 'Event';
  const photo = getListingPhoto(event);
  const sizes = photo === eventPhoto || photo === expoPhoto ? '(max-width: 640px) 100vw, 30vw' : undefined;
  const closed = isPastEvent(event.date);
  const startTime = formatTime(event.time);
  const endTime = formatTime(event.endTime);
  const schedule = endTime ? (startTime ? `${startTime} – ${endTime}` : `Ends at ${endTime}`) : startTime;
  const metadata = [
    { label: 'Date', Icon: CalendarDays, value: hasDate ? fullDateFormat.format(date) : 'To be announced' },
    { label: 'Time', Icon: Clock, value: schedule || 'To be announced' },
    { label: 'Location', Icon: MapPin, value: event.location || 'To be announced' },
    { label: 'Theme', Icon: Sparkles, value: event.category || 'To be announced' },
  ];

  return (
    <div className="celebration-listing" data-kind={kind}>
      <article className="celebration-listing-ticket">
        <div className="celebration-listing-photo">
          <EventPhoto photo={photo} sizes={sizes} className="absolute inset-0 size-full object-cover object-center" />
        </div>
        <div className="celebration-listing-details">
          <p className="celebration-listing-category">{kind}{event.category ? ` / ${event.category}` : ''}</p>
          <h3><Link className="hover:underline" to={`/expos/${event._id}`}>{event.title}</Link></h3>
          <p className="celebration-listing-description">{event.description || 'More details will be shared by the organizer.'}</p>
          <dl className="celebration-listing-meta">
            {metadata.map(({ label, Icon, value }) => (
              <div key={label}>
                <dt><Icon size={17} aria-hidden="true" />{label}</dt>
                <dd>{label === 'Date' && hasDate ? <time dateTime={date.toISOString()}>{value}</time> : value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="celebration-listing-stub">
          {closed ? <Link to={`/expos/${event._id}`} className="celebration-listing-action">View details <span aria-hidden="true"><ArrowUpRight size={17} /></span></Link> : <BookLink eventId={event._id} className="celebration-listing-action" aria-label={`Book now: ${event.title}`}>Book Now <span aria-hidden="true"><ArrowUpRight size={17} /></span></BookLink>}
        </div>
      </article>
    </div>
  );
}

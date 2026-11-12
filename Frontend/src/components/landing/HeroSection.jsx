import BookLink from './BookLink';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventPhoto from './EventPhoto';
import { heroPhoto } from './landingPhotos';
import useAuth from '@/hooks/useAuth';
import useWebsiteBanner from '@/hooks/useWebsiteBanner';

export default function HeroSection() {
  const attendee = useAuth()?.role === 'attendee';
  const { bannerTitle, bannerDescription, bannerButton, bannerImage } = useWebsiteBanner();
  const photo = bannerImage ? { src: bannerImage, alt: '' } : heroPhoto;

  return (
    <section id="home" className="home-hero celebration-wrap" aria-labelledby="celebration-title">
      <div className="home-hero-copy">
        <p className="celebration-kicker">Event &amp; expo management</p>
        <h1 id="celebration-title">{bannerTitle || <>From the first booth to the <em>final booking.</em></>}</h1>
        <p>{bannerDescription || 'Organize exhibitions, manage booths and sessions, or discover events and reserve your place.'}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link className="celebration-button" to={attendee ? '/#catalog-events' : '/#inquire'}>
            {attendee ? 'Explore events' : bannerButton || 'Plan an event'} <ArrowUpRight size={18} />
          </Link>
          {attendee
            ? <BookLink className="home-link">{bannerButton || 'Book Now'}</BookLink>
            : <Link className="home-link" to="/#catalog-expos">Browse expos <ArrowUpRight size={16} /></Link>}
        </div>
      </div>
      <figure className="home-hero-image">
        <EventPhoto photo={photo} sizes={bannerImage ? undefined : '(max-width: 760px) 100vw, 54vw'} priority />
        <figcaption><span>EventSphere</span><span>Events · Exhibitions · Bookings</span></figcaption>
      </figure>
    </section>
  );
}

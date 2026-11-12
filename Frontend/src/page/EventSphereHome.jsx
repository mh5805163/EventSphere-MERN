import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import HeroSection from '@/components/landing/HeroSection';
import PublicPageShell from '@/components/landing/PublicPageShell';
import ExpoCollection from '@/components/landing/ExpoCollection';
import useExpos, { isExpo } from '@/hooks/useExpos';

import { galleryPhotos } from '@/components/landing/landingPhotos';
import LandingExtras from '@/components/landing/LandingExtras';
import './celebration.css';
import './home.css';

const packages = ['Classic', 'Signature', 'Bespoke'];

function openInquiry(event, reportStatus) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`EventSphere inquiry · ${form.get('package') || 'General inquiry'}`);
  const body = encodeURIComponent(`Name: ${form.get('name')}\nEmail: ${form.get('email')}\n\n${form.get('message')}`);
  reportStatus('Email draft requested. If your mail app does not open, email hello@eventsphere.com directly.');
  window.location.href = `mailto:hello@eventsphere.com?subject=${subject}&body=${body}`;
}

export default function EventSphereHome() {
  const { hash, key } = useLocation();
  const [inquiryStatus, setInquiryStatus] = useState('');
  const catalog = useExpos();
  const latest = [...catalog.items].sort((left, right) =>
    (Date.parse(right.createdAt) || 0) - (Date.parse(left.createdAt) || 0),
  );
  const expoItems = latest.filter(isExpo);
  const eventItems = latest.filter((item) => !isExpo(item));

  useEffect(() => {
    document.title = 'EventSphere — Events & Celebrations';
    if (!hash) return;
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [hash, key]);

  return (
    <PublicPageShell>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:p-4">
        Skip to content
      </a>
      <main id="main-content" className="celebration-page eventsphere-home" tabIndex={-1}>
        <HeroSection />

        <ExpoCollection data={{ ...catalog, items: eventItems }} kind="events" limit={3} />
        <ExpoCollection data={{ ...catalog, items: expoItems }} kind="expos" limit={3} />

        <section id="about" className="home-about celebration-wrap" aria-labelledby="about-title">
          <header>
            <p className="celebration-kicker">About EventSphere</p>
            <h2 id="about-title">One workspace for everyone on the floor.</h2>
            <Link to="/services" className="home-link">Explore our services <ArrowUpRight size={16} /></Link>
          </header>
          <dl className="home-roles">
            <div><dt>For organizers</dt><dd>Publish listings, coordinate booth assignments and sessions, and track registrations.</dd></div>
            <div><dt>For exhibitors</dt><dd>Apply to an expo, manage your company profile, and reserve an available booth after approval.</dd></div>
            <div><dt>For attendees</dt><dd>Find events by theme or location, book your place, and download confirmed passes.</dd></div>
          </dl>
        </section>

        <LandingExtras photos={galleryPhotos} />

        <section id="inquire" className="home-inquiry celebration-wrap" aria-labelledby="inquiry-title">
          <div>
            <p className="celebration-kicker">Make it yours</p>
            <h2 id="inquiry-title">Let’s plan your next gathering.</h2>
            <p>Tell us what you have in mind, including your dates, venue needs, or questions about exhibiting.</p>
          </div>
          <form onSubmit={(event) => openInquiry(event, setInquiryStatus)} className="home-inquiry-form">
            <h3>Send an inquiry</h3>
            <label>Your name<input name="name" autoComplete="name" required /></label>
            <label>Email address<input type="email" name="email" autoComplete="email" required /></label>
            <label>Package<select name="package">
              <option value="">Help me decide</option>
              {packages.map((name) => <option key={name}>{name}</option>)}
            </select></label>
            <label>Tell us about your event<textarea name="message" rows={3} required /></label>
            <button className="celebration-button" type="submit">Open email draft <ArrowUpRight size={16} /></button>
            <p className="home-form-note" role="status">{inquiryStatus || "Opens a draft in your email app for you to review and send."}</p>
          </form>
        </section>
      </main>
    </PublicPageShell>
  );
}

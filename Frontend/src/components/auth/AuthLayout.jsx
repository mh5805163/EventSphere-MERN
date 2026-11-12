import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LandingNavigation from '@/components/landing/LandingNavigation';
import conferencePhoto from '@/assets/auth-conference.jpg';
import './auth.css';

export default function AuthLayout({ title, description, children }) {
  useEffect(() => {
    document.title = title + ' — EventSphere';
  }, [title]);

  return (
    <div className="public-theme celebration-auth min-h-dvh" id="top">
      <LandingNavigation />
      <main className="celebration-auth-main">
        <div className="celebration-auth-spread">
          <div className="celebration-auth-photo" aria-hidden="true">
            <img src={conferencePhoto} alt="" />
            <p>Plan the event.<br /><em>Run the show.</em></p>
          </div>
          <section className="celebration-auth-panel" aria-labelledby="account-title">
            <Link to="/" className="celebration-auth-back">
              <ArrowLeft size={16} /> Back to EventSphere
            </Link>
            <header className="celebration-auth-heading">
              <p className="celebration-auth-kicker">Your EventSphere account</p>
              <h1 id="account-title">{title}</h1>
              <p>{description}</p>
            </header>
            {children}
          </section>
        </div>
      </main>
    </div>
  );
}

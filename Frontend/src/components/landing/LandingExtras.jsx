import EllipsisLoader from "@/components/EllipsisLoader";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, MessageSquare, Quote } from 'lucide-react';
import api from '@/api/api';
import EventPhoto from './EventPhoto';

const questions = [
  ['How do I book an event?', 'Select Book Now, sign in with your attendee account, and choose an event on the booking form.'],
  ['Where can I find my ticket?', 'Open your attendee profile to check your booking status and download your QR pass once confirmed.'],
  ['Can I get help planning a private celebration?', 'Use the inquiry form below to tell us your occasion, preferred date, and what you have in mind.'],
  ['How do I leave a review?', 'Sign in and use the floating Feedback button. Your first name and review will appear in Client Reviews.'],
];

function ClientReviews() {
  const [revision, setRevision] = useState(0);
  const [reviews, setReviews] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    api.get('/feedback/reviews', { signal: controller.signal })
      .then(({ data }) => {
        setReviews(data.reviews);
        setLoadError(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoadError(true);
      });
    return () => controller.abort();
  }, [revision]);

  return (
    <section id="reviews" className="celebration-wrap celebration-extras" aria-labelledby="reviews-title">
      <header>
        <p className="celebration-kicker">In their words</p>
        <h2 id="reviews-title">Client reviews</h2>
      </header>
      {loadError && <p className="home-review-state" role="status">Reviews couldn’t be loaded. <button className="celebration-text-link" type="button" onClick={() => setRevision((current) => current + 1)}>Try again</button></p>}
      {!loadError && !reviews && <EllipsisLoader label="Loading reviews" />}
      {!loadError && reviews?.length === 0 && <p className="home-review-state">Published reviews will appear here as attendees share their experiences. <Link className="home-link" to="/share-feedback">Share feedback <ArrowUpRight size={16} /></Link></p>}
      {!!reviews?.length && (
        <div className="celebration-extras-grid">
          {reviews.map(({ _id, name, message: review, rating }) => (
            <figure key={_id} className="celebration-review">
              <Quote size={23} aria-hidden="true" />
              {rating && <span aria-label={`${rating} out of 5 stars`}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>}
              <blockquote>{review}</blockquote>
              <figcaption>{name}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}

export default function LandingExtras({ photos }) {
  return (
    <>
      <Link to="/share-feedback" className="celebration-feedback-trigger"><MessageSquare size={19} aria-hidden="true" /> Feedback</Link>
      <section id="event-gallery" className="celebration-gallery-preview" aria-labelledby="gallery-preview-title">
        <div className="celebration-wrap celebration-extras">
          <header>
            <p className="celebration-kicker">Moments from the gallery</p>
            <h2 id="gallery-preview-title">Event gallery</h2>
          </header>
          <div className="celebration-extras-grid celebration-preview-photos">
            {photos.map((photo) => (
              <figure key={photo.name}>
                <EventPhoto photo={photo} sizes="(max-width: 640px) 100vw, 45vw" />
                <figcaption>{photo.name}</figcaption>
              </figure>
            ))}
          </div>
          <Link className="celebration-button" to="/gallery">
            View full gallery <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <ClientReviews />
      <section id="questions" className="celebration-questions" aria-labelledby="questions-title">
        <div className="celebration-wrap celebration-extras">
          <header>
            <p className="celebration-kicker">Before you book</p>
            <h2 id="questions-title">Questions &amp; answers</h2>
          </header>
          <div className="celebration-question-list">
            {questions.map(([question, answer], index) => (
              <details key={question} name="event-questions">
                <summary><span className="home-faq-index" aria-hidden="true">0{index + 1}</span><span>{question}</span><ChevronDown size={19} aria-hidden="true" /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

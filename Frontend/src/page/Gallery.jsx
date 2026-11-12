import { useEffect } from 'react';
import PublicPageShell from '@/components/landing/PublicPageShell';
import keynoteImage from '@/assets/gallery/keynote.jpg';
import workshopImage from '@/assets/gallery/workshop.jpg';
import hallImage from '@/assets/gallery/event-hall.jpg';
import venueImage from '@/assets/gallery/venue.jpg';
import presentationImage from '@/assets/gallery/presentation.jpg';
import gatheringImage from '@/assets/gallery/gathering.jpg';
import meetingImage from '@/assets/gallery/meeting.jpg';

const galleryImages = [
  [keynoteImage, 'Audience watching a keynote on a conference stage'],
  [workshopImage, 'Participants gathered around a table for a working session'],
  [hallImage, 'Attendees gathered in a large event hall'],
  [venueImage, 'Event venue prepared for guests'],
  [presentationImage, 'Participants seated together at a presentation'],
  [gatheringImage, 'Guests at an indoor event'],
  [meetingImage, 'Colleagues in a group discussion'],
];

export default function Gallery() {
  useEffect(() => {
    document.title = 'Event Gallery — EventSphere';
  }, []);

  return (
    <PublicPageShell>
      <main className="px-4 pb-16 pt-12 sm:px-7 sm:pt-16">
        <header className="mx-auto mb-9 max-w-2xl text-center">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a97d28]">
            Our moments
          </p>
          <h1 className="font-serif text-4xl font-semibold text-[#321b1f] sm:text-5xl">
            Event <span className="text-[#bd8b2e]">Gallery</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#756a64]">
            Explore conference stages, event venues, and the people who bring professional gatherings to life.
          </p>
        </header>
        <div className="mx-auto max-w-6xl columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
          {galleryImages.map(([src, alt], index) => (
            <figure
              key={src}
              className="mb-3 break-inside-avoid overflow-hidden rounded-xl border border-[#eadfd5] bg-white shadow-sm sm:mb-4 sm:rounded-2xl"
            >
              <img
                src={src}
                alt={alt}
                loading={index < 3 ? 'eager' : 'lazy'}
                className={`w-full object-cover transition duration-500 hover:scale-[1.03] ${
                  index % 3 === 0 ? 'aspect-[1.15]' : index % 3 === 1 ? 'aspect-[0.82]' : 'aspect-[1.35]'
                }`}
              />
            </figure>
          ))}
        </div>
      </main>
    </PublicPageShell>
  );
}

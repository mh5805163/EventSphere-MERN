import EllipsisLoader from "@/components/EllipsisLoader";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Search } from 'lucide-react';
import EventCard from './EventCard';

export default function ExpoCollection({
  data,
  kind = 'expos',
  limit,
  title = kind === 'events' ? 'Events' : 'Expos',
  eyebrow,
  description,
}) {
  const preview = typeof limit === 'number';
  const Heading = preview ? 'h2' : 'h1';
  const [query, setQuery] = useState('');
  const items = data.items.filter((item) =>
    [item.title, item.location, item.theme]
      .join(' ')
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const displayedItems = preview ? items.slice(0, limit) : items;
  return (
    <section className={preview ? 'home-catalog border-t border-[var(--public-line)] py-12 sm:py-18' : 'py-16 sm:py-20'} id={`catalog-${kind}`} aria-labelledby={`catalog-${kind}-title`}>
      <div className="mx-auto w-[min(1240px,calc(100%_-_3rem))]">
        <div className={preview ? "home-catalog-heading mb-7" : "mb-9 text-center"}>
          <div>
            {(eyebrow || preview) && <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a97d28]">
              {eyebrow || (kind === 'events' ? 'On the calendar' : 'On the exhibition floor')}
            </p>}
            <Heading id={`catalog-${kind}-title`} className="font-serif text-3xl font-semibold text-[#321b1f] sm:text-4xl">
              {title}
            </Heading>
          </div>
          {description && <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#756a64]">
            {description}
          </p>}
        </div>
        {!preview && (
          <label className="mx-auto mb-8 flex max-w-xl items-center gap-3 rounded-full border border-[#eadfd5] bg-white px-5 py-2.5 text-[#6e625d] shadow-sm [&_input]:min-w-0 [&_input]:w-full [&_input]:bg-transparent [&_input]:p-1 [&_input]:outline-none">
          <Search size={20} />
          <span className="sr-only">Search {kind}</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, theme, or location"
          />
          </label>
        )}
        {data.loading ? (
          <EllipsisLoader label="Finding your next experience" />
        ) : data.error ? (
          <div
            className="flex min-h-48 flex-col items-center justify-center gap-4 rounded-2xl border border-[#eadfd5] bg-white p-8 text-center text-[#665b54]"
            role="alert"
          >
            <CalendarDays />
            <h3>We'll be right back.</h3>
            <p>{data.error}</p>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#c6952d] px-6 py-3 text-sm text-white hover:bg-[#a97818] focus-visible:outline-[#9a7026]"
              onClick={data.retry}
            >
              Try again
            </button>
          </div>
        ) : items.length ? (
          <div className={preview ? "home-catalog-list" : "grid gap-5 md:grid-cols-2 lg:grid-cols-3"}>
            {displayedItems.map((item) => (
              <EventCard key={item._id} event={item} />
            ))}
          </div>
        ) : (
          <div className="home-catalog-empty flex min-h-48 flex-col items-center justify-center gap-4 rounded-2xl border border-[#eadfd5] bg-white p-8 text-center text-[#665b54]">
            <CalendarDays />
            <h3>
              {query ? `No matching ${kind}.` : `No ${kind} listed yet.`}
            </h3>
            <p>
              {query
                ? 'Try another name, theme, or location.'
                : `New ${kind} will appear here as organizers publish them.`}
            </p>
          </div>
        )}
        {preview && (
          <div className="mt-8 text-center">
            <Link
              to={kind === 'events' ? '/event-listing' : '/expos'}
              className="celebration-button"
            >
              View all {kind}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

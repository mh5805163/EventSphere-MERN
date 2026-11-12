import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

function Photo({ photo, sizes, priority, className }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className={`event-photo-fallback ${className || ''}`} aria-hidden="true">
      <ImageIcon strokeWidth={1} />
    </div>
  ) : (
    <img
      className={className}
      src={sizes ? `${photo.src}&w=960` : photo.src}
      srcSet={sizes ? [480, 960, 1600].map(width => `${photo.src}&w=${width} ${width}w`).join(', ') : undefined}
      sizes={sizes}
      alt={photo.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      onError={() => setFailed(true)}
    />
  );
}

export default function EventPhoto(props) {
  return <Photo key={props.photo.src} {...props} />;
}

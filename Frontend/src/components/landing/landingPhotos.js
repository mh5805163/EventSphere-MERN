function photo(id, alt) {
  return { src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80`, alt };
}

export const heroPhoto = photo('1505373877841-8d25f7d46678', 'Audience seated in front of an illuminated conference stage');
export const galleryPhotos = [
  { name: 'Live conferences', ...photo('1540575467063-178a50c2df87', 'Attendees gathered inside a large event hall') },
  { name: 'Event venues', ...photo('1511795409834-ef04bbd61622', 'An event venue set for guests') },
  { name: 'Learning together', ...photo('1523580494863-6f3031224c94', 'Participants seated together at a presentation') },
];
export const expoPhoto = photo('1511578314322-379afb476865', 'Participants attending a large professional event');
export const eventPhoto = photo('1505236858219-8359eb29e329', 'People gathered at an indoor event');

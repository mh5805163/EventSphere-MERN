import API from '@/api/api';
import { isExpo } from '@/hooks/useExpos';
import { eventPhoto, expoPhoto } from './landingPhotos';

export function getListingPhoto(event) {
  if (event.hasImage) {
    return { src: API.getUri({ url: `/events/${event._id}/image`, params: { v: event.updatedAt } }), alt: '' };
  }

  const image = event.image || event.banner || event.coverImage || event.poster;
  if (typeof image === 'string' && image.trim()) return { src: image.trim(), alt: '' };

  return isExpo(event) ? expoPhoto : eventPhoto;
}

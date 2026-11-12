import { AxiosError } from 'axios';
import { readAuthValue } from './previewSession';

const createdAt = new Date().toISOString();
const start = new Date(Date.now() + 14 * 86400000);
const date = start.toISOString().slice(0, 10);
const organizer = { _id: 'preview-organizer', name: 'Preview Organizer', email: 'organizer@example.invalid', role: 'organizer', createdAt };
const attendee = { _id: 'preview-attendee', name: 'Preview Attendee', email: 'attendee@example.invalid', role: 'attendee', createdAt };
const expo = {
  _id: 'preview-expo', listingType: 'expo', title: 'Preview Design & Technology Expo',
  category: 'Technology', description: 'Illustrative expo listing for inspecting the Admin workspace.',
  location: 'Example Convention Centre', date, time: '09:30', endTime: '17:00', organizer, createdAt,
};
const events = [
  expo,
  { ...expo, _id: 'preview-event', listingType: 'event', title: 'Preview Conference', category: 'Conference' },
];
const exhibitors = [
  { _id: 'preview-exhibitor', companyName: 'Preview Studio', category: 'Design', status: 'Approved',
    description: 'Sample exhibitor application.', products: 'Exhibition design', event: expo, contactPerson: organizer, boothNumber: 'A-01' },
  { _id: 'preview-applicant', companyName: 'Preview Labs', category: 'Technology', status: 'Pending',
    description: 'Sample application awaiting review.', event: expo, contactPerson: organizer },
];
const booths = [
  { _id: 'preview-booth-a', boothNumber: 'A-01', status: 'Reserved', reservedBy: exhibitors[0] },
  { _id: 'preview-booth-b', boothNumber: 'A-02', status: 'Available' },
];
const attendees = [
  { _id: 'preview-booking', event: expo, user: attendee, name: attendee.name, email: attendee.email,
    ticketType: 'VIP', status: 'Confirmed', guestCount: 1, details: 'Sample registration.', createdAt },
];
const session = {
  _id: 'preview-session-record', title: 'Preview keynote', description: 'Sample schedule entry.',
  speaker: 'Preview Speaker', topic: 'Design', location: 'Main stage',
  startTime: `${date}T10:00:00Z`, endTime: `${date}T11:00:00Z`,
};

function getPreviewData(path, config, account) {
  switch (path) {
    case '/auth/me': return { user: account };
    case '/auth/allusers': return { allUsers: [{ ...account, createdAt }, organizer, attendee] };
    case '/events/all': return { events };
    case '/exhibitors/all':
    case '/exhibitors/search': return { exhibitors };
    case '/attendees/all': return { attendees };
    case '/feedback/reviews': return { reviews: [] };
    case '/feedback/all': return { feedbacks: [{
      _id: 'preview-feedback', event: expo, name: attendee.name, email: attendee.email,
      type: 'feedback', status: 'Open', subject: 'Preview venue feedback', message: 'Sample feedback for the review panel.', createdAt,
    }] };
    case '/notifications/mine': return { unreadCount: 1, notifications: [{
      _id: 'preview-notification', title: 'Preview application received', message: 'Sample notification about an exhibitor application.', createdAt,
    }] };
    case '/messages/conversations': return { conversations: [{
      event: expo, participant: attendee, lastMessage: 'Sample inquiry about the expo schedule.', updatedAt: createdAt,
    }] };
    case '/analytics/summary': {
      const selectedEventId = config.params?.eventId || '';
      const conferenceOnly = selectedEventId === events[1]._id;
      const sessionStats = conferenceOnly ? [] : [{ ...session, eventTitle: expo.title, registrations: 1, bookmarks: 1 }];
      const exhibitorStats = conferenceOnly ? [] : [{ ...exhibitors[0], eventTitle: expo.title, visits: 1 }];
      return {
        events, selectedEventId, generatedAt: createdAt, sessionStats, exhibitorStats,
        analytics: {
          totalEvents: selectedEventId ? 1 : 2, attendeeRegistrations: conferenceOnly ? 0 : 1,
          exhibitorApplications: conferenceOnly ? 0 : 2, approvedApplications: conferenceOnly ? 0 : 1,
          pendingApplications: conferenceOnly ? 0 : 1, rejectedApplications: 0,
          totalBooths: conferenceOnly ? 0 : 2, reservedBooths: conferenceOnly ? 0 : 1,
          availableBooths: conferenceOnly ? 0 : 1, boothReservationRate: conferenceOnly ? 0 : 50,
          totalSessions: sessionStats.length, sessionRegistrations: sessionStats.length, sessionBookmarks: sessionStats.length,
          recordedBoothVisits: exhibitorStats.length, uniqueVisitingAttendees: exhibitorStats.length,
        },
      };
    }
    default: break;
  }

  if (path === `/messages/thread/${expo._id}/${attendee._id}`) {
    return { messages: [{ _id: 'preview-message', sender: attendee, text: 'Sample inquiry about the expo schedule.', createdAt }], nextBefore: null };
  }
  if (path === `/booths/event/${expo._id}`) return { booths };
  if (path === `/booths/layout/${expo._id}`) {
    return { layout: { rows: 3, columns: 4, revision: 1, placements: [
      { booth: booths[0]._id, row: 1, column: 1 },
      { booth: booths[1]._id, row: 1, column: 3 },
    ] } };
  }
  if (exhibitors.some(item => path === `/exhibitors/services/${item._id}`)) return { requests: [] };
  if (path.startsWith('/sessions/event/')) return { sessions: path.endsWith(expo._id) ? [session] : [] };
  if (path.startsWith('/events/')) {
    const event = events.find(item => path === `/events/${item._id}`);
    if (event) return { event };
  }
}

export function previewAdapter(config) {
  function response(data, status = 200) {
    return { data: structuredClone(data), status, statusText: String(status), headers: {}, config };
  }

  function reject(status, message) {
    throw new AxiosError(message, 'ERR_BAD_REQUEST', config, undefined, response({ msg: message }, status));
  }

  if (config.method !== 'get') reject(403, 'Changes are disabled in the read-only development preview.');
  const account = JSON.parse(readAuthValue('user'));
  const path = config.url;
  if (!account) {
    if (path === '/events/all') return response({ events: [] });
    if (path === '/feedback/reviews') return response({ reviews: [] });
    reject(401, 'Sign in to the development Admin preview.');
  }

  const data = getPreviewData(path, config, account);
  if (!data) reject(404, 'This request is unavailable in the development preview.');
  return response(data);
}

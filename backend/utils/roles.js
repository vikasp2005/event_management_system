import { Participant, EventCoordinator, VenueIncharge, Admin } from '../models/Users.model.js';


export const roles = {
    participant: Participant,
    event_coordinator: EventCoordinator,
    venue_incharge: VenueIncharge,
    admin: Admin,
};
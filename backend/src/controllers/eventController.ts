import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

// Pillar 3: Get all events (Seminars, Workshops, AMA talks)
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventType, targetAudience, upcomingOnly } = req.query;

    const where: any = {};
    if (eventType && typeof eventType === 'string' && eventType !== 'ALL') {
      where.eventType = eventType;
    }
    if (targetAudience && typeof targetAudience === 'string' && targetAudience !== 'ALL') {
      where.targetAudience = targetAudience;
    }
    if (upcomingOnly === 'true') {
      where.startTime = { gte: new Date() };
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    const transformed = events.map(evt => ({
      ...evt,
      registeredCount: evt._count.registrations,
      seatsRemaining: Math.max(0, evt.maxCapacity - evt._count.registrations),
      isSoldOut: evt._count.registrations >= evt.maxCapacity,
    }));

    res.json(transformed);
  } catch (error) {
    console.error('Get All Events Error:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};

// Get single event details
export const getEventDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.json({
      ...event,
      registeredCount: event._count.registrations,
      seatsRemaining: Math.max(0, event.maxCapacity - event._count.registrations),
      isSoldOut: event._count.registrations >= event.maxCapacity,
    });
  } catch (error) {
    console.error('Get Event Details Error:', error);
    res.status(500).json({ message: 'Failed to fetch event details' });
  }
};

// Register for event (RSVP)
export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: eventId } = req.params;
    const { attendeeName, attendeeEmail, organization, userId } = req.body;

    if (!attendeeName || !attendeeEmail) {
      res.status(400).json({ message: 'Attendee name and email are required' });
      return;
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } },
    });

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event._count.registrations >= event.maxCapacity) {
      res.status(400).json({ message: 'This seminar is fully booked. Registration is closed.' });
      return;
    }

    // Check existing registration
    const existing = await prisma.eventRegistration.findUnique({
      where: {
        eventId_attendeeEmail: {
          eventId,
          attendeeEmail,
        },
      },
    });

    if (existing) {
      res.status(400).json({ message: 'You are already registered for this event.' });
      return;
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        attendeeName,
        attendeeEmail,
        organization: organization || null,
        userId: userId || null,
      },
    });

    res.status(201).json({
      message: `Registration confirmed for "${event.title}". A calendar invitation will be dispatched to ${attendeeEmail}.`,
      registration,
      joiningInfo: event.locationOrUrl || 'Link will be sent 24h prior to the session.',
    });
  } catch (error) {
    console.error('Register For Event Error:', error);
    res.status(500).json({ message: 'Failed to register for event' });
  }
};

// Admin: Create Event
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      speakerName,
      speakerTitle,
      speakerAvatar,
      speakerBio,
      eventType,
      targetAudience,
      startTime,
      endTime,
      isVirtual,
      locationOrUrl,
      maxCapacity,
      bannerUrl,
    } = req.body;

    if (!title || !description || !speakerName || !speakerTitle || !startTime || !endTime) {
      res.status(400).json({
        message: 'title, description, speakerName, speakerTitle, startTime, and endTime are required.',
      });
      return;
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        speakerName,
        speakerTitle,
        speakerAvatar: speakerAvatar || null,
        speakerBio: speakerBio || null,
        eventType: eventType || 'SEMINAR',
        targetAudience: targetAudience || 'PROFESSIONAL',
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        isVirtual: isVirtual !== undefined ? isVirtual : true,
        locationOrUrl: locationOrUrl || null,
        maxCapacity: maxCapacity ? parseInt(maxCapacity, 10) : 100,
        bannerUrl: bannerUrl || null,
      },
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Create Event Error:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
};

// Admin: Get registered attendees for event
export const getEventAttendees = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: eventId } = req.params;

    const attendees = await prisma.eventRegistration.findMany({
      where: { eventId },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(attendees);
  } catch (error) {
    console.error('Get Event Attendees Error:', error);
    res.status(500).json({ message: 'Failed to fetch attendees' });
  }
};

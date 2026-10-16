import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token if available in localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Types & Interfaces
export type TargetAudience = 'K12' | 'HIGHER_ED' | 'PROFESSIONAL';
export type DeliveryMode = 'SELF_PACED' | 'COHORT_BASED' | 'HYBRID' | 'IN_PERSON';
export type CourseRequestStatus = 'PENDING_REVIEW' | 'APPROVED' | 'UNAVAILABLE' | 'NO_INSTRUCTOR_AVAILABLE' | 'PROPOSAL_SENT' | 'REJECTED';
export type PrintItemType = 'SUMMARY_BOOKLET' | 'FULL_LECTURE_NOTES' | 'STUDY_GUIDE' | 'VERIFIED_PHYSICAL_CERTIFICATE';
export type PrintOrderStatus = 'ORDER_RECEIVED' | 'PRINTING_IN_PROGRESS' | 'DISPATCHED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
export type EventType = 'SEMINAR' | 'WORKSHOP' | 'MENTOR_TALK' | 'CAREER_PANEL';
export type InstructorAppStatus = 'NEW_APPLICATION' | 'UNDER_REVIEW' | 'INTERVIEW_SCHEDULED' | 'APPROVED' | 'REJECTED';

export interface Course {
  id: string;
  title: string;
  description: string;
  syllabus: string;
  price: number;
  category: string;
  targetAudience: TargetAudience;
  deliveryMode: DeliveryMode;
  startDate?: string | null;
  endDate?: string | null;
  durationWeeks?: number | null;
  hoursPerWeek?: number | null;
  scheduleDetails?: string | null;
  inclusions: string[];
  exclusions: string[];
  prerequisites: string[];
  gradingCriteria?: string | null;
  attendancePolicy?: string | null;
  materialPrice?: number | null;
  instructorId: string;
  instructor?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
    bio?: string | null;
    title?: string | null;
    organization?: string | null;
    academicCredentials?: string | null;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    websiteUrl?: string | null;
  };
  avgRating?: string | null;
  reviewCount?: number;
  totalLessons?: number;
  modules?: Array<{
    id: string;
    title: string;
    order: number;
    lessons: Array<{ id: string; title: string; order: number }>;
    quizzes?: Array<{ id: string; title: string }>;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: { name: string; avatarUrl?: string | null };
  }>;
}

export interface CourseRequest {
  id: string;
  requesterName: string;
  email: string;
  phone?: string | null;
  organization?: string | null;
  targetAudience: TargetAudience;
  topic: string;
  studentCount: number;
  neededTimeframe: string;
  deliveryMode: DeliveryMode;
  specificRequirements?: string | null;
  status: CourseRequestStatus;
  adminNotes?: string | null;
  assignedInstructorId?: string | null;
  assignedInstructor?: {
    id: string;
    name: string;
    email: string;
    title?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface PrintOrder {
  id: string;
  userId: string;
  courseId?: string | null;
  course?: { title: string } | null;
  user?: { name: string; email: string } | null;
  itemType: PrintItemType;
  quantity: number;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  totalAmount: number;
  paymentStatus: string;
  status: PrintOrderStatus;
  trackingNumber?: string | null;
  carrier?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformEvent {
  id: string;
  title: string;
  description: string;
  speakerName: string;
  speakerTitle: string;
  speakerAvatar?: string | null;
  speakerBio?: string | null;
  eventType: EventType;
  targetAudience: TargetAudience;
  startTime: string;
  endTime: string;
  isVirtual: boolean;
  locationOrUrl?: string | null;
  maxCapacity: number;
  bannerUrl?: string | null;
  registeredCount: number;
  seatsRemaining: number;
  isSoldOut: boolean;
  createdAt: string;
}

export interface InstructorApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  currentAffiliation: string;
  highestDegree: string;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  resumeUrl?: string | null;
  courseProposalTitle: string;
  courseProposalSummary: string;
  sampleVideoUrl?: string | null;
  targetAudience: TargetAudience;
  status: InstructorAppStatus;
  reviewNotes?: string | null;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  studentName: string;
  studentRole: string;
  companyOrSchool: string;
  avatarUrl?: string | null;
  quote: string;
  rating: number;
  isFeatured: boolean;
  course?: { id: string; title: string } | null;
  createdAt: string;
}

// Typed Service Helpers
export const courseRequestsApi = {
  submit: (data: Partial<CourseRequest>) => api.post('/course-requests', data),
  getAll: (params?: { status?: string; targetAudience?: string }) =>
    api.get<CourseRequest[]>('/course-requests', { params }),
  updateStatus: (id: string, data: { status?: CourseRequestStatus; adminNotes?: string; assignedInstructorId?: string | null }) =>
    api.patch(`/course-requests/${id}/status`, data),
};

export const deliveryApi = {
  createOrder: (data: Partial<PrintOrder>) => api.post('/delivery/orders', data),
  getMyOrders: () => api.get<PrintOrder[]>('/delivery/my-orders'),
  getAllOrders: (params?: { status?: string }) => api.get<PrintOrder[]>('/delivery/admin/orders', { params }),
  updateOrderStatus: (id: string, data: { status?: PrintOrderStatus; carrier?: string; trackingNumber?: string }) =>
    api.patch(`/delivery/admin/orders/${id}`, data),
};

export const eventsApi = {
  getAll: (params?: { eventType?: string; targetAudience?: string; upcomingOnly?: boolean }) =>
    api.get<PlatformEvent[]>('/events', { params }),
  getById: (id: string) => api.get<PlatformEvent>(`/events/${id}`),
  register: (id: string, data: { attendeeName: string; attendeeEmail: string; organization?: string; userId?: string }) =>
    api.post(`/events/${id}/register`, data),
  create: (data: Partial<PlatformEvent>) => api.post('/events', data),
  getAttendees: (id: string) => api.get(`/events/${id}/attendees`),
};

export const instructorApplicationsApi = {
  submit: (data: Partial<InstructorApplication>) => api.post('/instructor-applications/apply', data),
  getAll: (params?: { status?: string }) => api.get<InstructorApplication[]>('/instructor-applications/admin', { params }),
  updateStatus: (id: string, data: { status?: InstructorAppStatus; reviewNotes?: string }) =>
    api.patch(`/instructor-applications/admin/${id}`, data),
};

export const testimonialsApi = {
  getFeatured: (params?: { courseId?: string }) => api.get<Testimonial[]>('/testimonials', { params }),
  submit: (data: Partial<Testimonial>) => api.post('/testimonials', data),
};

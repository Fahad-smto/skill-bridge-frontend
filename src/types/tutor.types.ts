// types/tutor.types.ts
export interface ITutorProfile {
  id: number;
  userId: number;
  bio: string;
  hourlyRate: number;
  subjects: string[];
  rating: number;
  totalSessions: number;
  isAvailable: boolean;
  experience?: number;
  education?: string;
  languages?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IAvailability {
  id: number;
  tutorId: number;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isRecurring: boolean;
  date?: string; // for non-recurring slots
}

export interface IBooking {
  id: number;
  studentId: number;
  tutorProfileId: number;
  duration: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  scheduledAt: string;
  createdAt: string;
  student?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface IReview {
  id: number;
  bookingId: number;
  rating: number;
  comment: string;
  createdAt: string;
  student?: {
    name: string;
    avatar?: string;
  };
}

export interface ITutorStats {
  totalStudents: number;
  totalEarnings: number;
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  averageRating: number;
  weeklySchedule: {
    day: string;
    sessions: number;
  }[];
}
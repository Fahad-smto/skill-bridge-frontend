// types/admin.types.ts
export interface IUser {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  isBanned: boolean;
  createdAt: string;
  profile?: {
    bio?: string;
    hourlyRate?: number;
    subjects?: string[];
  };
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
    name: string;
    email: string;
  };
  tutorProfile?: {
    user?: {
      name: string;
      email: string;
    };
  };
}

export interface ICategory {
  id: number;
  name: string;
  icon: string;
  _count?: {
    tutors: number;
  };
}

export interface IStats {
  totalStudents: number;
  totalTutors: number;
  totalBookings: number;
  totalRevenue: number;
  completedBookings: number;
  totalBanned: number;
  totalCategories: number;
}
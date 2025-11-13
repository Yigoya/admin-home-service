export type User = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  profileImage?: string | null;
  role: 'ADMIN' | 'OPERATOR' | 'CUSTOMER' | 'TECHNICIAN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';
  language?: 'ENGLISH' | 'AMHARIC';
  createdAt?: string;
  updatedAt?: string;
};

// Password reset types
export type PasswordResetRequest = {
  email: string;
};

export type PasswordReset = {
  token: string;
  password: string;
};

// Auth related types
export type LoginRequest = {
  email: string;
  password: string;
  FCMToken: string;
  deviceType: string;
  deviceModel: string;
  operatingSystem: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type Customer = User & {
  preferredLanguage?: string;
  addresses?: Address[];
  // Additional optional fields used by UI
  customerId?: number;
  address?: Address;
  bookings?: number;
  services?: Service[];
};

export type Technician = User & {
  bio?: string;
  availability?: boolean;
  services?: Service[];
  documents?: string[];
  idCardImage?: string;
  city?: string;
  subcity?: string;
  wereda?: string;
  verified?: boolean;
  weeklySchedule?: WeeklySchedule;
  ratings?: number;
  // Additional optional fields used by UI
  technicianId?: number;
  address?: Address;
  rating?: number;
  completedJobs?: number;
};

export type Operator = User & {
  bio?: string;
  documents?: string[];
  idCardImage?: string;
};

export type Address = {
  id: number;
  street: string;
  city: string;
  subcity?: string;
  wereda?: string;
  state: string;
  country: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
};

export type WeeklySchedule = {
  mondayStart?: string;
  mondayEnd?: string;
  tuesdayStart?: string;
  tuesdayEnd?: string;
  wednesdayStart?: string;
  wednesdayEnd?: string;
  thursdayStart?: string;
  thursdayEnd?: string;
  fridayStart?: string;
  fridayEnd?: string;
  saturdayStart?: string;
  saturdayEnd?: string;
  sundayStart?: string;
  sundayEnd?: string;
};

export type ServiceCategory = {
  id: number;
  name: string;
  description: string;
  icon: string;
  isMobileCategory?: boolean;
  translations?: { [key: string]: { name: string; description: string } };
};

export type Service = {
  id: number;
  name: string;
  description: string;
  icon: string;
  serviceFee: number;
  estimatedDuration: string;
  categoryId: number;
  category?: ServiceCategory;
  translations?: { [key: string]: { name: string; description: string } };
};

export type Booking = {
  id: number;
  customerId: number;
  technicianId: number;
  serviceId: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED' | 'ASSIGNED' | 'IN_PROGRESS' | 'CANCELED';
  description?: string;
  scheduledDate: string;
  serviceLocation: Address;
  totalCost: number;
  timeSchedule?: string;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  technician?: Technician;
  service?: Service | string;
  // Additional optional fields used by UI
  bookingId?: number;
  review?: { rating?: number; comment?: string; createdAt?: string };
};

export type Review = {
  id: number;
  bookingId: number;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  technician?: Technician;
};

export type Dispute = {
  id: number;
  bookingId: number;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  booking?: Booking;
  // Optional fields used by UI
  disputeId?: number;
  reason?: string;
  technician?: Technician;
};

export type ContactUs = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  createdAt: string;
};

export type Tender = {
  id: number;
  title: string;
  description: string;
  location: string;
  closingDate: string;
  contactInfo: string;
  status: 'OPEN' | 'CLOSED';
  categoryId: number;
  documentUrl?: string;
  datePosted: string;
  category?: ServiceCategory;
};

export type TenderAgency = {
  id: number;
  companyName: string;
  tinNumber: string;
  contactPerson: string;
  email: string;
  phoneNumber?: string;
  website?: string;
  businessLicenseUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
};

export type Dashboard = {
  totalTechnicians: number;
  totalCustomers: number;
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalDisputes: number;
  openDisputes: number;
  resolvedDisputes: number;
  totalRevenue: number;
  customerGrowth: { date: string; count: number }[];
  technicianGrowth: { date: string; count: number }[];
  bookingsByService: { serviceName: string; count: number }[];
  revenueByMonth: { month: string; revenue: number }[];
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
};

export type PaginatedResponse<T> = {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
};

// Convenience exported unions used across pages
export type BookingStatus = Booking['status'];
export type DisputeStatus = 'PENDING' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED' | 'OPEN' | 'IN_PROGRESS';

export type Business = {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  location: {
    name: string;
    latitude: number;
    longitude: number;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phoneNumber: string;
  email: string;
  website?: string;
  openingHours: {
    mondayOpen?: string;
    mondayClose?: string;
    tuesdayOpen?: string;
    tuesdayClose?: string;
    wednesdayOpen?: string;
    wednesdayClose?: string;
    thursdayOpen?: string;
    thursdayClose?: string;
    fridayOpen?: string;
    fridayClose?: string;
    saturdayOpen?: string;
    saturdayClose?: string;
    sundayOpen?: string;
    sundayClose?: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  images: string[];
  isVerified: boolean;
  isFeatured: boolean;
  categories: ServiceCategory[];
  createdAt: string;
  updatedAt: string;
};

export type BusinessService = {
  id: number;
  name: string;
  description: string;
  price: number;
  businessId: number;
  categoryId: number;
  imageUrl: string;
  serviceOptions?: {
    name: string;
    price: number;
    description: string;
  }[];
  available: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BusinessReview = {
  id: number;
  businessId: number;
  userId: number;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  user?: User;
}; 
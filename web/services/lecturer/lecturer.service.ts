export interface LecturerPosition {
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lecturer {
  id: number;
  createdAt: string;
  updatedAt: string;
  lecturerId: string | null;
  positionId: string | null;
  level: string | null;
  userDetail: {
    username: string;
    firstname: string;
    lastname: string;
    gender: number | null;
    email: string | null;
    address: string | null;
    phone: string | null;
    status: number;
    isAdmin: number;
    userType: number;
  };
  position: LecturerPosition | null;
}

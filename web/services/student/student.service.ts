export interface Student {
  id: number;
  createdAt: string;
  updatedAt: string;
  studentId: string | null;
  schoolYear: number | null;
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
}

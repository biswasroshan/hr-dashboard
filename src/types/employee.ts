
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  phone: string;
  image: string;
  address: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    country: string;
  };
  department: string;
  rating: number;
  role: string;
  bio: string;
  joinDate: string;
}

export interface Project {
  id: number;
  name: string;
  status: 'active' | 'completed' | 'pending';
  progress: number;
  deadline: string;
}

export interface Feedback {
  id: number;
  author: string;
  date: string;
  rating: number;
  comment: string;
  type: 'peer' | 'manager' | 'self';
}

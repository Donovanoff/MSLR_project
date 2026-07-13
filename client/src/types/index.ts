export interface RegistrationData {
  email: string;
  fullName: string;
  dob: string;
  password: string;
  scc: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  hasVotedIn: string[];
}

export interface Option {
  id: string;
  text: string;
  votes: number;
}

export interface Referendum {
  _id: string;
  title: string;
  description: string;
  status: string;
  options: Option[];
}

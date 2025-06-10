export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
};

export type UserFormData = {
  name: string;
  email: string;
  role: string;
  department: string;
};

export type ValidationErrors = {
  name?: string;
  email?: string;
  role?: string;
};

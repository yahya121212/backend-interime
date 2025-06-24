export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  CANDIDATE = 'candidate',
  COMPANYEMPLOYEE = 'company-employee',
  AGENCYEMPLOYEE = 'agency-employee',
}

type USER = {
  id: string;
  email: string;
  password: string;
  role: Role;
};

export interface IAuthenticate {
  user: USER;
  token: string;
}

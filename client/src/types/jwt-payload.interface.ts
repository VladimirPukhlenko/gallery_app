export interface UserJwtPayload {
  email: string;
  fullName: string;
  _id: string;
  iat: number;
  exp: number;
}

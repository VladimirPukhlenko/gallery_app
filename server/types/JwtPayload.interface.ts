export interface JwtPayloadRecovery {
  _id: string;
  key: string;
  iat: number;
  exp: number;
}

export interface JwtPayload {
  email: string;
  fullName: string;
  _id: string;
  iat: number;
  exp: number;
}

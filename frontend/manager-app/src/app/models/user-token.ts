export interface UserToken {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  username: string;
  is_admin: boolean;
}

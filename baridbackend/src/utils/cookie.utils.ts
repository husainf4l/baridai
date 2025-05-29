import { Response, Request } from 'express';

// Cookie options for security
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' as const : 'lax' as const,
  maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
  path: '/'
};

// Set user ID cookie for OAuth flows
export const setUserIdCookie = (res: Response, userId: string): void => {
  res.cookie('userId', userId, COOKIE_OPTIONS);
};

// Get user ID from cookie
export const getUserIdFromCookie = (req: Request): string | null => {
  return req.cookies?.userId || null;
};

// Clear user ID cookie
export const clearUserIdCookie = (res: Response): void => {
  res.clearCookie('userId', { path: '/' });
};

// Set access and refresh token cookies
export const setAuthCookies = (
  res: Response, 
  accessToken: string,
  refreshToken?: string
): void => {
  // Set access token with shorter expiry
  res.cookie('accessToken', accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  
  // Set refresh token with longer expiry if provided
  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
    });
  }
};

// Clear auth cookies
export const clearAuthCookies = (res: Response): void => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
};

export default {
  setUserIdCookie,
  getUserIdFromCookie,
  clearUserIdCookie,
  setAuthCookies,
  clearAuthCookies
};

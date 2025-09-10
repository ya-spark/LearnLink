import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK (for server-side verification)
// Note: In production, you'd need to set up service account credentials
// For development, we'll use a simple approach with client-side tokens

export interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
    email?: string;
    name?: string;
  };
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // In a real implementation, you'd verify the Firebase token here
    // For now, we'll use a simplified approach where the frontend sends user data
    const userClaims = JSON.parse(decodeURIComponent(token));
    
    (req as AuthenticatedRequest).user = userClaims;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};
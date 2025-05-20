// src/types/express/index.d.ts
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: {
      userId: string;
      email: string;
      role: string;
    };
  }
}
declare namespace Express {
  export interface User {
    userId: string;
    email?: string;
    role?: string;
  }
}

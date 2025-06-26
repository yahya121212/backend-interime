import { join } from 'path';

export const FRONT_BASE_URL = 'https://www.interim-online.fr';

export const FRONT_LOGIN = `${FRONT_BASE_URL}/auth/login`;

export const ANGULAR_VIEW_lINK = `${FRONT_BASE_URL}/auth/verify-otp`;
export const ANGULAR_RESET_PASSWORD_VIEW = `${FRONT_BASE_URL}/reset-password`;

export const INSEE_TOKEN_URL = 'https://api.insee.fr/token';

export const APP_NAME = 'Interim-Online';
export const APP_PHONE = '+33 1 40 34 10 45';
export const APP_EMAIL = 'contact@interim-online-pro-tech.com';

// Upload File
export const FILE_UPLOAD_DIR = join(process.cwd(), 'src', 'uploads');
export const COVER_UPLOAD_DIR = join(process.cwd(), 'src', 'uploads/covers');
export const IMAGE_UPLOAD_DIR = join(process.cwd(), 'src', 'uploads/images');

export const CORS_CONFIG = {
  origin: [FRONT_BASE_URL],
  credentials: true,
  methods: 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
  exposedHeaders: 'Content-Range,X-Content-Range',
  maxAge: 3600,
};

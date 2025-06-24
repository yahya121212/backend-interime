import { join } from 'path';

export const isProduction = process.env.NODE_ENV === 'production';

export const APP_HOST = 'http://localhost';

export const FRONT_BASE_URL = isProduction
  ? 'https://agile-attitude.com/'
  : `${APP_HOST}:4200`;

export const BACK_BASE_URL = isProduction
  ? 'https://agile-attitude.com/api'
  : `${APP_HOST}:3000/api`;

export const FRONT_LOGIN = `${FRONT_BASE_URL}/auth/login`;
export const FRONT_OFFER_URL = `${FRONT_BASE_URL}/freelancer/project-details`;
export const CANDIDATE_URL = `${FRONT_BASE_URL}/employer/developer-details`;

export const ANGULAR_VIEW_lINK = `${FRONT_BASE_URL}/auth/verify-otp`;
export const ANGULAR_RESET_PASSWORD_VIEW = `${FRONT_BASE_URL}/reset-password`;

export const INSEE_TOKEN_URL = 'https://api.insee.fr/token';

export const APP_LOGO = `${BACK_BASE_URL}/uploads/images/interim.png`;
export const APP_NAME = 'Interim-Online';
export const APP_PHONE = '+33 1 40 34 10 45';
export const APP_EMAIL = 'recrutement@interim-online.fr';

// Upload File
export const FILE_UPLOAD_DIR = join(process.cwd(), 'src', 'uploads/cvs');
export const COVER_UPLOAD_DIR = join(process.cwd(), 'src', 'uploads/covers');
export const IMAGE_UPLOAD_DIR = join(process.cwd(), 'src', 'uploads/images');

export const CORS_CONFIG = {
  origin: [
    FRONT_BASE_URL,
    'http://46.202.129.82:4200',
    'https://agile-attitude.com',
  ],
  credentials: true,
  methods: 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
  exposedHeaders: 'Content-Range,X-Content-Range',
  maxAge: 3600,
};

# Management Portal

A Next.js management portal with user authentication, registration, and verification workflows.

## Features

- ✅ User login with email/password
- ✅ Email verification flow
- ✅ User registration with multi-step process
- ✅ Phone number verification
- ✅ Dashboard with user profile
- ✅ CAPTCHA support (optional, with development bypass)
- ✅ API proxy for CORS handling
- ✅ Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your configuration:
   ```bash
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
   NEXT_PUBLIC_USE_PROXY=true
   NEXT_PUBLIC_ENABLE_LOGGING=true

   # CAPTCHA Configuration (Optional)
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
   RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

### Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: Your backend API URL
- `NEXT_PUBLIC_USE_PROXY`: Enable API proxy for CORS (true/false)
- `NEXT_PUBLIC_ENABLE_LOGGING`: Enable API logging (true/false)
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`: Google reCAPTCHA site key (optional)
- `RECAPTCHA_SECRET_KEY`: Google reCAPTCHA secret key (optional)

### CAPTCHA Setup

CAPTCHA is optional. If not configured, the app will run in development mode with CAPTCHA bypass.

To enable CAPTCHA:
1. Get keys from [Google reCAPTCHA](https://www.google.com/recaptcha/)
2. Add the keys to your `.env.local` file
3. The app will automatically detect and use CAPTCHA

## API Integration

The app integrates with your backend API for:
- User authentication (`/users/auth/login-initiate`, `/users/auth/login-verify`)
- User registration (`/users/register`)
- Email verification (`/users/verify-email`)
- Phone verification (`/users/send-phone-verification`, `/users/verify-phone`)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # User dashboard
│   ├── register/          # Registration page
│   ├── verify/            # Email verification page
│   └── api/               # API routes
├── components/            # React components
│   ├── LoginForm.tsx      # Login component
│   ├── RegisterForm.tsx   # Registration component
│   └── CaptchaWidget.tsx  # CAPTCHA component
└── lib/                   # Utilities and configurations
    ├── api.ts             # API client
    ├── config.ts          # App configuration
    └── captchaService.ts  # CAPTCHA service
```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set production environment variables in your deployment platform

3. Deploy to your preferred platform (Vercel, Netlify, etc.)

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT

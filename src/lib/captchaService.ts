interface CaptchaProvider {
  secretKey: string | undefined;
  verifyUrl: string;
}

interface CaptchaProviders {
  recaptcha: CaptchaProvider;
  hcaptcha: CaptchaProvider;
}

/**
 * CAPTCHA verification service
 * Supports multiple CAPTCHA providers (Google reCAPTCHA, hCaptcha, etc.)
 */
class CaptchaService {
  private providers: CaptchaProviders;

  constructor() {
    this.providers = {
      recaptcha: {
        secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
        verifyUrl: 'https://www.google.com/recaptcha/api/siteverify'
      },
      hcaptcha: {
        secretKey: process.env.HCAPTCHA_SECRET_KEY,
        verifyUrl: 'https://hcaptcha.com/siteverify'
      }
    };
  }

  /**
   * Verify CAPTCHA token
   * @param token - CAPTCHA token from client
   * @param provider - CAPTCHA provider (recaptcha, hcaptcha)
   * @param remoteIp - Client IP address
   * @returns Whether verification was successful
   */
  async verifyToken(token: string, provider: keyof CaptchaProviders = 'recaptcha', remoteIp: string | null = null): Promise<boolean> {
    try {
      const config = this.providers[provider];
      if (!config || !config.secretKey) {
        console.warn(`CAPTCHA provider ${provider} not configured`);
        return true; // Skip verification if not configured
      }

      const formData = new URLSearchParams();
      formData.append('secret', config.secretKey);
      formData.append('response', token);
      if (remoteIp) {
        formData.append('remoteip', remoteIp);
      }

      const response = await fetch(config.verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const result = await response.json();
      
      return result.success === true;
    } catch (error) {
      console.error('CAPTCHA verification error:', error);
      return false;
    }
  }

  /**
   * Simple CAPTCHA validation for development/testing
   * @param token - CAPTCHA token
   * @returns Whether token is valid
   */
  validateSimpleCaptcha(token: string): boolean {
    // For development/testing, accept any non-empty token
    // In production, this should be replaced with actual CAPTCHA verification
    return Boolean(token && token.length > 0);
  }
}

export default new CaptchaService();
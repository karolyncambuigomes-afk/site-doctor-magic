/**
 * Secure error handling utility that prevents sensitive information exposure
 */

interface ErrorDetails {
  message: string;
  code?: string;
  statusCode?: number;
}

/**
 * Sanitizes error messages to prevent information disclosure
 * @param error - The original error
 * @returns Sanitized error object safe for client display
 */
export const sanitizeError = (error: any): ErrorDetails => {
  // Default secure error message
  const defaultError: ErrorDetails = {
    message: 'An unexpected error occurred. Please try again.',
    statusCode: 500
  };

  if (!error) return defaultError;

  // Handle known Supabase auth errors
  if (error.message) {
    const message = error.message.toLowerCase();
    
    // Safe authentication errors
    if (message.includes('invalid login credentials')) {
      return { message: 'Invalid email or password.', statusCode: 401 };
    }
    
    if (message.includes('email not confirmed')) {
      return { message: 'Please check your email and click the confirmation link.', statusCode: 400 };
    }
    
    if (message.includes('user already registered')) {
      return { message: 'An account with this email already exists.', statusCode: 409 };
    }
    
    if (message.includes('weak password')) {
      return { message: 'Password is too weak. Please choose a stronger password.', statusCode: 400 };
    }
    
    if (message.includes('invalid email')) {
      return { message: 'Please enter a valid email address.', statusCode: 400 };
    }
    
    // Access denied errors
    if (message.includes('access denied') || message.includes('permission denied')) {
      return { message: 'You do not have permission to perform this action.', statusCode: 403 };
    }
    
    // Rate limiting
    if (message.includes('rate limit') || message.includes('too many requests')) {
      return { message: 'Too many requests. Please wait a moment and try again.', statusCode: 429 };
    }
  }

  // For any other errors, return generic message to prevent information disclosure
  return defaultError;
};

/**
 * Logs errors securely without exposing sensitive data
 * @param error - The error to log
 * @param context - Additional context for debugging
 */
export const logSecureError = (error: any, context?: string) => {
  // In production, this would send to a secure logging service
  console.error('Security Error:', {
    timestamp: new Date().toISOString(),
    context,
    error: error?.code || 'UNKNOWN_ERROR',
    // Don't log full error details in production
    sanitizedMessage: sanitizeError(error).message
  });
};
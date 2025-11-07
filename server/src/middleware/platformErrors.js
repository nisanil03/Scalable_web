// Platform error definitions with their status codes
const PLATFORM_ERRORS = {
  FUNCTION_THROTTLED: { status: 500, code: 'FUNCTION_THROTTLED', message: 'Function execution throttled' },
  INTERNAL_CACHE_ERROR: { status: 500, code: 'INTERNAL_CACHE_ERROR', message: 'Internal cache error occurred' },
  INTERNAL_CACHE_KEY_TOO_LONG: { status: 500, code: 'INTERNAL_CACHE_KEY_TOO_LONG', message: 'Cache key exceeds maximum length' },
  INTERNAL_CACHE_LOCK_FULL: { status: 500, code: 'INTERNAL_CACHE_LOCK_FULL', message: 'Cache lock limit reached' },
  INTERNAL_CACHE_LOCK_TIMEOUT: { status: 500, code: 'INTERNAL_CACHE_LOCK_TIMEOUT', message: 'Cache lock timeout occurred' },
  INTERNAL_DEPLOYMENT_FETCH_FAILED: { status: 500, code: 'INTERNAL_DEPLOYMENT_FETCH_FAILED', message: 'Failed to fetch deployment' },
  INTERNAL_EDGE_FUNCTION_INVOCATION_FAILED: { status: 500, code: 'INTERNAL_EDGE_FUNCTION_INVOCATION_FAILED', message: 'Edge function invocation failed' },
  INTERNAL_EDGE_FUNCTION_INVOCATION_TIMEOUT: { status: 500, code: 'INTERNAL_EDGE_FUNCTION_INVOCATION_TIMEOUT', message: 'Edge function timed out' },
  INTERNAL_FUNCTION_INVOCATION_FAILED: { status: 500, code: 'INTERNAL_FUNCTION_INVOCATION_FAILED', message: 'Function invocation failed' },
  INTERNAL_FUNCTION_INVOCATION_TIMEOUT: { status: 500, code: 'INTERNAL_FUNCTION_INVOCATION_TIMEOUT', message: 'Function invocation timed out' },
  INTERNAL_FUNCTION_NOT_FOUND: { status: 500, code: 'INTERNAL_FUNCTION_NOT_FOUND', message: 'Function not found' },
  INTERNAL_FUNCTION_NOT_READY: { status: 500, code: 'INTERNAL_FUNCTION_NOT_READY', message: 'Function not ready' },
  INTERNAL_FUNCTION_SERVICE_UNAVAILABLE: { status: 500, code: 'INTERNAL_FUNCTION_SERVICE_UNAVAILABLE', message: 'Function service unavailable' },
  INTERNAL_MICROFRONTENDS_BUILD_ERROR: { status: 500, code: 'INTERNAL_MICROFRONTENDS_BUILD_ERROR', message: 'Microfrontends build error' },
  INTERNAL_MICROFRONTENDS_INVALID_CONFIGURATION_ERROR: { status: 500, code: 'INTERNAL_MICROFRONTENDS_INVALID_CONFIGURATION_ERROR', message: 'Invalid microfrontends configuration' },
  INTERNAL_MICROFRONTENDS_UNEXPECTED_ERROR: { status: 500, code: 'INTERNAL_MICROFRONTENDS_UNEXPECTED_ERROR', message: 'Unexpected microfrontends error' },
  INTERNAL_MISSING_RESPONSE_FROM_CACHE: { status: 500, code: 'INTERNAL_MISSING_RESPONSE_FROM_CACHE', message: 'Missing cache response' },
  INTERNAL_OPTIMIZED_IMAGE_REQUEST_FAILED: { status: 500, code: 'INTERNAL_OPTIMIZED_IMAGE_REQUEST_FAILED', message: 'Image optimization request failed' },
  INTERNAL_ROUTER_CANNOT_PARSE_PATH: { status: 500, code: 'INTERNAL_ROUTER_CANNOT_PARSE_PATH', message: 'Unable to parse route path' },
  INTERNAL_STATIC_REQUEST_FAILED: { status: 500, code: 'INTERNAL_STATIC_REQUEST_FAILED', message: 'Static content request failed' },
  INTERNAL_UNARCHIVE_FAILED: { status: 500, code: 'INTERNAL_UNARCHIVE_FAILED', message: 'Failed to unarchive content' },
  INTERNAL_UNEXPECTED_ERROR: { status: 500, code: 'INTERNAL_UNEXPECTED_ERROR', message: 'An unexpected error occurred' }
};

class PlatformError extends Error {
  constructor(code) {
    const error = PLATFORM_ERRORS[code] || PLATFORM_ERRORS.INTERNAL_UNEXPECTED_ERROR;
    super(error.message);
    this.name = 'PlatformError';
    this.code = error.code;
    this.status = error.status;
  }
}

// Helper to check if an error is a platform error
const isPlatformError = (code) => {
  return code in PLATFORM_ERRORS;
};

module.exports = {
  PlatformError,
  isPlatformError,
  PLATFORM_ERRORS
};
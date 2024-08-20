export const SHOULD_HANDLE_ERROR = [401, 403, 404, 429];

export const ERROR_CODES = {
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	TOO_MANY_REQUESTS: 429,
	INTERNAL_SERVER_ERROR: 500,
	SERVICE_UNAVAILABLE: 503,
} as const;

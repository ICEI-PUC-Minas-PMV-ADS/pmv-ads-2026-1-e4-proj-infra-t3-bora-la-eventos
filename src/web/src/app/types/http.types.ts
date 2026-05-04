export type HttpMethod =
	| "GET"
	| "POST"
	| "PUT"
	| "PATCH"
	| "DELETE"
	| "OPTIONS"
	| "HEAD";

export enum LoginResponse {
	INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
}

export enum CreateUserResponse {
	USER_REGISTERED_SUCCESSFULLY = "USER_REGISTERED_SUCCESSFULLY",
	EMAIL_ALREADY_IN_USE = "EMAIL_ALREADY_IN_USE",
	DOCUMENT_ALREADY_IN_USE = "DOCUMENT_ALREADY_IN_USE",
	INVALID_DOCUMENT = "INVALID_DOCUMENT",
}

export type DefaultHttpResponse<T> = {
	message: T;
	code?: string; 
}
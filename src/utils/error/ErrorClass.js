export class ErrorClass extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.cause = statusCode; // For compatibility with the global error handler
    }
} 
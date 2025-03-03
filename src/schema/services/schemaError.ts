export interface SchemaErrorDetails {
    /** Path to the problematic property (e.g., 'pages.en.homepage.minify[0]') */
    path: string;

    /** The value that způsobila chybu */
    value?: unknown;

    /** Expected value or type information */
    expected?: unknown;

    /** Additional context about the error */
    context?: Record<string, unknown>;
}

/**
 * Error thrown when schema validation fails
 */
export class SchemaError extends Error {
    /** Detailed information about the schema error */
    details?: SchemaErrorDetails;

    /**
     * Creates a new SchemaError instance
     *
     * @param message - Human-readable error message
     * @param details - Optional structured error details
     */
    constructor(message: string, details?: SchemaErrorDetails) {
        super(message);
        this.name = 'SchemaError';
        this.details = details;
    }

    /**
     * Returns a formatted representation of the error path
     */
    getPathString(): string {
        return this.details?.path || 'unknown';
    }

    /**
     * Returns detailed description including the path and expected values
     */
    getDetailedMessage(): string {
        if (!this.details) {
            return this.message;
        }

        let detailedMessage = `Error at '${this.details.path}': ${this.message}`;

        if (this.details.value !== undefined) {
            detailedMessage += `\nReceived: ${JSON.stringify(this.details.value)}`;
        }

        if (this.details.expected !== undefined) {
            detailedMessage += `\nExpected: ${JSON.stringify(this.details.expected)}`;
        }

        return detailedMessage;
    }
}

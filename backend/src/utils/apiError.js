class apiError extends Error {
    constructor(
        statusCode,
        message = "something went wrong",
        errors = [],
        stack = ""
    ) {
        // constructor implementation
        super(message);
        this.statusCode = statusCode;
        this.data = null,
        this.errors = errors;
        this.message = message,
        this.errors = errors

        if(stack) {
            this.stack = stack;
        } 
        else {
            Error.captureStackTrace(this, this.constructor);
        }
        
    }
}


export { apiError };
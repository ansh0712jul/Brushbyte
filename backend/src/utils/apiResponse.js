class apiResponse {
    constructor(statusCode, message="sucess", data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400
    }
}
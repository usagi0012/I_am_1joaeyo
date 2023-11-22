class Response {
    static successResult(msg, object) {
        return {
            success: true,
            message: msg,
            data: object,
        };
    }

    static failResult(msg) {
        return {
            success: false,
            message: msg,
        };
    }
}

export default Response;

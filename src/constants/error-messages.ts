export enum ErrorMessages {
    INVALID_ID = ' isn\'t valid id',
    NO_USER_WITH_ID = 'User with such id doesn\'t exist',
    EMPTY_BODY = 'Empty body',
    REQUIRED_FIELDS = 'Add all required fields: username, age, hobbies',
    ENDPOINT_NOT_EXIST = 'This endpoint doesn\'t exist',
    INTERNAL_SERVER_ERROR = 'Internal server error'
}

export enum StatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    NO_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}
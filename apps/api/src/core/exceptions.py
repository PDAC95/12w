"""
Custom Exceptions

Application-specific exception classes for better error handling.
"""

from fastapi import HTTPException, status


class AppException(HTTPException):
    """Base exception class for application errors"""

    def __init__(
        self,
        status_code: int,
        detail: str,
        headers: dict | None = None
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)


class ValidationError(AppException):
    """Exception raised for validation errors"""

    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )


class NotFoundError(AppException):
    """Exception raised when a resource is not found"""

    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail
        )


class UnauthorizedError(AppException):
    """Exception raised for unauthorized access"""

    def __init__(self, detail: str = "Unauthorized"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"}
        )


class ForbiddenError(AppException):
    """Exception raised for forbidden access"""

    def __init__(self, detail: str = "Forbidden"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail
        )


class ConflictError(AppException):
    """Exception raised for resource conflicts"""

    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail
        )


class InternalServerError(AppException):
    """Exception raised for internal server errors"""

    def __init__(self, detail: str = "Internal server error"):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail
        )

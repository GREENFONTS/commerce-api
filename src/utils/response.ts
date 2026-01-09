import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export class ResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
  ): void {
    const response: ApiResponse<T> = {
      success: true,
      data,
    };

    if (message) {
      response.message = message;
    }

    res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    error: string | Error,
    statusCode: number = 500,
    errors?: Array<{ field: string; message: string }>
  ): void {
    const errorMessage = error instanceof Error ? error.message : error;

    const response: ApiResponse = {
      success: false,
      error: errorMessage,
    };

    if (errors && errors.length > 0) {
      response.errors = errors;
    }

    res.status(statusCode).json(response);
  }

  static notFound(res: Response, message: string = 'Resource not found'): void {
    this.error(res, message, 404);
  }

  static badRequest(
    res: Response,
    message: string,
    errors?: Array<{ field: string; message: string }>
  ): void {
    this.error(res, message, 400, errors);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): void {
    this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden'): void {
    this.error(res, message, 403);
  }

  static internalServerError(
    res: Response,
    message: string = 'Internal server error'
  ): void {
    this.error(res, message, 500);
  }

  static successWithPagination<T>(
    res: Response,
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    },
    message?: string,
    statusCode: number = 200
  ): void {
    const response: ApiResponse<T[]> = {
      success: true,
      data,
      pagination,
    };

    if (message) {
      response.message = message;
    }

    res.status(statusCode).json(response);
  }
}


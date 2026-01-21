export interface ValidationError {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  validationErrors?: ValidationError[];
}

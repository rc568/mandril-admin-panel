import type { ValidationError } from '@/types/api/api-error';

interface Props {
  errors: ValidationError[];
}

export const ValidationErrorList = ({ errors }: Props) => {
  return (
    <>
      <span>Errores de validación:</span>
      <ul>
        {errors.map((error) => (
          <li key={error.field}>
            <span className="capitalize font-bold">{error.field}: </span>
            {error.message}
          </li>
        ))}
      </ul>
    </>
  );
};

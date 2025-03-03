import { useState, ChangeEvent, FormEvent } from "react";

interface FormErrors {
  [key: string]: string;
}

type Validator<T> = (value: any, values: T) => string | null;

interface Validators<T> {
  [key: string]: Validator<T>;
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validators?: Validators<T>,
  onSubmit?: (values: T) => Promise<void> | void
) {
  const [values, setValues] = useState<T>({ ...initialValues, isSubmitting: false }); // Add isSubmitting
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (fieldValues = values): FormErrors => {
    if (!validators) return {};

    const tempErrors: FormErrors = {};
    for (const field in validators) {
      const validator = validators[field];
      const value = fieldValues[field];
      const error = validator(value, fieldValues);
      if (error) tempErrors[field] = error;
    }
    setErrors(tempErrors);
    return tempErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (validators && validators[name]) {
      const error = validators[name](newValue, { ...values, [name]: newValue });
      setErrors((prev) => ({ ...prev, [name]: error || "" }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = validate();
    const isValid = Object.values(formErrors).every((x) => !x);

    if (isValid && onSubmit) {
      setValues((prev) => ({ ...prev, isSubmitting: true }));
      try {
        await onSubmit(values);
      } catch (err) {
        console.error("Submit error:", err);
        setErrors((prev) => ({ ...prev, form: "Submission failed" }));
      } finally {
        setValues((prev) => ({ ...prev, isSubmitting: false }));
      }
    }
  };

  const resetForm = () => {
    setValues({ ...initialValues, isSubmitting: false });
    setErrors({});
  };

  const setFieldValue = (name: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validators && validators[name as string]) {
      const error = validators[name as string](value, { ...values, [name]: value });
      setErrors((prev) => ({ ...prev, [name as string]: error || "" }));
    }
  };

  return {
    values,
    errors,
    isSubmitting: values.isSubmitting, // Expose for backward compatibility
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    setValues,
  };
}
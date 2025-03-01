import { useState, ChangeEvent, FormEvent } from 'react';

interface ValidationRules {
  [key: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    match?: string;
    custom?: (value: any, formValues: any) => boolean;
    errorMessage?: string;
  };
}

interface FormErrors {
  [key: string]: string;
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: ValidationRules,
  onSubmit?: (values: T) => void
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (fieldValues = values): FormErrors => {
    if (!validationRules) return {};

    let tempErrors: FormErrors = { ...errors };
    
    for (const field in fieldValues) {
      if (validationRules[field]) {
        const { 
          required, 
          minLength, 
          maxLength, 
          pattern, 
          match, 
          custom, 
          errorMessage 
        } = validationRules[field];
        
        tempErrors[field] = '';
        
        const value = fieldValues[field];
        
        // Required field validation
        if (required && !value) {
          tempErrors[field] = errorMessage || 'This field is required';
          continue;
        }
        
        // Skip other validations if field is empty and not required
        if (!value && !required) continue;
        
        // Min length validation
        if (minLength && value.length < minLength) {
          tempErrors[field] = errorMessage || `Minimum ${minLength} characters required`;
          continue;
        }
        
        // Max length validation
        if (maxLength && value.length > maxLength) {
          tempErrors[field] = errorMessage || `Maximum ${maxLength} characters allowed`;
          continue;
        }
        
        // Pattern validation
        if (pattern && !pattern.test(value)) {
          tempErrors[field] = errorMessage || 'Invalid format';
          continue;
        }
        
        // Match validation (e.g., password confirmation)
        if (match && value !== values[match]) {
          tempErrors[field] = errorMessage || 'Values do not match';
          continue;
        }
        
        // Custom validation
        if (custom && !custom(value, values)) {
          tempErrors[field] = errorMessage || 'Invalid value';
          continue;
        }
      }
    }
    
    setErrors(tempErrors);
    return tempErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
    
    if (validationRules) {
      validate({ [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validationRules) {
      onSubmit?.(values);
      return;
    }
    
    const formErrors = validate();
    const isValid = Object.values(formErrors).every(x => x === '');
    
    if (isValid) {
      setIsSubmitting(true);
      try {
        await onSubmit?.(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  const setFieldValue = (name: keyof T, value: any) => {
    setValues({
      ...values,
      [name]: value
    });
    
    if (validationRules && validationRules[name as string]) {
      validate({ [name]: value });
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    setValues
  };
}

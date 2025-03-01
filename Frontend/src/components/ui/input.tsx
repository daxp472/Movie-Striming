import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'outlined' | 'underlined'
  size?: 'default' | 'sm' | 'lg'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', size = 'default', className, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      outlined: 'border border-gray-300 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      underlined: 'border-b border-gray-300 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-b-blue-500',
    }

    const sizeStyles = {
      default: 'px-4 py-2 text-sm',
      sm: 'px-3 py-1 text-xs',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <input
        ref={ref}
        className={`${variantStyles[variant]} ${sizeStyles[size]} rounded-lg transition-colors duration-300 ${className}`}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
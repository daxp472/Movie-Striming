import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', className, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      destructive: 'bg-red-500 text-white hover:bg-red-600',
      outline: 'border border-gray-300 text-gray-800 hover:bg-gray-100',
      ghost: 'bg-transparent text-gray-800 hover:bg-gray-100',
      link: 'bg-transparent text-blue-500 hover:underline',
    }

    const sizeStyles = {
      default: 'px-4 py-2 text-sm',
      sm: 'px-3 py-1 text-xs',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        className={`${variantStyles[variant]} ${sizeStyles[size]} rounded-lg transition-colors duration-300 ${className}`}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
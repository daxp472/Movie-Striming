import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from "./button"

interface ToastProps {
  message: string
  icon: JSX.Element
}

export function Toaster() {
  const [isVisible, setIsVisible] = useState(false)
  const [toastData, setToastData] = useState<ToastProps | null>(null)

  const showToast = (message: string, icon: JSX.Element) => {
    setToastData({ message, icon })
    setIsVisible(true)
  }

  const hideToast = () => {
    setIsVisible(false)
    setToastData(null)
  }

  const handleAutoDismiss = () => {
    const timer = setTimeout(() => {
      hideToast()
    }, 3000) // Auto dismiss after 3 seconds

    return () => clearTimeout(timer)
  }

  useEffect(() => {
    if (isVisible) {
      handleAutoDismiss()
    }
  }, [isVisible])

  return (
    <div className={`fixed bottom-4 right-4 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
      {isVisible && toastData && (
        <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-4 border border-gray-200">
          <div>{toastData.icon}</div>
          <div className="flex-1">
            <p className="text-gray-800">{toastData.message}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={hideToast}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
import React from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const AuthHeader = ({ page }) => {
  return (
    <header className="w-full px-6 py-4 fixed top-0 left-0 z-50" style={{ backgroundColor: '#7A85C1' }}>
      <div className="flex justify-between items-center  mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/src/assets/logo.png" 
            alt="Logo" 
            className="h-8 w-auto rounded-md"
          />
          <span 
            className="text-2xl font-bold text-white ml-3"
          >
            TaskApp
          </span>
        </div>

        {/* Conditional Right Side Content */}
        {page === 'Login' && (
          <Link to="/register">
            <Button 
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-[#7A85C1] transition-colors duration-200"
            >
              New User? Sign Up
            </Button>
          </Link>
        )}

        {page === 'Register' && (
          <Link to="/login">
            <Button 
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-[#7A85C1] transition-colors duration-200"
            >
              Already a User? Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}

export default AuthHeader

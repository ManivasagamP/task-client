import React from 'react'
import { Button } from '@/components/ui/button'

const Header = () => {

  const user = JSON.parse(sessionStorage.getItem('user'))

  const handleLogout = () => {
    sessionStorage.removeItem('isAuth')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <header className="w-full px-6 py-4" style={{ backgroundColor: '#7A85C1' }}>
      <div className="flex justify-between items-center">
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

        <div className="flex items-center gap-4">
          <span className="text-white">{`Welcome ${user?.name}`}</span>
        <Button 
          onClick={handleLogout}  
          variant="outline"
          className="text-white border-white hover:bg-white hover:text-[#7A85C1] transition-colors duration-200"
        >
          Sign Out
        </Button>
        </div>
        
      </div>
    </header>
  )
}

export default Header

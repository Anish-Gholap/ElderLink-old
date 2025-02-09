/* eslint-disable react-refresh/only-export-components */
// Context to save currently logged in user amongst all required pages if refreshed

import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext()

export const useAuthContext = () => useContext(AuthContext)

export const AuthProvider = ({children}) => {
  // initialise user state from localStorage to persist login after Refresh
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null
  })

  // load user from local storage when the app starts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))
    
    if(storedUser) {
      setUser(storedUser)
    }
  }, [])

  // save user to local storage whenever user storage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      // when user logs out
      localStorage.removeItem("user")
    }
  }, [user])

  // Helper functions
  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const value = {
    user, 
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )

}

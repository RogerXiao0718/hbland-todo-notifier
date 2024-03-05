'use client'

import { createContext, useState } from 'react'

export const AuthContext = createContext(null)

export default function AuthProvider({children}) {
    const [auth, setAuth] = useState(null)
    const [isManager, setIsManager] = useState(false)

    return (
        <AuthContext.Provider value={{ auth, setAuth, isManager, setIsManager }}>
            { children }
        </AuthContext.Provider>
    )
}

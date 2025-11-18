import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const AUTH_STORAGE_KEY = 'react-demo-auth'

// 管理登录状态 + 本地持久化
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [user])

  // 模拟接口延迟，校验固定账号
  const login = async ({ email, password }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@example.com' && password === 'admin123') {
          const profile = { name: '管理员', email }
          setUser(profile)
          resolve(profile)
        } else {
          reject(new Error('账号或密码错误（admin@example.com / admin123）'))
        }
      }, 600)
    })
  }

  const logout = () => setUser(null)

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 自定义 Hook：隔离 useContext 细节
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 中使用')
  }
  return context
}


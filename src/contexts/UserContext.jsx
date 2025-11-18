import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUser,
  getUserById,
  getUsers,
  updateUser,
} from '../services/mockUsers'

const UserContext = createContext(null)

// 统一用户数据流转、状态与操作
export function UserProvider({ children }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 列表页与其它页面共享的刷新逻辑
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await getUsers()
      setUsers(list)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // 根据是否有 id 自动选择创建或更新
  const upsertUser = async (payload) => {
    setLoading(true)
    setError(null)
    try {
      let result
      if (payload.id) {
        result = await updateUser(payload.id, payload)
      } else {
        result = await createUser(payload)
      }
      await fetchUsers()
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = useMemo(
    () => ({
      users,
      loading,
      error,
      fetchUsers,
      upsertUser,
      getUserById,
    }),
    [users, loading, error, fetchUsers, upsertUser, getUserById],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// 自定义 Hook：提供用户数据上下文
export function useUsers() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUsers 必须在 UserProvider 内使用')
  }
  return context
}


import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import {
  createUser,
  getUserById,
  getUsers,
  updateUser,
} from '../services/mockUsers'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchUsers = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const upsertUser = useCallback(async (payload) => {
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
  }, [fetchUsers])

  const value = useMemo(
    () => ({
      users,
      loading,
      error,
      fetchUsers,
      upsertUser,
      getUserById,
    }),
    [users, loading, error, fetchUsers, upsertUser],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUsers() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUsers 必须在 UserProvider 内使用')
  }
  return context
}

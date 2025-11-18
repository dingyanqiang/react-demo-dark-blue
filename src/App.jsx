import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { UserProvider } from './contexts/UserContext'
import LoginPage from './pages/LoginPage'
import UserList from './pages/UserList'
import UserForm from './pages/UserForm'
import UserDetail from './pages/UserDetail'
import './App.css'

// 受保护路由：确保只有登录后才能访问子路由
function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// 根组件：挂载认证、用户数据上下文并配置路由
function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            {/* 登录页保持独立，避免外层layout干扰 */}
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* 默认重定向到用户列表 */}
              <Route index element={<Navigate to="/users" replace />} />
              {/* 用户模块的 CRUD 页面 */}
              <Route path="users" element={<UserList />} />
              <Route path="users/new" element={<UserForm mode="create" />} />
              <Route path="users/:userId/edit" element={<UserForm mode="edit" />} />
              <Route path="users/:userId" element={<UserDetail />} />
            </Route>
            <Route path="*" element={<Navigate to="/users" replace />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </AuthProvider>
  )
}

export default App

import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// 顶层布局：包含品牌、导航、用户信息
function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // NavLink 会注入 isActive，这里统一转成样式类名
  const getLinkClass = ({ isActive }) =>
    isActive ? 'nav-link nav-link--active' : 'nav-link'

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand__title">用户后台</span>
          <span className="brand__sub">MVP 控制台</span>
        </div>
        <nav className="nav-links">
          <NavLink to="/users" className={getLinkClass} end>
            用户列表
          </NavLink>
          <NavLink to="/users/new" className={getLinkClass}>
            新建用户
          </NavLink>
        </nav>
        <div className="user-meta">
          <span className="user-meta__name">{user?.name}</span>
          <button type="button" className="ghost-btn" onClick={handleLogout}>
            退出
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout


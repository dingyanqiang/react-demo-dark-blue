import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const DEFAULT_EMAIL = 'admin@example.com'
const DEFAULT_PASSWORD = 'admin123'

// 简单登录页：使用固定账号模拟认证
function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: DEFAULT_EMAIL,
    password: DEFAULT_PASSWORD,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 控制表单双向绑定
  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // 触发登录流程，成功后跳转列表页
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form)
      navigate('/users')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <form className="panel" onSubmit={handleSubmit}>
        <h1>后台登录</h1>
        <p className="helper-text">体验账号已自动填入，可直接登录</p>
        <label>
          <span>邮箱</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            required
          />
        </label>
        <label>
          <span>密码</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="admin123"
            required
          />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  )
}

export default LoginPage


import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUsers } from '../contexts/UserContext'

const ROLE_OPTIONS = ['管理员', '运营', '访客']
const STATUS_OPTIONS = ['启用', '停用']

// 复用组件：通过 mode 区分创建/编辑
function UserForm({ mode }) {
  const isEdit = mode === 'edit'
  const { userId } = useParams()
  const navigate = useNavigate()
  const { upsertUser, getUserById } = useUsers()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: ROLE_OPTIONS[1],
    status: STATUS_OPTIONS[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [initializing, setInitializing] = useState(isEdit)

  // 编辑场景下先拉取原始数据
  useEffect(() => {
    if (isEdit && userId) {
      setInitializing(true)
      getUserById(userId)
        .then((data) => {
          setForm({
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: data.role,
            status: data.status,
          })
        })
        .catch((err) => setError(err.message))
        .finally(() => setInitializing(false))
    }
  }, [isEdit, userId, getUserById])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // 创建或更新后跳转至详情
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = { ...form }
      if (isEdit) {
        payload.id = userId
      }
      const result = await upsertUser(payload)
      navigate(`/users/${result.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>{isEdit ? '编辑用户' : '创建用户'}</h2>
          <p className="helper-text">
            {isEdit ? '更新已有用户资料' : '填写基础信息创建新账号'}
          </p>
        </div>
      </header>
      {error && <p className="error-text">{error}</p>}
      {initializing ? (
        <p>数据加载中...</p>
      ) : (
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            <span>姓名</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="请输入姓名"
              required
            />
          </label>
          <label>
            <span>邮箱</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@company.com"
              required
            />
          </label>
          <label>
            <span>手机号</span>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="138xxxx0000"
              required
            />
          </label>
          <label>
            <span>角色</span>
            <select name="role" value={form.role} onChange={handleChange}>
              {ROLE_OPTIONS.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </label>
          {isEdit && (
            <label>
              <span>状态</span>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
          )}
          <div className="form-actions">
            <button type="button" className="ghost-btn" onClick={() => navigate(-1)}>
              取消
            </button>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? '提交中...' : '保存'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

export default UserForm


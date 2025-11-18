import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useUsers } from '../contexts/UserContext'

// 用户详情：单条数据回显
function UserDetail() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { getUserById } = useUsers()
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // 拉取详情数据，可复用列表的 getUserById
  useEffect(() => {
    getUserById(userId)
      .then((data) => setUser(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId, getUserById])

  if (loading) {
    return (
      <section className="panel">
        <p>加载中...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="panel">
        <p className="error-text">{error}</p>
        <button type="button" onClick={() => navigate(-1)}>
          返回
        </button>
      </section>
    )
  }

  if (!user) return null

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>用户详情</h2>
          <p className="helper-text">查看用户的基础信息</p>
        </div>
        <div className="panel__actions">
          <Link className="primary-btn" to={`/users/${user.id}/edit`}>
            编辑
          </Link>
          <button type="button" className="ghost-btn" onClick={() => navigate(-1)}>
            返回
          </button>
        </div>
      </header>
      <dl className="detail-grid">
        <div>
          <dt>姓名</dt>
          <dd>{user.name}</dd>
        </div>
        <div>
          <dt>邮箱</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>角色</dt>
          <dd>{user.role}</dd>
        </div>
        <div>
          <dt>手机号</dt>
          <dd>{user.phone}</dd>
        </div>
        <div>
          <dt>状态</dt>
          <dd>{user.status}</dd>
        </div>
        <div>
          <dt>创建时间</dt>
          <dd>{user.createdAt}</dd>
        </div>
      </dl>
    </section>
  )
}

export default UserDetail


import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUsers } from '../contexts/UserContext'

function UserList() {
  const { users, loading, error, fetchUsers } = useUsers()
  const [keyword, setKeyword] = useState('')

  // 基于关键字的前端过滤
  const filtered = useMemo(() => {
    if (!keyword.trim()) return users
    return users.filter(
      (item) =>
        item.name.includes(keyword) ||
        item.email.includes(keyword) ||
        item.role.includes(keyword),
    )
  }, [keyword, users])

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>用户列表</h2>
          <p className="helper-text">
            支持新增、编辑、查看详情，数据基于本地 Mock
          </p>
        </div>
        <div className="panel__actions">
          <input
            className="search-input"
            type="search"
            placeholder="搜索姓名/邮箱/角色"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="button" onClick={fetchUsers}>
            {loading ? '刷新中...' : '刷新'}
          </button>
          <Link className="primary-btn" to="/users/new">
            + 新建用户
          </Link>
        </div>
      </header>
      {error && <p className="error-text">{error}</p>}
      {/* 列表展示 + 常用操作 */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>姓名</th>
              <th>邮箱</th>
              <th>角色</th>
              <th>手机号</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id}>
                <td><em className="text-primary">{user.name}</em></td>
                <td><em className="text-primary">{user.email}</em></td>
                <td><em className="text-primary">{user.role}</em></td>
                <td><em className="text-primary">{user.phone}</em></td>
                <td>
                  <span className={`status status--${user.status === '启用' ? 'success' : 'inactive'}`}>
                    {user.status}
                  </span>
                </td>
                <td><em className="text-primary">{user.createdAt}</em></td>
                <td className="table-actions">
                  <Link to={`/users/${user.id}`}><em className="text-primary">详情</em></Link>
                  <Link to={`/users/${user.id}/edit`}><em className="text-primary">编辑</em></Link>
                  {/* TODO: 删除功能待接入真实接口 */}
                  <button type="button" className="ghost-btn"><em className="text-primary">删除</em></button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={7} className="empty-state">
                  {loading ? '加载中...' : '暂无数据'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default UserList


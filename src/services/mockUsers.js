// 初始 Mock 数据，用于前端演示
const seedUsers = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    status: '启用',
    phone: '13800000001',
    createdAt: '2024-08-11',
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    role: '运营',
    status: '启用',
    phone: '13800000002',
    createdAt: '2024-10-03',
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    role: '访客',
    status: '停用',
    phone: '13800000003',
    createdAt: '2024-12-19',
  },
]

let userStore = [...seedUsers]
let counter = userStore.length + 1

// 统一模拟网络延迟与异常
const withLatency = (callback, time = 400) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(callback())
      } catch (err) {
        reject(err)
      }
    }, time)
  })

// 获取用户列表
export function getUsers() {
  return withLatency(() => [...userStore])
}

// 根据 ID 获取单条数据
export function getUserById(id) {
  return withLatency(() => {
    const found = userStore.find((item) => item.id === id)
    if (!found) {
      throw new Error('用户不存在')
    }
    return { ...found }
  })
}

// 新建用户并自动生成 id / 创建时间
export function createUser(payload) {
  return withLatency(() => {
    const newUser = {
      id: String(counter++),
      createdAt: new Date().toISOString().slice(0, 10),
      status: '启用',
      ...payload,
    }
    userStore = [newUser, ...userStore]
    return { ...newUser }
  })
}

// 局部更新已有用户
export function updateUser(id, payload) {
  return withLatency(() => {
    const index = userStore.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('用户不存在')
    }
    const updated = {
      ...userStore[index],
      ...payload,
    }
    userStore[index] = updated
    return { ...updated }
  })
}


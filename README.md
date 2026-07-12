# 时光影像馆 — 老人影像管理系统

多角色影像管理平台：管理员管理老人档案，老人查看/上传照片，志愿者代老人上传，子女浏览父母影像时间轴。

## 技术栈

React 19 · Vite 8 · Tailwind CSS 4 · shadcn/ui · Zustand · react-router-dom v7 · Axios

## 开发

```bash
npm install
npm run dev      # localhost:5173
npm run build    # 输出 dist/
npm run lint     # ESLint
```

## 项目结构

```
src/
├── api/api.js            # Axios 实例（baseURL、token 注入、401 拦截）
├── store/authStore.js    # 认证状态（Zustand + persist）
├── pages/
│   ├── Login.jsx          # 登录（DEV_MODE 跳过真实 API）
│   ├── Register.jsx       # 注册（已对接真实 API）
│   ├── Dashboard.jsx      # 管理员：老人档案 CRUD
│   ├── ElderDashboard.jsx # 老人端：照片上传 + 相册
│   └── VolunteerDashboard.jsx  # 志愿者：为关联老人上传
├── components/ui/         # shadcn/ui 组件
└── lib/utils.js           # cn() 工具函数
```

## 角色路由

| 角色 | 路由 | 权限 |
|------|------|------|
| admin | `/dashboard` | 全部 CRUD |
| elder | `/elder-dashboard` | 自己的照片和信息 |
| volunteer | `/volunteer-dashboard` | 关联老人的照片上传 |
| children | `/family-dashboard` | 未开发 |

## 开发开关

`App.jsx` 第 11 行：`DEV_BYPASS_AUTH = true` — 跳过登录验证
`Login.jsx` 第 25 行：`DEV_MODE = true` — 使用内置测试账号

测试账号：李秀英 / 123456（老人）· 志愿者 / 123456 · 其他任意（管理员）

## Mock 状态

所有页目前使用 Mock 数据，仅 `Register.jsx` 调用了真实 API（`POST /auth/register`）。
后端就绪后，将 `api.get/post/put/delete` 替换掉 `MOCK_ELDERS`、`MOCK_IMAGES` 等数组即可。

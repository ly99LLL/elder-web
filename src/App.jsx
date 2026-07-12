import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ElderDashboard from './pages/ElderDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import { Toaster } from 'sonner';

// 开发测试开关：设为 true 可跳过登录直接访问 Dashboard
const DEV_BYPASS_AUTH = true;

function PrivateRoute({ children, allowedRoles = [] }) {
  const token = useAuthStore((state) => state.token);
  const userInfo = useAuthStore((state) => state.userInfo);
  const isAuth = DEV_BYPASS_AUTH || token;

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // 如果有角色限制，检查角色
  if (allowedRoles.length > 0 && userInfo?.role) {
    if (!allowedRoles.includes(userInfo.role)) {
      // 角色不匹配，重定向到对应的首页
      const roleHome = {
        admin: '/dashboard',
        elder: '/elder-dashboard',
        volunteer: '/volunteer-dashboard',
        children: '/family-dashboard',
      };
      return <Navigate to={roleHome[userInfo.role] || '/dashboard'} replace />;
    }
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* 管理员后台 */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        {/* 老人个人页面 */}
        <Route
          path="/elder-dashboard"
          element={
            <PrivateRoute allowedRoles={['elder']}>
              <ElderDashboard />
            </PrivateRoute>
          }
        />
        {/* 志愿者工作台 */}
        <Route
          path="/volunteer-dashboard"
          element={
            <PrivateRoute allowedRoles={['volunteer']}>
              <VolunteerDashboard />
            </PrivateRoute>
          }
        />
        {/* 默认重定向 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

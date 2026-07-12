import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/api';
import { toast } from 'sonner';
import { LogInIcon, Heart, Camera } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const DEV_MODE = true;
    if (DEV_MODE) {
      setTimeout(() => {
        if (username === '李秀英' && password === '123456') {
          setToken('elder-token');
          setUserInfo({ username: '李秀英', role: 'elder', age: 82 });
          toast.success('欢迎回来，李秀英奶奶！');
          navigate('/elder-dashboard');
        } else if (username === '志愿者' && password === '123456') {
          setToken('volunteer-token');
          setUserInfo({ username: '张志愿者', role: 'volunteer' });
          toast.success('志愿者登录成功');
          navigate('/volunteer-dashboard');
        } else {
          setToken('dev-token');
          setUserInfo({ username: username || '管理员', role: 'admin' });
          toast.success('管理员登录成功');
          navigate('/dashboard');
        }
        setIsLoading(false);
      }, 500);
      return;
    }

    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      setToken(token);
      setUserInfo(user || { username, role: 'admin' });
      toast.success('登录成功');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || '登录失败，请检查用户名和密码';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #FFF5EC 0%, #FFE8D6 30%, #FFF9F0 60%, #FDE8D0 100%)' }}>
      {/* 装饰背景 */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 size-32 rounded-full bg-amber-200/50 blur-3xl" />
        <div className="absolute bottom-20 right-10 size-48 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 size-40 rounded-full bg-yellow-200/30 blur-3xl" />
      </div>

      {/* Logo区 */}
      <div className="relative z-10 flex flex-col items-center mb-8">
        <div className="flex size-16 items-center justify-center rounded-2xl mb-4"
             style={{ background: 'linear-gradient(135deg, #E8784A, #F4A261)' }}>
          <Camera className="size-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#4A3228' }}>
          时光影像馆
        </h1>
        <p className="text-sm mt-1" style={{ color: '#A08070' }}>
          珍藏每一段温暖记忆
        </p>
      </div>

      {/* 登录卡片 */}
      <Card className="relative z-10 w-full max-w-sm border-0 shadow-lg shadow-orange-100/50" style={{ borderRadius: '1rem' }}>
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-lg" style={{ color: '#4A3228' }}>欢迎回来</CardTitle>
          <CardDescription style={{ color: '#A08070' }}>请登录您的账户</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username" style={{ color: '#6B5344' }}>用户名</Label>
              <Input
                id="username"
                type="text"
                placeholder="请输入用户名"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 rounded-xl border-orange-200 focus:border-orange-400 focus:ring-orange-300"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" style={{ color: '#6B5344' }}>密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl border-orange-200 focus:border-orange-400 focus:ring-orange-300"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-2 rounded-xl text-base font-medium"
              style={{ background: 'linear-gradient(135deg, #E8784A, #F4A261)', border: 'none' }}
            >
              {isLoading ? (
                <><span className="animate-spin mr-2">⏳</span> 登录中...</>
              ) : (
                <><LogInIcon className="size-4 mr-1" /> 登录</>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <p className="text-sm" style={{ color: '#A08070' }}>
            还没有账户？{' '}
            <Link to="/register" className="font-medium hover:underline" style={{ color: '#E8784A' }}>
              立即注册
            </Link>
          </p>
          <div className="text-xs text-center px-4 py-2.5 rounded-xl w-full"
               style={{ background: '#FFF5EC', color: '#A08070' }}>
            <p className="font-medium mb-1" style={{ color: '#8B6F5E' }}>测试账号</p>
            <p>老人：李秀英 / 123456</p>
            <p>志愿者：志愿者 / 123456</p>
            <p>管理员：任意用户名 / 任意密码</p>
          </div>
        </CardFooter>
      </Card>

      {/* 底部 */}
      <p className="relative z-10 mt-8 text-xs" style={{ color: '#C0A090' }}>
        <Heart className="size-3 inline mr-1" style={{ fill: '#E8784A', stroke: 'none' }} />
        用心记录，温暖陪伴
      </p>
    </div>
  );
}

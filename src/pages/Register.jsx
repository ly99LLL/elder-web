import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'sonner';
import { UserPlusIcon, Camera, Heart } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const ROLES = [
  { value: 'elder', label: '👵 老人', desc: '查看和上传自己的影像' },
  { value: 'volunteer', label: '🤝 志愿者', desc: '为老人拍摄和上传影像' },
  { value: 'children', label: '👨‍👩‍👧 子女', desc: '浏览父母的影像档案' },
];

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('elder');
  const [bindCode, setBindCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/register', { username, password, role, bindCode: bindCode || undefined });
      toast.success('注册成功，请登录');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || '注册失败，请稍后重试';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #FFF5EC 0%, #FFE8D6 30%, #FFF9F0 60%, #FDE8D0 100%)' }}>
      {/* 装饰 */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 right-20 size-36 rounded-full bg-amber-200/50 blur-3xl" />
        <div className="absolute bottom-10 left-10 size-44 rounded-full bg-orange-200/40 blur-3xl" />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center mb-6">
        <div className="flex size-14 items-center justify-center rounded-2xl mb-3"
             style={{ background: 'linear-gradient(135deg, #E8784A, #F4A261)' }}>
          <Camera className="size-7 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: '#4A3228' }}>
          创建新账户
        </h1>
        <p className="text-sm mt-1" style={{ color: '#A08070' }}>加入时光影像馆</p>
      </div>

      <Card className="relative z-10 w-full max-w-sm border-0 shadow-lg shadow-orange-100/50" style={{ borderRadius: '1rem' }}>
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-lg" style={{ color: '#4A3228' }}>注册</CardTitle>
          <CardDescription style={{ color: '#A08070' }}>填写信息完成注册</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* 角色选择 */}
            <div className="flex flex-col gap-1.5">
              <Label style={{ color: '#6B5344' }}>我是</Label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs transition-all border-2"
                    style={{
                      borderColor: role === r.value ? '#E8784A' : '#F0E0D0',
                      background: role === r.value ? '#FFF5EC' : '#FFFAF5',
                      color: role === r.value ? '#E8784A' : '#A08070',
                    }}
                  >
                    <span className="text-lg">{r.label.slice(0, 2)}</span>
                    <span className="font-medium">{r.label.slice(3)}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs mt-0.5" style={{ color: '#C0A090' }}>
                {ROLES.find((r) => r.value === role)?.desc}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username" style={{ color: '#6B5344' }}>用户名</Label>
              <Input id="username" type="text" placeholder="请输入用户名" required
                value={username} onChange={(e) => setUsername(e.target.value)}
                className="h-11 rounded-xl border-orange-200" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" style={{ color: '#6B5344' }}>密码</Label>
              <Input id="password" type="password" placeholder="6-32位密码" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl border-orange-200" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword" style={{ color: '#6B5344' }}>确认密码</Label>
              <Input id="confirmPassword" type="password" placeholder="请再次输入密码" required
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 rounded-xl border-orange-200" />
            </div>

            {/* 绑定码（子女/志愿者） */}
            {(role === 'children' || role === 'volunteer') && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bindCode" style={{ color: '#6B5344' }}>绑定邀请码</Label>
                <Input id="bindCode" type="text" placeholder="请输入老人/管理员提供的邀请码"
                  value={bindCode} onChange={(e) => setBindCode(e.target.value)}
                  className="h-11 rounded-xl border-orange-200" />
              </div>
            )}

            <Button type="submit" disabled={isLoading}
              className="w-full h-11 mt-2 rounded-xl text-base font-medium"
              style={{ background: 'linear-gradient(135deg, #E8784A, #F4A261)', border: 'none' }}>
              {isLoading ? (<><span className="animate-spin mr-2">⏳</span> 注册中...</>)
                : (<><UserPlusIcon className="size-4 mr-1" /> 注册</>)}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm" style={{ color: '#A08070' }}>
            已有账户？{' '}
            <Link to="/login" className="font-medium hover:underline" style={{ color: '#E8784A' }}>去登录</Link>
          </p>
        </CardFooter>
      </Card>

      <p className="relative z-10 mt-6 text-xs" style={{ color: '#C0A090' }}>
        <Heart className="size-3 inline mr-1" style={{ fill: '#E8784A', stroke: 'none' }} />
        用心记录，温暖陪伴
      </p>
    </div>
  );
}

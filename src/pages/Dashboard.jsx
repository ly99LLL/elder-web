import { useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Plus, Pencil, Trash2, Upload, User, ImageOff, Camera, Users, ImageIcon } from 'lucide-react';

const MOCK_ELDERS = [
  { id: 1, name: '王建国', age: 78, phone: '138****1234', avatar: null },
  { id: 2, name: '李秀英', age: 82, phone: '139****5678', avatar: null },
  { id: 3, name: '张德明', age: 75, phone: '137****9012', avatar: null },
  { id: 4, name: '陈淑芬', age: 80, phone: '136****3456', avatar: null },
];

function ElderFormDialog({ open, onOpenChange, elder, onSubmit }) {
  const isEdit = Boolean(elder);
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(elder?.avatar || null);
  const [formData, setFormData] = useState({ name: elder?.name || '', age: elder?.age || '', phone: elder?.phone || '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('请选择图片文件'); return; }
    setPreviewUrl(URL.createObjectURL(file));
    toast.success('图片已选择');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('请拖入图片文件'); return; }
    setPreviewUrl(URL.createObjectURL(file));
    toast.success('图片已选择');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('请输入姓名'); return; }
    if (!formData.age || Number(formData.age) <= 0) { toast.error('请输入有效年龄'); return; }
    onSubmit({ ...formData, age: Number(formData.age), avatar: previewUrl });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl border-0 shadow-xl shadow-orange-100/50">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle style={{ color: '#4A3228' }}>{isEdit ? '编辑档案' : '新增档案'}</DialogTitle>
            <DialogDescription style={{ color: '#A08070' }}>
              {isEdit ? '修改老人档案信息' : '填写老人基本信息并上传头像'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="elder-name" style={{ color: '#6B5344' }}>姓名</Label>
              <Input id="elder-name" name="name" placeholder="请输入老人姓名"
                value={formData.name} onChange={handleChange}
                className="h-11 rounded-xl border-orange-200" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="elder-age" style={{ color: '#6B5344' }}>年龄</Label>
              <Input id="elder-age" name="age" type="number" placeholder="请输入年龄"
                value={formData.age} onChange={handleChange}
                className="h-11 rounded-xl border-orange-200" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="elder-phone" style={{ color: '#6B5344' }}>联系方式</Label>
              <Input id="elder-phone" name="phone" placeholder="请输入手机号或座机"
                value={formData.phone} onChange={handleChange}
                className="h-11 rounded-xl border-orange-200" />
            </div>

            <div className="flex flex-col gap-2">
              <Label style={{ color: '#6B5344' }}>头像 / 原片上传</Label>
              <div onClick={() => fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 transition-colors"
                style={{ borderColor: '#F0C8A0', background: '#FFF9F5' }}>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" className="size-24 rounded-full object-cover ring-2" style={{ ringColor: '#F0C8A0' }} />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-full" style={{ background: '#FFF0E5' }}>
                    <Upload className="size-6" style={{ color: '#E8784A' }} />
                  </div>
                )}
                <div className="text-center text-sm" style={{ color: '#A08070' }}>
                  {previewUrl ? <span style={{ color: '#4A3228' }}>点击或拖拽更换图片</span>
                    : <><span className="font-medium" style={{ color: '#4A3228' }}>点击上传</span><span> 或拖拽图片</span></>}
                </div>
                <p className="text-xs" style={{ color: '#C0A090' }}>支持 JPG、PNG 格式</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="rounded-xl border-orange-200">取消</Button>
            </DialogClose>
            <Button type="submit" className="rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #E8784A, #F4A261)', border: 'none' }}>
              {isEdit ? '保存修改' : '确认新增'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Dashboard() {
  const { userInfo, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [elders, setElders] = useState(MOCK_ELDERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingElder, setEditingElder] = useState(null);

  const handleLogout = () => { clearAuth(); toast.success('已退出登录'); navigate('/login'); };
  const openCreate = () => { setEditingElder(null); setDialogOpen(true); };
  const openEdit = (elder) => { setEditingElder(elder); setDialogOpen(true); };

  const handleSubmit = (data) => {
    if (editingElder) {
      setElders((prev) => prev.map((item) => item.id === editingElder.id ? { ...item, ...data } : item));
      toast.success('档案已更新');
    } else {
      setElders((prev) => [{ id: Date.now(), ...data }, ...prev]);
      toast.success('档案已新增');
    }
  };

  const handleDelete = (id) => {
    setElders((prev) => prev.filter((item) => item.id !== id));
    toast.success('档案已删除');
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ background: '#FFFAF5' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b" style={{ background: 'rgba(255,250,245,0.85)', backdropFilter: 'blur(12px)', borderColor: '#F0E0D0' }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #E8784A, #F4A261)' }}>
              <Camera className="size-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold" style={{ color: '#4A3228' }}>时光影像馆 · 管理后台</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: '#A08070' }}>欢迎，{userInfo?.username || '管理员'}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}
              className="rounded-xl border-orange-200 text-[#8B6F5E] hover:bg-orange-50">
              <LogOut className="size-4 mr-1" /> 退出
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="border-0 shadow-md rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF5EC, #FFE8D6)' }}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-xl" style={{ background: '#F4A261' }}>
                    <ImageIcon className="size-4 text-white" />
                  </div>
                  <CardTitle className="text-sm font-medium" style={{ color: '#8B6F5E' }}>影像总数</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" style={{ color: '#E8784A' }}>0</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FDE8D0, #F8D8B8)' }}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-xl" style={{ background: '#E8784A' }}>
                    <Users className="size-4 text-white" />
                  </div>
                  <CardTitle className="text-sm font-medium" style={{ color: '#8B6F5E' }}>老人数量</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" style={{ color: '#C96A3A' }}>{elders.length}</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF9F0, #FFF0E0)' }}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-xl" style={{ background: '#E0A870' }}>
                    <Upload className="size-4 text-white" />
                  </div>
                  <CardTitle className="text-sm font-medium" style={{ color: '#8B6F5E' }}>今日上传</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" style={{ color: '#C9A060' }}>0</div>
              </CardContent>
            </Card>
          </div>

          {/* 档案表格 */}
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle style={{ color: '#4A3228' }}>老人档案列表</CardTitle>
              <Button size="sm" onClick={openCreate} className="rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #E8784A, #F4A261)', border: 'none' }}>
                <Plus className="size-4 mr-1" /> 新增档案
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: '#F0E0D0' }}>
                    <TableHead style={{ color: '#A08070' }}>头像</TableHead>
                    <TableHead style={{ color: '#A08070' }}>姓名</TableHead>
                    <TableHead style={{ color: '#A08070' }}>年龄</TableHead>
                    <TableHead style={{ color: '#A08070' }}>联系方式</TableHead>
                    <TableHead className="text-right" style={{ color: '#A08070' }}>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {elders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center gap-2" style={{ color: '#C0A090' }}>
                          <ImageOff className="size-8 opacity-50" />
                          <span>暂无档案数据</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    elders.map((elder) => (
                      <TableRow key={elder.id} style={{ borderColor: '#F5EBE0' }} className="hover:bg-orange-50/50">
                        <TableCell>
                          <Avatar size="sm" className="ring-2 ring-orange-100">
                            {elder.avatar ? <AvatarImage src={elder.avatar} alt={elder.name} /> : null}
                            <AvatarFallback style={{ background: '#FFF0E5', color: '#E8784A' }}>
                              <User className="size-4" />
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium" style={{ color: '#4A3228' }}>{elder.name}</TableCell>
                        <TableCell style={{ color: '#8B6F5E' }}>{elder.age} 岁</TableCell>
                        <TableCell style={{ color: '#A08070' }}>{elder.phone}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon-xs" onClick={() => openEdit(elder)} className="hover:bg-orange-50" style={{ color: '#E8784A' }}>
                              <Pencil className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon-xs" onClick={() => handleDelete(elder.id)} className="hover:bg-red-50" style={{ color: '#E8784A' }}>
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <ElderFormDialog open={dialogOpen} onOpenChange={setDialogOpen} elder={editingElder} onSubmit={handleSubmit} />
    </div>
  );
}

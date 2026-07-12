import { useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LogOut, Upload, User, Camera, Users, ImageIcon } from 'lucide-react';

const MOCK_ELDERS = [
  { id: 1, name: '王建国', age: 78, avatar: null, imageCount: 45, lastUploadAt: '2026-06-15' },
  { id: 2, name: '李秀英', age: 82, avatar: null, imageCount: 32, lastUploadAt: '2026-06-20' },
  { id: 3, name: '陈淑芬', age: 80, avatar: null, imageCount: 18, lastUploadAt: '2026-06-10' },
];

function UploadDialog({ open, onOpenChange, elder }) {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageNote, setImageNote] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('请选择图片文件'); return; }
    setPreviewImage(URL.createObjectURL(file));
    setImageNote('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('请拖入图片文件'); return; }
    setPreviewImage(URL.createObjectURL(file));
    setImageNote('');
  };

  const confirmUpload = () => {
    if (!previewImage) { toast.error('请先选择图片'); return; }
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setPreviewImage(null);
      setImageNote('');
      toast.success(`已为${elder.name}上传照片`);
      onOpenChange(false);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl border-0 shadow-xl shadow-orange-100/50">
        <DialogHeader>
          <DialogTitle style={{ color: '#4A3228' }}>为 {elder?.name} 上传照片</DialogTitle>
          <DialogDescription style={{ color: '#A08070' }}>选择照片并添加备注，帮助记录珍贵时刻</DialogDescription>
        </DialogHeader>

        {!previewImage ? (
          <div onClick={() => fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-12 transition-colors"
            style={{ borderColor: '#F0C8A0', background: '#FFF9F5' }}>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <div className="flex size-16 items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, #FFF5EC, #FFE8D6)' }}>
              <Camera className="size-8" style={{ color: '#E8784A' }} />
            </div>
            <p className="text-lg font-medium" style={{ color: '#4A3228' }}>点击或拖拽上传照片</p>
            <p className="text-sm" style={{ color: '#C0A090' }}>支持 JPG、PNG 格式</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <img src={previewImage} alt="预览" className="w-full sm:w-48 h-48 object-cover rounded-xl" />
              <div className="flex-1 flex flex-col gap-3">
                <Label style={{ color: '#6B5344' }}>照片备注</Label>
                <Textarea placeholder="写下这张照片的故事..." value={imageNote}
                  onChange={(e) => setImageNote(e.target.value)}
                  className="flex-1 min-h-[100px] rounded-xl border-orange-200" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setPreviewImage(null); setImageNote(''); }}
                className="rounded-xl border-orange-200">重新选择</Button>
              <Button onClick={confirmUpload} disabled={isUploading} className="rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #E8784A, #F4A261)', border: 'none' }}>
                {isUploading ? (<><span className="animate-spin mr-2">⏳</span> 上传中...</>)
                  : (<><Upload className="size-4 mr-1" /> 确认上传</>)}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function VolunteerDashboard() {
  const { userInfo, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [elders] = useState(MOCK_ELDERS);
  const [uploadTarget, setUploadTarget] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleLogout = () => { clearAuth(); toast.success('已退出登录'); navigate('/login'); };

  const openUpload = (elder) => { setUploadTarget(elder); setUploadOpen(true); };

  return (
    <div className="flex min-h-screen flex-col" style={{ background: '#FFFAF5' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b" style={{ background: 'rgba(255,250,245,0.85)', backdropFilter: 'blur(12px)', borderColor: '#F0E0D0' }}>
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #E8784A, #F4A261)' }}>
              <Camera className="size-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold" style={{ color: '#4A3228' }}>志愿者工作台</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: '#A08070' }}>{userInfo?.username || '志愿者'}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}
              className="rounded-xl border-orange-200 text-[#8B6F5E] hover:bg-orange-50">
              <LogOut className="size-4 mr-1" /> 退出
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-6">
          {/* 欢迎卡片 */}
          <Card className="border-0 shadow-md rounded-2xl bg-white overflow-hidden">
            <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #E8784A, #F4A261, #F8D8B8)' }} />
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, #FFF5EC, #FFE8D6)' }}>
                  <span className="text-3xl">🤝</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: '#4A3228' }}>
                    你好，{userInfo?.username || '志愿者'}！
                  </h2>
                  <p className="text-sm mt-1" style={{ color: '#A08070' }}>
                    你当前关联了 {elders.length} 位老人，可以为他们拍摄和上传影像
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-0 shadow-md rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF5EC, #FFE8D6)' }}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg" style={{ background: '#F4A261' }}>
                    <Users className="size-4 text-white" />
                  </div>
                  <CardTitle className="text-sm font-medium" style={{ color: '#8B6F5E' }}>关联老人</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" style={{ color: '#E8784A' }}>{elders.length}</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FDE8D0, #F8D8B8)' }}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg" style={{ background: '#E8784A' }}>
                    <ImageIcon className="size-4 text-white" />
                  </div>
                  <CardTitle className="text-sm font-medium" style={{ color: '#8B6F5E' }}>本月上传</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" style={{ color: '#C96A3A' }}>12</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF9F0, #FFF0E0)' }}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg" style={{ background: '#E0A870' }}>
                    <Upload className="size-4 text-white" />
                  </div>
                  <CardTitle className="text-sm font-medium" style={{ color: '#8B6F5E' }}>总上传</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" style={{ color: '#C9A060' }}>95</div>
              </CardContent>
            </Card>
          </div>

          {/* 关联老人列表 */}
          <Card className="border-0 shadow-md rounded-2xl bg-white overflow-hidden">
            <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #F4A261, #E8784A, #F8D8B8)' }} />
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl" style={{ background: '#FFF0E5' }}>
                  <Users className="size-5" style={{ color: '#E8784A' }} />
                </div>
                <CardTitle className="text-lg" style={{ color: '#4A3228' }}>关联的老人</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {elders.map((elder) => (
                  <div key={elder.id}
                    className="rounded-2xl p-5 transition-shadow hover:shadow-md border"
                    style={{ background: '#FFF9F5', borderColor: '#F0E0D0' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="size-12 ring-2 ring-orange-100">
                        {elder.avatar ? <AvatarImage src={elder.avatar} alt={elder.name} /> : null}
                        <AvatarFallback style={{ background: '#FFF0E5', color: '#E8784A', fontSize: '18px' }}>
                          <User className="size-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-base" style={{ color: '#4A3228' }}>{elder.name}</p>
                        <p className="text-sm" style={{ color: '#A08070' }}>{elder.age} 岁</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: '#A08070' }}>
                      <span>📷 {elder.imageCount} 张</span>
                      <span>🕐 {elder.lastUploadAt}</span>
                    </div>
                    <Button onClick={() => openUpload(elder)}
                      className="w-full rounded-xl text-white" size="sm"
                      style={{ background: 'linear-gradient(135deg, #E8784A, #F4A261)', border: 'none' }}>
                      <Upload className="size-4 mr-1" /> 上传照片
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {uploadTarget && <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} elder={uploadTarget} />}
    </div>
  );
}

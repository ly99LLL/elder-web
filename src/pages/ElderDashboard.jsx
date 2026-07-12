import { useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, Upload, User, ImageIcon, Calendar, Phone, Edit3, X, Trash2, ZoomIn, Save, Camera } from 'lucide-react';

const MOCK_IMAGES = [
  { id: 1, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', note: '去年春天在公园拍的，花开的很好', uploadTime: '2026-01-15 14:30' },
  { id: 2, url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop', note: '和孙子一起去郊游，风景很美', uploadTime: '2026-02-20 09:15' },
  { id: 3, url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=400&fit=crop', note: '家门口的老树，陪伴了我几十年', uploadTime: '2026-04-01 16:45' },
];

const MOCK_ELDER_INFO = { name: '李秀英', age: 82, phone: '139****5678', emergencyContact: '李小明（儿子）138****9999', avatar: null };

export default function ElderDashboard() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  const [elderInfo, setElderInfo] = useState(MOCK_ELDER_INFO);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editForm, setEditForm] = useState(MOCK_ELDER_INFO);

  const [images, setImages] = useState(MOCK_IMAGES);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageNote, setImageNote] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleLogout = () => { clearAuth(); toast.success('已退出登录'); navigate('/login'); };
  const startEditInfo = () => { setEditForm({ ...elderInfo }); setIsEditingInfo(true); };
  const saveInfo = () => { if (!editForm.name.trim()) { toast.error('请输入姓名'); return; } setElderInfo({ ...editForm }); setIsEditingInfo(false); toast.success('个人信息已更新'); };
  const cancelEditInfo = () => { setEditForm({ ...elderInfo }); setIsEditingInfo(false); };
  const handleFormChange = (field, value) => { setEditForm((prev) => ({ ...prev, [field]: value })); };

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
      const newImage = {
        id: Date.now(), url: previewImage,
        note: imageNote.trim() || '暂无备注',
        uploadTime: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      };
      setImages((prev) => [newImage, ...prev]);
      setPreviewImage(null); setImageNote(''); setIsUploading(false);
      toast.success('照片上传成功');
    }, 800);
  };

  const cancelUpload = () => { setPreviewImage(null); setImageNote(''); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const deleteImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    if (selectedImage?.id === id) setSelectedImage(null);
    toast.success('照片已删除');
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ background: '#FFFAF5' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b" style={{ background: 'rgba(255,250,245,0.85)', backdropFilter: 'blur(12px)', borderColor: '#F0E0D0' }}>
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #E8784A, #F4A261)' }}>
              <Camera className="size-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold" style={{ color: '#4A3228' }}>我的影像空间</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="size-9 ring-2 ring-orange-100">
                {elderInfo.avatar ? <AvatarImage src={elderInfo.avatar} alt={elderInfo.name} /> : null}
                <AvatarFallback style={{ background: '#FFF0E5', color: '#E8784A' }}>
                  <User className="size-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-base font-medium hidden sm:inline" style={{ color: '#4A3228' }}>{elderInfo.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}
              className="rounded-xl border-orange-200 text-[#8B6F5E] hover:bg-orange-50">
              <LogOut className="size-4 mr-1" /> 退出
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-6">
          {/* 个人信息卡片 */}
          <Card className="border-0 shadow-md rounded-2xl bg-white overflow-hidden">
            <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #E8784A, #F4A261, #F8D8B8)' }} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl" style={{ background: '#FFF0E5' }}>
                  <User className="size-5" style={{ color: '#E8784A' }} />
                </div>
                <CardTitle className="text-lg" style={{ color: '#4A3228' }}>我的信息</CardTitle>
              </div>
              {!isEditingInfo ? (
                <Button variant="ghost" size="sm" onClick={startEditInfo} className="rounded-xl" style={{ color: '#E8784A' }}>
                  <Edit3 className="size-4 mr-1" /> 编辑
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={cancelEditInfo} className="rounded-xl" style={{ color: '#A08070' }}>
                    <X className="size-4 mr-1" /> 取消
                  </Button>
                  <Button size="sm" onClick={saveInfo} className="rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #E8784A, #F4A261)', border: 'none' }}>
                    <Save className="size-4 mr-1" /> 保存
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {!isEditingInfo ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#FFF9F5' }}>
                    <User className="size-5" style={{ color: '#E8784A' }} />
                    <div><p className="text-xs" style={{ color: '#C0A090' }}>姓名</p><p className="text-base font-semibold" style={{ color: '#4A3228' }}>{elderInfo.name}</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#FFF9F5' }}>
                    <Calendar className="size-5" style={{ color: '#F4A261' }} />
                    <div><p className="text-xs" style={{ color: '#C0A090' }}>年龄</p><p className="text-base font-semibold" style={{ color: '#4A3228' }}>{elderInfo.age} 岁</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#FFF9F5' }}>
                    <Phone className="size-5" style={{ color: '#E0A870' }} />
                    <div><p className="text-xs" style={{ color: '#C0A090' }}>联系方式</p><p className="text-base font-semibold" style={{ color: '#4A3228' }}>{elderInfo.phone}</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#FFF9F5' }}>
                    <User className="size-5" style={{ color: '#C9A060' }} />
                    <div><p className="text-xs" style={{ color: '#C0A090' }}>紧急联系人</p><p className="text-sm font-semibold" style={{ color: '#4A3228' }}>{elderInfo.emergencyContact}</p></div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="edit-name" style={{ color: '#6B5344' }}>姓名</Label>
                    <Input id="edit-name" value={editForm.name} onChange={(e) => handleFormChange('name', e.target.value)}
                      placeholder="请输入姓名" className="h-11 rounded-xl border-orange-200" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="edit-age" style={{ color: '#6B5344' }}>年龄</Label>
                    <Input id="edit-age" type="number" value={editForm.age} onChange={(e) => handleFormChange('age', parseInt(e.target.value) || 0)}
                      placeholder="请输入年龄" className="h-11 rounded-xl border-orange-200" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="edit-phone" style={{ color: '#6B5344' }}>联系方式</Label>
                    <Input id="edit-phone" value={editForm.phone} onChange={(e) => handleFormChange('phone', e.target.value)}
                      placeholder="请输入手机号" className="h-11 rounded-xl border-orange-200" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="edit-emergency" style={{ color: '#6B5344' }}>紧急联系人</Label>
                    <Input id="edit-emergency" value={editForm.emergencyContact} onChange={(e) => handleFormChange('emergencyContact', e.target.value)}
                      placeholder="请输入紧急联系人" className="h-11 rounded-xl border-orange-200" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 上传区域 */}
          <Card className="border-0 shadow-md rounded-2xl bg-white overflow-hidden">
            <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #F4A261, #E8784A, #F8D8B8)' }} />
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl" style={{ background: '#FFF0E5' }}>
                  <Upload className="size-5" style={{ color: '#E8784A' }} />
                </div>
                <CardTitle className="text-lg" style={{ color: '#4A3228' }}>上传新照片</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {!previewImage ? (
                <div onClick={() => fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
                  className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-10 transition-colors"
                  style={{ borderColor: '#F0C8A0', background: '#FFF9F5' }}>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  <div className="flex size-16 items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, #FFF5EC, #FFE8D6)' }}>
                    <Camera className="size-8" style={{ color: '#E8784A' }} />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium" style={{ color: '#4A3228' }}>点击或拖拽上传照片</p>
                    <p className="text-sm mt-1" style={{ color: '#C0A090' }}>支持 JPG、PNG 格式</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <img src={previewImage} alt="预览" className="w-full sm:w-48 h-48 object-cover rounded-xl" />
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                      <Label htmlFor="image-note" style={{ color: '#6B5344' }}>添加备注</Label>
                      <Textarea id="image-note" placeholder="写下这张照片的故事..." value={imageNote}
                        onChange={(e) => setImageNote(e.target.value)}
                        className="flex-1 min-h-[100px] rounded-xl border-orange-200" />
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={cancelUpload} className="rounded-xl border-orange-200">取消</Button>
                        <Button onClick={confirmUpload} disabled={isUploading} className="rounded-xl text-white"
                          style={{ background: 'linear-gradient(135deg, #E8784A, #F4A261)', border: 'none' }}>
                          {isUploading ? (<><span className="animate-spin mr-2">⏳</span> 上传中...</>)
                            : (<><Upload className="size-4 mr-1" /> 确认上传</>)}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 照片画廊 */}
          <Card className="border-0 shadow-md rounded-2xl bg-white overflow-hidden">
            <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #F8D8B8, #F4A261, #E8784A)' }} />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-xl" style={{ background: '#FFF0E5' }}>
                    <ImageIcon className="size-5" style={{ color: '#E8784A' }} />
                  </div>
                  <CardTitle className="text-lg" style={{ color: '#4A3228' }}>我的照片</CardTitle>
                  <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm"
                    style={{ background: '#FFF0E5', color: '#E8784A', border: 'none' }}>{images.length} 张</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {images.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12" style={{ color: '#C0A090' }}>
                  <ImageIcon className="size-16 mb-4 opacity-30" />
                  <p className="text-lg">还没有上传照片</p>
                  <p className="text-sm mt-1">点击上方上传按钮添加您的第一张照片</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image.id}
                      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border"
                      style={{ borderColor: '#F0E0D0' }}>
                      <div className="aspect-square overflow-hidden cursor-pointer" onClick={() => setSelectedImage(image)}>
                        <img src={image.url} alt={image.note} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      </div>
                      <div className="p-3">
                        <p className="text-sm line-clamp-2 min-h-[40px]" style={{ color: '#8B6F5E' }}>{image.note}</p>
                        <p className="text-xs mt-2" style={{ color: '#C0A090' }}>{image.uploadTime}</p>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="icon-xs" className="size-8 rounded-lg bg-white/90 hover:bg-white shadow-sm"
                          onClick={() => setSelectedImage(image)}>
                          <ZoomIn className="size-4" style={{ color: '#E8784A' }} />
                        </Button>
                        <Button variant="destructive" size="icon-xs" className="size-8 rounded-lg"
                          onClick={() => deleteImage(image.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* 图片查看弹窗 */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border-0 shadow-xl">
          <DialogHeader className="sr-only"><DialogTitle>查看图片</DialogTitle></DialogHeader>
          {selectedImage && (
            <div className="flex flex-col">
              <div className="relative bg-black/90">
                <img src={selectedImage.url} alt={selectedImage.note} className="w-full max-h-[60vh] object-contain" />
              </div>
              <div className="p-4" style={{ background: '#FFFAF5' }}>
                <p className="text-base font-medium" style={{ color: '#4A3228' }}>{selectedImage.note}</p>
                <p className="text-sm mt-1" style={{ color: '#A08070' }}>上传时间：{selectedImage.uploadTime}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

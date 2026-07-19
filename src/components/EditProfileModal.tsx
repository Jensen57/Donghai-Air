import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { X, Camera, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { userInfo, updateUser } = useAuth();
  const [nickname, setNickname] = useState(userInfo?.nickname || '');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAvatarChange = () => {
    const randomAvatarId = Math.floor(Math.random() * 1000);
    const newAvatar = `https://picsum.photos/seed/${randomAvatarId}/100/100`;
    updateUser({ avatar: newAvatar });
  };

  const handleSave = async () => {
    if (!nickname.trim()) {
      setStatus('error');
      setErrorMessage('昵称不能为空');
      return;
    }

    setIsSaving(true);
    setStatus('idle');
    
    try {
      await updateUser({ nickname, phone });
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 1500);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || '修改失败，请稍后再试');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-sm rounded-3xl overflow-hidden relative z-10 shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-800">编辑个人资料</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Avatar Edit */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative group cursor-pointer" onClick={handleAvatarChange}>
                  <img 
                    src={userInfo?.avatar} 
                    alt="avatar" 
                    className="w-24 h-24 rounded-full border-4 border-gray-50 shadow-md"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <span className="text-xs text-gray-400 mt-2">点击更换头像</span>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">用户昵称</label>
                  <input 
                    type="text" 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-donghai outline-none"
                    placeholder="请输入昵称"
                  />
                </div>
              </div>

              {/* Status Messages */}
              <AnimatePresence mode="wait">
                {status === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex items-center justify-center gap-2 text-green-500 text-sm font-medium"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    修改成功
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex items-center justify-center gap-2 text-red-500 text-sm font-medium"
                  >
                    <AlertCircle className="w-5 h-5" />
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action */}
              <Button 
                onClick={handleSave}
                disabled={isSaving || status === 'success'}
                className="w-full mt-8 bg-donghai hover:bg-donghai-light text-white h-12 rounded-xl font-bold shadow-lg shadow-donghai/20 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    保存中...
                  </>
                ) : '保存修改'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

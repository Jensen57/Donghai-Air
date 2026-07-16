import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { X, ShieldCheck, Phone, AlertCircle } from 'lucide-react';

interface LoginOverlayProps {
  isOpen?: boolean;
  onClose?: () => void;
  startStep?: 'auth' | 'phone';
}

export default function LoginOverlay({ isOpen, onClose, startStep = 'auth' }: LoginOverlayProps) {
  const { isLoggedIn, login, updateUser } = useAuth();
  const [showAuth, setShowAuth] = useState(true);
  const [step, setStep] = useState<'auth' | 'phone' | 'success'>(startStep);

  React.useEffect(() => {
    if (isOpen) {
      setStep(startStep);
      setError(null);
    }
  }, [isOpen, startStep]);
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const isVisible = isOpen !== undefined ? isOpen : (!isLoggedIn && showAuth);

  if (!isVisible) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setShowAuth(false);
    }
  };

  const handleAuthorize = () => {
    // Simulate network delay
    setTimeout(() => {
      // 90% success rate for demo
      if (Math.random() > 0.1) {
        login({
          openID: 'wx_' + Math.random().toString(36).substr(2, 9),
          nickname: '东海旅客',
          avatar: 'https://picsum.photos/seed/user/200/200'
        });
        setStep('success');
        setError(null);
      } else {
        setError('授权失败，请重新尝试');
      }
    }, 800);
  };

  const handleBindPhone = () => {
    if (phoneNumber.length !== 11) {
      setError('请输入正确的11位手机号');
      return;
    }
    updateUser({ phone: phoneNumber }).then(() => {
      setStep('success');
      setError(null);
    });
  };

  const skipPhone = () => {
    handleClose();
  };

  return (
    <AnimatePresence>
      {showAuth && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[300] bg-black/60 flex items-end justify-center"
        >
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-white w-full max-w-md rounded-t-[32px] p-6 pb-20 shadow-2xl"
          >
            {step === 'auth' && (
              <div className="flex flex-col items-center text-center">
                <div className="w-full flex justify-end mb-2">
                  <X className="w-6 h-6 text-gray-300 cursor-pointer" onClick={handleClose} />
                </div>
                <div className="w-16 h-16 bg-donghai/10 rounded-2xl flex items-center justify-center mb-4">
                  <img src="https://www.dzair.com/favicon.ico" alt="logo" className="w-10 h-10" />
                </div>
                <h2 className="text-lg font-bold mb-2">东海航空 申请</h2>
                <p className="text-sm text-gray-500 mb-8">获取您的微信昵称、头像，用于为您提供更好的个性化服务</p>
                
                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-xs mb-4 bg-red-50 px-4 py-2 rounded-lg w-full">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-3 w-full">
                  <Button 
                    onClick={handleAuthorize}
                    className="w-full bg-[#07C160] hover:bg-[#06ae56] text-white h-12 rounded-xl font-bold"
                  >
                    允许
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full text-gray-400 h-12"
                    onClick={handleClose}
                  >
                    拒绝
                  </Button>
                </div>
              </div>
            )}

            {step === 'phone' && (
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                   <h2 className="text-xl font-bold">绑定手机号</h2>
                   <div className="flex items-center gap-2">
                     <Button variant="ghost" size="sm" onClick={skipPhone} className="text-gray-400 font-medium">跳过</Button>
                     <X className="w-5 h-5 text-gray-300 cursor-pointer" onClick={handleClose} />
                   </div>
                </div>
                <p className="text-sm text-gray-500 mb-8">绑定手机号用于账户安全与赔付验证</p>
                
                <div className="relative mb-2">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="tel" 
                    placeholder="请输入手机号" 
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11));
                      if (error) setError(null);
                    }}
                    className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-12 pr-4 text-base focus:ring-2 focus:ring-donghai outline-none transition-all placeholder:text-gray-300"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-xs mt-2 mb-6 ml-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="mt-4">
                  <Button 
                    onClick={handleBindPhone}
                    className="w-full bg-donghai text-white h-14 rounded-2xl font-bold text-lg shadow-lg shadow-donghai/10 active:scale-[0.98] transition-transform"
                  >
                    立即绑定
                  </Button>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-lg font-bold mb-2">登录成功</h2>
                <p className="text-sm text-gray-500 mb-8">欢迎回来，开启您的东海之旅</p>
                <Button 
                  onClick={handleClose}
                  className="w-full bg-donghai text-white h-12 rounded-xl font-bold"
                >
                  进入商城
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

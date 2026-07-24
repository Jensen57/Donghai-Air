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
  const [agreed, setAgreed] = useState(false);
  const [shake, setShake] = useState(false);
  const [showOtherPhone, setShowOtherPhone] = useState(false);

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
    // Log user in
    login({
      openID: 'ph_' + phoneNumber,
      nickname: '东海旅客',
      avatar: 'https://picsum.photos/seed/user/200/200'
    });
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
            className="bg-white w-full max-w-md rounded-t-[32px] p-6 pb-8 shadow-2xl"
          >
            {step === 'auth' && (
              <div className="flex flex-col items-center text-center">
                <div className="w-full flex justify-end mb-4">
                  <X className="w-6 h-6 text-gray-300 cursor-pointer" onClick={handleClose} />
                </div>
                <h2 className="text-lg font-bold mb-8">登录 <span className="text-red-500">享更多优惠</span></h2>
                
                <Button 
                  onClick={() => {
                    if (!agreed) {
                      setShake(true);
                      setTimeout(() => setShake(false), 500);
                      return;
                    }
                    setStep('phone');
                  }}
                  className="w-full bg-[#07C160] hover:bg-[#06ae56] text-white h-12 rounded-xl font-bold mb-4"
                >
                  同意协议并手机号快捷登录
                </Button>

                <div className={`flex items-start text-[11px] text-gray-400 text-left w-full mb-4 transition-transform ${shake ? 'translate-x-1' : ''}`}>
                  <input type="checkbox" id="agree" className="mt-0.5 mr-2 w-4 h-4 rounded-full border-gray-300 text-donghai focus:ring-donghai" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                  <label htmlFor="agree">
                    我同意使用未注册的手机号自动创建账号
                  </label>
                </div>
              </div>
            )}

            {step === 'phone' && (
              <div className="flex flex-col pt-4 scale-90 origin-top">
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 font-medium">
                  <img src="https://www.dzair.com/favicon.ico" className="w-5 h-5 rounded-full" alt="logo"/>
                  东海航空商城
                </div>
                
                <h2 className="text-lg font-bold mb-2">申请获取并验证你的手机号</h2>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  实现网上购物所必须的功能及保证保障交易安全所必须的功能。例如账户注册、登录与验证、下单、配送服务、客服及退货等功能
                </p>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-xs mb-4 bg-red-50 px-4 py-2 rounded-lg w-full">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={handleAuthorize} 
                    className="w-full bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#333] h-16 rounded-xl flex flex-col items-center justify-center border-none shadow-none"
                  >
                    <span className="text-lg font-bold">172****5624</span>
                    <span className="text-[10px] text-gray-500 font-normal mt-0.5">微信绑定号码</span>
                  </Button>

                  <Button 
                    variant="ghost" 
                    className="w-full bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#333] h-14 rounded-xl font-bold"
                    onClick={handleClose}
                  >
                    不允许
                  </Button>
                </div>

                <div className="text-center mt-6">
                  <span className="text-sm text-[#576b95] cursor-pointer" onClick={() => setShowOtherPhone(true)}>使用其它号码</span>
                </div>
              </div>
            )}

            {showOtherPhone && (
              <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/20">
                <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
                   <h2 className="text-xl font-bold mb-6 text-center">输入手机号</h2>
                   <input 
                      type="tel" 
                      placeholder="请输入11位手机号" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      className="w-full bg-gray-50 border-none rounded-xl py-4 px-4 text-base mb-6 focus:ring-2 focus:ring-donghai outline-none"
                   />
                   <Button onClick={() => { handleBindPhone(); setShowOtherPhone(false); }} className="w-full bg-donghai text-white h-12 rounded-xl font-bold">确定</Button>
                   <Button variant="ghost" onClick={() => setShowOtherPhone(false)} className="mt-4 text-gray-500 w-full">取消</Button>
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

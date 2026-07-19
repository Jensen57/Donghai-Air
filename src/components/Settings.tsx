import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff,
  RefreshCw,
  Bell, 
  Database, 
  Smartphone,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import EmployeeAuth from './EmployeeAuth';

interface SettingsProps {
  onBack: () => void;
  initialSubPage?: string | null;
}

function PhoneBindingPage({ userInfo, onBack, updateUser }: { userInfo: any, onBack: () => void, updateUser: any }) {
  const [phoneInput, setPhoneInput] = useState('');
  const [vCode, setVCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    if (!/^1[3-9]\d{9}$/.test(phoneInput)) {
      alert('请输入正确的手机号');
      return;
    }
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBind = async () => {
    if (!phoneInput || !vCode) {
      alert('请完善信息');
      return;
    }
    await updateUser({ phone: phoneInput });
    alert('绑定成功');
    onBack();
  };

  if (!userInfo?.phone) {
    return (
      <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
        <div className="pt-12 pb-4 px-4 flex items-center gap-2 border-b">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h2 className="text-lg font-bold">绑定手机号</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center mb-8 text-center text-donghai">
            <Smartphone className="w-12 h-12 mb-2" />
            <p className="text-gray-400 text-xs">绑定手机后即可享受完整的购票及积分服务</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center bg-gray-50 rounded-xl px-4 h-12">
              <span className="text-sm font-bold text-gray-800 pr-3 border-r border-gray-200">+86</span>
              <input 
                type="tel" 
                placeholder="请输入手机号"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm focus:ring-0 px-3"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-50 rounded-xl px-4 h-12 flex items-center">
                <input 
                  type="text" 
                  placeholder="验证码"
                  value={vCode}
                  onChange={(e) => setVCode(e.target.value)}
                  className="w-full bg-transparent border-none text-sm focus:ring-0"
                />
              </div>
              <Button 
                variant="outline"
                disabled={countdown > 0}
                onClick={startCountdown}
                className="rounded-xl px-4 border-donghai text-donghai h-12 text-xs min-w-[100px]"
              >
                {countdown > 0 ? `${countdown}s` : '获取验证码'}
              </Button>
            </div>
          </div>

          <Button 
            onClick={handleBind}
            className="w-full mt-8 bg-donghai text-white rounded-xl h-12 font-bold"
          >
            立即绑定
          </Button>
          
          <p className="mt-4 text-[10px] text-gray-400 text-center">
            认证即同意 <span className="text-donghai">《用户服务协议》</span> 与 <span className="text-donghai">《隐私政策》</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
      <div className="pt-12 pb-4 px-4 flex items-center gap-2 border-b">
        <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
        <h2 className="text-lg font-bold">手机绑定</h2>
      </div>
      <div className="p-6 flex flex-col items-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <Smartphone className="w-10 h-10 text-donghai" />
        </div>
        <p className="text-gray-500 text-sm mb-2 text-center">当前绑定手机号</p>
        <h3 className="text-2xl font-bold mb-8">{userInfo?.phone}</h3>
        <Button 
          className="w-full bg-donghai text-white rounded-xl h-12"
          onClick={() => {
            updateUser({ phone: undefined });
            alert('进入更换流程');
          }}
        >
          更换手机号
        </Button>
        <p className="mt-4 text-[10px] text-gray-400">更换手机号后，下次登录请使用新手机号</p>
      </div>
    </div>
  );
}

function PayPasswordPage({ userInfo, onBack, updateUser }: { userInfo: any, onBack: () => void, updateUser: any }) {
  const [viewMode, setViewMode] = useState<'menu' | 'enter_pass' | 'confirm_pass' | 'verify_old'>('menu');
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isModifying, setIsModifying] = useState(false);

  const hasPassword = !!userInfo?.paymentPassword;

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      setErrorMsg('');
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 6) {
        setTimeout(() => {
          if (viewMode === 'verify_old') {
            if (newPin === userInfo?.paymentPassword) {
              setIsModifying(true);
              setPin('');
              setViewMode('enter_pass');
            } else {
              setShowErrorModal(true);
            }
          } else if (viewMode === 'enter_pass') {
            setFirstPin(newPin);
            setPin('');
            setViewMode('confirm_pass');
          } else if (viewMode === 'confirm_pass') {
            if (newPin === firstPin) {
              updateUser({ paymentPassword: newPin }).then(() => {
                setShowSuccessModal(true);
              });
            } else {
              setErrorMsg('两次输入的密码不一致，请重新输入');
              setPin('');
            }
          }
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const handleReset = () => {
    setPin('');
    setFirstPin('');
    setErrorMsg('');
  };

  const handleBack = () => {
    if (viewMode === 'menu') {
      onBack();
    } else if (viewMode === 'enter_pass') {
      if (isModifying) {
        setViewMode('verify_old');
      } else {
        setViewMode('menu');
      }
      handleReset();
    } else if (viewMode === 'confirm_pass') {
      setViewMode('enter_pass');
      setPin('');
    } else if (viewMode === 'verify_old') {
      setViewMode('menu');
      handleReset();
    }
  };

  const getHeaderTitle = () => {
    if (viewMode === 'menu') return '支付密码';
    if (viewMode === 'verify_old') return '验证旧密码';
    if (viewMode === 'enter_pass') return isModifying ? '设置新密码' : '设置支付密码';
    if (viewMode === 'confirm_pass') return '确认支付密码';
    return '支付密码';
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300 relative">
      {/* Header */}
      <div className="pt-12 pb-4 px-4 flex items-center gap-2 border-b">
        <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={handleBack} />
        <h2 className="text-lg font-bold">{getHeaderTitle()}</h2>
      </div>

      {viewMode === 'menu' ? (
        // Option select screen
        <div className="flex-1 flex flex-col justify-between p-6">
          <div className="space-y-6">
            <div className="border-b border-gray-100 divide-y divide-gray-100 bg-white">
              {!hasPassword ? (
                // First-time option
                <div 
                  onClick={() => {
                    setIsModifying(false);
                    handleReset();
                    setViewMode('enter_pass');
                  }}
                  className="flex items-center justify-between py-4 px-2 active:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">设置积分商城兑换密码</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">首次设置支付密码以保障资金安全</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              ) : (
                // Subsequent options
                <>
                  <div 
                    onClick={() => {
                      setIsModifying(true);
                      handleReset();
                      setViewMode('verify_old');
                    }}
                    className="flex items-center justify-between py-4 px-2 active:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">修改支付密码</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">定期更换密码，账户更安全</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>

                  <div 
                    onClick={() => {
                      setIsModifying(false);
                      handleReset();
                      setViewMode('enter_pass');
                    }}
                    className="flex items-center justify-between py-4 px-2 active:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">重置密码</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">忘记密码或需要直接重置</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Pin Entry Screen (for verify_old, enter_pass, confirm_pass)
        <div className="flex-1 flex flex-col justify-between p-6">
          <div className="text-center pt-6">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
              <Lock className="w-4 h-4 text-gray-500" />
            </div>
            <h3 className="text-base font-bold text-gray-800">
              {viewMode === 'verify_old' && '请输入原支付密码'}
              {viewMode === 'enter_pass' && (isModifying ? '请输入新的支付密码' : '请输入支付密码')}
              {viewMode === 'confirm_pass' && '请再次输入支付密码'}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {viewMode === 'confirm_pass' ? '请确保两次输入的密码完全一致' : '支付密码为6位数字，请勿泄露给他人'}
            </p>

            {/* Code Boxes + Eye Toggle */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="flex justify-center gap-3">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg font-bold transition-all ${
                      pin.length > i ? 'border-donghai bg-donghai/5 text-gray-800' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    {pin.length > i && (
                      showPin ? (
                        <span className="text-gray-800 font-mono text-base">{pin[i]}</span>
                      ) : (
                        <span className="text-gray-800 font-mono text-base">*</span>
                      )
                    )}
                  </div>
                ))}
              </div>
              <button 
                type="button"
                onClick={() => setShowPin(!showPin)} 
                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 border border-gray-100 active:scale-95 transition-all ml-1 shrink-0"
              >
                {showPin ? <Eye className="w-4 h-4 text-gray-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 mt-4 animate-bounce">{errorMsg}</p>
            )}
          </div>

          {/* Number Keyboard */}
          <div className="pb-8">
            <div className="grid grid-cols-3 gap-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <Button 
                  key={num}
                  variant="outline"
                  className="h-14 rounded-2xl text-lg font-bold bg-gray-50/50 hover:bg-gray-100 border-none shadow-none text-gray-700"
                  onClick={() => handleNumberClick(num)}
                >
                  {num}
                </Button>
              ))}
              <Button 
                variant="ghost" 
                className="h-14 rounded-2xl text-xs text-gray-400"
                onClick={handleReset}
              >
                重置
              </Button>
              <Button 
                variant="outline"
                className="h-14 rounded-2xl text-lg font-bold bg-gray-50/50 hover:bg-gray-100 border-none shadow-none text-gray-700"
                onClick={() => handleNumberClick('0')}
              >
                0
              </Button>
              <Button 
                variant="ghost" 
                className="h-14 rounded-2xl text-xs text-gray-400"
                onClick={handleDelete}
              >
                删除
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Incorrect Password Error Modal */}
      <AnimatePresence>
        {showErrorModal && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[250] p-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-xs text-center shadow-2xl border border-gray-100"
            >
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <h4 className="text-sm font-bold text-gray-800">支付密码错误</h4>
              <p className="text-xs text-gray-500 mt-2">
                支付密码错误，请重试
              </p>
              <div className="mt-5">
                <Button 
                  className="w-full rounded-full bg-donghai hover:bg-donghai/90 text-white font-bold h-10 text-xs"
                  onClick={() => {
                    setShowErrorModal(false);
                    setPin('');
                  }}
                >
                  重试
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[250] p-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-xs text-center shadow-2xl border border-gray-100"
            >
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <h4 className="text-sm font-bold text-gray-800">设置成功</h4>
              <p className="text-xs text-gray-500 mt-2">
                您的支付密码已成功保存
              </p>
              <div className="mt-5">
                <Button 
                  className="w-full rounded-full bg-donghai hover:bg-donghai/90 text-white font-bold h-10 text-xs"
                  onClick={() => {
                    setShowSuccessModal(false);
                    onBack();
                  }}
                >
                  我知道了
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Settings({ onBack, initialSubPage = null }: SettingsProps) {
  const { userInfo, updateUser } = useAuth();
  const [personalizedAds, setPersonalizedAds] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeSubPage, setActiveSubPage] = useState<string | null>(initialSubPage);
  const [realName, setRealName] = useState('');
  const [idNumber, setIdNumber] = useState('');

  const renderSubPage = () => {
    switch (activeSubPage) {
      case 'idAuth':
        if (!userInfo?.isIdVerified) {
          return (
            <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
              <div className="pt-12 pb-4 px-4 flex items-center gap-2 border-b">
                <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => {
                  if (initialSubPage === 'idAuth') {
                    onBack();
                  } else {
                    setActiveSubPage(null);
                  }
                }} />
                <h2 className="text-lg font-bold">实名认证</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center mb-10 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-donghai" />
                  </div>
                  <h3 className="text-lg font-bold">未认证实名信息</h3>
                  <p className="text-xs text-gray-400 mt-2">根据民航安全管理要求，购票及赔付需完成实名认证</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">真实姓名</label>
                    <input 
                      type="text" 
                      placeholder="请输入您的真实姓名"
                      value={realName}
                      onChange={(e) => setRealName(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-donghai transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">证件类型</label>
                    <select className="w-full bg-gray-50 border-none rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-donghai transition-all">
                      <option>中国居民身份证</option>
                      <option>护照</option>
                      <option>港澳居民来往内地通行证</option>
                      <option>台湾居民来往大陆通行证</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">证件号码</label>
                    <input 
                      type="text" 
                      placeholder="请输入您的证件号码"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-donghai transition-all"
                    />
                  </div>
                </div>

                <div className="mt-10">
                  <Button 
                    className="w-full bg-donghai text-white rounded-xl h-12 font-bold"
                    onClick={async () => {
                      if (!realName || !idNumber) {
                        alert('请完善姓名和证件号码');
                        return;
                      }
                      await updateUser({ isIdVerified: true });
                      alert('认证申请已提交，审核约需1-3个工作日');
                      if (initialSubPage === 'idAuth') {
                        onBack();
                      } else {
                        setActiveSubPage(null);
                      }
                    }}
                  >
                    提交认证
                  </Button>
                </div>

                <p className="mt-6 text-[10px] text-gray-400 leading-relaxed text-center px-4">
                  认证过程将按照《隐私政策》严格保护个人信息安全，仅用于身份核验。
                </p>
              </div>
            </div>
          );
        }
        return (
          <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
            <div className="pt-12 pb-4 px-4 flex items-center gap-2 border-b">
              <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => {
                if (initialSubPage === 'idAuth') {
                  onBack();
                } else {
                  setActiveSubPage(null);
                }
              }} />
              <h2 className="text-lg font-bold">实名认证</h2>
            </div>
            <div className="p-6">
              <div className="bg-green-50 rounded-2xl p-6 flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-green-800">已通过实名认证</h3>
                <p className="text-xs text-green-600/70 mt-1">您的信息已受国家密级保护</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-400">真实姓名</span>
                  <span className="text-sm font-medium text-gray-800">张*海</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-400">证件类型</span>
                  <span className="text-sm font-medium text-gray-800">中国居民身份证</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-400">证件号码</span>
                  <span className="text-sm font-medium text-gray-800">4403**********1234</span>
                </div>
              </div>
              <p className="mt-8 text-[10px] text-gray-400 leading-relaxed">
                温馨提示：实名信息是东海航空认证您真实身份的重要依据，一旦认证成功暂不支持自主修改。如需变更请联系官方客服。
              </p>
            </div>
          </div>
        );
      case 'phone':
        return (
          <PhoneBindingPage 
            userInfo={userInfo} 
            onBack={() => {
              if (initialSubPage === 'phone') {
                onBack();
              } else {
                setActiveSubPage(null);
              }
            }} 
            updateUser={updateUser} 
          />
        );
      case 'payPassword':
        return (
          <PayPasswordPage 
            userInfo={userInfo} 
            onBack={() => {
              if (initialSubPage === 'payPassword') {
                onBack();
              } else {
                setActiveSubPage(null);
              }
            }} 
            updateUser={updateUser} 
          />
        );
      case 'employeeAuth':
        return (
          <EmployeeAuth 
            onBack={() => {
              if (initialSubPage === 'employeeAuth') {
                onBack();
              } else {
                setActiveSubPage(null);
              }
            }} 
          />
        );
      default:
        return null;
    }
  };

  if (activeSubPage) {
    return renderSubPage();
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-50 border-b">
        <div className="flex items-center gap-2">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-lg font-bold">设置</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Account Security */}
        <div>
          <div className="px-2 mb-2 text-xs font-medium text-gray-400">账号与安全</div>
          <Card className="overflow-hidden border-none shadow-sm bg-white rounded-2xl">
            <div 
              className="flex items-center justify-between p-4 active:bg-gray-50 cursor-pointer"
              onClick={() => setActiveSubPage('idAuth')}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-800">实名认证</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className={userInfo?.isIdVerified ? 'text-green-500' : 'text-gray-400'}>
                  {userInfo?.isIdVerified ? '已认证' : '未认证'}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </div>

            <div 
              className="flex items-center justify-between p-4 active:bg-gray-50 cursor-pointer border-t border-gray-50"
              onClick={() => setActiveSubPage('phone')}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-800">手机绑定</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-gray-400">
                  {userInfo?.phone ? userInfo.phone : '未绑定'}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </div>
          </Card>
        </div>

        <div className="py-8 text-center text-[10px] text-gray-400">
          东海航空服务平台 版权所有
        </div>
      </div>

    </div>
  );
}

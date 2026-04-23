import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Shield, 
  Lock, 
  Eye, 
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

export default function Settings({ onBack, initialSubPage = null }: SettingsProps) {
  const { userInfo, updateUser } = useAuth();
  const [personalizedAds, setPersonalizedAds] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
                <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => setActiveSubPage(null)} />
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
                      setActiveSubPage(null);
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
              <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => setActiveSubPage(null)} />
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
        return <PhoneBindingPage userInfo={userInfo} onBack={() => setActiveSubPage(null)} updateUser={updateUser} />;
      case 'permissions':
        const permissions = [
          { name: '相机权限', desc: '用于拍照上传头像、订单评价等', status: true },
          { name: '地理位置', desc: '为您推荐附近的机场及服务内容', status: true },
          { name: '通知提醒', desc: '第一时间获知订单动态与优惠信息', status: true },
          { name: '相册访问', desc: '用于选取照片上传、保存图片等', status: true },
        ];
        return (
          <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
            <div className="pt-12 pb-4 px-4 flex items-center gap-2 border-b">
              <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => setActiveSubPage(null)} />
              <h2 className="text-lg font-bold">权限管理</h2>
            </div>
            <div className="p-4 space-y-4">
              {permissions.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-800">{p.name}</div>
                    <div className="text-[10px] text-gray-400 mt-1">{p.desc}</div>
                  </div>
                  <Switch defaultChecked={p.status} />
                </div>
              ))}
              <p className="text-center text-[10px] text-gray-400 pt-4">您可以根据需要随时开启或关闭相关权限</p>
            </div>
          </div>
        );
      case 'employeeAuth':
        return <EmployeeAuth onBack={() => setActiveSubPage(null)} />;
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
              className="flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50 cursor-pointer"
              onClick={() => setActiveSubPage('phone')}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-800">手机绑定</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>{userInfo?.phone ? userInfo.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '未绑定'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            <div 
              className="flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50 cursor-pointer"
              onClick={() => setActiveSubPage('idAuth')}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-800">实名认证</span>
              </div>
              <div className={`flex items-center gap-1 text-xs ${userInfo?.isIdVerified ? 'text-green-500' : 'text-donghai font-medium'}`}>
                <span>{userInfo?.isIdVerified ? '已认证' : '去认证'}</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </div>
            <div 
              className="flex items-center justify-between p-4 active:bg-gray-50 cursor-pointer"
              onClick={() => setActiveSubPage('employeeAuth')}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-800">员工内购认证</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className={
                  userInfo?.employeeAuth?.status === 'approved' ? 'text-green-500' :
                  userInfo?.employeeAuth?.status === 'pending' ? 'text-orange-500' :
                  userInfo?.employeeAuth?.status === 'rejected' ? 'text-red-500' :
                  'text-gray-400'
                }>
                  {userInfo?.employeeAuth?.status === 'approved' ? '已认证' :
                   userInfo?.employeeAuth?.status === 'pending' ? '审核中' :
                   userInfo?.employeeAuth?.status === 'rejected' ? '未通过' : '未认证'}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </div>
          </Card>
        </div>

        {/* Privacy Settings */}
        <div>
          <div className="px-2 mb-2 text-xs font-medium text-gray-400">隐私设置</div>
          <Card className="overflow-hidden border-none shadow-sm bg-white rounded-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-gray-500" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-800">个性化推荐</span>
                    <Info className="w-3 h-3 text-gray-400 cursor-pointer" onClick={() => setShowInfoModal(true)} />
                  </div>
                </div>
              </div>
              <Switch checked={personalizedAds} onChange={(e) => setPersonalizedAds(e.target.checked)} />
            </div>
            <div 
              className="flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50 cursor-pointer"
              onClick={() => setActiveSubPage('permissions')}
            >
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-800">权限管理</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
            <div 
              className="flex items-center justify-between p-4 active:bg-gray-50 cursor-pointer text-red-500"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-red-400" />
                <span className="text-sm">注销账号</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </Card>
        </div>

        {/* System Settings */}
        <div>
          <div className="px-2 mb-2 text-xs font-medium text-gray-400">系统</div>
          <Card className="overflow-hidden border-none shadow-sm bg-white rounded-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-800">消息通知</span>
              </div>
              <Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
            </div>
            <div className="flex items-center justify-between p-4 active:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-800">版本信息</span>
              </div>
              <span className="text-xs text-gray-400">v2.1.0</span>
            </div>
          </Card>
        </div>

        <div className="py-8 text-center text-[10px] text-gray-400">
          东海航空服务平台 版权所有
        </div>
      </div>

      {/* Info Modal for Personalized Recommendations */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfoModal(false)}
              className="absolute inset-0 bg-black/60"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl z-10"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold">关于个性化推荐</h3>
                <X className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => setShowInfoModal(false)} />
              </div>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  个性化推荐指的是系统根据您的<span className="text-donghai font-bold">历史订单、搜索习惯和浏览偏好</span>，为您展示更符合您兴趣的商品和优惠信息。
                </p>
                <div className="bg-gray-50 p-4 rounded-2xl flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-xs text-gray-500">开启后：您将更高效地发现感兴趣的低价航班和旅游服务。</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl flex gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <p className="text-xs text-gray-500">关闭后：推荐内容的相关度可能会降低，您将看到更多通用型信息。</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowInfoModal(false)}
                className="w-full mt-6 bg-donghai text-white rounded-xl h-12 font-bold"
              >
                我知道了
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Delete Account Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-black/60"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl z-10 text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">确认注销账号？</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                注销后，您的账号信息、积分、订单历史将<span className="text-red-500 font-bold">被永久删除且无法找回</span>。请谨慎操作。
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-xl h-12"
                >
                  取消
                </Button>
                <Button 
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    alert('注销申请已提交，工作人员将在7个工作日内与您核实');
                  }}
                  className="bg-red-500 text-white rounded-xl h-12"
                >
                  确认注销
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

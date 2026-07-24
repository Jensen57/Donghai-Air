import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  ChevronRight, 
  Wallet, 
  Ticket, 
  Star, 
  Clock, 
  ShieldAlert, 
  Headphones, 
  LogOut,
  UserCircle,
  ShieldCheck,
  Bell,
  HelpCircle,
  Edit3,
  RefreshCw,
  AlertCircle,
  Heart,
  CheckCircle2,
  Plane,
  Coins,
  Lock,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import EditProfileModal from './EditProfileModal';
import MessageCenter from './MessageCenter';
import HelpCenter from './HelpCenter';
import Favorites from './Favorites';
import AddressManagement from './AddressManagement';
import Feedback from './Feedback';

export default function Profile({ onCheckout, onTabChange, onShowAfterSales, onShowCompensation, onShowEmployeeAuth, onShowEmployeeMall, onShowInternalOrders, onShowPointsCenter, onShowPointsMall, onShowLogin, onShowCustomerService, onShowSettings, onShowPayPassword }: { 
  onCheckout: (items: any[]) => void, 
  onTabChange: (tab: any, id?: string) => void, 
  onShowAfterSales: () => void, 
  onShowCompensation: () => void,
  onShowEmployeeAuth: () => void,
  onShowEmployeeMall: () => void,
  onShowInternalOrders: () => void,
  onShowPointsCenter: () => void,
  onShowPointsMall: () => void,
  onShowLogin: () => void,
  onShowCustomerService: () => void,
  onShowSettings: () => void,
  onShowPayPassword: () => void
}) {
  const { isLoggedIn, userInfo, logout } = useAuth();

  const handleEmployeeAuthClick = () => {
    if (userInfo?.isEmployee) {
      onShowEmployeeMall();
    } else {
      onShowEmployeeAuth();
    }
  };
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      // Simulate page loading
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  if (showMessages) {
    return <MessageCenter onBack={() => setShowMessages(false)} onNavigate={(type, id) => {
      setShowMessages(false);
      if (type === 'order') {
        onTabChange('orders', id);
      } else if (type === 'compensation') {
        onShowCompensation();
      }
    }} />;
  }

  if (showHelp) {
    return <HelpCenter onBack={() => setShowHelp(false)} />;
  }

  if (showFavorites) {
    return <Favorites onBack={() => setShowFavorites(false)} onCheckout={onCheckout} onShowLogin={onShowLogin} onTabChange={onTabChange} onShowCustomerService={onShowCustomerService} />;
  }

  if (showAddresses) {
    return <AddressManagement onBack={() => setShowAddresses(false)} />;
  }

  if (showFeedback) {
    return <Feedback onBack={() => setShowFeedback(false)} />;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 px-6">
        <UserCircle className="w-20 h-20 text-gray-200 mb-4" />
        <h2 className="text-lg font-bold text-gray-800 mb-2">未登录</h2>
        <p className="text-sm text-gray-500 text-center mb-8">登录后可查看订单、积分、赔付记录等隐私信息</p>
        <Button 
          onClick={onShowLogin} 
          className="bg-donghai text-white rounded-full px-12 h-12 font-bold"
        >
          去登录
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <RefreshCw className="w-8 h-8 text-donghai animate-spin mb-4" />
        <p className="text-sm text-gray-400">加载中...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Top Header - Gradient background with ample padding for MiniProgram capsule */}
      <div className="bg-gradient-to-b from-[#006687] to-[#00516b] text-white px-5 pt-14 pb-5 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img 
                src={userInfo?.avatar || 'https://picsum.photos/seed/avatar/100/100'} 
                alt="avatar" 
                className="w-13 h-13 rounded-full border-2 border-white/50 shadow-md object-cover"
              />
              {userInfo?.isEmployee && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1 border-2 border-[#00516b] z-20 shadow">
                  <ShieldCheck className="w-3 h-3 text-donghai" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-wide">{userInfo?.nickname}</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowEditModal(true)}
                  className="w-5 h-5 rounded-full bg-white/15 hover:bg-white/25 p-0 transition-colors"
                >
                  <Edit3 className="w-2.5 h-2.5 text-white/95" />
                </Button>
              </div>
              {userInfo && userInfo.isEmployee && userInfo.employeeAuth?.status === 'approved' && (
                <div className="mt-1">
                  <div className="border border-white/30 text-white bg-white/15 px-2 py-0.5 rounded-full text-[9px] font-medium backdrop-blur-sm tracking-wider inline-block">
                    已认证员工
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Decorative background logo */}
        <div className="absolute top-0 right-0 w-36 h-36 opacity-[0.08] -mr-8 -mt-8 pointer-events-none">
          <Plane className="w-full h-full text-white" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-3 pb-24">
        {/* Menu List */}
        <Card className="overflow-hidden border-none shadow-sm bg-white rounded-2xl">
          {[
            { icon: Coins, label: '积分中心', extra: '', onClick: onShowPointsCenter },
            { icon: ShieldCheck, label: '旅客赔付', extra: '', onClick: onShowCompensation },
            { 
              icon: ShieldCheck, 
              label: '员工认证', 
              extra: userInfo?.employeeAuth?.status === 'approved' ? '已认证' :
                     userInfo?.employeeAuth?.status === 'pending' ? '审核中' :
                     userInfo?.employeeAuth?.status === 'rejected' ? '未通过' : '未认证',
              extraClass: userInfo?.employeeAuth?.status === 'approved' ? 'text-green-500' :
                          userInfo?.employeeAuth?.status === 'pending' ? 'text-orange-500' :
                          userInfo?.employeeAuth?.status === 'rejected' ? 'text-red-500' :
                          'text-gray-400',
              onClick: onShowEmployeeAuth 
            },
            { 
              icon: Lock, 
              label: '设置支付密码', 
              extra: userInfo?.paymentPassword ? '已设置' : '未设置',
              extraClass: userInfo?.paymentPassword ? 'text-green-500' : 'text-gray-400',
              onClick: onShowPayPassword 
            },
            { 
              icon: MapPin, 
              label: '地址管理', 
              extra: '', 
              onClick: () => setShowAddresses(true) 
            },
            { icon: Headphones, label: '联系客服', extra: '', onClick: onShowCustomerService },
          ].map((item, index, arr) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                onClick={item.onClick}
                className={`flex items-center justify-between p-3.5 active:bg-gray-50 transition-colors ${
                  index !== arr.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-800">{item.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-xs ${item.extraClass || 'text-gray-400'}`}>
                    {item.extra}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            );
          })}
        </Card>

        <Button 
          variant="ghost" 
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full text-red-500 bg-white hover:bg-red-50 h-10 rounded-2xl font-medium flex items-center justify-center gap-2 shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          退出登录
        </Button>
      </div>

      {/* Modals */}
      <EditProfileModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} />

      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center px-8">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full rounded-3xl p-6 text-center shadow-2xl"
            >
              <h3 className="text-lg font-bold mb-6">确认退出</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="rounded-xl h-11"
                >
                  取消
                </Button>
                <Button 
                  onClick={() => {
                    logout();
                    setShowLogoutConfirm(false);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-11"
                >
                  确认退出
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

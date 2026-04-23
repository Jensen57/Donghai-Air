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
  CreditCard,
  Box,
  Truck,
  MessageSquare,
  ShieldCheck,
  Bell,
  HelpCircle,
  Edit3,
  RefreshCw,
  AlertCircle,
  Heart,
  CheckCircle2,
  Plane
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import EditProfileModal from './EditProfileModal';
import MessageCenter from './MessageCenter';
import HelpCenter from './HelpCenter';
import Favorites from './Favorites';
import AddressManagement from './AddressManagement';
import SettingsView from './Settings';
import Feedback from './Feedback';

export default function Profile({ onCheckout, onTabChange, onShowAfterSales, onShowCompensation, onShowEmployeeAuth, onShowEmployeeMall, onShowInternalOrders, onShowPointsCenter, onShowPointsMall, onShowLogin, onShowCustomerService, initialSettingSubPage = null, clearInitialSettingSubPage }: { 
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
  initialSettingSubPage?: string | null,
  clearInitialSettingSubPage?: () => void
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
  const [showSettings, setShowSettings] = useState(!!initialSettingSubPage);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialSettingSubPage) {
      setShowSettings(true);
    }
  }, [initialSettingSubPage]);

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

  if (showSettings) {
    return <SettingsView onBack={() => setShowSettings(false)} initialSubPage={initialSettingSubPage} />;
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

  const orderTabs = [
    { icon: CreditCard, label: '待付款', count: userInfo?.orderCounts?.pendingPayment },
    { icon: Box, label: '待发货', count: userInfo?.orderCounts?.pendingShipment },
    { icon: Truck, label: '待收货', count: userInfo?.orderCounts?.pendingReceipt },
    { icon: MessageSquare, label: '待售后', count: userInfo?.orderCounts?.afterSales, onClick: onShowAfterSales },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-donghai text-white px-6 pt-16 pb-16 relative overflow-hidden">
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={userInfo?.avatar || 'https://picsum.photos/seed/avatar/100/100'} 
                alt="avatar" 
                className="w-16 h-16 rounded-full border-2 border-white/30 shadow-lg object-cover"
              />
              {userInfo?.isEmployee && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1 border-2 border-donghai z-20">
                  <ShieldCheck className="w-3 h-3 text-donghai" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{userInfo?.nickname}</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowEditModal(true)}
                  className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 p-0"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {userInfo && userInfo.isEmployee && userInfo.employeeAuth?.status === 'approved' && (
                  <div className="border border-white/40 text-white bg-white/20 px-1.5 py-0.5 rounded-full text-[9px] font-medium backdrop-blur-sm">
                    已认证员工
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative cursor-pointer" onClick={() => setShowMessages(true)}>
              <Bell className="w-5 h-5 opacity-70" />
              {userInfo?.unreadMessagesCount && userInfo.unreadMessagesCount > 0 ? (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] h-3.5 min-w-[14px] flex items-center justify-center p-0 border-none">
                  {userInfo.unreadMessagesCount}
                </Badge>
              ) : null}
            </div>
            <Settings className="w-5 h-5 opacity-70 cursor-pointer" onClick={() => {
              clearInitialSettingSubPage?.();
              setShowSettings(true);
            }} />
          </div>
        </div>

        {/* Points Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between relative z-10 border border-white/10 mb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>
            <div>
              <div className="text-xs opacity-70">积分余额</div>
              <div className="text-lg font-bold">{userInfo?.points}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] opacity-60">有效期至: {userInfo?.pointsExpiry}</div>
            <div className="flex flex-col items-end gap-1 mt-1">
              <Button 
                onClick={onShowPointsCenter}
                className="bg-yellow-400 text-donghai text-[10px] font-bold h-6 px-3 rounded-full hover:bg-yellow-300"
              >
                积分中心
              </Button>
              <Button variant="link" className="text-white text-[10px] p-0 h-auto" onClick={onShowPointsCenter}>积分明细 &gt;</Button>
            </div>
          </div>
        </div>

        {/* Decorative background logo */}
        <div className="absolute top-0 right-0 w-48 h-48 opacity-10 -mr-12 -mt-12 pointer-events-none">
          <Plane className="w-full h-full text-white" />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 mt-4 relative z-20 pb-20 space-y-2">
        
        {/* Order Management */}
        <Card className="p-3 border-none shadow-sm bg-white rounded-2xl active:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between mb-3" onClick={() => onTabChange('orders')}>
            <h3 className="text-sm font-bold text-gray-800">订单管理</h3>
            <div className="flex items-center text-[10px] text-gray-400">
              全部订单 <ChevronRight className="w-3 h-3" />
            </div>
          </div>
          <div className="flex items-center justify-around mb-4">
            {orderTabs.map((tab: any, i) => (
              <div key={i} className="text-center flex-1 relative" onClick={tab.onClick || (() => onTabChange('orders'))}>
                <div className="text-lg font-bold text-gray-800">{tab.count || 0}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{tab.label}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {[
              { label: '实物订单', onClick: () => onTabChange('orders') },
              { label: '内购订单', onClick: onShowInternalOrders },
              { label: '地址管理', onClick: () => setShowAddresses(true) }
            ].map((item) => (
              <Button 
                key={item.label} 
                variant="ghost"
                onClick={item.onClick}
                className="flex-1 h-8 bg-gray-50 hover:bg-gray-100 rounded-full text-[10px] text-gray-600 font-medium border-none"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Compensation Records */}
        <Card className="p-3 border-none shadow-sm bg-white rounded-2xl active:bg-gray-50 transition-colors" onClick={onShowCompensation}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-800">赔付记录</h3>
            <div className="flex items-center text-[10px] text-gray-400">
              查看详情 <ChevronRight className="w-3 h-3" />
            </div>
          </div>
          <div className="flex items-center justify-around">
            {[
              { label: '待审核', count: userInfo?.compensationCounts.pendingAudit || 0 },
              { label: '赔付中', count: userInfo?.compensationCounts.processing || 0 },
              { label: '已到账', count: userInfo?.compensationCounts.completed || 0 },
            ].map((tab, i) => (
              <div key={i} className="text-center">
                <div className="text-lg font-bold text-gray-800">{tab.count}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{tab.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Menu List */}
        <Card className="overflow-hidden border-none shadow-sm bg-white rounded-2xl">
          {[
            { icon: Heart, label: '我的收藏', extra: `${userInfo?.favorites?.length || 0}件`, onClick: () => setShowFavorites(true) },
            { icon: Bell, label: '消息中心', extra: `${userInfo?.unreadMessagesCount || 0}条未读`, onClick: () => setShowMessages(true) },
            { icon: HelpCircle, label: '帮助中心', extra: '', onClick: () => setShowHelp(true) },
            { icon: MessageSquare, label: '意见反馈', extra: '', onClick: () => setShowFeedback(true) },
            { icon: Settings, label: '设置', extra: '', onClick: () => {
              clearInitialSettingSubPage?.();
              setShowSettings(true);
            } },
          ].map((item, index, arr) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                onClick={item.onClick}
                className={`flex items-center justify-between p-3 active:bg-gray-50 transition-colors ${
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
                  <span className={`text-xs ${item.extra === '去认证' ? 'text-donghai font-medium' : 'text-gray-400'}`}>
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
              <h3 className="text-lg font-bold mb-2">确认退出</h3>
              <p className="text-sm text-gray-500 mb-6">退出后将无法查看个人隐私信息，确认退出登录吗？</p>
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

import React from 'react';
import { ShoppingBag, ShoppingCart, FileText, User } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onShowLogin: () => void;
}

export default function BottomNav({ activeTab, setActiveTab, onShowLogin }: BottomNavProps) {
  const { userInfo } = useAuth();
  const navItems = [
    { id: 'mall', label: '商城', icon: ShoppingBag },
    { id: 'cart', label: '购物车', icon: ShoppingCart, requireAuth: true },
    { id: 'orders', label: '订单', icon: FileText, requireAuth: true },
    { id: 'profile', label: '个人主页', icon: User },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 flex items-center justify-around h-[76px] pb-5 px-4 z-[100] shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.requireAuth && !userInfo) {
                onShowLogin();
                return;
              }
              setActiveTab(item.id);
            }}
            className={`flex flex-col items-center justify-center flex-1 transition-colors ${
              isActive ? 'text-donghai' : 'text-gray-400'
            }`}
          >
            <div className="relative">
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-donghai/10' : ''}`} />
              {item.id === 'cart' && userInfo?.cart && userInfo.cart.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-donghai text-white text-[8px] font-bold px-1 py-0.5 rounded-full border border-white min-w-[16px] text-center shadow-sm">
                  {userInfo.cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0) > 99 ? '99+' : userInfo.cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0)}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

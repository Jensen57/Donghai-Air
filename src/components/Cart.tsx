import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Trash2, 
  Plus, 
  Minus, 
  Check, 
  ShoppingCart,
  ArrowRight,
  AlertCircle,
  Coins,
  MapPin,
  UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import AddressManagement from './AddressManagement';

export default function Cart({ onBack, onCheckout }: { onBack: () => void, onCheckout: (selectedItems: any[]) => void }) {
  const { userInfo, updateCartQuantity, removeFromCart, clearCart } = useAuth();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'normal' | 'points' | 'internal'>('all');
  const [showAddressManagement, setShowAddressManagement] = useState(false);

  const cartItems = userInfo?.cart || [];
  
  const filteredItems = cartItems.filter(item => {
    if (activeTab === 'normal') return !item.isPointsOnly && !item.productId.startsWith('emp-');
    if (activeTab === 'points') return item.isPointsOnly;
    if (activeTab === 'internal') return item.productId.startsWith('emp-');
    return true;
  });

  const normalItems = filteredItems.filter(item => !item.isPointsOnly && !item.productId.startsWith('emp-'));
  const pointsItems = filteredItems.filter(item => item.isPointsOnly);
  const internalItems = filteredItems.filter(item => item.productId.startsWith('emp-'));

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map(item => item.id));
    }
  };

  const selectedItems = cartItems.filter(item => selectedIds.includes(item.id));
  const hasNormalSelected = selectedItems.some(item => !item.isPointsOnly && !item.productId.startsWith('emp-'));
  const hasPointsSelected = selectedItems.some(item => item.isPointsOnly);
  const hasInternalSelected = selectedItems.some(item => item.productId.startsWith('emp-'));
  
  const selectedTypesCount = [hasNormalSelected, hasPointsSelected, hasInternalSelected].filter(Boolean).length;
  const isMixedSelection = selectedTypesCount > 1;

  const totalPrice = selectedItems
    .filter(item => !item.isPointsOnly)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const totalPoints = selectedItems
    .filter(item => item.isPointsOnly)
    .reduce((sum, item) => sum + (item.points || 0) * item.quantity, 0);

  const [showIdAuthNeeded, setShowIdAuthNeeded] = useState(false);

  const handleCheckout = () => {
    if (isMixedSelection) {
      alert('不同类型的商品（普通、积分、内购）不能同时结算，请分别选择');
      return;
    }
    
    if (!userInfo?.isIdVerified) {
      setShowIdAuthNeeded(true);
      return;
    }

    onCheckout(selectedItems);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    clearCart(selectedIds);
    setSelectedIds([]);
    setShowDeleteConfirm(false);
  };

  const renderCartItem = (item: any) => (
    <Card key={item.id} className="p-3 border-none shadow-sm flex gap-3 relative overflow-hidden">
      <div 
        className={`w-5 h-5 rounded-full border flex items-center justify-center mt-8 transition-colors ${selectedIds.includes(item.id) ? 'bg-donghai border-donghai' : 'border-gray-300'}`}
        onClick={() => toggleSelect(item.id)}
      >
        {selectedIds.includes(item.id) && <Check className="w-3 h-3 text-white" />}
      </div>
      
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-20 h-20 rounded-lg object-cover bg-gray-50"
        referrerPolicy="no-referrer"
      />
      
      <div className="flex-1 flex flex-col justify-between py-0.5">
        <div>
          <h3 className="text-xs font-medium text-gray-800 line-clamp-1">{item.name}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(item.specs).map(([label, val]) => (
              <span key={label} className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                {val}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          {item.isPointsOnly ? (
            <div className="flex items-center gap-0.5 text-donghai font-bold text-sm">
              <Coins className="w-3.5 h-3.5" />
              <span>{item.points}</span>
            </div>
          ) : (
            <div className="text-donghai font-bold text-sm">¥{item.price}</div>
          )}
          <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-0.5">
            <button 
              className="w-6 h-6 flex items-center justify-center text-gray-400 disabled:opacity-30"
              disabled={item.quantity <= 1}
              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
            <button 
              className="w-6 h-6 flex items-center justify-center text-gray-400"
              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <button 
        className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500"
        onClick={() => removeFromCart(item.id)}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </Card>
  );

  if (showAddressManagement) {
    return <AddressManagement onBack={() => setShowAddressManagement(false)} />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-0 sticky top-0 z-50 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
            <h1 className="text-lg font-bold">购物车 ({cartItems.length})</h1>
            <div 
              onClick={() => setShowAddressManagement(true)}
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full cursor-pointer ml-1 active:bg-gray-200 transition-colors"
            >
              <MapPin className="w-3 h-3 text-donghai" />
              <span className="text-[10px] text-gray-600">收货地址</span>
            </div>
          </div>
          {cartItems.length > 0 && (
            <div className="flex gap-4">
              <span className="text-sm text-red-500" onClick={handleBatchDelete}>
                批量删除
              </span>
              <span className="text-sm text-gray-500" onClick={toggleSelectAll}>
                {selectedIds.length === filteredItems.length ? '取消全选' : '全选'}
              </span>
            </div>
          )}
        </div>
        
        {/* Tabs */}
        <div className="flex gap-6 px-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: '全部' },
            { id: 'normal', label: '普通商品' },
            { id: 'points', label: '积分换购' },
            ...(userInfo?.isEmployee ? [{ id: 'internal', label: '内购专区' }] : [])
          ].map(tab => (
            <div 
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedIds([]);
              }}
              className={`pb-3 text-sm transition-all relative ${activeTab === tab.id ? 'text-donghai font-bold' : 'text-gray-500'}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="cartTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-donghai"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        {activeTab !== 'points' && normalItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <ShoppingCart className="w-4 h-4 text-donghai" />
              <h2 className="text-xs font-bold text-gray-800">普通商品</h2>
            </div>
            {normalItems.map(renderCartItem)}
          </div>
        )}

        {activeTab !== 'normal' && pointsItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Coins className="w-4 h-4 text-orange-500" />
              <h2 className="text-xs font-bold text-gray-800">积分换购</h2>
            </div>
            {pointsItems.map(renderCartItem)}
          </div>
        )}

        {activeTab !== 'normal' && activeTab !== 'points' && internalItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              <h2 className="text-xs font-bold text-gray-800">内购专区</h2>
            </div>
            {internalItems.map(renderCartItem)}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ShoppingCart className="w-16 h-16 mb-4 opacity-10" />
            <p className="text-sm">暂无相关商品</p>
            <Button 
              variant="outline" 
              className="mt-6 rounded-full border-donghai text-donghai"
              onClick={onBack}
            >
              去逛逛
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="absolute bottom-[76px] left-0 right-0 bg-white/95 backdrop-blur-md border-t px-4 py-3 flex items-center justify-between z-[60] shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 cursor-pointer" onClick={toggleSelectAll}>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedIds.length === filteredItems.length ? 'bg-donghai border-donghai' : 'border-gray-300'}`}>
              {selectedIds.length === filteredItems.length && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-xs text-gray-500">全选</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] text-gray-400">合计</div>
              <div className="flex flex-col items-end">
                {totalPrice > 0 && <div className="text-donghai font-bold text-lg">¥{totalPrice}</div>}
                {totalPoints > 0 && (
                  <div className="flex items-center gap-0.5 text-donghai font-bold text-sm">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{totalPoints}</span>
                  </div>
                )}
              </div>
            </div>
            <Button 
              disabled={selectedIds.length === 0 || isMixedSelection}
              onClick={handleCheckout}
              className={`rounded-full px-8 h-11 font-bold shadow-lg shadow-donghai/20 ${
                isMixedSelection 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-donghai hover:bg-donghai-light text-white'
              }`}
            >
              {isMixedSelection ? '不可混合结算' : `结算 (${selectedIds.length})`}
            </Button>
          </div>
        </div>
      )}
      {/* Delete Confirmation Overlay */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-[32px] p-6 w-full max-w-xs text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">确认删除</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                确定要从购物车中删除选中的 {selectedIds.length} 件商品吗？
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  className="flex-1 rounded-full h-11 font-bold border-gray-100"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  取消
                </Button>
                <Button 
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-full h-11 font-bold"
                  onClick={confirmDelete}
                >
                  确定删除
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Real-name Auth Required Modal */}
      <AnimatePresence>
        {showIdAuthNeeded && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIdAuthNeeded(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-[32px] p-6 w-full max-w-xs text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCircle className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">提示</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">根据相关规定，您需要先完成实名认证后方可进行交易。</p>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  className="flex-1 rounded-full h-11 font-bold border-gray-100 text-gray-600"
                  onClick={() => {
                    setShowIdAuthNeeded(false);
                  }}
                >
                  稍后
                </Button>
                <Button 
                  className="flex-1 bg-donghai text-white rounded-full h-11 font-bold"
                  onClick={() => {
                    setShowIdAuthNeeded(false);
                    const event = new CustomEvent('navigate-id-auth');
                    window.dispatchEvent(event);
                  }}
                >
                  去认证
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

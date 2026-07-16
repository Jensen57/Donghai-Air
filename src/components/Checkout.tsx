import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  MapPin, 
  ChevronRight, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Check,
  Coins,
  UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../context/AuthContext';
import AddressManagement from './AddressManagement';
import { DETAILED_PRODUCTS, POINTS_PRODUCTS, INTERNAL_PRODUCTS } from '../constants';

interface CheckoutProps {
  items: any[];
  onBack: () => void;
  onSuccess: (orderId: string) => void;
  onShowLogin: (step: 'auth' | 'phone') => void;
  onShowEmployeeAuth: () => void;
}

export default function Checkout({ items, onBack, onSuccess, onShowLogin, onShowEmployeeAuth }: CheckoutProps) {
  const { userInfo, clearCart, addOrder, updateOrderStatus, setShowBuyPoints } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'paying' | 'success' | 'failed'>('idle');
  const [paymentMethod, setPaymentMethod] = useState('微信支付');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const lastOrderId = React.useRef<string>('');
  const [showAddressManagement, setShowAddressManagement] = useState(false);
  const [showEmployeeAuthNeeded, setShowEmployeeAuthNeeded] = useState(false);
  const { updateUser } = useAuth();

  const defaultAddress = userInfo?.addresses.find(a => a.isDefault) || userInfo?.addresses[0];
  const totalPrice = 0;
  const totalPoints = items.reduce((sum, item) => sum + ((item.points || item.price || 0) * item.quantity), 0);

  const isPurePoints = true;

  const handleSubmit = async (phoneOverride?: string) => {
    if (orderId) {
      setShowPayment(true);
      return;
    }

    if (!defaultAddress) {
      alert('请先填写收货地址');
      return;
    }

    if (totalPoints > 0 && userInfo && userInfo.points < totalPoints) {
      alert(`您的积分不足（完成此订单需要 ${totalPoints} 积分，当前仅有 ${userInfo.points} 积分），点击确定去购买积分`);
      setShowBuyPoints(true);
      onBack();
      return;
    }

    // Employee internal purchase check
    const hasInternalItems = items.some(item => item.productId && item.productId.startsWith('emp-'));
    if (hasInternalItems) {
      if (!userInfo?.isEmployee || userInfo?.employeeAuth?.status !== 'approved') {
        setShowEmployeeAuthNeeded(true);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Create order
      const id = await addOrder({
        items: items.map(i => ({
          productId: i.productId,
          name: i.name,
          image: i.image,
          price: i.price,
          points: i.points,
          isPointsOnly: i.isPointsOnly,
          specs: i.specs,
          quantity: i.quantity
        })),
        totalAmount: totalPrice,
        totalPoints: totalPoints,
        address: defaultAddress,
        paymentMethod: isPurePoints ? '积分兑换' : paymentMethod
      });
      setOrderId(id);
      lastOrderId.current = id;
      setIsSubmitting(false);
      
      if (isPurePoints) {
        // For pure points, we can just "pay" immediately or show a confirm
        setShowPayment(true);
      } else {
        setShowPayment(true);
      }
    } catch (error) {
      setIsSubmitting(false);
      alert('订单创建失败，请重试');
    }
  };

  const handlePay = async () => {
    const currentOrderId = orderId || lastOrderId.current;
    if (!currentOrderId) {
      setPaymentStatus('failed');
      setErrorMessage('订单状态异常，请返回重试');
      return;
    }

    // Balance checkout validation
    if (!isPurePoints && paymentMethod === '余额支付') {
      const balance = userInfo?.balance || 0;
      if (balance < totalPrice) {
        setPaymentStatus('failed');
        setErrorMessage(`当前可用余额为 ¥${balance.toFixed(2)}，无法完成支付，请使用其他支付方式`);
        return;
      }
    }

    setPaymentStatus('paying');
    setErrorMessage('');
    
    try {
      if (totalPoints > 0 && userInfo) {
        // Deduct points
        // In a real app, this would be server-side
        // We'll simulate it by updating user points
        // The addOrder already handles some logic, but let's be explicit if needed
        // Actually, let's assume updateOrderStatus or a new function handles it
      }

      // Simulate payment process
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1500);
      });

      // Update order status
      await updateOrderStatus(currentOrderId, 'pendingShipment');
      
      // Update global stock and sales (Mutation of imported constants)
      items.forEach(item => {
        const globalItem = DETAILED_PRODUCTS.find(p => p.id === item.productId) || 
                           POINTS_PRODUCTS.find(p => p.id === item.productId) || 
                           INTERNAL_PRODUCTS.find(p => p.id === item.productId);
        if (globalItem) {
          globalItem.stock = Math.max(0, globalItem.stock - item.quantity);
          globalItem.sales = (globalItem.sales || 0) + item.quantity;
        }
      });

      // Clear purchased items from cart
      const cartItemIds = items.filter(i => !i.id.startsWith('temp_')).map(i => i.id);
      if (cartItemIds.length > 0) {
        clearCart(cartItemIds);
      }

      setPaymentStatus('success');
    } catch (error: any) {
      setPaymentStatus('failed');
      setErrorMessage(error.message || '支付异常，请稍后再试');
    }
  };

  if (showAddressManagement) {
    return <AddressManagement onBack={() => setShowAddressManagement(false)} />;
  }

  if (paymentStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white px-8">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">支付成功</h2>
        <p className="text-sm text-gray-500 text-center mb-1">您的订单已提交，我们将尽快为您安排发货</p>
        <p className="text-xs text-gray-400 mb-8">订单号：{orderId}</p>
        <div className="w-full space-y-3">
          <Button className="w-full bg-donghai text-white rounded-xl h-12 font-bold" onClick={() => onSuccess(orderId)}>查看订单</Button>
          <Button variant="ghost" className="w-full text-gray-400" onClick={onBack}>返回商城</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
        <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
        <h1 className="text-lg font-bold">确认订单</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {/* Address Section */}
        <Card 
          onClick={() => setShowAddressManagement(true)}
          className="p-4 border-none shadow-sm bg-white rounded-2xl flex items-center gap-3 active:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-donghai/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-donghai" />
          </div>
          <div className="flex-1">
            {defaultAddress ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-gray-800">{defaultAddress.receiver}</span>
                  <span className="text-xs text-gray-500">{defaultAddress.phone}</span>
                  {defaultAddress.isDefault && <Badge className="bg-donghai/10 text-donghai text-[8px] h-3.5 px-1 border-none">默认</Badge>}
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {defaultAddress.province}{defaultAddress.city}{defaultAddress.district}{defaultAddress.detail}
                </p>
              </>
            ) : (
              <span className="text-sm text-gray-400">请添加收货地址</span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </Card>

        {/* Items Section */}
        <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-gray-800 border-b pb-3">商品信息</h3>
          {items.map((item, i) => (
            <div key={i} className="flex gap-3">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <h4 className="text-xs text-gray-800 line-clamp-1">{item.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">
                    {Object.values(item.specs).join(' / ')}
                  </span>
                  <span className="text-xs text-gray-500">x{item.quantity}</span>
                </div>
                <div className="flex items-center gap-0.5 text-donghai font-bold text-sm">
                  <Coins className="w-3.5 h-3.5" />
                  <span>{item.points || item.price} 积分</span>
                </div>
              </div>
            </div>
          ))}
        </Card>

        {/* Summary Section */}
        <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">商品总计</span>
            <div className="flex items-center gap-0.5 text-donghai font-bold">
              <Coins className="w-3 h-3" />
              <span>{totalPoints} 积分</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">运费</span>
            <span className="text-donghai font-bold text-xs">免运费</span>
          </div>
          <div className="border-t pt-3 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800">合计</span>
            <div className="flex items-center gap-0.5 text-donghai font-bold text-lg">
              <Coins className="w-4 h-4" />
              <span>{totalPoints} 积分</span>
            </div>
          </div>
        </Card>

        {/* Payment Method */}
        {!isPurePoints ? (
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-gray-800">支付方式</h3>
            <div className="space-y-3">
              {[
                { id: '微信支付', label: '微信支付', sub: '推荐使用微信支付', icon: 'https://img.icons8.com/color/48/weixing.png' },
                { id: '余额支付', label: '余额支付', sub: '可用余额 ¥0.00', icon: 'https://img.icons8.com/color/48/wallet.png' },
                { id: '银行卡', label: '银行卡支付', sub: '支持各大银行储蓄卡/信用卡', icon: 'https://img.icons8.com/color/48/bank-card-backside.png' }
              ].map((method) => (
                <div 
                  key={method.id} 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <div className="flex items-center gap-3">
                    <img src={method.icon} alt={method.label} className="w-6 h-6" />
                    <div>
                      <div className="text-xs font-medium text-gray-800">{method.label}</div>
                      <div className="text-[10px] text-gray-400">{method.sub}</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === method.id ? 'bg-donghai border-donghai' : 'border-gray-300'}`}>
                    {paymentMethod === method.id && <Check className="w-2 h-2 text-white" />}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-donghai/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-donghai" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-800">支付方式</div>
                <div className="text-[10px] text-gray-400">积分支付</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-donghai font-bold text-sm">
              <Check className="w-4 h-4" />
              <span>已选择</span>
            </div>
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 pt-3 pb-8 flex items-center justify-between z-50 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[12px] text-gray-400 font-medium">应付合计</span>
          <div className="flex items-baseline">
            {totalPrice > 0 && <span className="text-donghai font-bold text-2xl tracking-tighter">¥{totalPrice}</span>}
            {totalPoints > 0 && (
              <div className="flex items-center gap-0.5 text-donghai font-bold text-lg ml-2">
                <Coins className="w-4 h-4" />
                <span>{totalPoints}</span>
              </div>
            )}
          </div>
        </div>
        <Button 
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="bg-donghai hover:bg-donghai-light text-white rounded-full px-10 h-10 font-bold shadow-lg shadow-donghai/10"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : orderId ? '立即支付' : (isPurePoints ? '立即兑换' : '提交订单')}
        </Button>
      </div>

      {/* Payment Sheet */}
      <AnimatePresence>
        {showPayment && (
          <div className="fixed inset-0 z-[100] bg-black/60 flex items-end">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full rounded-t-[32px] p-6 pb-12"
            >
              <div className="flex items-center justify-between mb-8">
                <X className="w-6 h-6 text-gray-300" onClick={() => {
                  setShowPayment(false);
                  setPaymentStatus('idle');
                  setErrorMessage('');
                }} />
                <h3 className="text-lg font-bold">{isPurePoints ? '确认兑换' : '确认付款'}</h3>
                <div className="w-6" />
              </div>

              <div className="text-center mb-10">
                {isPurePoints ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-3xl font-bold text-gray-800 mb-2">
                      <Coins className="w-8 h-8 text-donghai" />
                      <span>{totalPoints}</span>
                    </div>
                    <p className="text-xs text-gray-400">积分兑换订单</p>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-gray-800 mb-2">¥{totalPrice}</div>
                    {totalPoints > 0 && (
                      <div className="flex items-center justify-center gap-1 text-donghai font-bold mb-2">
                        <Coins className="w-4 h-4" />
                        <span>+ {totalPoints} 积分</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400">东海航空商城订单</p>
                  </>
                )}
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-500">{isPurePoints ? '支付方式' : '付款方式'}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-800">{isPurePoints ? '积分支付' : paymentMethod}</span>
                  </div>
                </div>
              </div>

              {paymentStatus === 'failed' && (
                <div className="mb-6 p-3 bg-red-50 rounded-xl flex items-center gap-2 text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs">{errorMessage}</span>
                </div>
              )}

              <Button 
                onClick={handlePay}
                disabled={paymentStatus === 'paying'}
                className={`w-full ${paymentStatus === 'failed' ? 'bg-donghai' : 'bg-green-500 hover:bg-green-600'} text-white rounded-2xl h-14 font-bold text-lg shadow-xl`}
              >
                {paymentStatus === 'paying' ? <Loader2 className="w-6 h-6 animate-spin" /> : paymentStatus === 'failed' ? '重新支付' : '立即付款'}
              </Button>
              
              <div className="mt-4 flex items-center justify-center gap-1 text-[10px] text-gray-400">
                <ShieldCheck className="w-3 h-3" />
                支付安全由微信支付提供保障
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Employee Auth Required Modal */}
      <AnimatePresence>
        {showEmployeeAuthNeeded && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmployeeAuthNeeded(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-[32px] p-6 w-full max-w-xs text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-donghai/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-donghai" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">提示</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">您的订单包含内购商品，请先完成员工身份认证。</p>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  className="flex-1 rounded-full h-11 font-bold border-gray-200 text-gray-600"
                  onClick={() => setShowEmployeeAuthNeeded(false)}
                >
                  稍后
                </Button>
                <Button 
                  className="flex-1 bg-donghai text-white rounded-full h-11 font-bold"
                  onClick={() => {
                    setShowEmployeeAuthNeeded(false);
                    onShowEmployeeAuth();
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

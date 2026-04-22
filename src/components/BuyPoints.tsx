import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Coins, 
  Info, 
  CheckCircle2, 
  CreditCard,
  AlertCircle,
  Loader2,
  Zap,
  Gift,
  X,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../context/AuthContext';

interface Tier {
  points: number;
  price: number;
  bonus?: number;
  label?: string;
}

const PURCHASE_TIERS: Tier[] = [
  { points: 100, price: 10 },
  { points: 500, price: 50, label: '常用档位' },
  { points: 1000, price: 100, bonus: 100, label: '超值赠送' },
  { points: 2000, price: 200, bonus: 300, label: '人气最高' },
  { points: 5000, price: 500, bonus: 1000, label: '尊享优惠' },
  { points: 10000, price: 1000, bonus: 2500, label: '终极回馈' },
];

export default function BuyPoints({ onBack }: { onBack: () => void }) {
  const { userInfo, purchasePoints, addOrder } = useAuth();
  const [selectedTier, setSelectedTier] = useState<Tier | null>(PURCHASE_TIERS[2]);
  const [customPoints, setCustomPoints] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const calculatePrice = (points: number) => {
    return points / 10;
  };

  const validateCustomPoints = (val: string) => {
    const num = parseInt(val);
    if (isNaN(num)) return '请输入有效的积分数量';
    if (num < 100) return '最低购买100积分';
    if (num % 10 !== 0) return '购买数量需为10的倍数';
    return '';
  };

  const handlePurchaseRequest = async () => {
    if (activeOrderId) {
      setShowPayment(true);
      return;
    }

    let pointsToBuy = 0;
    let bonusPoints = 0;
    let price = 0;

    if (isCustom) {
      const err = validateCustomPoints(customPoints);
      if (err) {
        setError(err);
        return;
      }
      pointsToBuy = parseInt(customPoints);
      price = calculatePrice(pointsToBuy);
    } else if (selectedTier) {
      pointsToBuy = selectedTier.points;
      bonusPoints = selectedTier.bonus || 0;
      price = selectedTier.price;
    } else {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Step 1: Create an unpaid order for points
      const orderId = await addOrder({
        items: [{
          productId: 'points_topup_' + pointsToBuy,
          name: `积分充值 - ${pointsToBuy}${bonusPoints > 0 ? `+${bonusPoints}` : ''}积分`,
          image: 'https://img.icons8.com/color/96/coins.png',
          price: price,
          quantity: 1,
          specs: { '类型': '即时到账' }
        }],
        totalAmount: price,
        paymentMethod: '微信支付'
      });
      
      setActiveOrderId(orderId);
      setShowPayment(true);
    } catch (err) {
      setError('订单创建失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActualPay = async () => {
    if (!activeOrderId) return;

    let pointsToBuy = 0;
    let bonusPoints = 0;
    let price = 0;

    if (isCustom) {
      pointsToBuy = parseInt(customPoints);
      price = calculatePrice(pointsToBuy);
    } else if (selectedTier) {
      pointsToBuy = selectedTier.points;
      bonusPoints = selectedTier.bonus || 0;
      price = selectedTier.price;
    }

    setIsPaying(true);
    try {
      // Simulate real payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call purchasePoints to finalize
      await purchasePoints(pointsToBuy, bonusPoints, price, activeOrderId);
      
      setShowPayment(false);
      setShowSuccess(true);
    } catch (err) {
      setError('支付遇到问题，请在订单管理中重试');
    } finally {
      setIsPaying(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center p-8 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </motion.div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">购买成功</h2>
        <p className="text-sm text-gray-500 mb-8">
          积分已即时到账，您可以在积分中心查看明细
        </p>
        <Button 
          className="w-full bg-donghai text-white rounded-full h-12 font-bold"
          onClick={onBack}
        >
          返回
        </Button>
      </div>
    );
  }

  const currentPoints = isCustom ? parseInt(customPoints) || 0 : selectedTier?.points || 0;
  const currentPrice = isCustom ? calculatePrice(currentPoints) : selectedTier?.price || 0;
  const currentBonus = isCustom ? 0 : selectedTier?.bonus || 0;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
        <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
        <h1 className="text-lg font-bold">现金购积分</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        {/* User Points Info */}
        <Card className="p-4 border-none shadow-sm bg-donghai rounded-2xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-xs opacity-70 mb-1">当前积分余额</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{userInfo?.points}</span>
              <Coins className="w-4 h-4 opacity-70" />
            </div>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Coins className="w-24 h-24" />
          </div>
        </Card>

        {/* Purchase Rules */}
        <div className="bg-blue-50 rounded-2xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-blue-900">购买规则</h3>
            <ul className="text-[10px] text-blue-700 space-y-1 list-disc pl-3">
              <li>1元 = 10积分，购买即时到账</li>
              <li>积分有效期为自购买之日起1年</li>
              <li>自定义购买最低100积分，需为10的倍数</li>
              <li>购买积分不支持退款，请确认后下单</li>
            </ul>
          </div>
        </div>

        {/* Tiers Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-800">选择购买档位</h3>
          <div className="grid grid-cols-3 gap-3">
            {PURCHASE_TIERS.map((tier, i) => (
              <div 
                key={i}
                onClick={() => {
                  if (activeOrderId) setActiveOrderId(null);
                  setSelectedTier(tier);
                  setIsCustom(false);
                  setError('');
                }}
                className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  !isCustom && selectedTier === tier ? 'border-donghai bg-donghai/5' : 'border-white bg-white'
                }`}
              >
                {tier.label && (
                  <div className="absolute -top-2 -right-1 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                    {tier.label}
                  </div>
                )}
                <div className={`text-sm font-bold ${!isCustom && selectedTier === tier ? 'text-donghai' : 'text-gray-800'}`}>
                  {tier.points} 积分
                </div>
                <div className="text-[10px] text-gray-400">¥{tier.price}</div>
                {tier.bonus && (
                  <div className="text-[9px] text-orange-500 font-medium">赠{tier.bonus}积分</div>
                )}
              </div>
            ))}
            <div 
              onClick={() => {
                if (activeOrderId) setActiveOrderId(null);
                setIsCustom(true);
                setSelectedTier(null);
                setError('');
              }}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                isCustom ? 'border-donghai bg-donghai/5' : 'border-white bg-white'
              }`}
            >
              <div className={`text-sm font-bold ${isCustom ? 'text-donghai' : 'text-gray-800'}`}>自定义</div>
              <div className="text-[10px] text-gray-400">最低100</div>
            </div>
          </div>
        </div>

        {/* Custom Input */}
        <AnimatePresence>
          {isCustom && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-800">输入购买数量</h3>
                  <span className="text-[10px] text-gray-400">1元 = 10积分</span>
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    value={customPoints}
                    onChange={(e) => {
                      if (activeOrderId) setActiveOrderId(null);
                      setCustomPoints(e.target.value);
                      setError('');
                    }}
                    placeholder="请输入积分数量"
                    className="w-full bg-gray-50 rounded-xl h-12 px-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-donghai/30"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                    积分
                  </div>
                </div>
                {error && (
                  <div className="flex items-center gap-1.5 text-red-500 text-[10px]">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary */}
        <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">购买积分</span>
            <span className="text-gray-800 font-medium">{currentPoints} 积分</span>
          </div>
          {currentBonus > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">赠送积分</span>
              <span className="text-orange-500 font-medium">+{currentBonus} 积分</span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">到账积分</span>
            <span className="text-donghai font-bold">{currentPoints + currentBonus} 积分</span>
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-800">支付金额</span>
            <span className="text-xl font-bold text-donghai">¥{currentPrice.toFixed(2)}</span>
          </div>
        </Card>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 z-50 max-w-md mx-auto">
        <Button 
          onClick={handlePurchaseRequest}
          disabled={isSubmitting || (isCustom && !customPoints)}
          className="w-full bg-donghai text-white rounded-full h-12 font-bold shadow-lg shadow-donghai/20 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>正在创建订单...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>{activeOrderId ? '继续支付' : '立即购买'}</span>
            </>
          )}
        </Button>
      </div>

      {/* Payment Simulation Overlay */}
      <AnimatePresence>
        {showPayment && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 flex items-end justify-center"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full rounded-t-3xl p-6 pb-12 space-y-6"
            >
              <div className="flex items-center justify-between border-b pb-4">
                <X className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => setShowPayment(false)} />
                <span className="font-bold">确认支付</span>
                <div className="w-5" />
              </div>
              
              <div className="text-center space-y-1">
                <div className="text-3xl font-bold">¥{currentPrice.toFixed(2)}</div>
                <div className="text-xs text-gray-400">东海航空-积分购买 (订单:{activeOrderId})</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">支付方式</span>
                  <div className="flex items-center gap-2">
                    <img src="https://img.icons8.com/color/48/weixing.png" alt="wechat" className="w-5 h-5 rounded-sm" />
                    <span className="font-medium">微信支付</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">购买内容</span>
                  <span className="font-medium">{currentPoints + currentBonus} 积分</span>
                </div>
              </div>

              <Button 
                className="w-full bg-[#07C160] hover:bg-[#06ae56] text-white h-12 rounded-xl font-bold mt-4"
                onClick={handleActualPay}
                disabled={isPaying}
              >
                {isPaying ? <Loader2 className="w-6 h-6 animate-spin" /> : '立即支付'}
              </Button>
              
              <div className="flex flex-col items-center gap-2 text-[10px] text-gray-400">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-green-500" />
                  <span>微信支付安全保障中</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  Package, 
  ChevronRight, 
  FileText, 
  Truck, 
  MapPin, 
  Clock, 
  Phone, 
  Copy,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Coins,
  X,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, Order, OrderStatus } from '../context/AuthContext';

const STATUS_MAP: Record<OrderStatus, { label: string, color: string }> = {
  pendingPayment: { label: '待付款', color: 'text-orange-500' },
  pendingShipment: { label: '待发货', color: 'text-blue-500' },
  pendingReceipt: { label: '待收货', color: 'text-donghai' },
  afterSales: { label: '售后中', color: 'text-red-500' },
  afterSalesCompleted: { label: '售后完成', color: 'text-green-500' },
  afterSalesRejected: { label: '审核失败', color: 'text-red-400' },
  completed: { label: '已完成', color: 'text-gray-400' },
  cancelled: { label: '已取消', color: 'text-gray-300' }
};

// Logistics View
const LogisticsDetail = ({ order, onBack }: { order: Order, onBack: () => void }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  if (!order.logistics) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-lg font-bold">物流详情</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-400">
          <Truck className="w-16 h-16 mb-4 opacity-10" />
          <p className="text-sm">暂无物流信息</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-50 border-b">
        <div className="flex items-center gap-2">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-lg font-bold">物流详情</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : '刷新'}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Logistics Header */}
        <Card className="p-4 border-none shadow-sm bg-white rounded-2xl flex gap-4">
          <div className="w-16 h-16 rounded-2xl bg-donghai/10 flex items-center justify-center">
            <Truck className="w-8 h-8 text-donghai" />
          </div>
          <div className="flex-1 py-1">
            <div className="text-sm font-bold text-gray-800 mb-1">{order.logistics.company}</div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              运单号: {order.logistics.trackingNumber}
              <Copy className="w-3 h-3 cursor-pointer" />
            </div>
          </div>
        </Card>

        {/* Trajectory */}
        <Card className="p-6 border-none shadow-sm bg-white rounded-2xl">
          <div className="relative space-y-8">
            {order.logistics.trajectory.map((item, i) => (
              <div key={i} className="flex gap-4 relative">
                {/* Line */}
                {i !== order.logistics!.trajectory.length - 1 && (
                  <div className="absolute left-[7px] top-5 bottom-[-20px] w-0.5 bg-gray-100" />
                )}
                
                {/* Dot */}
                <div className={`w-4 h-4 rounded-full border-2 bg-white z-10 mt-1 flex-shrink-0 ${i === 0 ? 'border-donghai' : 'border-gray-200'}`}>
                  {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-donghai m-auto mt-[1px]" />}
                </div>

                <div className="flex-1">
                  <p className={`text-xs leading-relaxed mb-1 ${i === 0 ? 'text-gray-800 font-bold' : 'text-gray-500'}`}>
                    {item.status}
                  </p>
                  <p className="text-[10px] text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Order Detail View
const OrderDetail = ({ order, onBack, onShowLogistics, onApplyAfterSales, onPay, isPaying }: { order: Order, onBack: () => void, onShowLogistics: () => void, onApplyAfterSales: (productId: string) => void, onPay: (order: Order) => void, isPaying: boolean }) => {
  const { updateOrderStatus, shipOrder } = useAuth();
  const statusInfo = STATUS_MAP[order.status];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
        <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
        <h1 className="text-lg font-bold">订单详情</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {/* Status Banner */}
        <div className={`${
          order.status === 'afterSalesRejected' ? 'bg-red-500' : 
          order.status === 'pendingPayment' ? 'bg-orange-500' : 'bg-donghai'
        } rounded-2xl p-6 text-white flex items-center justify-between`}>
          <div>
            <h2 className="text-xl font-bold mb-1">{statusInfo.label}</h2>
            <p className="text-xs opacity-80">
              {order.status === 'pendingPayment' && '订单已提交，请尽快完成支付'}
              {order.status === 'pendingShipment' && '商品正在准备中，请耐心等待'}
              {order.status === 'pendingReceipt' && '商品已发出，请注意查收'}
              {order.status === 'completed' && '订单已完成，感谢您的支持'}
              {order.status === 'afterSales' && '售后处理中，请关注进度'}
              {order.status === 'afterSalesCompleted' && '售后服务已处理完成'}
              {order.status === 'afterSalesRejected' && '售后申请未通过审核'}
            </p>
          </div>
          <Package className="w-12 h-12 opacity-20" />
        </div>

        {/* Logistics Entry */}
        {order.logistics && (
          <Card 
            className="p-4 border-none shadow-sm bg-white rounded-2xl flex items-center gap-3 active:bg-gray-50"
            onClick={onShowLogistics}
          >
            <Truck className="w-5 h-5 text-donghai" />
            <div className="flex-1">
              <p className="text-xs text-donghai font-bold line-clamp-1">{order.logistics.trajectory[0].status}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{order.logistics.trajectory[0].time}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </Card>
        )}

        {/* Address */}
        {order.address && (
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-gray-800">{order.address.receiver}</span>
                <span className="text-sm text-gray-500">{order.address.phone}</span>
              </div>
              <p className="text-xs text-gray-500">
                {order.address.province}{order.address.city}{order.address.district}{order.address.detail}
              </p>
            </div>
          </Card>
        )}

        {/* Items */}
        <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="space-y-3">
              <div className="flex gap-3">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-gray-50" />
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <h4 className="text-xs font-medium text-gray-800 line-clamp-2">{item.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">
                      {Object.values(item.specs).join(' / ')}
                    </span>
                    <span className="text-xs text-gray-500">x{item.quantity}</span>
                  </div>
                  {item.isPointsOnly ? (
                    <div className="flex items-center gap-0.5 text-donghai font-bold text-sm">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{item.points}</span>
                    </div>
                  ) : (
                    <div className="text-donghai font-bold text-sm">¥{item.price}</div>
                  )}
                </div>
              </div>
              {order.status === 'completed' && (
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full text-[10px] h-7 px-4 border-gray-100 text-gray-500"
                    onClick={() => onApplyAfterSales(item.productId)}
                  >
                    申请售后
                  </Button>
                </div>
              )}
            </div>
          ))}
          <div className="border-t pt-4 flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">商品总额</span>
              <div className="flex flex-col items-end">
                {order.totalAmount > 0 && <span className="text-gray-800">¥{order.totalAmount}</span>}
                {order.totalPoints && order.totalPoints > 0 && (
                  <div className="flex items-center gap-0.5 text-donghai font-bold">
                    <Coins className="w-3 h-3" />
                    <span>{order.totalPoints}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">运费</span>
              <span className="text-gray-800">¥0.00</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-1">
              <span className="text-gray-800">实付款</span>
              <div className="flex flex-col items-end">
                {order.totalAmount > 0 && <span className="text-donghai">¥{order.totalAmount}</span>}
                {order.totalPoints && order.totalPoints > 0 && (
                  <div className="flex items-center gap-0.5 text-donghai font-bold">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{order.totalPoints}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Order Info */}
        <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-3">
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-400">订单编号</span>
            <div className="flex items-center gap-1 text-gray-600">
              {order.id}
              <Copy className="w-3 h-3" />
            </div>
          </div>
          {order.isInternal && (
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-400">售后通道</span>
              <Badge className="bg-blue-50 text-blue-500 text-[9px] h-4 px-2 border-none">员工专属售后通道</Badge>
            </div>
          )}
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-400">创建时间</span>
            <span className="text-gray-600">{order.createdAt}</span>
          </div>
          {order.paymentTime && (
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-400">支付时间</span>
              <span className="text-gray-600">{order.paymentTime}</span>
            </div>
          )}
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-400">支付方式</span>
            <span className="text-gray-600">{order.paymentMethod}</span>
          </div>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex items-center justify-end gap-3 z-50">
        {order.status === 'pendingPayment' && (
          <>
            <Button variant="outline" className="rounded-full text-xs h-9 px-6 border-gray-200">取消订单</Button>
            <Button 
              disabled={isPaying}
              className="rounded-full text-xs h-9 px-8 bg-donghai text-white min-w-[100px]"
              onClick={() => onPay(order)}
            >
              {isPaying ? <Loader2 className="w-4 h-4 animate-spin" /> : '立即支付'}
            </Button>
          </>
        )}
        {order.status === 'pendingShipment' && (
          <>
            <Button variant="outline" className="rounded-full text-xs h-9 px-6 border-gray-200">修改地址</Button>
            <Button 
              className="rounded-full text-xs h-9 px-6 bg-orange-500 text-white hover:bg-orange-600"
              onClick={() => shipOrder(order.id)}
            >
              模拟发货 (运营端)
            </Button>
          </>
        )}
        {order.status === 'pendingReceipt' && (
          <>
            <Button variant="outline" className="rounded-full text-xs h-9 px-6 border-gray-200" onClick={onShowLogistics}>查看物流</Button>
            <Button className="rounded-full text-xs h-9 px-8 bg-donghai text-white" onClick={() => updateOrderStatus(order.id, 'completed')}>确认收货</Button>
          </>
        )}
        {order.status === 'completed' && (
          <>
            <Button variant="outline" className="rounded-full text-xs h-9 px-6 border-donghai text-donghai">再次购买</Button>
          </>
        )}
        {order.status === 'afterSales' && (
          <Button variant="outline" className="rounded-full text-xs h-9 px-6 border-gray-200 text-gray-500">查看售后详情</Button>
        )}
      </div>
    </div>
  );
};

export default function Orders({ onApplyAfterSales, onBack, isInternalOnly = false, initialOrderId, onClearTarget }: { onApplyAfterSales: (orderId: string, productId: string) => void, onBack?: () => void, isInternalOnly?: boolean, initialOrderId?: string, onClearTarget?: () => void }) {
  const { isLoggedIn, userInfo, updateOrderStatus, shipOrder, purchasePoints } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showLogistics, setShowLogistics] = useState(false);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [showCashier, setShowCashier] = useState(false);
  const [orderToPay, setOrderToPay] = useState<Order | null>(null);

  React.useEffect(() => {
    if (initialOrderId && userInfo?.orders) {
      const order = userInfo.orders.find(o => o.id === initialOrderId);
      if (order) {
        setSelectedOrder(order);
      }
    }
  }, [initialOrderId, userInfo?.orders]);

  const handlePayOrder = (order: Order) => {
    setOrderToPay(order);
    setShowCashier(true);
  };

  const executePayment = async () => {
    if (!orderToPay) return;
    setPayingOrderId(orderToPay.id);
    try {
      // Check if it's a points purchase
      const pointsItem = orderToPay.items.find(item => item.productId.startsWith('points_topup_'));
      if (pointsItem) {
        const pointsMatch = pointsItem.productId.match(/points_topup_(\d+)/);
        const pointsToBuy = pointsMatch ? parseInt(pointsMatch[1]) : 0;
        await purchasePoints(pointsToBuy, 0, orderToPay.totalAmount, orderToPay.id);
      } else {
        // Regular product order
        await new Promise(resolve => setTimeout(resolve, 2000));
        updateOrderStatus(orderToPay.id, 'pendingShipment');
      }
      setShowCashier(false);
      setOrderToPay(null);
    } catch (err) {
      alert('支付失败，请稍后重试');
    } finally {
      setPayingOrderId(null);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-donghai text-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-10">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={handleBack} />
          <h1 className="text-lg font-medium">{isInternalOnly ? '我的内购订单' : '我的订单'}</h1>
          <div className="w-6" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <FileText className="w-16 h-16 text-gray-200 mb-4" />
          <p className="text-sm text-gray-400 mb-6">登录后可查看您的订单信息</p>
          <Button className="bg-donghai text-white rounded-full px-8 h-10">去登录</Button>
        </div>
      </div>
    );
  }

  if (showLogistics && selectedOrder) {
    return <LogisticsDetail order={selectedOrder} onBack={() => setShowLogistics(false)} />;
  }

  const handleCloseDetail = () => {
    setSelectedOrder(null);
    onClearTarget?.();
  };

  if (selectedOrder) {
    return (
      <OrderDetail 
        order={selectedOrder} 
        onBack={handleCloseDetail} 
        onShowLogistics={() => setShowLogistics(true)}
        onApplyAfterSales={(productId) => onApplyAfterSales(selectedOrder.id, productId)}
        onPay={handlePayOrder}
        isPaying={payingOrderId === selectedOrder.id}
      />
    );
  }

  const orders = userInfo?.orders || [];
  const baseOrders = isInternalOnly ? orders.filter(o => o.isInternal) : orders;
  const filteredOrders = activeTab === 'all' 
    ? baseOrders 
    : baseOrders.filter(o => o.status === activeTab);

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'pendingPayment', label: '待付款' },
    { id: 'pendingShipment', label: '待发货' },
    { id: 'pendingReceipt', label: '待收货' },
    { id: 'completed', label: '已完成' }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-donghai text-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-50 shrink-0">
        <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={handleBack} />
        <h1 className="text-lg font-medium">{isInternalOnly ? '我的内购订单' : '我的订单'}</h1>
        <div className="w-6" />
      </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden" onValueChange={setActiveTab}>
            <div className="bg-white shrink-0 z-40 border-b">
              <TabsList className="w-full bg-transparent h-12 p-0 rounded-none overflow-x-auto no-scrollbar justify-start">
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id} 
                    className="flex-none px-4 h-full rounded-none text-xs data-[state=active]:bg-transparent data-[state=active]:text-donghai data-[state=active]:shadow-none relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-donghai after:hidden data-[state=active]:after:block"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2 pb-32">
              {filteredOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className="px-2.5 py-1.5 border-none shadow-sm bg-white rounded-xl active:bg-gray-50 transition-colors"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center text-[10px] text-gray-400 font-mono opacity-60">
                      <span>{order.id}</span>
                      {order.isInternal && (
                        <span className="ml-1 px-1 bg-blue-50 text-blue-500 rounded-sm">内购</span>
                      )}
                    </div>
                    <span className={`text-[11px] font-bold ${STATUS_MAP[order.status].color}`}>
                      {STATUS_MAP[order.status].label}
                    </span>
                  </div>
                  
                  {order.items.slice(0, 1).map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover bg-gray-50 flex-shrink-0" referrerPolicy="no-referrer" />
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h4 className="text-[13px] font-medium text-gray-800 truncate leading-tight">{item.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[11px] text-gray-400 truncate max-w-[120px]">
                            {Object.values(item.specs).join('/')}
                          </span>
                          <div className="flex items-baseline gap-1.5 font-bold">
                            <span className="text-[11px] text-gray-400 font-normal">x{item.quantity}</span>
                            {item.isPointsOnly ? (
                              <div className="flex items-center gap-0.5 text-donghai text-[12px]">
                                <Coins className="w-2.5 h-2.5" />
                                <span>{item.points}</span>
                              </div>
                            ) : (
                              <div className="text-donghai text-[12px]">¥{item.price}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {order.items.length > 1 && (
                    <div className="text-[10px] text-gray-300 mt-1 pl-12">+第2件等{order.items.length}件</div>
                  )}

                  <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-gray-50/50">
                    <div className="text-[11px] text-gray-400">
                      实付: <span className="text-donghai font-bold">
                        {order.totalAmount > 0 ? `¥${order.totalAmount}` : ''}
                        {order.totalPoints && order.totalPoints > 0 ? `${order.totalAmount > 0 ? '+' : ''}${order.totalPoints}积分` : ''}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {order.status === 'pendingPayment' && (
                        <Button 
                          size="sm" 
                          className="rounded-full text-[11px] h-6 px-4 bg-donghai text-white py-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePayOrder(order);
                          }}
                        >
                          支付
                        </Button>
                      )}
                      {(order.status === 'pendingShipment' || order.status === 'pendingReceipt') && (
                        <Button 
                          size="sm" 
                          className="rounded-full text-[11px] h-6 px-4 bg-donghai text-white py-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (order.status === 'pendingShipment') shipOrder(order.id);
                            else updateOrderStatus(order.id, 'completed');
                          }}
                        >
                          {order.status === 'pendingShipment' ? '发货' : '收货'}
                        </Button>
                      )}
                      {(order.status === 'completed' || order.status === 'afterSalesCompleted' || order.status === 'afterSalesRejected') && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-full text-[11px] h-6 px-4 border-donghai text-donghai py-0" 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (order.status === 'afterSalesCompleted' || order.status === 'afterSalesRejected' || order.status === 'completed') {
                              setSelectedOrder(order);
                            }
                          }}
                        >
                          {(order.status === 'afterSalesCompleted' || order.status === 'afterSalesRejected') ? '查看详情' : '再买'}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

            {filteredOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <FileText className="w-16 h-16 mb-4 opacity-10" />
                <p className="text-sm">暂无相关订单</p>
              </div>
            )}
          </div>
        </Tabs>
      </div>

      {/* Payment Cashier Overlay */}
      <AnimatePresence>
        {showCashier && orderToPay && (
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
              className="bg-white w-full rounded-t-3xl p-6 pb-12 space-y-6 max-w-md"
            >
              <div className="flex items-center justify-between border-b pb-4">
                <X className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => {
                  setShowCashier(false);
                  setOrderToPay(null);
                }} />
                <span className="font-bold">收银台</span>
                <div className="w-5" />
              </div>
              
              <div className="text-center space-y-1">
                <div className="text-3xl font-bold">¥{orderToPay.totalAmount.toFixed(2)}</div>
                <div className="text-xs text-gray-400">东海航空-订单支付 (单号:{orderToPay.id})</div>
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
                  <span className="text-gray-500">订单内容</span>
                  <span className="font-medium truncate max-w-[200px]">{orderToPay.items[0].name}{orderToPay.items.length > 1 ? ` 等${orderToPay.items.length}件` : ''}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-[#07C160] hover:bg-[#06ae56] text-white h-12 rounded-xl font-bold mt-4"
                onClick={executePayment}
                disabled={payingOrderId === orderToPay.id}
              >
                {payingOrderId === orderToPay.id ? <Loader2 className="w-6 h-6 animate-spin" /> : '立即支付'}
              </Button>
              
              <div className="flex flex-col items-center gap-2 text-[10px] text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-donghai/10 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-donghai" />
                  </div>
                  <span>安全支付环境，保障您的资金安全</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

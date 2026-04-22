import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Camera, 
  X, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  Package,
  FileText,
  MessageSquare,
  RefreshCw,
  Loader2,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth, AfterSalesRecord, AfterSalesType, AfterSalesStatus } from '../context/AuthContext';

const STATUS_MAP: Record<AfterSalesStatus, { label: string, color: string, icon: any }> = {
  pendingAudit: { label: '待审核', color: 'text-orange-500', icon: Clock },
  approved: { label: '审核通过', color: 'text-green-500', icon: CheckCircle2 },
  rejected: { label: '审核拒绝', color: 'text-red-500', icon: AlertCircle },
  pendingReturn: { label: '待寄回', color: 'text-blue-500', icon: Truck },
  pendingReceipt: { label: '待确认收货', color: 'text-donghai', icon: Package },
  completed: { label: '已完成', color: 'text-gray-400', icon: CheckCircle2 },
  cancelled: { label: '已取消', color: 'text-gray-300', icon: X }
};

const AIRLINE_ADDRESS = "广东省深圳市宝安区航站四路东海航空基地 售后部";
const AIRLINE_PHONE = "0755-12345678";

interface AfterSalesProps {
  orderId?: string;
  productId?: string;
  onBack: () => void;
}

export default function AfterSales({ orderId, productId, onBack }: AfterSalesProps) {
  const { userInfo, applyAfterSales, updateAfterSalesStatus, showNotification } = useAuth();
  const [view, setView] = useState<'list' | 'apply' | 'detail'>(orderId ? 'apply' : 'list');
  const [selectedRecord, setSelectedRecord] = useState<AfterSalesRecord | null>(null);
  
  // Apply Form State
  const [type, setType] = useState<AfterSalesType>('return');
  const [reason, setReason] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [returnAddress, setReturnAddress] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>(`${AIRLINE_ADDRESS} (联系电话: ${AIRLINE_PHONE})`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tracking Form State
  const [trackingNumber, setTrackingNumber] = useState('');

  const order = userInfo?.orders.find(o => o.id === orderId);
  const product = order?.items.find(i => i.productId === productId);

  React.useEffect(() => {
    if (order?.address && !returnAddress) {
      const addr = order.address;
      setReturnAddress(`${addr.receiver} ${addr.phone} ${addr.province}${addr.city}${addr.district}${addr.detail}`);
    }
  }, [order?.address]);

  const handleApply = async () => {
    if (!reason.trim()) {
      showNotification('提示', '请填写申请原因');
      return;
    }
    if (images.length === 0) {
      showNotification('提示', '请上传商品图片凭证');
      return;
    }

    setIsSubmitting(true);
    try {
      await applyAfterSales({
        orderId: orderId!,
        productId: productId!,
        type,
        reason,
        images,
        returnAddress,
        deliveryAddress,
      });
      // Immediately redirect to order list to avoid feeling 'stuck' if that was intended, or go to list
      setView('list');
      showNotification('成功', '售后申请已提交');
    } catch (error) {
      showNotification('错误', '申请失败，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = () => {
    // Simulate image upload
    const newImage = `https://picsum.photos/seed/${Math.random()}/400/400`;
    setImages([...images, newImage]);
  };

  const handleTrackingSubmit = (record: AfterSalesRecord) => {
    if (!trackingNumber.trim()) {
      showNotification('提示', '请输入快递单号');
      return;
    }
    updateAfterSalesStatus(record.id, 'pendingReceipt', { trackingNumber });
    setTrackingNumber('');
    setSelectedRecord({ ...record, status: 'pendingReceipt', trackingNumber });
    showNotification('成功', '快递单号已提交');
  };

  // List View
  if (view === 'list') {
    const records = userInfo?.afterSales || [];
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-lg font-bold">售后记录</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {records.map((record) => {
            const order = userInfo?.orders.find(o => o.id === record.orderId);
            const product = order?.items.find(i => i.productId === record.productId);
            const status = STATUS_MAP[record.status];
            const Icon = status.icon;

            return (
              <Card 
                key={record.id} 
                className="p-4 border-none shadow-sm bg-white rounded-2xl active:bg-gray-50 transition-colors"
                onClick={() => {
                  setSelectedRecord(record);
                  setView('detail');
                }}
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
                  <div className="flex items-center text-[10px] text-gray-400">
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    <span>售后单号: {record.id}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${status.color}`}>
                    <Icon className="w-3 h-3" />
                    {status.label}
                  </div>
                </div>

                <div className="flex gap-3">
                  <img src={product?.image} alt={product?.name} className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
                  <div className="flex-1">
                    <h4 className="text-xs font-medium text-gray-800 line-clamp-1 mb-1">{product?.name}</h4>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-donghai/20 text-donghai bg-donghai/5">
                        {record.type === 'return' ? '退货退款' : '换货'}
                      </Badge>
                      <span className="text-[10px] text-gray-400">{record.createdAt}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {records.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
              <p className="text-sm">暂无售后记录</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Apply View
  if (view === 'apply') {
    return (
      <div className="flex flex-col h-full bg-gray-50 relative">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-50 border-b">
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
            <h1 className="text-lg font-bold">申请售后</h1>
          </div>
          {order?.isInternal && (
            <Badge className="bg-blue-50 text-blue-500 text-[10px] h-6 px-3 border-none">员工专属通道</Badge>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
          {/* Product Info */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl flex gap-3">
            <img src={product?.image} alt={product?.name} className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
            <div className="flex-1 py-0.5">
              <h4 className="text-xs font-medium text-gray-800 line-clamp-2 mb-1">{product?.name}</h4>
              <div className="text-[10px] text-gray-400">
                {product && Object.values(product.specs).join(' / ')}
              </div>
              {product?.isPointsOnly ? (
                <div className="flex items-center gap-0.5 text-donghai font-bold text-xs mt-1">
                  <Coins className="w-3 h-3" />
                  <span>{product.points}</span>
                </div>
              ) : (
                <div className="text-donghai font-bold text-xs mt-1">¥{product?.price}</div>
              )}
            </div>
          </Card>

          {/* Type Selection */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-gray-800">选择售后类型</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'return', label: '退货退款', sub: '已收到货，需退还商品' },
                { id: 'exchange', label: '换货', sub: '商品质量问题，需更换' }
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setType(item.id as AfterSalesType)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    type === item.id ? 'border-donghai bg-donghai/5' : 'border-gray-50 bg-white'
                  }`}
                >
                  <div className={`text-xs font-bold mb-1 ${type === item.id ? 'text-donghai' : 'text-gray-800'}`}>
                    {item.label}
                  </div>
                  <div className="text-[9px] text-gray-400 leading-tight">{item.sub}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Addresses */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-800 flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-500" />
                售后相关地址
              </h3>
              
              <div className="space-y-1.5 pt-1 border-t border-gray-50 mt-1">
                <div className="text-[10px] text-gray-400">包裹取件地址 (您的地址)</div>
                <textarea
                  value={returnAddress}
                  onChange={(e) => setReturnAddress(e.target.value)}
                  placeholder="请输入退货/换货取件地址..."
                  className="w-full bg-gray-50 rounded-xl p-2.5 text-[11px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-donghai/30 resize-none min-h-[50px]"
                  rows={2}
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] text-gray-400">售后收货地址 (东海航空)</div>
                <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-3 text-[11px] text-gray-400 flex items-start gap-2 italic">
                  <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                  {deliveryAddress}
                </div>
              </div>
            </div>
          </Card>

          {/* Reason */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-gray-800">申请原因</h3>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="请详细描述您遇到的问题..."
              className="w-full h-32 bg-gray-50 rounded-xl p-3 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-donghai/30 resize-none"
            />
          </Card>

          {/* Images */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800">上传凭证</h3>
              <span className="text-[10px] text-gray-400">{images.length}/3</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                  <img src={img} alt="upload" className="w-full h-full object-cover" />
                  <div 
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-black/50 rounded-full p-1 cursor-pointer"
                  >
                    <X className="w-3 h-3 text-white" />
                  </div>
                </div>
              ))}
              {images.length < 3 && (
                <div 
                  onClick={handleUpload}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300 active:bg-gray-50"
                >
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[9px]">上传图片</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white border-t px-4 py-3 z-50">
          <Button 
            onClick={handleApply}
            disabled={isSubmitting}
            className="w-full bg-donghai text-white rounded-full h-12 font-bold shadow-lg shadow-donghai/20"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : '提交申请'}
          </Button>
        </div>
      </div>
    );
  }

  // Detail View
  if (view === 'detail' && selectedRecord) {
    const status = STATUS_MAP[selectedRecord.status];
    const Icon = status.icon;
    const order = userInfo?.orders.find(o => o.id === selectedRecord.orderId);
    const product = order?.items.find(i => i.productId === selectedRecord.productId);

    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-50 border-b">
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => setView('list')} />
            <h1 className="text-lg font-bold">售后详情</h1>
          </div>
          {selectedRecord.isEmployeeChannel && (
            <Badge className="bg-blue-50 text-blue-500 text-[10px] h-6 px-3 border-none">员工专属通道</Badge>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
          {/* Status Banner */}
          <div className={`rounded-2xl p-6 text-white flex items-center justify-between ${
            selectedRecord.status === 'rejected' ? 'bg-red-500' : 
            selectedRecord.status === 'completed' ? 'bg-gray-400' : 'bg-donghai'
          }`}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{status.label}</h2>
                {selectedRecord.isEmployeeChannel && (
                  <Badge className="bg-white/20 text-white text-[8px] h-4 px-1.5 border-none">优先处理</Badge>
                )}
              </div>
              <p className="text-xs opacity-80">
                {selectedRecord.status === 'pendingAudit' && '您的申请已提交，预计1-2个工作日内完成审核'}
                {selectedRecord.status === 'approved' && '审核已通过，请尽快寄回商品'}
                {selectedRecord.status === 'rejected' && `审核未通过：${selectedRecord.auditOpinion || '不符合售后规则'}`}
                {selectedRecord.status === 'pendingReturn' && '请填写快递单号并寄回商品'}
                {selectedRecord.status === 'pendingReceipt' && '等待运营人员确认收货'}
                {selectedRecord.status === 'completed' && '售后流程已完成'}
              </p>
            </div>
            <Icon className="w-12 h-12 opacity-20" />
          </div>

          {/* Audit Simulation (For Demo) */}
          {selectedRecord.status === 'pendingAudit' && (
            <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-gray-800">模拟审核 (演示用)</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="rounded-xl border-green-200 text-green-600 hover:bg-green-50"
                  onClick={() => updateAfterSalesStatus(selectedRecord.id, 'approved')}
                >
                  审核通过
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => updateAfterSalesStatus(selectedRecord.id, 'rejected', { auditOpinion: '商品影响二次销售' })}
                >
                  审核拒绝
                </Button>
              </div>
            </Card>
          )}

          {/* Return Info Form */}
          {selectedRecord.status === 'approved' && (
            <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-donghai">
                <Truck className="w-4 h-4" />
                <h3 className="text-xs font-bold">填写退货物流</h3>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl space-y-2">
                <div className="text-[10px] text-gray-400">退货地址</div>
                <div className="text-xs text-gray-800 font-medium">广东省深圳市宝安区航站四路东海航空基地 售后部</div>
                <div className="text-[10px] text-gray-400">联系电话: 0755-12345678</div>
              </div>
              <input 
                type="text" 
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="请输入退货快递单号"
                className="w-full bg-gray-50 rounded-xl h-12 px-4 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-donghai/30"
              />
              <Button 
                onClick={() => handleTrackingSubmit(selectedRecord)}
                className="w-full bg-donghai text-white rounded-xl h-11 font-bold"
              >
                提交物流信息
              </Button>
            </Card>
          )}

          {/* Tracking Info Display */}
          {selectedRecord.trackingNumber && (
            <Card className="p-4 border-none shadow-sm bg-white rounded-2xl flex items-center gap-3">
              <Truck className="w-5 h-5 text-donghai" />
              <div className="flex-1">
                <div className="text-[10px] text-gray-400">退货单号</div>
                <div className="text-xs text-gray-800 font-bold">{selectedRecord.trackingNumber}</div>
              </div>
              {selectedRecord.status === 'pendingReceipt' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-donghai text-[10px]"
                  onClick={() => {
                    const isPoints = product?.isPointsOnly;
                    const refundData: any = { refundTime: new Date().toLocaleString() };
                    if (isPoints) {
                      refundData.refundPoints = (product.points || 0) * product.quantity;
                    } else {
                      refundData.refundAmount = product?.price;
                    }
                    updateAfterSalesStatus(selectedRecord.id, 'completed', refundData);
                  }}
                >
                  (模拟)确认收货
                </Button>
              )}
            </Card>
          )}

          {/* Refund Info */}
          {selectedRecord.status === 'completed' && (selectedRecord.refundAmount || selectedRecord.refundPoints) && (
            <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">{selectedRecord.refundPoints ? '退回积分' : '退款金额'}</span>
                {selectedRecord.refundPoints ? (
                  <div className="flex items-center gap-0.5 text-donghai font-bold">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{selectedRecord.refundPoints}</span>
                  </div>
                ) : (
                  <span className="text-donghai font-bold">¥{selectedRecord.refundAmount}</span>
                )}
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">退款时间</span>
                <span className="text-gray-800">{selectedRecord.refundTime}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">退款方式</span>
                <span className="text-gray-800">
                  {selectedRecord.refundPoints ? '原路退回 (积分账户)' : '原路退回 (微信支付)'}
                </span>
              </div>
            </Card>
          )}

          {/* Application Info */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-gray-800">申请信息</h3>
            <div className="flex gap-3">
              <img src={product?.image} alt={product?.name} className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
              <div className="flex-1">
                <h4 className="text-xs font-medium text-gray-800 line-clamp-1 mb-1">{product?.name}</h4>
                <div className="text-[10px] text-gray-400">
                  {product && Object.values(product.specs).join(' / ')}
                </div>
                {product?.isPointsOnly ? (
                  <div className="flex items-center gap-0.5 text-donghai font-bold text-xs mt-1">
                    <Coins className="w-3 h-3" />
                    <span>{product.points}</span>
                  </div>
                ) : (
                  <div className="text-donghai font-bold text-xs mt-1">¥{product?.price}</div>
                )}
              </div>
            </div>
            <div className="space-y-3 pt-3 border-t border-gray-50">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">售后类型</span>
                <span className="text-gray-800">{selectedRecord.type === 'return' ? '退货退款' : '换货'}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">申请原因</span>
                <span className="text-gray-800">{selectedRecord.reason}</span>
              </div>
              {selectedRecord.returnAddress && (
                <div className="flex justify-between text-[11px] gap-4">
                  <span className="text-gray-400 shrink-0">取件地址</span>
                  <span className="text-gray-800 text-right leading-tight">{selectedRecord.returnAddress}</span>
                </div>
              )}
              {selectedRecord.deliveryAddress && (
                <div className="flex justify-between text-[11px] gap-4">
                  <span className="text-gray-400 shrink-0">收货地址</span>
                  <span className="text-gray-800 text-right leading-tight font-medium underline decoration-donghai/20 underline-offset-2">{selectedRecord.deliveryAddress}</span>
                </div>
              )}
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">申请时间</span>
                <span className="text-gray-800">{selectedRecord.createdAt}</span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              {selectedRecord.images.map((img, i) => (
                <img key={i} src={img} alt="proof" className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}

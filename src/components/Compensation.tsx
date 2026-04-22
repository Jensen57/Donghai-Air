import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Camera, 
  X, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  Coins,
  FileText,
  MessageSquare,
  Loader2,
  Plane,
  Calendar,
  User,
  ShieldCheck,
  Filter,
  Search,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth, CompensationRecord, CompensationType, CompensationStatus } from '../context/AuthContext';

const STATUS_MAP: Record<CompensationStatus, { label: string, color: string, icon: any }> = {
  pendingAudit: { label: '待审核', color: 'text-orange-500', icon: Clock },
  approved: { label: '审核通过', color: 'text-green-500', icon: CheckCircle2 },
  rejected: { label: '审核拒绝', color: 'text-red-500', icon: AlertCircle },
  processing: { label: '赔付中', color: 'text-blue-500', icon: CreditCard },
  completed: { label: '已到账', color: 'text-donghai', icon: CheckCircle2 }
};

const REASONS = ['航班延误', '航班取消', '服务失误', '行李延误', '其他'];

export default function Compensation({ onBack }: { onBack: () => void }) {
  const { userInfo, applyCompensation, updateCompensationStatus } = useAuth();
  const [view, setView] = useState<'list' | 'apply' | 'detail'>('list');
  const [selectedRecord, setSelectedRecord] = useState<CompensationRecord | null>(null);
  
  // Filter State
  const [filterStatus, setFilterStatus] = useState<CompensationStatus | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Apply Form State
  const [type, setType] = useState<CompensationType>('cash');
  const [flightNo, setFlightNo] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [passengerName, setPassengerName] = useState('');
  const [passengerIdCard, setPassengerIdCard] = useState('');
  const [reason, setReason] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredRecords = useMemo(() => {
    let records = [...(userInfo?.compensations || [])];
    
    // Sort by createdAt descending
    records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Filter by status
    if (filterStatus !== 'all') {
      records = records.filter(r => r.status === filterStatus);
    }

    // Filter by date range
    if (startDate) {
      records = records.filter(r => new Date(r.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      records = records.filter(r => new Date(r.createdAt) <= end);
    }

    return records;
  }, [userInfo?.compensations, filterStatus, startDate, endDate]);

  const handleApply = async () => {
    if (!flightNo || !flightDate || !passengerName || !passengerIdCard || !reason) {
      alert('请填写完整信息');
      return;
    }
    if (images.length === 0) {
      alert('请上传证明材料');
      return;
    }

    setIsSubmitting(true);
    try {
      await applyCompensation({
        type,
        flightNo,
        flightDate,
        passengerName,
        passengerIdCard,
        reason,
        images,
      });
      setView('list');
      // Reset form
      setFlightNo('');
      setFlightDate('');
      setPassengerName('');
      setPassengerIdCard('');
      setReason('');
      setImages([]);
    } catch (error) {
      alert('提交失败，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = () => {
    if (images.length >= 5) return;
    const newImage = `https://picsum.photos/seed/${Math.random()}/400/400`;
    setImages([...images, newImage]);
  };

  // List View
  if (view === 'list') {
    return (
      <div className="flex flex-col h-full bg-gray-50 relative">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-lg font-bold">旅客赔付</h1>
        </div>
        
        {/* Filter Bar */}
        <div className="bg-white px-4 py-2 border-b flex items-center gap-4 overflow-x-auto no-scrollbar sticky top-[88px] z-40">
          <div 
            onClick={() => setFilterStatus('all')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterStatus === 'all' ? 'bg-donghai text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            全部
          </div>
          {Object.entries(STATUS_MAP).map(([key, value]) => (
            <div 
              key={key}
              onClick={() => setFilterStatus(key as CompensationStatus)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterStatus === key ? 'bg-donghai text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {value.label}
            </div>
          ))}
        </div>

        {/* Date Filter Toggle */}
        <div className="bg-white px-4 py-2 flex items-center justify-between border-b">
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{startDate || '开始日期'} - {endDate || '结束日期'}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-donghai text-[10px] font-bold"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-3 h-3 mr-1" />
            筛选时间
          </Button>
        </div>

        {/* Date Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white px-4 py-4 border-b overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 ml-1">开始日期</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-gray-50 rounded-lg h-9 px-3 text-[11px] text-gray-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 ml-1">结束日期</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-gray-50 rounded-lg h-9 px-3 text-[11px] text-gray-800 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-[11px]"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                >
                  重置
                </Button>
                <Button 
                  size="sm" 
                  className="h-8 bg-donghai text-white text-[11px] px-6 rounded-full"
                  onClick={() => setShowFilters(false)}
                >
                  确定
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-gray-800">
              {filterStatus === 'all' ? '全部记录' : STATUS_MAP[filterStatus as CompensationStatus].label}
              <span className="ml-2 text-[10px] text-gray-400 font-normal">共 {filteredRecords.length} 条</span>
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-donghai text-xs font-bold"
              onClick={() => setView('apply')}
            >
              + 新增申请
            </Button>
          </div>

          {filteredRecords.map((record) => {
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
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-50">
                  <div className="flex items-center text-[10px] text-gray-400">
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    <span>申请ID: {record.id}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${status.color}`}>
                    <Icon className="w-3 h-3" />
                    {status.label}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-donghai" />
                    <span className="text-sm font-bold text-gray-800">{record.flightNo}</span>
                  </div>
                  <span className="text-xs text-donghai font-bold">
                    {record.type === 'cash' ? `¥${record.amount}` : `${record.points} 积分`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <div className="flex items-center gap-3">
                    <span>{record.passengerName}</span>
                    <span>{record.flightDate}</span>
                  </div>
                  <span>{record.createdAt}</span>
                </div>
              </Card>
            );
          })}

          {filteredRecords.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <ShieldCheck className="w-16 h-16 mb-4 opacity-10" />
              <p className="text-sm">未找到符合条件的赔付记录</p>
              {(filterStatus !== 'all' || startDate || endDate) && (
                <Button 
                  variant="ghost" 
                  className="mt-2 text-donghai text-xs"
                  onClick={() => {
                    setFilterStatus('all');
                    setStartDate('');
                    setEndDate('');
                  }}
                >
                  清除筛选条件
                </Button>
              )}
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
        <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => setView('list')} />
          <h1 className="text-lg font-bold">赔付申请</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
          {/* Type Selection */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-gray-800">选择赔付类型</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'cash', label: '现金赔付', icon: CreditCard, sub: '原路退回或转账' },
                { id: 'points', label: '积分赔付', icon: Coins, sub: '发放至会员账户' }
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setType(item.id as CompensationType)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    type === item.id ? 'border-donghai bg-donghai/5' : 'border-gray-50 bg-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mb-2 ${type === item.id ? 'text-donghai' : 'text-gray-400'}`} />
                  <div className={`text-xs font-bold mb-1 ${type === item.id ? 'text-donghai' : 'text-gray-800'}`}>
                    {item.label}
                  </div>
                  <div className="text-[9px] text-gray-400 leading-tight">{item.sub}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Flight Info */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-gray-800">航班信息</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 h-12">
                <Plane className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={flightNo}
                  onChange={(e) => setFlightNo(e.target.value.toUpperCase())}
                  placeholder="航班号 (如: DZ6201)"
                  className="flex-1 bg-transparent text-xs text-gray-800 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 h-12">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input 
                  type="date" 
                  value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-gray-800 focus:outline-none"
                />
              </div>
            </div>
          </Card>

          {/* Passenger Info */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-gray-800">乘机人信息</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 h-12">
                <User className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="乘机人姓名"
                  className="flex-1 bg-transparent text-xs text-gray-800 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 h-12">
                <FileText className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={passengerIdCard}
                  onChange={(e) => setPassengerIdCard(e.target.value)}
                  placeholder="乘机人身份证号"
                  className="flex-1 bg-transparent text-xs text-gray-800 focus:outline-none"
                />
              </div>
            </div>
          </Card>

          {/* Reason */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-gray-800">赔付原因</h3>
            <div className="flex flex-wrap gap-2">
              {REASONS.map((r) => (
                <Badge 
                  key={r}
                  onClick={() => setReason(r)}
                  variant={reason === r ? 'default' : 'outline'}
                  className={`cursor-pointer h-7 px-3 rounded-full text-[10px] ${
                    reason === r ? 'bg-donghai text-white' : 'border-gray-100 text-gray-500'
                  }`}
                >
                  {r}
                </Badge>
              ))}
            </div>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="请详细描述赔付原因..."
              className="w-full h-24 bg-gray-50 rounded-xl p-3 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-donghai/30 resize-none"
            />
          </Card>

          {/* Images */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800">证明材料</h3>
              <span className="text-[10px] text-gray-400">{images.length}/5</span>
            </div>
            <p className="text-[9px] text-gray-400 leading-tight">请上传航班延误/取消通知、登机牌、身份证等证明材料</p>
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden group">
                  <img src={img} alt="upload" className="w-full h-full object-cover" />
                  <div 
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-black/50 rounded-full p-1 cursor-pointer"
                  >
                    <X className="w-3 h-3 text-white" />
                  </div>
                </div>
              ))}
              {images.length < 5 && (
                <div 
                  onClick={handleUpload}
                  className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300 active:bg-gray-50"
                >
                  <Camera className="w-5 h-5 mb-1" />
                  <span className="text-[8px]">上传图片</span>
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

    return (
      <div className="flex flex-col h-full bg-gray-50 relative">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => setView('list')} />
          <h1 className="text-lg font-bold">赔付详情</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
          {/* Status Banner */}
          <div className={`rounded-2xl p-6 text-white flex items-center justify-between ${
            selectedRecord.status === 'rejected' ? 'bg-red-500' : 
            selectedRecord.status === 'completed' ? 'bg-donghai' : 'bg-donghai/80'
          }`}>
            <div>
              <h2 className="text-xl font-bold mb-1">{status.label}</h2>
              <p className="text-xs opacity-80">
                {selectedRecord.status === 'pendingAudit' && '您的申请已提交，预计3-5个工作日内完成审核'}
                {selectedRecord.status === 'approved' && '审核已通过，正在为您处理赔付'}
                {selectedRecord.status === 'rejected' && `审核未通过：${selectedRecord.auditOpinion || '不符合赔付规则'}`}
                {selectedRecord.status === 'processing' && '赔付资金/积分正在发放中'}
                {selectedRecord.status === 'completed' && '赔付已成功到账'}
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
                  onClick={() => updateCompensationStatus(selectedRecord.id, 'approved')}
                >
                  审核通过
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => updateCompensationStatus(selectedRecord.id, 'rejected', { auditOpinion: '航班延误时间未达赔付标准' })}
                >
                  审核拒绝
                </Button>
              </div>
            </Card>
          )}

          {/* Processing Simulation (For Demo) */}
          {selectedRecord.status === 'approved' && (
            <Card className="p-4 border-none shadow-sm bg-white rounded-2xl">
              <Button 
                className="w-full bg-donghai text-white rounded-xl h-11 font-bold"
                onClick={() => updateCompensationStatus(selectedRecord.id, 'processing')}
              >
                (模拟)开始赔付
              </Button>
            </Card>
          )}

          {selectedRecord.status === 'processing' && (
            <Card className="p-4 border-none shadow-sm bg-white rounded-2xl">
              <Button 
                className="w-full bg-donghai text-white rounded-xl h-11 font-bold"
                onClick={() => updateCompensationStatus(selectedRecord.id, 'completed')}
              >
                (模拟)确认到账
              </Button>
            </Card>
          )}

          {/* Compensation Info */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-gray-800">赔付信息</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">赔付类型</span>
                <span className="text-gray-800 font-medium">{selectedRecord.type === 'cash' ? '现金赔付' : '积分赔付'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">赔付金额/积分</span>
                <span className="text-donghai font-bold">
                  {selectedRecord.type === 'cash' ? `¥${selectedRecord.amount}` : `${selectedRecord.points} 积分`}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">申请时间</span>
                <span className="text-gray-800">{selectedRecord.createdAt}</span>
              </div>
            </div>
          </Card>

          {/* Flight & Passenger Info */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-gray-800">航班与乘机人</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">航班号</span>
                <span className="text-gray-800 font-medium">{selectedRecord.flightNo}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">乘机日期</span>
                <span className="text-gray-800">{selectedRecord.flightDate}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">乘机人</span>
                <span className="text-gray-800">{selectedRecord.passengerName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">身份证号</span>
                <span className="text-gray-800">{selectedRecord.passengerIdCard}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">赔付原因</span>
                <span className="text-gray-800">{selectedRecord.reason}</span>
              </div>
            </div>
          </Card>

          {/* Evidence */}
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-gray-800">证明材料</h3>
            <div className="flex flex-wrap gap-2">
              {selectedRecord.images.map((img, i) => (
                <img key={i} src={img} alt="proof" className="w-20 h-20 rounded-lg object-cover bg-gray-50" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}

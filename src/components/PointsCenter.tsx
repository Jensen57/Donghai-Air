import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';

export default function PointsCenter({ onBack }: { onBack: () => void }) {
  const { userInfo } = useAuth();
  
  // Filter states
  const [activeType, setActiveType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeType]);

  const filterTypes = [
    { id: 'all', label: '全部' },
    { id: 'income', label: '收入' },
    { id: 'expense', label: '支出' },
  ];

  const filteredRecords = useMemo(() => {
    if (!userInfo?.pointsRecords) return [];
    
    return userInfo.pointsRecords.filter(record => {
      if (activeType === 'income') {
        // 'purchase', 'compensation', 'refund', 'bonus' or amount > 0
        return record.amount > 0 || ['purchase', 'compensation', 'refund', 'bonus'].includes(record.type);
      }
      if (activeType === 'expense') {
        // 'consumption' or amount < 0
        return record.amount < 0 || record.type === 'consumption';
      }
      return true;
    });
  }, [userInfo?.pointsRecords, activeType]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = useMemo(() => {
    return filteredRecords.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  const getExpiryDate = (createdAtStr: string) => {
    try {
      const datePart = createdAtStr.split(' ')[0];
      const parts = datePart.split('/');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        return `${year + 2}/${parts[1]}/${parts[2]}`;
      }
      const partsHyphen = datePart.split('-');
      if (partsHyphen.length === 3) {
        const year = parseInt(partsHyphen[0]);
        return `${year + 2}-${partsHyphen[1]}-${partsHyphen[2]}`;
      }
    } catch (e) {
      // fallback
    }
    return '2028-12-31';
  };

  const totalPoints = userInfo?.points || 0;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 border-b sticky top-0 z-50 flex items-center">
        <ChevronLeft className="w-6 h-6 cursor-pointer text-gray-800 mr-2" onClick={onBack} />
        <h1 className="text-lg font-bold text-gray-800">积分中心</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {/* Available Points Card */}
        <Card className="bg-donghai overflow-hidden border-none shadow-md rounded-[24px] relative">
          <div className="p-6 text-white relative z-10">
            <p className="text-[11px] opacity-70 tracking-widest uppercase font-medium mb-1">当前可用积分</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-mono">{totalPoints}</span>
              <span className="text-sm opacity-85">积分</span>
              <Coins className="w-4 h-4 opacity-50 ml-1" />
            </div>
          </div>
          {/* Subtle Graphic Background blur */}
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </Card>

        {/* Unified Transaction Details & Filters Section */}
        <div className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-50 flex flex-col min-h-[300px]">
          {/* Sub Header */}
          <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-3">
            <div className="flex items-center">
              <div className="w-1 h-3 bg-donghai rounded-full mr-2" />
              <h3 className="text-sm font-bold text-gray-800">积分明细</h3>
            </div>
            <span className="text-[10px] text-gray-400 font-normal">仅支持查看近一年的记录</span>
          </div>

          {/* Quick Type Tabs */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {filterTypes.map(type => (
              <Badge
                key={type.id}
                variant={activeType === type.id ? 'default' : 'outline'}
                onClick={() => setActiveType(type.id)}
                className={`cursor-pointer rounded-full px-3 py-1 text-[10px] border-none shadow-none transition-all ${
                  activeType === type.id 
                    ? 'bg-donghai text-white' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {type.label}
              </Badge>
            ))}
          </div>

          {/* Records List */}
          <div className="flex-1 space-y-3">
            {paginatedRecords.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {paginatedRecords.map((record) => (
                  <div key={record.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0 active:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        record.amount > 0 ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        {record.amount > 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-700">
                          {record.description?.replace(/\s*\([^)]*订单号[^)]*\)/g, '').replace(/\s*订单号[：:][A-Za-z0-9_-]+/g, '').trim()}
                        </div>
                        {record.amount > 0 && ['purchase', 'compensation', 'refund', 'bonus'].includes(record.type) ? (
                          <div className="space-y-0.5 mt-0.5">
                            <div className="text-[9px] text-gray-400">时间：{record.createdAt}</div>
                            <div className="text-[9px] text-amber-600 font-medium">积分到期时间：{getExpiryDate(record.createdAt)}</div>
                          </div>
                        ) : (
                          <div className="text-[9px] text-gray-400 mt-0.5">{record.createdAt}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-bold ${record.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {record.amount > 0 ? '+' : ''}{record.amount}
                      </div>
                      <div className="text-[9px] text-gray-400">余额 {record.balance}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center text-gray-400">
                <Coins className="w-8 h-8 opacity-20 mb-2" />
                <p className="text-xs font-bold text-gray-500">暂无相关收支明细</p>
                {activeType !== 'all' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 rounded-full border-donghai text-donghai h-7 text-[10px] px-4"
                    onClick={() => setActiveType('all')}
                  >
                    重置筛选
                  </Button>
                )}
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="text-xs"
                >
                  上一页
                </Button>
                <span className="text-xs text-gray-500">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="text-xs"
                >
                  下一页
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

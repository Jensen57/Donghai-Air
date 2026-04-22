import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Plus, 
  MapPin, 
  Edit2, 
  Trash2, 
  Check,
  Phone,
  User,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth, Address } from '../context/AuthContext';

interface AddressManagementProps {
  onBack: () => void;
}

export default function AddressManagement({ onBack }: AddressManagementProps) {
  const { userInfo, addAddress, updateAddress, deleteAddress } = useAuth();
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editingAddress, setEditingAddress] = useState<Partial<Address> | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleSave = () => {
    if (!editingAddress?.receiver || !editingAddress?.phone || !editingAddress?.detail) {
      return;
    }
    if (editingAddress.phone.length !== 11) {
      return;
    }

    if (editingAddress.id) {
      updateAddress(editingAddress.id, editingAddress);
    } else {
      addAddress(editingAddress as Omit<Address, 'id'>);
    }
    setView('list');
    setEditingAddress(null);
  };

  const handleDelete = (id: string) => {
    deleteAddress(id);
    setShowDeleteConfirm(null);
  };

  if (view === 'edit') {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => setView('list')} />
          <h1 className="text-lg font-bold">{editingAddress?.id ? '编辑地址' : '新增地址'}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <Card className="p-4 border-none shadow-sm bg-white rounded-2xl space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 ml-1">收货人</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={editingAddress?.receiver || ''}
                  onChange={(e) => setEditingAddress({ ...editingAddress, receiver: e.target.value })}
                  placeholder="请输入收货人姓名"
                  className="w-full bg-gray-50 rounded-xl h-11 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-donghai/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 ml-1">手机号码</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="tel" 
                  value={editingAddress?.phone || ''}
                  onChange={(e) => setEditingAddress({ ...editingAddress, phone: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                  placeholder="请输入11位手机号"
                  className="w-full bg-gray-50 rounded-xl h-11 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-donghai/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 ml-1">所在地区</label>
              <div className="grid grid-cols-3 gap-2">
                <input 
                  type="text" 
                  value={editingAddress?.province || ''}
                  onChange={(e) => setEditingAddress({ ...editingAddress, province: e.target.value })}
                  placeholder="省"
                  className="bg-gray-50 rounded-xl h-11 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-donghai/30"
                />
                <input 
                  type="text" 
                  value={editingAddress?.city || ''}
                  onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                  placeholder="市"
                  className="bg-gray-50 rounded-xl h-11 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-donghai/30"
                />
                <input 
                  type="text" 
                  value={editingAddress?.district || ''}
                  onChange={(e) => setEditingAddress({ ...editingAddress, district: e.target.value })}
                  placeholder="区"
                  className="bg-gray-50 rounded-xl h-11 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-donghai/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 ml-1">详细地址</label>
              <textarea 
                value={editingAddress?.detail || ''}
                onChange={(e) => setEditingAddress({ ...editingAddress, detail: e.target.value })}
                placeholder="街道、楼牌号等详细信息"
                className="w-full bg-gray-50 rounded-xl h-24 p-3 text-xs focus:outline-none focus:ring-1 focus:ring-donghai/30 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-600">设为默认地址</span>
              <div 
                onClick={() => setEditingAddress({ ...editingAddress, isDefault: !editingAddress?.isDefault })}
                className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${editingAddress?.isDefault ? 'bg-donghai' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editingAddress?.isDefault ? 'left-5' : 'left-1'}`} />
              </div>
            </div>
          </Card>
        </div>

        <div className="p-4 bg-white border-t">
          <Button 
            onClick={handleSave}
            className="w-full bg-donghai text-white rounded-full h-12 font-bold shadow-lg shadow-donghai/20"
          >
            保存地址
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-2 sticky top-0 z-50 border-b">
        <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
        <h1 className="text-lg font-bold">地址管理</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {userInfo?.addresses.map((addr) => (
          <Card key={addr.id} className="p-4 border-none shadow-sm bg-white rounded-2xl relative overflow-hidden group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-800">{addr.receiver}</span>
                <span className="text-xs text-gray-500">{addr.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span>
                {addr.isDefault && (
                  <Badge className="bg-donghai/10 text-donghai text-[9px] h-4 px-1.5 border-none">默认</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2 text-xs text-gray-500 leading-relaxed pr-12">
              <MapPin className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
              <span>{addr.province}{addr.city}{addr.district}{addr.detail}</span>
            </div>
            
            <div className="absolute top-4 right-4 flex flex-col gap-3">
              <div 
                onClick={() => {
                  setEditingAddress(addr);
                  setView('edit');
                }}
                className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-donghai active:bg-donghai/10 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </div>
              <div 
                onClick={() => setShowDeleteConfirm(addr.id)}
                className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 active:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </div>
            </div>
          </Card>
        ))}

        {(!userInfo?.addresses || userInfo.addresses.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <MapPin className="w-16 h-16 mb-4 opacity-10" />
            <p className="text-sm">暂无收货地址</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Overlay */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(null)}
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
              <h3 className="text-lg font-bold text-gray-800 mb-2">确认删除？</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">删除后将无法恢复，确认要删除该收货地址吗？</p>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="rounded-full h-11 text-xs"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  取消
                </Button>
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full h-11 text-xs font-bold"
                  onClick={() => handleDelete(showDeleteConfirm)}
                >
                  确认删除
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="p-4 bg-white border-t">
        <Button 
          onClick={() => {
            setEditingAddress({ isDefault: userInfo?.addresses.length === 0 });
            setView('edit');
          }}
          className="w-full bg-donghai text-white rounded-full h-12 font-bold shadow-lg shadow-donghai/20 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          新增地址
        </Button>
      </div>
    </div>
  );
}

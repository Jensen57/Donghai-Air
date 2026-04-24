import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  points?: number;
  isPointsOnly?: boolean;
  specs: Record<string, string>;
  quantity: number;
}

export interface Address {
  id: string;
  receiver: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

export type OrderStatus = 'pendingPayment' | 'pendingShipment' | 'pendingReceipt' | 'afterSales' | 'afterSalesCompleted' | 'afterSalesRejected' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  points?: number;
  isPointsOnly?: boolean;
  specs: Record<string, string>;
  quantity: number;
}

export interface LogisticsTrajectory {
  time: string;
  location: string;
  status: string;
}

export interface LogisticsInfo {
  company: string;
  trackingNumber: string;
  trajectory: LogisticsTrajectory[];
  shipTime?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  totalPoints?: number;
  status: OrderStatus;
  address?: Address;
  paymentMethod: string;
  paymentTime?: string;
  createdAt: string;
  logistics?: LogisticsInfo;
  isInternal?: boolean;
}

export type AfterSalesType = 'return' | 'exchange';
export type AfterSalesStatus = 'pendingAudit' | 'approved' | 'rejected' | 'pendingReturn' | 'pendingReceipt' | 'completed' | 'cancelled';

export type EmployeeAuthStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface EmployeeAuthRecord {
  id: string;
  employeeId: string;
  name: string;
  phone: string;
  badgeImage: string;
  status: EmployeeAuthStatus;
  auditOpinion?: string;
  auditTime?: string;
  createdAt: string;
}

export interface AfterSalesRecord {
  id: string;
  orderId: string;
  productId: string;
  type: AfterSalesType;
  reason: string;
  images: string[];
  status: AfterSalesStatus;
  returnAddress?: string;
  deliveryAddress?: string;
  trackingNumber?: string;
  auditOpinion?: string;
  refundAmount?: number;
  refundPoints?: number;
  refundTime?: string;
  createdAt: string;
  isEmployeeChannel?: boolean;
}

export type CompensationType = 'cash' | 'points';
export type CompensationStatus = 'pendingAudit' | 'approved' | 'rejected' | 'processing' | 'completed';

export interface CompensationRecord {
  id: string;
  type: CompensationType;
  flightNo: string;
  flightDate: string;
  passengerName: string;
  passengerIdCard: string;
  reason: string;
  amount: number;
  points: number;
  images: string[];
  status: CompensationStatus;
  auditOpinion?: string;
  createdAt: string;
}

export type PointsChangeType = 'purchase' | 'compensation' | 'consumption' | 'refund' | 'bonus';

export interface PointsRecord {
  id: string;
  amount: number;
  type: PointsChangeType;
  description: string;
  balance: number;
  createdAt: string;
  paymentId?: string;
  paymentAmount?: number;
}

export interface Message {
  id: string;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  type: 'system' | 'order' | 'points' | 'compensation' | 'internal';
  businessId?: string;
}

interface UserInfo {
  openID: string;
  nickname: string;
  avatar: string;
  phone?: string;
  points: number;
  balance: number;
  pointsExpiry: string;
  isEmployee: boolean;
  isIdVerified: boolean;
  unreadMessagesCount: number;
  favorites: string[];
  cart: CartItem[];
  addresses: Address[];
  orders: Order[];
  afterSales: AfterSalesRecord[];
  compensations: CompensationRecord[];
  pointsRecords: PointsRecord[];
  messages: Message[];
  employeeAuth?: EmployeeAuthRecord;
  internalPurchases: Record<string, number>;
  orderCounts: {
    pendingPayment: number;
    pendingShipment: number;
    pendingReceipt: number;
    afterSales: number;
  };
  compensationCounts: {
    pendingAudit: number;
    processing: number;
    completed: number;
  };
}

interface AuthContextType {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  login: (info: Partial<UserInfo>) => void;
  logout: () => void;
  updateUser: (info: Partial<UserInfo>) => Promise<void>;
  setUnreadCount: (count: number) => void;
  toggleFavorite: (productId: string) => Promise<void>;
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  updateCartQuantity: (cartId: string, quantity: number) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: (ids: string[]) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  applyAfterSales: (record: Omit<AfterSalesRecord, 'id' | 'status' | 'createdAt'>) => Promise<string>;
  updateAfterSalesStatus: (id: string, status: AfterSalesStatus, extra?: Partial<AfterSalesRecord>) => void;
  applyCompensation: (record: Omit<CompensationRecord, 'id' | 'status' | 'createdAt' | 'amount' | 'points'>) => Promise<string>;
  updateCompensationStatus: (id: string, status: CompensationStatus, extra?: Partial<CompensationRecord>) => void;
  applyEmployeeAuth: (record: Omit<EmployeeAuthRecord, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateEmployeeAuthStatus: (status: EmployeeAuthStatus, extra?: Partial<EmployeeAuthRecord>) => void;
  purchasePoints: (points: number, bonus: number, price: number) => Promise<void>;
  shipOrder: (orderId: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'time' | 'isRead'>) => void;
  notification: { title: string, content: string } | null;
  showNotification: (title: string, content: string) => void;
  hideNotification: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER_DATA: Partial<UserInfo> = {
  points: 1250,
  balance: 0,
  pointsExpiry: '2026-12-31',
  isEmployee: false,
  isIdVerified: false,
  phone: undefined, // Explicitly undefined to force phone binding during checkout
  unreadMessagesCount: 2,
  favorites: [],
  cart: [],
  addresses: [
    { id: '1', receiver: '张三', phone: '13800138000', province: '广东省', city: '深圳市', district: '宝安区', detail: '航站四路东海航空基地', isDefault: true }
  ],
  orders: [
    {
      id: 'DH20260408001',
      items: [
        { productId: '1', name: '东海航空 飞机模型 1:200', image: 'https://picsum.photos/seed/plane1/800/800', price: 198, specs: { '比例': '1:200' }, quantity: 1 }
      ],
      totalAmount: 198,
      status: 'pendingReceipt',
      address: { id: '1', receiver: '张三', phone: '13800138000', province: '广东省', city: '深圳市', district: '宝安区', detail: '航站四路东海航空基地', isDefault: true },
      paymentMethod: '微信支付',
      paymentTime: '2026-04-08 10:30:00',
      createdAt: '2026-04-08 10:25:00',
      logistics: {
        company: '顺丰速运',
        trackingNumber: 'SF1234567890',
        shipTime: '2026-04-08 14:00:00',
        trajectory: [
          { time: '2026-04-08 18:30:00', location: '深圳市', status: '快件已到达 深圳宝安集散中心' },
          { time: '2026-04-08 15:00:00', location: '深圳市', status: '顺丰速运 已收寄' },
          { time: '2026-04-08 14:00:00', location: '深圳市', status: '包裹正在等待揽收' }
        ]
      }
    }
  ],
  afterSales: [],
  compensations: [],
  pointsRecords: [
    { id: '1', amount: 500, type: 'purchase', description: '购买积分', balance: 1250, createdAt: '2026-04-20 10:00:00' },
    { id: '2', amount: 300, type: 'compensation', description: '延误赔付积分', balance: 750, createdAt: '2026-04-18 15:30:00' },
    { id: '3', amount: -200, type: 'consumption', description: '兑换模型扣除', balance: 450, createdAt: '2026-04-15 09:00:00' },
    { id: '4', amount: 100, type: 'refund', description: '售后退回积分', balance: 650, createdAt: '2026-04-10 11:45:00' },
    { id: '5', amount: 550, type: 'purchase', description: '购买积分', balance: 550, createdAt: '2026-04-05 14:20:00' },
  ],
  messages: [
    {
      id: '1',
      title: '订单发货提醒',
      content: '您的订单 DH20260408001 已发货，请注意查收。',
      time: '2026-04-08 14:00',
      isRead: false,
      type: 'order',
      businessId: 'DH20260408001'
    },
    {
      id: '2',
      title: '欢迎加入东海航空商城',
      content: '尊贵的旅客，欢迎开启您的东海之旅！在这里您可以购买精美周边、兑换积分好物。',
      time: '2026-04-08 10:00',
      isRead: true,
      type: 'system'
    }
  ],
  internalPurchases: {},
  orderCounts: {
    pendingPayment: 0,
    pendingShipment: 0,
    pendingReceipt: 1,
    afterSales: 0,
  },
  compensationCounts: {
    pendingAudit: 0,
    processing: 0,
    completed: 0,
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [notification, setNotification] = useState<{ title: string, content: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('donghai_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUserInfo({
        ...DEFAULT_USER_DATA,
        ...parsedUser
      } as UserInfo);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (info: Partial<UserInfo>) => {
    const fullInfo = {
      ...DEFAULT_USER_DATA,
      ...info,
      openID: info.openID || 'wx_' + Math.random().toString(36).substr(2, 9),
    } as UserInfo;
    
    setUserInfo(fullInfo);
    setIsLoggedIn(true);
    localStorage.setItem('donghai_user', JSON.stringify(fullInfo));
  };

  const logout = () => {
    setUserInfo(null);
    setIsLoggedIn(false);
    localStorage.removeItem('donghai_user');
  };

  const setUnreadCount = (count: number) => {
    if (userInfo) {
      const updated = { ...userInfo, unreadMessagesCount: count };
      setUserInfo(updated);
      localStorage.setItem('donghai_user', JSON.stringify(updated));
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (!userInfo) return;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const favorites = userInfo.favorites || [];
        const newFavorites = favorites.includes(productId)
          ? favorites.filter(id => id !== productId)
          : [...favorites, productId];
        const updated = { ...userInfo, favorites: newFavorites };
        setUserInfo(updated);
        localStorage.setItem('donghai_user', JSON.stringify(updated));
        resolve();
      }, 500);
    });
  };

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    if (!userInfo) return;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const cart = [...(userInfo.cart || [])];
        const existingIndex = cart.findIndex(c => 
          c.productId === item.productId && 
          JSON.stringify(c.specs) === JSON.stringify(item.specs)
        );

        if (existingIndex > -1) {
          cart[existingIndex].quantity += item.quantity;
        } else {
          cart.push({ ...item, id: Math.random().toString(36).substr(2, 9) });
        }

        const updated = { ...userInfo, cart };
        setUserInfo(updated);
        localStorage.setItem('donghai_user', JSON.stringify(updated));
        resolve();
      }, 500);
    });
  };

  const updateCartQuantity = (cartId: string, quantity: number) => {
    if (!userInfo) return;
    const cart = userInfo.cart.map(c => c.id === cartId ? { ...c, quantity } : c);
    const updated = { ...userInfo, cart };
    setUserInfo(updated);
    localStorage.setItem('donghai_user', JSON.stringify(updated));
  };

  const removeFromCart = (cartId: string) => {
    if (!userInfo) return;
    const cart = userInfo.cart.filter(c => c.id !== cartId);
    const updated = { ...userInfo, cart };
    setUserInfo(updated);
    localStorage.setItem('donghai_user', JSON.stringify(updated));
  };

  const clearCart = (ids: string[]) => {
    if (!userInfo) return;
    const cart = userInfo.cart.filter(c => !ids.includes(c.id));
    const updated = { ...userInfo, cart };
    setUserInfo(updated);
    localStorage.setItem('donghai_user', JSON.stringify(updated));
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    if (!userInfo) return;
    const newAddress = { ...address, id: Math.random().toString(36).substr(2, 9) };
    const addresses = [...userInfo.addresses, newAddress];
    if (address.isDefault) {
      addresses.forEach(a => { if (a.id !== newAddress.id) a.isDefault = false; });
    }
    const updated = { ...userInfo, addresses };
    setUserInfo(updated);
    localStorage.setItem('donghai_user', JSON.stringify(updated));
  };

  const updateAddress = (id: string, address: Partial<Address>) => {
    if (!userInfo) return;
    const addresses = userInfo.addresses.map(a => a.id === id ? { ...a, ...address } : a);
    if (address.isDefault) {
      addresses.forEach(a => { if (a.id !== id) a.isDefault = false; });
    }
    const updated = { ...userInfo, addresses };
    setUserInfo(updated);
    localStorage.setItem('donghai_user', JSON.stringify(updated));
  };

  const deleteAddress = (id: string) => {
    if (!userInfo) return;
    const addresses = userInfo.addresses.filter(a => a.id !== id);
    const updated = { ...userInfo, addresses };
    setUserInfo(updated);
    localStorage.setItem('donghai_user', JSON.stringify(updated));
  };

  const addMessage = (message: Omit<Message, 'id' | 'time' | 'isRead'>) => {
    setUserInfo(prev => {
      if (!prev) return null;
      const newMessage: Message = {
        ...message,
        id: Math.random().toString(36).substr(2, 9),
        time: new Date().toLocaleString(),
        isRead: false
      };
      const updated = {
        ...prev,
        messages: [newMessage, ...prev.messages],
        unreadMessagesCount: prev.unreadMessagesCount + 1
      };
      localStorage.setItem('donghai_user', JSON.stringify(updated));
      return updated;
    });
  };

  const showNotification = (title: string, content: string) => {
    setNotification({ title, content });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const addOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    if (!userInfo) throw new Error('未登录');
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const orderId = 'DH' + Date.now().toString().slice(-8);
        const isInternal = order.items.some(item => item.productId.startsWith('emp-'));
        const newOrder: Order = {
          ...order,
          id: orderId,
          status: 'pendingPayment',
          createdAt: new Date().toLocaleString(),
          isInternal
        };
        
        const newMessage: Message = {
          title: '下单成功',
          content: `您的订单 ${orderId} 已提交成功，请尽快支付。`,
          type: 'order',
          businessId: orderId,
          id: 'MSG' + Date.now().toString().slice(-8),
          time: new Date().toLocaleString(),
          isRead: false
        };

        setUserInfo(prev => {
          if (!prev) return null;
          
          const internalPurchases = { ...prev.internalPurchases };
          order.items.forEach(item => {
            if (item.productId.startsWith('emp-')) {
              internalPurchases[item.productId] = (internalPurchases[item.productId] || 0) + item.quantity;
            }
          });

          const updated = {
            ...prev,
            orders: [newOrder, ...prev.orders],
            internalPurchases,
            orderCounts: {
              ...prev.orderCounts,
              pendingPayment: prev.orderCounts.pendingPayment + 1
            },
            messages: [newMessage, ...prev.messages],
            unreadMessagesCount: prev.unreadMessagesCount + 1
          };
          localStorage.setItem('donghai_user', JSON.stringify(updated));
          return updated;
        });

        showNotification('下单成功', `订单号: ${orderId}`);
        resolve(orderId);
      }, 500);
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setUserInfo(prev => {
      if (!prev) return null;
      
      let oldStatus: OrderStatus | undefined;
      let orderPoints = 0;
      const orders = prev.orders.map(o => {
        if (o.id === orderId) {
          oldStatus = o.status;
          orderPoints = o.totalPoints || 0;
          return { 
            ...o, 
            status, 
            paymentTime: status === 'pendingShipment' ? new Date().toLocaleString() : o.paymentTime,
            logistics: (status === 'completed' && o.logistics) ? {
              ...o.logistics,
              trajectory: [
                { time: new Date().toLocaleString(), location: '收货地址', status: '包裹已由本人签收，感谢使用东海航空' },
                ...(o.logistics.trajectory || [])
              ]
            } : o.logistics
          };
        }
        return o;
      });

      if (!oldStatus) return prev;

      const counts = { ...prev.orderCounts };
      if (oldStatus in counts) (counts as any)[oldStatus] = Math.max(0, (counts as any)[oldStatus] - 1);
      if (status in counts) (counts as any)[status]++;

      let updated = { ...prev, orders, orderCounts: counts };

      // If payment successful and there are points to deduct
      if (status === 'pendingShipment' && oldStatus === 'pendingPayment' && orderPoints > 0) {
        const newBalance = prev.points - orderPoints;
        const record: PointsRecord = {
          id: 'PR' + Date.now().toString().slice(-8),
          amount: -orderPoints,
          type: 'consumption',
          description: `商品兑换扣除积分 (订单号: ${orderId})`,
          balance: newBalance,
          createdAt: new Date().toLocaleString()
        };
        
        updated = {
          ...updated,
          points: newBalance,
          pointsRecords: [record, ...(prev.pointsRecords || [])]
        };
      }

      // Handle messages within the same update to avoid race conditions
      if (status === 'pendingShipment' || status === 'completed') {
        const newMessage: Message = {
          id: 'MSG' + Date.now().toString().slice(-8),
          time: new Date().toLocaleString(),
          isRead: false,
          title: status === 'pendingShipment' ? '支付成功' : '订单已完成',
          content: status === 'pendingShipment' 
            ? `您的订单 ${orderId} 已支付成功，我们将尽快为您发货。`
            : `您的订单 ${orderId} 已确认收货，感谢您的支持。`,
          type: 'order',
          businessId: orderId
        };
        
        updated = {
          ...updated,
          messages: [newMessage, ...updated.messages],
          unreadMessagesCount: updated.unreadMessagesCount + 1
        };
        
        showNotification(
          status === 'pendingShipment' ? '支付成功' : '订单已完成',
          status === 'pendingShipment' ? `订单 ${orderId} 已进入待发货状态` : `感谢您的购物！`
        );
      }

      localStorage.setItem('donghai_user', JSON.stringify(updated));
      return updated;
    });
  };

  const applyAfterSales = async (record: Omit<AfterSalesRecord, 'id' | 'status' | 'createdAt'>) => {
    if (!userInfo) throw new Error('未登录');
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const id = 'AS' + Date.now().toString().slice(-8);
        
        setUserInfo(prev => {
          if (!prev) return null;
          
          const order = prev.orders.find(o => o.id === record.orderId);
          const isEmployeeChannel = order?.isInternal || record.productId.startsWith('emp-');
          
          const newRecord: AfterSalesRecord = {
            ...record,
            id,
            status: 'pendingAudit',
            createdAt: new Date().toLocaleString(),
            isEmployeeChannel
          };
          
          const orders = prev.orders.map(o => {
            if (o.id === record.orderId) {
              return { ...o, status: 'afterSales' as OrderStatus };
            }
            return o;
          });

          const newMessage: Message = {
            id: 'MSG' + Date.now().toString().slice(-8),
            time: new Date().toLocaleString(),
            isRead: false,
            title: '售后申请已提交',
            content: `您的售后申请 ${id} 已提交，请耐心等待审核。`,
            type: 'order',
            businessId: record.orderId
          };

          const updated = { 
            ...prev, 
            orders,
            afterSales: [newRecord, ...(prev.afterSales || [])],
            orderCounts: {
              ...prev.orderCounts,
              afterSales: (prev.orderCounts.afterSales || 0) + 1
            },
            messages: [newMessage, ...prev.messages],
            unreadMessagesCount: prev.unreadMessagesCount + 1
          };
          
          localStorage.setItem('donghai_user', JSON.stringify(updated));
          return updated;
        });

        showNotification('售后申请已提交', `申请单号: ${id}`);
        resolve(id);
      }, 800);
    });
  };

  const updateAfterSalesStatus = (id: string, status: AfterSalesStatus, extra?: Partial<AfterSalesRecord>) => {
    if (!userInfo) return;
    
    let pointsToRefund = 0;
    let refundOrderId = '';
    let refundProductId = '';
    
    // Also track if order status should be updated
    let targetOrderToUpdate: string | null = null;
    let targetOrderStatus: OrderStatus = 'afterSalesCompleted';
    
    if (status === 'completed' || status === 'rejected') {
      const record = userInfo.afterSales.find(r => r.id === id);
      if (record) {
        targetOrderToUpdate = record.orderId;
        targetOrderStatus = status === 'completed' ? 'afterSalesCompleted' : 'afterSalesRejected';
      }
    }
    
    const afterSales = userInfo.afterSales.map(r => {
      if (r.id === id) {
        const updatedRecord = { ...r, status, ...extra };
        
        // Check if we need to refund points
        if (status === 'completed' && r.type === 'return' && r.status !== 'completed') {
          const order = userInfo.orders.find(o => o.id === r.orderId);
          if (order) {
            const item = order.items.find(i => i.productId === r.productId);
            if (item && item.isPointsOnly) {
              pointsToRefund = (item.points || 0) * item.quantity;
              refundOrderId = r.orderId;
              refundProductId = r.productId;
            }
          }
        }
        
        return updatedRecord;
      }
      return r;
    });

    let updated = { ...userInfo, afterSales };

    if (targetOrderToUpdate) {
      updated.orders = updated.orders.map(o => {
        if (o.id === targetOrderToUpdate) {
          const newStatus = targetOrderStatus;
          const currentLogistics = o.logistics || { company: '顺丰速运', trackingNumber: 'SF' + Math.random().toString().slice(-10), trajectory: [] };
          return { 
            ...o, 
            status: newStatus,
            logistics: {
              ...currentLogistics,
              trajectory: [
                { time: new Date().toLocaleString(), location: '售后中心', status: newStatus === 'afterSalesCompleted' ? '售后处理完成' : '售后申请已被拒绝' },
                ...(currentLogistics.trajectory || [])
              ]
            }
          };
        }
        return o;
      });
    }

    if (pointsToRefund > 0) {
      const newBalance = userInfo.points + pointsToRefund;
      const record: PointsRecord = {
        id: 'PR' + Date.now().toString().slice(-8),
        amount: pointsToRefund,
        type: 'refund',
        description: `商品退货积分退回 (订单号: ${refundOrderId})`,
        balance: newBalance,
        createdAt: new Date().toLocaleString()
      };

      const message: Message = {
        id: 'M' + Date.now().toString().slice(-8),
        title: '积分退回通知',
        content: `您的退货申请已处理完成，${pointsToRefund}积分已退回至您的账户。`,
        time: new Date().toLocaleString(),
        isRead: false,
        type: 'points'
      };

      updated = {
        ...updated,
        points: newBalance,
        pointsRecords: [record, ...(userInfo.pointsRecords || [])],
        messages: [message, ...(userInfo.messages || [])],
        unreadMessagesCount: (userInfo.unreadMessagesCount || 0) + 1
      };
      
      showNotification('积分已退回', `${pointsToRefund} 积分已入账`);
    } else {
      addMessage({
        title: '售后状态更新',
        content: `您的售后申请 ${id} 状态已更新为: ${status === 'approved' ? '审核通过' : status === 'rejected' ? '已拒绝' : status === 'pendingReturn' ? '待退货' : '已完成'}。`,
        type: 'order',
        businessId: id
      });
      showNotification('售后状态更新', `申请单号: ${id}`);
    }

    setUserInfo(updated);
    localStorage.setItem('donghai_user', JSON.stringify(updated));
  };

  const applyCompensation = async (record: Omit<CompensationRecord, 'id' | 'status' | 'createdAt' | 'amount' | 'points'>) => {
    if (!userInfo) throw new Error('未登录');
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const id = 'CP' + Date.now().toString().slice(-8);
        
        // Auto-calculate compensation (mock logic)
        const amount = record.type === 'cash' ? 200 : 0;
        const points = record.type === 'points' ? 2000 : 0;

        const newRecord: CompensationRecord = {
          ...record,
          id,
          amount,
          points,
          status: 'pendingAudit',
          createdAt: new Date().toLocaleString(),
        };
        
        const updated = { 
          ...userInfo, 
          compensations: [newRecord, ...(userInfo.compensations || [])],
          compensationCounts: {
            ...userInfo.compensationCounts,
            pendingAudit: (userInfo.compensationCounts.pendingAudit || 0) + 1
          }
        };
        setUserInfo(updated);
        localStorage.setItem('donghai_user', JSON.stringify(updated));
        resolve(id);
      }, 800);
    });
  };

  const updateCompensationStatus = (id: string, status: CompensationStatus, extra?: Partial<CompensationRecord>) => {
    if (!userInfo) return;
    
    let oldStatus: CompensationStatus | undefined;
    const compensations = userInfo.compensations.map(r => {
      if (r.id === id) {
        oldStatus = r.status;
        return { ...r, status, ...extra };
      }
      return r;
    });

    if (!oldStatus) return;

    const counts = { ...userInfo.compensationCounts };
    // Simplified count update logic
    if (oldStatus === 'pendingAudit') counts.pendingAudit = Math.max(0, counts.pendingAudit - 1);
    if (oldStatus === 'processing') counts.processing = Math.max(0, counts.processing - 1);
    
    if (status === 'pendingAudit') counts.pendingAudit++;
    if (status === 'processing') counts.processing++;
    if (status === 'completed') counts.completed++;

    const updated = { ...userInfo, compensations, compensationCounts: counts };
    setUserInfo(updated);
    localStorage.setItem('donghai_user', JSON.stringify(updated));
  };

  const applyEmployeeAuth = async (record: Omit<EmployeeAuthRecord, 'id' | 'status' | 'createdAt'>) => {
    if (!userInfo) throw new Error('未登录');
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const id = 'EA' + Date.now().toString().slice(-8);
        const newRecord: EmployeeAuthRecord = {
          ...record,
          id,
          status: 'pending',
          createdAt: new Date().toLocaleString(),
        };
        
        const updated = { 
          ...userInfo, 
          employeeAuth: newRecord
        };
        setUserInfo(updated);
        localStorage.setItem('donghai_user', JSON.stringify(updated));
        resolve();
      }, 800);
    });
  };

  const updateEmployeeAuthStatus = (status: EmployeeAuthStatus, extra?: Partial<EmployeeAuthRecord>) => {
    if (!userInfo || !userInfo.employeeAuth) return;
    
    const updatedAuth: EmployeeAuthRecord = {
      ...userInfo.employeeAuth,
      status,
      ...extra,
      auditTime: status !== 'pending' ? new Date().toLocaleString() : userInfo.employeeAuth.auditTime
    };

    const updated = { 
      ...userInfo, 
      employeeAuth: updatedAuth,
      isEmployee: status === 'approved'
    };
    setUserInfo(updated);
    localStorage.setItem('donghai_user', JSON.stringify(updated));
  };

  const purchasePoints = async (points: number, bonus: number, price: number, orderId?: string) => {
    if (!userInfo) throw new Error('未登录');
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const totalPoints = points + bonus;
        const newBalance = userInfo.points + totalPoints;
        
        const record: PointsRecord = {
          id: 'PR' + Date.now().toString().slice(-8),
          amount: totalPoints,
          type: 'purchase',
          description: `现金购买积分${bonus > 0 ? ` (含赠送${bonus}积分)` : ''}`,
          balance: newBalance,
          createdAt: new Date().toLocaleString(),
          paymentId: orderId || ('PAY' + Date.now().toString().slice(-10)),
          paymentAmount: price
        };

        const message: Message = {
          id: 'MSG' + Date.now().toString().slice(-8),
          title: '积分到账通知',
          content: `您成功购买了${points}积分${bonus > 0 ? `，系统额外赠送${bonus}积分` : ''}。当前积分余额：${newBalance}。`,
          time: new Date().toLocaleString(),
          isRead: false,
          type: 'points'
        };

        let updatedOrders = userInfo.orders;
        let updatedCounts = { ...userInfo.orderCounts };

        if (orderId) {
          updatedOrders = userInfo.orders.map(o => {
            if (o.id === orderId) {
              return { 
                ...o, 
                status: 'completed' as OrderStatus,
                paymentTime: new Date().toLocaleString()
              };
            }
            return o;
          });
          
          updatedCounts.pendingPayment = Math.max(0, updatedCounts.pendingPayment - 1);
        }

        const updated = {
          ...userInfo,
          points: newBalance,
          pointsRecords: [record, ...(userInfo.pointsRecords || [])],
          orders: updatedOrders,
          orderCounts: updatedCounts,
          messages: [message, ...(userInfo.messages || [])],
          unreadMessagesCount: (userInfo.unreadMessagesCount || 0) + 1
        };
        
        setUserInfo(updated);
        localStorage.setItem('donghai_user', JSON.stringify(updated));
        resolve();
      }, 1500);
    });
  };

  const shipOrder = (orderId: string) => {
    if (!userInfo) return;
    
    setUserInfo(prev => {
      if (!prev) return null;
      const orders = prev.orders.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'pendingReceipt' as OrderStatus,
            logistics: {
              company: '顺丰速运',
              trackingNumber: 'SF' + Math.random().toString().slice(-10),
              shipTime: new Date().toLocaleString(),
              trajectory: [
                { time: new Date().toLocaleString(), location: '深圳市', status: '包裹已发出，正在前往目的地' },
                { time: new Date(Date.now() - 3600000).toLocaleString(), location: '深圳市', status: '包裹正在等待揽收' }
              ]
            }
          };
        }
        return o;
      });

      const counts = { ...prev.orderCounts };
      counts.pendingShipment = Math.max(0, counts.pendingShipment - 1);
      counts.pendingReceipt++;

      const updated = { 
        ...prev, 
        orders, 
        orderCounts: counts
      };
      localStorage.setItem('donghai_user', JSON.stringify(updated));
      return updated;
    });

    addMessage({
      title: '商品已发货',
      content: `您的订单 ${orderId} 已发货，请注意查收。`,
      type: 'order',
      businessId: orderId
    });
    showNotification('商品已发货', `订单 ${orderId} 正在配送中`);
  };

  const updateUser = async (info: Partial<UserInfo>) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (userInfo) {
          const updated = { ...userInfo, ...info };
          setUserInfo(updated);
          localStorage.setItem('donghai_user', JSON.stringify(updated));
          resolve();
        }
      }, 1000);
    });
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, userInfo, login, logout, updateUser, setUnreadCount, toggleFavorite,
      addToCart, updateCartQuantity, removeFromCart, clearCart,
      addAddress, updateAddress, deleteAddress, addOrder, updateOrderStatus,
      applyAfterSales, updateAfterSalesStatus,
      applyCompensation, updateCompensationStatus,
      applyEmployeeAuth, updateEmployeeAuthStatus,
      purchasePoints,
      shipOrder,
      addMessage,
      notification,
      showNotification,
      hideNotification
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { useState } from 'react';
import Mall from './components/Mall';
import CouponCenter from './components/CouponCenter';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Profile from './components/Profile';
import Checkout from './components/Checkout';
import AfterSales from './components/AfterSales';
import Compensation from './components/Compensation';
import EmployeeAuth from './components/EmployeeAuth';
import EmployeeMall from './components/EmployeeMall';
import BuyPoints from './components/BuyPoints';
import PointsCenter from './components/PointsCenter';
import PointsMall from './components/PointsMall';
import BottomNav from './components/BottomNav';
import LoginOverlay from './components/LoginOverlay';
import CustomerService from './components/CustomerService';
import MessageCenter from './components/MessageCenter';
import MiniProgramCapsule from './components/MiniProgramCapsule';
import HelpCenter from './components/HelpCenter';
import Settings from './components/Settings';
import WeChatHome from './components/wechat/WeChatHome';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Headphones, Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function NotificationToast({ onClick }: { onClick?: () => void }) {
  const { notification, hideNotification } = useAuth();

  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, hideNotification]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="absolute bottom-24 left-0 right-0 z-[1000] flex justify-center px-4"
        >
          <div 
            onClick={() => {
              if (onClick) onClick();
              hideNotification();
            }}
            className="bg-gray-800/90 text-white backdrop-blur-md px-6 py-2 rounded-full text-sm font-medium shadow-lg cursor-pointer"
          >
            {notification.title === '已加入购物车' ? '加入购物车成功' : notification.title}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AppContent() {
  const [appMode, setAppMode] = useState<'wechat' | 'mini_program'>('mini_program');
  const [activeTab, setActiveTab] = useState('mall');
  const [prevTab, setPrevTab] = useState<string | null>(null);
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [ordersKey, setOrdersKey] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [afterSalesInfo, setAfterSalesInfo] = useState<{ orderId?: string, productId?: string } | null>(null);
  const [showCompensation, setShowCompensation] = useState(false);
  const [showEmployeeAuth, setShowEmployeeAuth] = useState(false);
  const [showEmployeeMall, setShowEmployeeMall] = useState(false);
  const [showInternalOrders, setShowInternalOrders] = useState(false);
  const [showPointsCenter, setShowPointsCenter] = useState(false);
  const [showPointsMall, setShowPointsMall] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginStep, setLoginStep] = useState<'auth' | 'phone'>('auth');
  const [showCustomerService, setShowCustomerService] = useState(false);
  const [mallCategory, setMallCategory] = useState<string | undefined>(undefined);
  const [mallProductId, setMallProductId] = useState<string | undefined>(undefined);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pId = params.get('productId');
    if (pId) {
      setMallProductId(pId);
      setActiveTab('mall');
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const triggerLogin = (step: any = 'auth') => {
    const finalStep = (step === 'auth' || step === 'phone') ? step : 'auth';
    setLoginStep(finalStep);
    setShowLogin(true);
  };
  const [showMessages, setShowMessages] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [helpCenterQuery, setHelpCenterQuery] = useState('');

  const { logout, userInfo, showBuyPoints, setShowBuyPoints } = useAuth();

  // targetOrderId is for navigating to specific order from message center
  const [targetOrderId, setTargetOrderId] = useState<string | undefined>(undefined);
  const [initialSettingSubPage, setInitialSettingSubPage] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [pendingCheckoutPay, setPendingCheckoutPay] = useState<boolean>(false);
  const [pendingCheckoutPoints, setPendingCheckoutPoints] = useState<boolean>(false);
  const [autoOpenPasswordInput, setAutoOpenPasswordInput] = useState<boolean>(false);

  React.useEffect(() => {
    if (showBuyPoints && showCheckout) {
      setPendingCheckoutPoints(true);
      setShowCheckout(false);
    }
  }, [showBuyPoints, showCheckout]);

  React.useEffect(() => {
    if (initialSettingSubPage) {
      setShowSettings(true);
    }
  }, [initialSettingSubPage]);

  React.useEffect(() => {
    const handleNavigateIdAuth = () => {
       // Switch to profile tab and then open settings->idAuth
       setShowCheckout(false);
       setActiveTab('profile');
       setInitialSettingSubPage('idAuth');
    };
    window.addEventListener('navigate-id-auth', handleNavigateIdAuth);
    return () => window.removeEventListener('navigate-id-auth', handleNavigateIdAuth);
  }, []);

  const constraintsRef = React.useRef(null);

  const handleMinimize = () => {
    setAppMode('wechat');
  };

  const handleClose = () => {
    setAppMode('wechat');
    // Reset state for fresh start
    setActiveTab('mall');
    setShowCheckout(false);
    setAfterSalesInfo(null);
    setShowCompensation(false);
    setShowEmployeeAuth(false);
    setShowEmployeeMall(false);
    setShowInternalOrders(false);
    setShowBuyPoints(false);
    setShowPointsCenter(false);
    setShowPointsMall(false);
    setShowMessages(false);
    setShowHelpCenter(false);
    logout();
  };

  const handleOpenMiniProgram = () => {
    setAppMode('mini_program');
  };

  const handleCheckout = (items: any[]) => {
    setCheckoutItems(items);
    setShowCheckout(true);
  };

  const handleApplyAfterSales = (orderId: string, productId: string) => {
    setAfterSalesInfo({ orderId, productId });
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    setShowEmployeeMall(false);
    setShowPointsMall(false);
    setShowPointsCenter(false);
    setShowInternalOrders(false);
    handleTabChange('orders');
    setOrdersKey(prev => prev + 1);
  };

  const handleTabChange = (tab: string, id?: string) => {
    // Force target order ID update
    if (id) {
      setTargetOrderId(id);
    }

    if (tab !== activeTab) {
      setPrevTab(activeTab);
      setActiveTab(tab);
      // Only clear if navigating away and NO new ID is provided
      if (tab !== 'orders' && !id) {
        setTargetOrderId(undefined);
      }
    }
    setShowEmployeeMall(false);
    setShowPointsMall(false);
    setShowPointsCenter(false);
    setShowInternalOrders(false);
    setShowBuyPoints(false);
    setShowCompensation(false);
    setShowEmployeeAuth(false);
    setShowMessages(false);
    setShowHelpCenter(false);
    setInitialSettingSubPage(null);
    setHelpCenterQuery('');
  };

  const clearInitialSettingSubPage = () => {
    setInitialSettingSubPage(null);
  };

  const handleOpenCustomerService = () => {
    if (userInfo) {
      setShowCustomerService(true);
    } else {
      triggerLogin();
    }
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'mall':
        return (
          <Mall 
            onCheckout={handleCheckout} 
            onShowCompensation={() => setShowCompensation(true)} 
            onShowEmployeeAuth={() => setShowEmployeeAuth(true)}
            onShowEmployeeMall={() => setShowEmployeeMall(true)}
            onShowPointsCenter={() => setShowPointsCenter(true)}
            onShowPointsMall={() => setShowPointsMall(true)}
            onShowLogin={triggerLogin}
            onTabChange={handleTabChange}
            onShowCustomerService={handleOpenCustomerService}
            initialCategory={mallCategory}
            onClearInitialCategory={() => setMallCategory(undefined)}
            initialProductId={mallProductId}
            onClearInitialProductId={() => setMallProductId(undefined)}
          />
        );
      case 'cart':
        return (
          <Cart 
            onBack={() => handleTabChange('mall')} 
            onCheckout={handleCheckout} 
            onShowLogin={triggerLogin} 
            onTabChange={handleTabChange}
            onShowCustomerService={handleOpenCustomerService}
            onShowEmployeeAuth={() => setShowEmployeeAuth(true)}
          />
        );
      case 'orders':
        return (
          <Orders 
            key={ordersKey}
            onApplyAfterSales={handleApplyAfterSales} 
            onShowAfterSales={(orderId, productId) => {
              setAfterSalesInfo({ orderId, productId });
            }}
            initialOrderId={targetOrderId} 
            onClearTarget={() => setTargetOrderId(undefined)}
            onBack={prevTab ? () => {
              setActiveTab(prevTab);
              setPrevTab(null);
            } : undefined}
            onCheckout={handleCheckout}
            onTabChange={handleTabChange}
            onShowLogin={triggerLogin}
            onShowCustomerService={handleOpenCustomerService}
            onShowEmployeeAuth={() => setShowEmployeeAuth(true)}
            onShowPayPassword={() => {
              if (userInfo) {
                setInitialSettingSubPage('payPassword');
                setShowSettings(true);
              } else {
                triggerLogin('auth');
              }
            }}
          />
        );
      case 'profile':
        return (
          <Profile 
            onCheckout={handleCheckout} 
            onTabChange={handleTabChange} 
            onShowAfterSales={() => setAfterSalesInfo({})} 
            onShowCompensation={() => setShowCompensation(true)}
            onShowEmployeeAuth={() => setShowEmployeeAuth(true)}
            onShowEmployeeMall={() => setShowEmployeeMall(true)}
            onShowInternalOrders={() => setShowInternalOrders(true)}
            onShowPointsCenter={() => setShowPointsCenter(true)}
            onShowPointsMall={() => setShowPointsMall(true)}
            onShowLogin={triggerLogin}
            onShowCustomerService={handleOpenCustomerService}
            onShowSettings={() => setShowSettings(true)}
            onShowPayPassword={() => {
              setInitialSettingSubPage('payPassword');
              setShowSettings(true);
            }}
          />
        );
      default:
        return (
          <Mall 
            onCheckout={handleCheckout} 
            onShowCompensation={() => setShowCompensation(true)} 
            onShowEmployeeAuth={() => setShowEmployeeAuth(true)}
            onShowEmployeeMall={() => setShowEmployeeMall(true)}
            onShowPointsCenter={() => setShowPointsCenter(true)}
            onShowPointsMall={() => setShowPointsMall(true)}
            onShowLogin={triggerLogin}
            onTabChange={handleTabChange}
            onShowCustomerService={handleOpenCustomerService}
            initialCategory={mallCategory}
            onClearInitialCategory={() => setMallCategory(undefined)}
            initialProductId={mallProductId}
            onClearInitialProductId={() => setMallProductId(undefined)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-0 sm:p-4">
      <div ref={constraintsRef} className="w-full max-w-[430px] h-screen sm:h-[844px] bg-gray-50 relative overflow-hidden flex flex-col shadow-2xl sm:rounded-[32px] sm:border-[8px] sm:border-black">
        <AnimatePresence mode="wait">
          {appMode === 'wechat' ? (
            <motion.div
              key="wechat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-hidden"
            >
              <WeChatHome onOpenMiniProgram={handleOpenMiniProgram} />
            </motion.div>
          ) : (
            <motion.div
              key="mini_program"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="flex-1 flex flex-col relative overflow-hidden"
            >
              <MiniProgramCapsule onMinimize={handleMinimize} onClose={handleClose} />
              <NotificationToast onClick={() => setShowMessages(true)} />
            
            {showCheckout ? (
              <Checkout 
                items={checkoutItems} 
                onBack={() => {
                  setShowCheckout(false);
                  setAutoOpenPasswordInput(false);
                }} 
                onSuccess={() => {
                  setAutoOpenPasswordInput(false);
                  handleCheckoutSuccess();
                }} 
                onShowLogin={triggerLogin}
                onShowEmployeeAuth={() => setShowEmployeeAuth(true)}
                onShowPayPassword={() => {
                  setPendingCheckoutPay(true);
                  setShowCheckout(false);
                  setInitialSettingSubPage('payPassword');
                  setShowSettings(true);
                }}
                autoOpenPasswordInput={autoOpenPasswordInput}
              />
            ) : showHelpCenter ? (
              <HelpCenter onBack={() => {
                setShowHelpCenter(false);
                setHelpCenterQuery('');
              }} initialSearch={helpCenterQuery} />
            ) : showSettings ? (
              <Settings 
                onBack={() => {
                  setShowSettings(false);
                  setInitialSettingSubPage(null);
                  if (pendingCheckoutPay) {
                    setPendingCheckoutPay(false);
                    setAutoOpenPasswordInput(true);
                    setShowCheckout(true);
                  }
                }} 
                initialSubPage={initialSettingSubPage} 
              />
            ) : afterSalesInfo ? (
              <AfterSales 
                orderId={afterSalesInfo.orderId} 
                productId={afterSalesInfo.productId} 
                onBack={() => setAfterSalesInfo(null)} 
              />
            ) : showCompensation ? (
              <Compensation onBack={() => setShowCompensation(false)} />
            ) : showEmployeeAuth ? (
              <EmployeeAuth 
                onBack={() => setShowEmployeeAuth(false)} 
                onShowEmployeeMall={() => {
                  setShowEmployeeAuth(false);
                  setMallCategory('员工专区');
                  handleTabChange('mall');
                }}
              />
            ) : showMessages ? (
              <MessageCenter 
                onBack={() => setShowMessages(false)} 
                onNavigate={(type, id) => {
                  setShowMessages(false);
                  if (type === 'order') {
                    handleTabChange('orders', id);
                  } else if (type === 'compensation') {
                    setShowCompensation(true);
                  }
                }} 
              />
            ) : showEmployeeMall ? (
              <EmployeeMall 
                onBack={() => setShowEmployeeMall(false)} 
                onCheckout={handleCheckout}
                onShowLogin={triggerLogin}
                onShowEmployeeAuth={() => setShowEmployeeAuth(true)}
                onTabChange={handleTabChange}
                onShowCustomerService={handleOpenCustomerService}
              />
            ) : showInternalOrders ? (
              <Orders 
                key={ordersKey}
                onApplyAfterSales={handleApplyAfterSales} 
                onShowAfterSales={(orderId, productId) => {
                  setAfterSalesInfo({ orderId, productId });
                }}
                onBack={() => setShowInternalOrders(false)}
                isInternalOnly={true} 
                onCheckout={handleCheckout}
                onTabChange={handleTabChange}
                onShowLogin={triggerLogin}
                onShowCustomerService={handleOpenCustomerService}
                onShowEmployeeAuth={() => setShowEmployeeAuth(true)}
                onShowPayPassword={() => {
                  if (userInfo) {
                    setInitialSettingSubPage('payPassword');
                    setShowSettings(true);
                  } else {
                    triggerLogin('auth');
                  }
                }}
              />
            ) : showBuyPoints ? (
              <BuyPoints onBack={() => {
                setShowBuyPoints(false);
                if (pendingCheckoutPoints) {
                  setPendingCheckoutPoints(false);
                  setShowCheckout(true);
                }
              }} />
            ) : showPointsMall ? (
              <PointsMall 
                onBack={() => setShowPointsMall(false)} 
                onCheckout={handleCheckout}
                onShowLogin={triggerLogin}
                onTabChange={handleTabChange}
                onShowCustomerService={handleOpenCustomerService}
              />
            ) : showPointsCenter ? (
              <PointsCenter 
                onBack={() => setShowPointsCenter(false)} 
              />
            ) : (
              <>
                <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
                  {renderMainContent()}
                </div>
                <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} onShowLogin={triggerLogin} />
              </>
            )}
            <LoginOverlay isOpen={showLogin} onClose={() => setShowLogin(false)} startStep={loginStep} />
            <CustomerService 
              isOpen={showCustomerService} 
              onClose={() => setShowCustomerService(false)} 
            />
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

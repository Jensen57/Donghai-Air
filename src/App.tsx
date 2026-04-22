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
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.y < -20) {
              hideNotification();
            }
          }}
          className="absolute top-6 left-4 right-4 z-[1000]"
        >
          <div 
            onClick={() => {
              if (onClick) onClick();
              hideNotification();
            }}
            className="bg-white/95 backdrop-blur-md border border-donghai/10 shadow-2xl rounded-2xl p-4 flex items-center gap-4 cursor-pointer"
          >
            <div className="w-10 h-10 bg-donghai/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-donghai" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-800 truncate">{notification.title}</h4>
              <p className="text-xs text-gray-500 truncate">{notification.content}</p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                hideNotification();
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('mall');
  const [prevTab, setPrevTab] = useState<string | null>(null);
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [afterSalesInfo, setAfterSalesInfo] = useState<{ orderId?: string, productId?: string } | null>(null);
  const [showCompensation, setShowCompensation] = useState(false);
  const [showEmployeeAuth, setShowEmployeeAuth] = useState(false);
  const [showEmployeeMall, setShowEmployeeMall] = useState(false);
  const [showInternalOrders, setShowInternalOrders] = useState(false);
  const [showBuyPoints, setShowBuyPoints] = useState(false);
  const [showPointsCenter, setShowPointsCenter] = useState(false);
  const [showPointsMall, setShowPointsMall] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCustomerService, setShowCustomerService] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [helpCenterQuery, setHelpCenterQuery] = useState('');

  // targetOrderId is for navigating to specific order from message center
  const [targetOrderId, setTargetOrderId] = useState<string | undefined>(undefined);

  const constraintsRef = React.useRef(null);

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
    setHelpCenterQuery('');
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
            onShowLogin={() => setShowLogin(true)}
            onTabChange={handleTabChange}
            onShowCustomerService={() => setShowCustomerService(true)}
          />
        );
      case 'cart':
        return <Cart onBack={() => handleTabChange('mall')} onCheckout={handleCheckout} />;
      case 'orders':
        return (
          <Orders 
            onApplyAfterSales={handleApplyAfterSales} 
            initialOrderId={targetOrderId} 
            onClearTarget={() => setTargetOrderId(undefined)}
            onBack={prevTab ? () => {
              setActiveTab(prevTab);
              setPrevTab(null);
            } : undefined}
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
            onShowLogin={() => setShowLogin(true)}
            onShowCustomerService={() => setShowCustomerService(true)}
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
            onShowLogin={() => setShowLogin(true)}
            onTabChange={handleTabChange}
            onShowCustomerService={() => setShowCustomerService(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-0 sm:p-4">
      <div ref={constraintsRef} className="w-full max-w-[430px] h-screen sm:h-[844px] bg-gray-50 relative overflow-hidden flex flex-col shadow-2xl sm:rounded-[32px] sm:border-[8px] sm:border-black">
        <MiniProgramCapsule />
        <NotificationToast onClick={() => setShowMessages(true)} />
      {/* Global Customer Service Button */}
      {!showCheckout && !afterSalesInfo && !showCompensation && !showEmployeeAuth && !showEmployeeMall && !showInternalOrders && !showBuyPoints && !showPointsMall && !showPointsCenter && !showMessages && (
        <motion.div 
          drag
          dragMomentum={false}
          dragConstraints={constraintsRef}
          onClick={() => setShowCustomerService(true)}
          className="absolute top-24 right-4 z-[100] w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-2xl flex items-center justify-center cursor-move active:scale-95 transition-transform border border-donghai/20"
        >
          <Headphones className="w-6 h-6 text-donghai" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">1</span>
          </div>
        </motion.div>
      )}

      {showCheckout ? (
        <Checkout 
          items={checkoutItems} 
          onBack={() => setShowCheckout(false)} 
          onSuccess={handleCheckoutSuccess} 
        />
      ) : showHelpCenter ? (
        <HelpCenter onBack={() => {
          setShowHelpCenter(false);
          setHelpCenterQuery('');
        }} initialSearch={helpCenterQuery} />
      ) : afterSalesInfo ? (
        <AfterSales 
          orderId={afterSalesInfo.orderId} 
          productId={afterSalesInfo.productId} 
          onBack={() => setAfterSalesInfo(null)} 
        />
      ) : showCompensation ? (
        <Compensation onBack={() => setShowCompensation(false)} />
      ) : showEmployeeAuth ? (
        <EmployeeAuth onBack={() => setShowEmployeeAuth(false)} />
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
          onShowLogin={() => setShowLogin(true)}
          onTabChange={handleTabChange}
          onShowCustomerService={() => setShowCustomerService(true)}
        />
      ) : showInternalOrders ? (
        <Orders 
          onApplyAfterSales={handleApplyAfterSales} 
          onBack={() => setShowInternalOrders(false)}
          isInternalOnly={true} 
        />
      ) : showBuyPoints ? (
        <BuyPoints onBack={() => setShowBuyPoints(false)} />
      ) : showPointsMall ? (
        <PointsMall 
          onBack={() => setShowPointsMall(false)} 
          onCheckout={handleCheckout}
          onShowLogin={() => setShowLogin(true)}
          onTabChange={handleTabChange}
          onShowCustomerService={() => setShowCustomerService(true)}
        />
      ) : showPointsCenter ? (
        <PointsCenter 
          onBack={() => setShowPointsCenter(false)} 
          onShowBuyPoints={() => setShowBuyPoints(true)}
          onShowPointsMall={() => setShowPointsMall(true)}
        />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
            {renderMainContent()}
          </div>
          <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} onShowLogin={() => setShowLogin(true)} />
        </>
      )}
      <LoginOverlay isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <CustomerService 
        isOpen={showCustomerService} 
        onClose={() => setShowCustomerService(false)} 
        onOpenHelp={(query) => {
          setShowCustomerService(false);
          setHelpCenterQuery(query || '');
          setShowHelpCenter(true);
        }}
      />
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

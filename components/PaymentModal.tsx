
import React, { useState } from 'react';
import { X, Lock, Loader2, CheckCircle, ShieldCheck, Zap, CreditCard, AlertTriangle, Smartphone, Building2 } from 'lucide-react';
import { openRazorpay } from '../services/paymentService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userData?: {
    name: string;
    email: string;
    phone: string;
  };
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, userData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRazorpayPayment = () => {
    setLoading(true);
    setError('');

    openRazorpay(
      499, // Amount
      (response) => {
        // Success Callback
        setLoading(false);
        onSuccess();
      },
      (err) => {
        // Failure Callback
        setLoading(false);
        setError(err.message || "Payment failed");
      },
      {
        name: userData?.name,
        email: userData?.email,
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
           <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <Zap size={32} fill="currentColor" />
           </div>
           
           <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Pro</h2>
           <p className="text-gray-600 mb-6">Unlock unlimited AI credits and premium templates.</p>

           <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
              <div className="flex justify-between items-center mb-2">
                 <span className="font-medium text-gray-700">Pro Subscription</span>
                 <span className="font-bold text-gray-900">₹499.00</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                 <span>Billing Cycle</span>
                 <span>One-time</span>
              </div>
           </div>

           {error && (
             <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 flex items-center justify-center gap-2">
               <ShieldCheck size={14} /> {error}
             </div>
           )}

           <button 
             onClick={handleRazorpayPayment}
             disabled={loading}
             className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 flex items-center justify-center gap-2"
           >
             {loading ? <Loader2 size={20} className="animate-spin" /> : 'Pay Securely with Razorpay'}
           </button>
           
           <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
             <Lock size={10} />
             <span>Secured by Razorpay</span>
           </div>

           {/* Test Credentials Helper */}
           <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-200 text-left">
             <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-2 uppercase tracking-wider">
               <CreditCard size={14} />
               <span>Use these Test Options</span>
             </div>
             
             <div className="space-y-3 text-xs">
               {/* Option 1: Netbanking (Easiest) */}
               <div className="bg-green-50 p-2.5 rounded border border-green-100">
                  <div className="flex items-center gap-2 mb-1">
                     <Building2 size={14} className="text-green-700" />
                     <span className="font-bold text-green-800">Method 1: Netbanking (Easiest)</span>
                  </div>
                  <p className="text-green-700 pl-6">
                    Select <strong>Netbanking</strong> &rarr; Choose any bank (e.g., Test Bank, SBI) &rarr; Click Pay. No ID required.
                  </p>
               </div>

               {/* Option 2: UPI */}
               <div className="bg-blue-50 p-2.5 rounded border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                     <Smartphone size={14} className="text-blue-700" />
                     <span className="font-bold text-blue-800">Method 2: UPI</span>
                  </div>
                  <p className="text-blue-700 pl-6">
                     Select <strong>UPI</strong> &rarr; Enter VPA: <code className="bg-white px-1 rounded font-mono border border-blue-200">success@razorpay</code> &rarr; Pay Now.
                  </p>
               </div>

               <div className="p-2 text-slate-500 flex gap-2 items-start border-t border-slate-200 mt-1">
                 <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                 <span>Cards often fail in Sandbox due to region locks. Please use Netbanking for instant success.</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

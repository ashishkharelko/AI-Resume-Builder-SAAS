
import React, { useState } from 'react';
import { X, CreditCard, Lock, Loader2, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        setSuccess(false);
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Lock size={16} className="text-green-600" /> Secure Checkout
          </h3>
          <button onClick={onClose} disabled={loading || success} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 animate-fadeIn">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <CheckCircle size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Payment Successful!</h4>
              <p className="text-gray-500">You are now a Pro member.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Subscribe to</p>
                <div className="flex justify-between items-end">
                  <h2 className="text-2xl font-bold text-gray-900">Pro Plan</h2>
                  <span className="text-xl font-bold text-blue-600">₹499<span className="text-sm text-gray-500 font-normal">/mo</span></span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input type="text" required className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Details</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      required 
                      className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                    <input type="text" required className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                    <input type="text" required className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="123" />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="bg-blue-50 text-blue-700 text-xs p-3 rounded mb-4 border border-blue-100">
                    <p className="font-bold mb-1">Test Mode Enabled</p>
                    <p>No actual charge will be made. You can use any details to proceed.</p>
                    <p className="mt-1 text-blue-600/80">Tip: Use "4242 4242 4242 4242" as card number.</p>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : 'Pay ₹499.00'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

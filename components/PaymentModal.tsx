
import React, { useState } from 'react';
import { X, Lock, Loader2, CheckCircle, CreditCard, Calendar, Code, User, Sparkles } from 'lucide-react';
import { createOrder } from '../services/paymentService';

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

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [cardData, setCardData] = useState({
    holderName: '',
    number: '',
    expiry: '',
    cvc: ''
  });

  if (!isOpen) return null;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ').substring(0, 19); // Limit to 19 chars (16 digits + 3 spaces)
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrorMessage(''); // Clear error on type
    
    if (name === 'number') {
      setCardData(prev => ({ ...prev, number: formatCardNumber(value) }));
    } else if (name === 'expiry') {
      setCardData(prev => ({ ...prev, expiry: formatExpiry(value) }));
    } else if (name === 'cvc') {
      setCardData(prev => ({ ...prev, cvc: value.replace(/\D/g, '').slice(0, 4) }));
    } else if (name === 'holderName') {
      setCardData(prev => ({ ...prev, holderName: value }));
    }
  };

  const fillTestData = () => {
    setCardData({
      holderName: 'Test User',
      number: '4242 4242 4242 4242',
      expiry: '12/30',
      cvc: '123'
    });
    setErrorMessage('');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Remove spaces for validation
      const cleanNumber = cardData.number.replace(/\s/g, '');
      
      if (!cardData.holderName.trim()) {
        throw new Error("Please enter card holder's name");
      }

      // Allow 12 or 16 digits for test convenience
      const isTestCard = cleanNumber.startsWith('4242');
      const isValidLength = cleanNumber.length === 16 || cleanNumber.length === 12;
      const isValidExpiry = cardData.expiry.length === 5; // MM/YY
      const isValidCvc = cardData.cvc.length >= 3;

      if (isTestCard && isValidLength && isValidExpiry && isValidCvc) {
        
        // Create simulated order
        await createOrder(499);

        // Simulate processing
        setTimeout(() => {
          setLoading(false);
          setSuccess(true);
          setTimeout(() => {
            onSuccess();
            setSuccess(false);
            setCardData({ holderName: '', number: '', expiry: '', cvc: '' });
            onClose();
          }, 2000);
        }, 2000);

      } else {
        if (!isTestCard) throw new Error("Invalid card number. Try the test card starting with 4242.");
        if (!isValidLength) throw new Error(`Card number must be 12 or 16 digits (Current: ${cleanNumber.length})`);
        if (!isValidExpiry) throw new Error("Invalid expiry date (MM/YY)");
        if (!isValidCvc) throw new Error("Invalid CVC");
        
        throw new Error("Invalid card details. Please check inputs.");
      }

    } catch (error: any) {
      console.error("Payment failed", error);
      setLoading(false);
      setErrorMessage(error.message || "Payment failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Lock size={16} className="text-green-600" /> Secure Checkout
          </h3>
          <button 
            onClick={onClose} 
            disabled={loading || success} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
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
              <p className="text-gray-500">Thank you for upgrading to Pro.</p>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-5">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500">Total Amount</p>
                <h2 className="text-3xl font-bold text-gray-900">₹499.00</h2>
              </div>

              {errorMessage && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 animate-shake">
                   <span className="font-bold">Error:</span> {errorMessage}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Card Holder Name</label>
                    <button 
                      type="button"
                      onClick={fillTestData} 
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Sparkles size={10} /> Autofill Test Data
                    </button>
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      name="holderName"
                      value={cardData.holderName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      name="number"
                      value={cardData.number}
                      onChange={handleInputChange}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Expiry</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        name="expiry"
                        value={cardData.expiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">CVC</label>
                    <div className="relative">
                      <Code className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        name="cvc"
                        value={cardData.cvc}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={4}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded text-xs text-blue-800 border border-blue-100">
                <strong>Test Mode:</strong> Use card <span className="font-mono">4242...</span> (12 or 16 digits) with any future date.
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : 'Pay Securely'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

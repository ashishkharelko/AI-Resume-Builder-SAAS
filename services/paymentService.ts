
// Mock Payment Service for Testing
interface OrderResponse {
  id: string;
  currency: string;
  amount: number;
}

interface VerificationResponse {
  status: 'success' | 'failure';
}

export const createOrder = async (amount: number): Promise<OrderResponse> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "test_order_" + Math.random().toString(36).substring(7),
        currency: "INR",
        amount: amount * 100
      });
    }, 800);
  });
};

export const verifyPayment = async (paymentData: any): Promise<boolean> => {
  // Simulate network delay and successful verification
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

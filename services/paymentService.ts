
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const openRazorpay = (
  amount: number, 
  onSuccess: (response: any) => void, 
  onFailure: (error: any) => void,
  prefill?: { name?: string; email?: string; contact?: string }
) => {
  
  const options = {
    key: "rzp_test_Ri2dji4nUc92yy", // Test API Key
    amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "ResumeAI Builder",
    description: "Pro Plan Subscription",
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // Logo
    handler: function (response: any) {
      // In a real app, verify signature on backend here
      onSuccess(response);
    },
    prefill: {
      name: prefill?.name || "",
      email: prefill?.email || "",
      contact: prefill?.contact || ""
    },
    theme: {
      color: "#2563eb"
    },
    modal: {
      ondismiss: function() {
        onFailure({ message: "Payment cancelled by user" });
      }
    }
  };

  const rzp1 = new window.Razorpay(options);
  
  rzp1.on('payment.failed', function (response: any){
      onFailure({ message: response.error.description || "Payment failed" });
  });

  rzp1.open();
};

// Keep legacy signature for compatibility if needed elsewhere, but unused
export const createOrder = async (amount: number): Promise<any> => {
  return { id: "legacy_mock" };
};

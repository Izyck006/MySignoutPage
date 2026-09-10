import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { usePaystackPayment } from 'react-paystack';
export default function CompletePayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);
  const currentUser = auth.currentUser;
  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: currentUser?.email || "",
    amount: 50000, // 500 NGN in kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
  };
  const initializePayment = usePaystackPayment(paystackConfig);
  const handlePayment = async () => {
    if (!currentUser) {
        setError("You must be logged in to complete payment.");
        return;
    }
    setError("");
    setIsProcessing(true);
    initializePayment({
        onSuccess: async (reference: any) => {
          try {
            let baseSlug = currentUser.email?.split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-') || "user";
            let finalSlug = baseSlug;
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", finalSlug));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              finalSlug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
            }
            await setDoc(doc(db, "users", currentUser.uid), {
              fullName: "New User", // We lost the original full name they typed if they closed the modal, so we provide a default they can edit later.
              username: finalSlug,
              email: currentUser.email,
              role: "student",
              paymentStatus: "paid",
              paystackReference: reference.reference,
              createdAt: new Date().toISOString(),
            });
            navigate("/dashboard");
          } catch (dbErr: any) {
            setError("Payment successful but failed to setup account. Please contact support.");
          } finally {
            setIsProcessing(false);
          }
        },
        onClose: () => {
          setIsProcessing(false);
          setError("Payment was cancelled.");
        }
      });
  };
  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-bold mb-4 text-primary">Complete Payment</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          It looks like you registered an account but didn't complete the one-time 500 NGN setup fee. 
          You must pay this fee to unlock your 3D digital shirt and Dashboard.
        </p>
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mb-6 text-sm border border-red-200">{error}</div>}
        <button 
          onClick={handlePayment} 
          disabled={isProcessing || !currentUser} 
          className="w-full bg-primary text-white p-3 rounded-md hover:bg-primary/90 font-bold transition-colors disabled:opacity-70 mb-4"
        >
          {isProcessing ? "Processing..." : "Pay 500 NGN"}
        </button>
        <button 
          onClick={handleLogout} 
          className="w-full bg-gray-100 text-gray-700 p-3 rounded-md hover:bg-gray-200 font-bold transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

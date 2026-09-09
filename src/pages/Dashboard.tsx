import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { LogOut, User, MessageSquare, Trash2, ExternalLink, Copy, Check, Download, Calendar, Coffee, ChevronDown } from "lucide-react";
import ShirtModel from "../components/ShirtModel";

interface Message {
  id: string;
  senderName: string;
  content: string;
  createdAt: string;
  position: [number, number, number];
}

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Gift Details State
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [savingGiftDetails, setSavingGiftDetails] = useState(false);
  const [isEditingGift, setIsEditingGift] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const publicLink = `${window.location.origin}/${username || currentUser?.uid}`;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;
      
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          const name = data.fullName || "";
          setFullName(name);
          
          let currentUsername = data.username;
          if (!currentUsername && name) {
            // Self-heal: Generate a username for old accounts that don't have one
            let baseSlug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            if (!baseSlug) baseSlug = "user";
            currentUsername = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
            
            // Fire and forget update
            updateDoc(userDocRef, { username: currentUsername }).catch(console.error);
          }
          
          setUsername(currentUsername || currentUser.uid);
          setBankName(data.bankName || "");
          setAccountNumber(data.accountNumber || "");
          setAccountName(data.accountName || "");
          
          if (!data.bankName || !data.accountNumber || !data.accountName) {
            setIsEditingGift(true);
          }
        } else {
          // Self-heal: Create the missing user document
          const defaultName = currentUser.displayName || "Student";
          
          let baseSlug = defaultName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          if (!baseSlug) baseSlug = "user";
          const newUsername = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;

          await setDoc(userDocRef, {
            fullName: defaultName,
            username: newUsername,
            email: currentUser.email,
            role: "student",
            createdAt: new Date().toISOString(),
          });
          setFullName(defaultName);
          setUsername(newUsername);
        }

        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, where("recipientId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const fetchedMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          fetchedMessages.push({ id: doc.id, ...doc.data() } as Message);
        });
        
        fetchedMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleDeleteSignature = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this signature?")) {
      try {
        const { deleteDoc, doc } = await import("firebase/firestore");
        await deleteDoc(doc(db, "messages", id));
        setMessages(messages.filter(msg => msg.id !== id));
      } catch (err) {
        console.error("Failed to delete message:", err);
        alert("Failed to delete signature.");
      }
    }
  };

  const handleSaveGiftDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    // Validate 10 digits
    if (accountNumber && !/^\d{10}$/.test(accountNumber)) {
      alert("Account number must be exactly 10 digits.");
      return;
    }

    setSavingGiftDetails(true);
    try {
      await setDoc(doc(db, "users", currentUser.uid), {
        bankName,
        accountNumber,
        accountName
      }, { merge: true });
      setIsEditingGift(false);
      alert("Gift account details saved successfully!");
    } catch (err) {
      console.error("Error saving gift details:", err);
      alert("Failed to save gift details.");
    } finally {
      setSavingGiftDetails(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12 animate-pulse">
        <nav className="bg-white border-b border-gray-200 h-16"></nav>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 flex items-center gap-5">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-64"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 h-[500px]"></div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-100 p-4 h-32"></div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 h-32"></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-64"></div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-48"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-xl font-bold text-primary">MySignout</Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">{currentUser?.email}</span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors bg-gray-100 hover:bg-red-50 px-3 py-2 rounded-md"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center text-primary">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {fullName || 'Student'}!</h1>
              <p className="text-gray-500">Manage your digital sign-out page and messages below.</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            
            {/* 3D Shirt Viewer */}
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
               <ShirtModel 
                 messages={messages} 
                 readOnly={true} 
                 isExporting={isExporting}
                 onExportComplete={() => setIsExporting(false)}
               />
               <div className="mt-4 pb-2 px-2 flex justify-end">
                <button 
                  onClick={() => setIsExporting(true)}
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-wait"
                >
                  <Download size={18} className={isExporting ? "animate-bounce" : ""} />
                  {isExporting ? "Packaging 3D Model..." : "Download 3D Model (.glb)"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="text-primary" size={24} />
                Signatures Log
                <span className="bg-primary text-white text-xs px-2.5 py-0.5 rounded-full ml-2">
                  {messages.length}
                </span>
              </h2>
              
              {messages.length > 0 && (
                <button
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to clear all signatures? This cannot be undone.")) {
                      try {
                        const { deleteDoc, doc } = await import("firebase/firestore");
                        for (const msg of messages) {
                          await deleteDoc(doc(db, "messages", msg.id));
                        }
                        setMessages([]);
                      } catch (err) {
                        console.error("Failed to clear messages:", err);
                        alert("Failed to clear messages.");
                      }
                    }
                  }}
                  className="text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-md font-medium transition-colors"
                >
                  Clear All Signatures
                </button>
              )}
            </div>

            {messages.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={28} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No signatures yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Your page is ready! Share your unique link with colleagues and friends to start collecting memories.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-gray-900 text-lg">{msg.senderName}</h4>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar size={14} />
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </div>
                        <button 
                          onClick={() => handleDeleteSignature(msg.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Delete signature"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6 sticky top-24 h-fit">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Share Your Page</h3>
              <p className="text-sm text-gray-600 mb-4">
                Send this link to anyone you want to sign your digital year book. They don't need an account to sign.
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600 truncate mr-2 select-all">
                  {publicLink}
                </span>
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={copyToClipboard}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${
                    copied 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                
                <Link
                  to={`/${username || currentUser?.uid}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink size={18} />
                  View Public Page
                </Link>
              </div>
            </div>

            {/* Gift Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Gift Account Details</h3>
                {!isEditingGift && (
                  <button 
                    onClick={() => setIsEditingGift(true)}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Allow visitors to send you a gift by providing your bank details. Clear the fields to hide this on your public page.
              </p>
              
              {isEditingGift ? (
                <form onSubmit={handleSaveGiftDetails} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="e.g. Chase Bank"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number (10 digits)</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="10 digit number"
                      maxLength={10}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={savingGiftDetails}
                    className="w-full bg-primary text-white py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 flex justify-center items-center"
                  >
                    {savingGiftDetails ? "Saving..." : "Save Details"}
                  </button>
                </form>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Bank Name</div>
                    <div className="font-medium text-gray-900">{bankName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Account Name</div>
                    <div className="font-medium text-gray-900">{accountName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Account Number</div>
                    <div className="font-medium text-gray-900 font-mono">{accountNumber}</div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Support the Creator Floating Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isSupportOpen && (
          <div className="mb-4 w-80 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl border border-amber-200 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200 origin-bottom-right">
            <div className="p-5 border-b border-amber-200/60 bg-white/40 backdrop-blur-sm flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-amber-900">Support the Creator</h3>
                <p className="text-sm text-amber-700">Keep the servers running! ☕</p>
              </div>
            </div>
            <div className="p-5 bg-white/90 backdrop-blur-sm space-y-4">
              <div>
                <div className="text-xs text-amber-800/70 uppercase tracking-wider font-semibold mb-1">Bank</div>
                <div className="font-medium text-amber-900 text-lg">Opay</div>
              </div>
              <div>
                <div className="text-xs text-amber-800/70 uppercase tracking-wider font-semibold mb-1">Account Name</div>
                <div className="font-medium text-amber-900 text-lg">Ehimen Isaac Audu</div>
              </div>
              <div>
                <div className="text-xs text-amber-800/70 uppercase tracking-wider font-semibold mb-1">Account Number</div>
                <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl p-3 mt-1 shadow-inner">
                  <span className="font-mono text-xl font-bold text-amber-700 tracking-wide">7071316989</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText("7071316989");
                      const btn = e.currentTarget;
                      const originalHTML = btn.innerHTML;
                      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                      setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
                    }}
                    className="p-2 text-amber-600 hover:text-amber-800 transition-colors bg-white hover:bg-amber-100 rounded-lg shadow-sm border border-amber-100"
                    title="Copy Account Number"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setIsSupportOpen(!isSupportOpen)}
          className={`flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
            isSupportOpen 
              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300 rounded-full w-14 h-14' 
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full px-6 py-4 gap-3'
          }`}
        >
          {isSupportOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <>
              <Coffee size={24} />
              <span className="font-bold text-lg">Support the Creator</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

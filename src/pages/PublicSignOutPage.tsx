import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import ShirtModel from "../components/ShirtModel";
import { Copy, PenTool, CheckCircle2, X, Gift } from "lucide-react";
import NotFound from "./NotFound";
import * as THREE from 'three';

const COLORS = [
  { name: 'Purple', hex: '#9333ea' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Black', hex: '#111827' }
];

// Helper to wrap text on canvas
const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    
    if (metrics.width > maxWidth && n > 0) {
      context.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
};

export default function PublicSignOutPage() {
  const { slug } = useParams<{ slug: string }>();
  const [recipientName, setRecipientName] = useState("");
  const [actualRecipientId, setActualRecipientId] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  
  // Gift State
  const [giftDetails, setGiftDetails] = useState<{bankName: string, accountName: string, accountNumber: string} | null>(null);
  const [giftCopied, setGiftCopied] = useState(false);
  
  // Placement State
  const [isPlacingMode, setIsPlacingMode] = useState(false);
  const [pendingSignature, setPendingSignature] = useState<any>(null);
  
  // Form State
  const [senderName, setSenderName] = useState("");
  const [content, setContent] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[4].hex);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!slug) return;
      try {
        let userDocData = null;
        let foundRecipientId = slug;

        // Try to find user by custom username first
        const usersRef = collection(db, "users");
        const userQ = query(usersRef, where("username", "==", slug));
        const userSnapshot = await getDocs(userQ);

        if (!userSnapshot.empty) {
          userDocData = userSnapshot.docs[0].data();
          foundRecipientId = userSnapshot.docs[0].id;
        } else {
          // Fallback to searching by document ID (for older links without usernames)
          const userDocRef = await getDoc(doc(db, "users", slug));
          if (userDocRef.exists()) {
            userDocData = userDocRef.data();
            foundRecipientId = userDocRef.id;
          }
        }

        if (userDocData) {
          setRecipientName(userDocData.fullName);
          setActualRecipientId(foundRecipientId);
          if (userDocData.accountNumber && userDocData.bankName && userDocData.accountName) {
            setGiftDetails({
              bankName: userDocData.bankName,
              accountName: userDocData.accountName,
              accountNumber: userDocData.accountNumber
            });
          }
        } else {
          setError("This sign-out page does not exist.");
          return;
        }

        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, where("recipientId", "==", foundRecipientId));
        const querySnapshot = await getDocs(q);
        
        const fetchedMessages: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedMessages.push({ id: doc.id, ...doc.data() });
        });
        setMessages(fetchedMessages);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [slug]);

  const MIN_DISTANCE = 0.2; // Adjusted minimum distance between signatures to fit more

  const handleShirtClick = async (position: [number, number, number], normal?: [number, number, number]) => {
    if (success) return; // Prevent signing again if already signed
    
    if (!isPlacingMode || !pendingSignature) {
      // Friendly UX: If they click the shirt without clicking "Sign" first, just open the modal
      if (!isModalOpen && !isPlacingMode) {
        setIsModalOpen(true);
      }
      return;
    }

    let finalPosition = [...position] as [number, number, number];
    let finalNormal = normal ? ([...normal] as [number, number, number]) : ([0, 0, 1] as [number, number, number]);

    const checkConflict = (pos: [number, number, number], norm: [number, number, number]) => {
      const [x1, y1, z1] = pos;
      const [nx1, ny1, nz1] = norm;
      return messages.some((msg) => {
        const [x2, y2, z2] = msg.position;
        const msgNormal = msg.normal || [0, 0, 1];
        const [nx2, ny2, nz2] = msgNormal;
        
        const distance = Math.sqrt(
          Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)
        );
        
        const dotProduct = nx1 * nx2 + ny1 * ny2 + nz1 * nz2;
        
        // If distance < MIN_DISTANCE and dotProduct > 0.5 (meaning they face similar directions)
        return distance < MIN_DISTANCE && dotProduct > 0.5;
      });
    };

    if (checkConflict(finalPosition, finalNormal)) {
      let foundSpot = false;
      const MAX_ATTEMPTS = 150; // Try plenty of spots
      
      const N = new THREE.Vector3(...finalNormal).normalize();
      let up = new THREE.Vector3(0, 1, 0);
      if (Math.abs(N.y) > 0.9) up = new THREE.Vector3(1, 0, 0);
      const right = new THREE.Vector3().crossVectors(N, up).normalize();
      const upTangent = new THREE.Vector3().crossVectors(right, N).normalize();

      for (let i = 1; i <= MAX_ATTEMPTS; i++) {
        const radius = Math.sqrt(i) * 0.05; // Increase radius progressively
        const angle = i * 2.39996; // Golden angle for even distribution

        const offsetRight = right.clone().multiplyScalar(Math.cos(angle) * radius);
        const offsetUp = upTangent.clone().multiplyScalar(Math.sin(angle) * radius);

        const candidatePos = new THREE.Vector3(...position).add(offsetRight).add(offsetUp);
        const candidatePosArray = [candidatePos.x, candidatePos.y, candidatePos.z] as [number, number, number];
        
        if (!checkConflict(candidatePosArray, finalNormal)) {
          finalPosition = candidatePosArray;
          foundSpot = true;
          break;
        }
      }

      if (!foundSpot) {
        alert("This area is too crowded! Please click somewhere else.");
        return;
      }
    }

    // Process the placement
    setSubmitting(true);
    try {
      const newMessage = {
        recipientId: actualRecipientId,
        senderName: pendingSignature.senderName,
        content: pendingSignature.content,
        imageData: pendingSignature.imageData,
        position: finalPosition,
        normal: finalNormal,
        tilt: pendingSignature.tilt || 0,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "messages"), newMessage);
      
      setMessages([...messages, { id: docRef.id, ...newMessage }]);
      setSuccess(true);
      setIsPlacingMode(false);
      setPendingSignature(null);
      setSubmitting(false);
      setCooldown(30);
    } catch (err) {
      console.error("Error saving signature:", err);
      alert("Failed to save your signature. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim()) return;
    
    let imageData = "";
    
    // Random tilt between -15 and 15 degrees, converted to radians
    const tilt = (Math.random() * 30 - 15) * (Math.PI / 180);

    // Generate an image from the typed message
    if (content.trim() || senderName.trim()) {
      const canvas = document.createElement("canvas");
      // We will resize it after calculating text height
      canvas.width = 1024;
      canvas.height = 1024; 
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        // Must load the font config to measure accurately
        ctx.font = "80px 'Caveat', cursive";
        
        const maxWidth = 900;
        const lineHeight = 90;
        const padding = 50;
        
        const textToWrap = content.trim() ? `${content.trim()} — ${senderName.trim()}` : senderName.trim();
        
        // Measure height
        const words = textToWrap.split(' ');
        let line = '';
        let currentY = padding;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          if (ctx.measureText(testLine).width > maxWidth && n > 0) {
            line = words[n] + ' ';
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        const totalHeight = currentY + lineHeight + padding;
        
        // Resize canvas to perfectly bound the text
        canvas.width = 1024;
        canvas.height = totalHeight;
        
        // Clear transparent background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Context resets on resize, so re-apply
        ctx.fillStyle = selectedColor;
        ctx.font = "80px 'Caveat', cursive";
        ctx.textBaseline = "top";
        
        wrapText(ctx, textToWrap, padding, padding, maxWidth, lineHeight);
        
        imageData = canvas.toDataURL("image/png");
      }
    }

    if (!imageData) {
      alert("Please type a message!");
      return;
    }

    // Save temporarily and enter placement mode
    setPendingSignature({
      senderName,
      content: "", // Content is now embedded in the image
      imageData,
      tilt,
    });
    
    setIsModalOpen(false);
    setIsPlacingMode(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <span>MySignout</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 gap-8">
        {/* Left Column: Instructions & 3D Model */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">{recipientName}'s Sign-out Page</h1>
            <p className="text-gray-600 text-lg mb-4">
              {success 
                ? "Thank you for signing! Your message is now part of history." 
                : "Leave a memorable signature on the digital shirt!"}
            </p>
            
            {!isPlacingMode && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={cooldown > 0}
                  className={`w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors shadow-sm disabled:bg-gray-400 ${cooldown > 0 ? "cursor-not-allowed" : ""}`}
                >
                  {cooldown > 0 ? `Wait ${cooldown}s` : "Sign the Shirt"}
                </button>
                {giftDetails && (
                  <button
                    onClick={() => setIsGiftModalOpen(true)}
                    className="w-full sm:w-auto bg-white text-primary border-2 border-primary px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Gift size={20} />
                    Send a Gift
                  </button>
                )}
              </div>
            )}
            
            {isPlacingMode && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-center justify-between shadow-inner animate-in fade-in slide-in-from-top-2">
                <span className="font-medium text-left">Great! Now tap anywhere on the 3D shirt to place your signature.</span>
                <button 
                  onClick={() => setIsPlacingMode(false)}
                  className="text-sm bg-white border border-amber-200 px-3 py-1.5 rounded-md hover:bg-amber-100 transition-colors shrink-0 ml-4"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex-grow">
             <ShirtModel messages={messages} onShirtClick={handleShirtClick} ownerName={recipientName} />
          </div>
        </div>
      </main>

      {/* Signature Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <PenTool size={18} className="text-primary" />
                Sign the Shirt
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSign} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type your signature or message (Max 150 chars)</label>
                <textarea
                  rows={3}
                  maxLength={150}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-sans"
                  placeholder="Leave a memorable message..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ink Color</label>
                <div className="flex gap-3">
                  {COLORS.map(color => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setSelectedColor(color.hex)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color.hex ? 'border-primary scale-110' : 'border-transparent hover:scale-105 shadow-sm'}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white py-3 rounded-md font-bold hover:bg-primary/90 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Continue to Placement
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Gift Modal */}
      {isGiftModalOpen && giftDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Gift size={18} className="text-primary" />
                Send a Gift to {recipientName}
              </h3>
              <button 
                onClick={() => setIsGiftModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-600 mb-4">
                Want to send a graduation or leaving gift? Here are the bank details:
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Bank Name</div>
                  <div className="font-medium text-gray-900">{giftDetails.bankName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Account Name</div>
                  <div className="font-medium text-gray-900">{giftDetails.accountName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Account Number</div>
                  <div className="font-medium text-gray-900 font-mono text-lg">{giftDetails.accountNumber}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(giftDetails.accountNumber);
                  setGiftCopied(true);
                  setTimeout(() => setGiftCopied(false), 3000);
                }}
                className={`w-full py-3 rounded-md font-bold transition-colors flex justify-center items-center gap-2 ${
                  giftCopied 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {giftCopied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                {giftCopied ? `Thank you so much from ${recipientName}!` : 'Copy Account Number'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen Loading Overlay for applying signature */}
      {submitting && isPlacingMode && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex flex-col items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm text-center">
            <div className="relative w-20 h-20 mb-6">
              {/* Spinner */}
              <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <PenTool className="absolute inset-0 m-auto text-primary animate-pulse" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Applying Signature...</h3>
            <p className="text-gray-500 text-sm">Please wait while we magically ink your message onto the shirt.</p>
          </div>
        </div>
      )}
    </div>
  );
}

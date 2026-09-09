import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Password Validation: 8+ chars, at least 1 uppercase, at least 1 number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters, contain at least one uppercase letter, and one number.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let baseSlug = fullName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (!baseSlug) baseSlug = "user";
      
      let finalSlug = baseSlug;
      
      // Check for uniqueness
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", finalSlug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        finalSlug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
      }

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        username: finalSlug,
        email,
        role: "student",
        createdAt: new Date().toISOString(),
      });

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to register");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">Register</h2>
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm border border-red-200">{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm font-bold">Full Name</label>
            <input
              type="text"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm font-bold">Email</label>
            <input
              type="email"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-sm font-bold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Must be at least 8 characters, include an uppercase letter and a number.
            </p>
          </div>
          <button type="submit" className="w-full bg-primary text-white p-3 rounded-md hover:bg-primary/90 font-bold transition-colors">
            Register
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

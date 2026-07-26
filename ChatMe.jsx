import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle, Search, ArrowLeft, Smile, Paperclip, Camera, Send,
  Phone, Video, PhoneMissed, PhoneIncoming, PhoneOutgoing, MoreVertical,
  Settings as SettingsIcon, LogOut, Edit2, Bell, Lock, Moon, Sun, Info,
  HelpCircle, User, Users, Check, CheckCheck, Plus, Image as ImageIcon,
  X, Mail, Eye, EyeOff, ChevronRight, Upload, Loader2, Shield, KeyRound,
  Clock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Seed / mock data                                                   */
/* ------------------------------------------------------------------ */

const SEED_USERS = [
  { id: 1, fullname: "Sarah Chen", email: "sarah@chatme.com", password: "password123", photo: "https://i.pravatar.cc/150?img=5", bio: "Product designer. Coffee enthusiast ☕", phone: "+1 555-0101", created_at: "2024-01-15", online: true },
  { id: 2, fullname: "Mike Johnson", email: "mike@chatme.com", password: "password123", photo: "https://i.pravatar.cc/150?img=12", bio: "Software engineer building cool things", phone: "+1 555-0102", created_at: "2024-02-10", online: false, lastSeen: "2h ago" },
  { id: 3, fullname: "Emma Davis", email: "emma@chatme.com", password: "password123", photo: "https://i.pravatar.cc/150?img=9", bio: "Photographer 📷 always chasing light", phone: "+1 555-0103", created_at: "2024-01-20", online: true },
  { id: 4, fullname: "Alex Kim", email: "alex@chatme.com", password: "password123", photo: "https://i.pravatar.cc/150?img=33", bio: "Traveler ✈️ 27 countries and counting", phone: "+1 555-0104", created_at: "2024-03-05", online: false, lastSeen: "yesterday" },
  { id: 5, fullname: "Priya Patel", email: "priya@chatme.com", password: "password123", photo: "https://i.pravatar.cc/150?img=47", bio: "Yoga instructor 🧘", phone: "+1 555-0105", created_at: "2024-02-28", online: true },
  { id: 6, fullname: "Diego Ramirez", email: "diego@chatme.com", password: "password123", photo: "https://i.pravatar.cc/150?img=51", bio: "Chef & food blogger", phone: "+1 555-0106", created_at: "2024-03-12", online: false, lastSeen: "3d ago" },
];

const CURRENT_USER_ID = 1;

const SEED_MESSAGES = {
  2: [
    { id: 1, senderId: 2, text: "Hey! How's the redesign going?", timestamp: "9:15 AM", status: "read" },
    { id: 2, senderId: 1, text: "Going really well, just polishing the chat screen now", timestamp: "9:18 AM", status: "read" },
    { id: 3, senderId: 2, text: "Awesome, can't wait to see it", timestamp: "9:20 AM", status: "read" },
    { id: 4, senderId: 1, text: "I'll send you a preview later today", timestamp: "9:21 AM", status: "delivered" },
  ],
  3: [
    { id: 1, senderId: 3, text: "Loved the photos from the shoot!", timestamp: "Yesterday", status: "read" },
    { id: 2, senderId: 1, text: "Thank you! The lighting was perfect", timestamp: "Yesterday", status: "read" },
    { id: 3, senderId: 3, text: "Let's do another session next week 📷", timestamp: "8:02 AM", status: "delivered" },
  ],
  4: [
    { id: 1, senderId: 1, text: "How was Lisbon?", timestamp: "Mon", status: "read" },
    { id: 2, senderId: 4, text: "Incredible! You have to visit sometime", timestamp: "Mon", status: "read" },
  ],
  5: [
    { id: 1, senderId: 5, text: "Class got moved to 6pm today", timestamp: "7:40 AM", status: "delivered" },
  ],
};

const SEED_UNREAD = { 2: 0, 3: 1, 4: 0, 5: 2, 6: 0 };

const SEED_CALLS = [
  { id: 1, userId: 2, type: "video", direction: "outgoing", missed: false, duration: "12:04", timestamp: "Today, 10:20 AM" },
  { id: 2, userId: 3, type: "voice", direction: "incoming", missed: true, duration: null, timestamp: "Today, 8:05 AM" },
  { id: 3, userId: 5, type: "voice", direction: "incoming", missed: false, duration: "3:41", timestamp: "Yesterday, 6:12 PM" },
  { id: 4, userId: 4, type: "video", direction: "outgoing", missed: true, duration: null, timestamp: "Yesterday, 2:00 PM" },
  { id: 5, userId: 6, type: "voice", direction: "outgoing", duration: "0:52", missed: false, timestamp: "Mon, 11:30 AM" },
];

const REPLIES = [
  "Sounds good to me!",
  "Haha true 😄",
  "Let me check and get back to you",
  "That works for me",
  "No way, really?",
  "On it 👍",
];

/* ------------------------------------------------------------------ */
/*  Small shared UI pieces                                             */
/* ------------------------------------------------------------------ */

function Logo({ size = 64, dark = false }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-blue-500 shadow-lg"
        style={{ width: size, height: size }}
      >
        <MessageCircle color="white" size={size * 0.55} strokeWidth={2.2} />
      </div>
    </div>
  );
}

function TextField({ icon: Icon, type = "text", placeholder, value, onChange, error, rightElement, dark }) {
  return (
    <div className="w-full">
      <div
        className={`flex items-center gap-2 rounded-xl border px-3 py-3 ${
          error ? "border-red-400" : dark ? "border-gray-700" : "border-gray-200"
        } ${dark ? "bg-gray-800" : "bg-gray-50"}`}
      >
        {Icon && <Icon size={18} className={dark ? "text-gray-400" : "text-gray-400"} />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`flex-1 bg-transparent outline-none text-sm ${dark ? "text-white placeholder-gray-500" : "text-gray-800 placeholder-gray-400"}`}
        />
        {rightElement}
      </div>
      {error && <p className="mt-1 text-xs text-red-500 pl-1">{error}</p>}
    </div>
  );
}

function PrimaryButton({ children, onClick, color = "green", disabled, type = "button" }) {
  const bg = color === "green" ? "bg-green-500 active:bg-green-600" : "bg-blue-500 active:bg-blue-600";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl py-3.5 text-white font-semibold text-sm shadow-md transition-colors ${bg} ${
        disabled ? "opacity-50" : ""
      }`}
    >
      {children}
    </button>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-4 py-2 rounded-xl shadow-lg">
      {message}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Screens: Auth                                                      */
/* ------------------------------------------------------------------ */

function SplashScreen({ dark }) {
  return (
    <div className={`flex flex-col items-center justify-center h-full gap-4 ${dark ? "bg-gray-900" : "bg-white"}`}>
      <Logo size={88} />
      <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>ChatMe</h1>
      <Loader2 className="animate-spin text-green-500 mt-6" size={26} />
    </div>
  );
}

function SignUpScreen({ users, onSignUp, goSignIn, dark }) {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [photo, setPhoto] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const submit = () => {
    const errs = {};
    if (!fullname.trim()) errs.fullname = "Full name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email";
    else if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase()))
      errs.email = "This email is already registered";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Use at least 6 characters";
    if (confirm !== password) errs.confirm = "Passwords do not match";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSignUp({ fullname: fullname.trim(), email: email.trim(), password, photo, bio: "", phone: "" });
    }
  };

  return (
    <div className={`h-full overflow-y-auto px-6 py-8 ${dark ? "bg-gray-900" : "bg-white"}`}>
      <div className="flex flex-col items-center mb-6">
        <Logo size={56} />
        <h1 className={`text-xl font-bold mt-4 ${dark ? "text-white" : "text-gray-900"}`}>Create Account</h1>
        <p className="text-sm text-gray-400 mt-1">Join ChatMe today</p>
      </div>

      <div className="flex flex-col items-center mb-5">
        <button
          onClick={() => fileRef.current?.click()}
          className="w-20 h-20 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden"
        >
          {photo ? (
            <img src={photo} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <Upload size={22} className="text-gray-400" />
          )}
        </button>
        <input type="file" accept="image/*" ref={fileRef} onChange={handlePhoto} className="hidden" />
        <span className="text-xs text-green-600 font-medium mt-2">Upload Profile Photo</span>
      </div>

      <div className="flex flex-col gap-3">
        <TextField icon={User} placeholder="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)} error={errors.fullname} dark={dark} />
        <TextField icon={Mail} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} dark={dark} />
        <TextField
          icon={Lock}
          type={showPw ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          dark={dark}
          rightElement={
            <button type="button" onClick={() => setShowPw((s) => !s)}>
              {showPw ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
            </button>
          }
        />
        <TextField
          icon={Lock}
          type={showPw ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          dark={dark}
        />
      </div>

      <div className="mt-6">
        <PrimaryButton onClick={submit} color="green">Sign Up</PrimaryButton>
      </div>

      <p className={`text-center text-sm mt-5 ${dark ? "text-gray-400" : "text-gray-500"}`}>
        Already have an account?{" "}
        <button onClick={goSignIn} className="text-blue-500 font-semibold">Sign In</button>
      </p>
    </div>
  );
}

function SignInScreen({ users, onSignIn, goSignUp, goReset, dark }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const submit = () => {
    if (!email.trim() || !password) {
      setError("Enter your email and password");
      return;
    }
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || user.password !== password) {
      setError("Incorrect email or password");
      return;
    }
    setError("");
    onSignIn(user);
  };

  return (
    <div className={`h-full overflow-y-auto px-6 py-10 ${dark ? "bg-gray-900" : "bg-white"}`}>
      <div className="flex flex-col items-center mb-8">
        <Logo size={64} />
        <h1 className={`text-xl font-bold mt-4 ${dark ? "text-white" : "text-gray-900"}`}>Welcome Back</h1>
        <p className="text-sm text-gray-400 mt-1">Sign in to continue</p>
      </div>

      <div className="flex flex-col gap-3">
        <TextField icon={Mail} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} dark={dark} />
        <TextField
          icon={Lock}
          type={showPw ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          dark={dark}
          rightElement={
            <button type="button" onClick={() => setShowPw((s) => !s)}>
              {showPw ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
            </button>
          }
        />
        {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
      </div>

      <div className="flex justify-end mt-2">
        <button onClick={goReset} className="text-xs text-blue-500 font-medium">Forgot Password?</button>
      </div>

      <div className="mt-6">
        <PrimaryButton onClick={submit} color="blue">Sign In</PrimaryButton>
      </div>

      <p className={`text-center text-sm mt-5 ${dark ? "text-gray-400" : "text-gray-500"}`}>
        Don't have an account?{" "}
        <button onClick={goSignUp} className="text-green-600 font-semibold">Sign Up</button>
      </p>

      <p className="text-center text-[11px] text-gray-400 mt-8">Demo login: sarah@chatme.com / password123</p>
    </div>
  );
}

function ResetPasswordScreen({ goSignIn, dark }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className={`h-full overflow-y-auto px-6 py-10 ${dark ? "bg-gray-900" : "bg-white"}`}>
      <div className="flex flex-col items-center mb-8">
        <Logo size={56} />
        <h1 className={`text-xl font-bold mt-4 ${dark ? "text-white" : "text-gray-900"}`}>Reset Password</h1>
        <p className="text-sm text-gray-400 mt-1 text-center">Enter your email and we'll send you a reset link</p>
      </div>

      {sent ? (
        <div className="text-center">
          <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-3">
            <Check className="text-green-500" size={26} />
          </div>
          <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>Reset link sent to {email}</p>
        </div>
      ) : (
        <>
          <TextField icon={Mail} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} dark={dark} />
          <div className="mt-6">
            <PrimaryButton onClick={() => email.trim() && setSent(true)} color="green">Send Reset Link</PrimaryButton>
          </div>
        </>
      )}

      <p className="text-center text-sm mt-6">
        <button onClick={goSignIn} className="text-blue-500 font-semibold">Back to Sign In</button>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Bottom Nav + Top Bar                                                */
/* ------------------------------------------------------------------ */

function BottomNav({ active, onChange, dark }) {
  const items = [
    { key: "chats", label: "Chats", icon: MessageCircle },
    { key: "contacts", label: "Contacts", icon: Users },
    { key: "calls", label: "Calls", icon: Phone },
    { key: "profile", label: "Profile", icon: User },
  ];
  return (
    <div className={`flex border-t ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
      {items.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="flex-1 flex flex-col items-center gap-1 py-2.5"
          >
            <Icon size={20} className={isActive ? "text-green-500" : "text-gray-400"} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] font-medium ${isActive ? "text-green-500" : "text-gray-400"}`}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ScreenHeader({ title, onBack, dark, right }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-4 border-b ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
      {onBack && (
        <button onClick={onBack}>
          <ArrowLeft size={20} className={dark ? "text-white" : "text-gray-700"} />
        </button>
      )}
      <h1 className={`text-base font-bold flex-1 ${dark ? "text-white" : "text-gray-900"}`}>{title}</h1>
      {right}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Home Screen                                                        */
/* ------------------------------------------------------------------ */

function timeAgoLabel(ts) {
  return ts;
}

function HomeScreen({ users, currentUser, messagesData, unread, openChat, dark }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const rows = users
    .filter((u) => u.id !== currentUser.id && messagesData[u.id])
    .map((u) => {
      const msgs = messagesData[u.id] || [];
      const last = msgs[msgs.length - 1];
      return { user: u, last, unread: unread[u.id] || 0 };
    })
    .filter((r) => r.user.fullname.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-col h-full">
      <div className={`px-4 py-4 border-b flex items-center gap-3 ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
        <h1 className={`text-xl font-bold flex-1 ${dark ? "text-white" : "text-gray-900"}`}>ChatMe</h1>
        <button onClick={() => setSearchOpen((s) => !s)}>
          <Search size={20} className="text-green-500" />
        </button>
      </div>
      {searchOpen && (
        <div className={`px-4 py-2 border-b ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
          <TextField icon={Search} placeholder="Search chats" value={query} onChange={(e) => setQuery(e.target.value)} dark={dark} />
        </div>
      )}
      <div className={`flex-1 overflow-y-auto ${dark ? "bg-gray-900" : "bg-white"}`}>
        {rows.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-10">No chats found</p>
        )}
        {rows.map(({ user, last, unread: u }) => (
          <button
            key={user.id}
            onClick={() => openChat(user.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 border-b ${dark ? "border-gray-800 active:bg-gray-800" : "border-gray-50 active:bg-gray-50"}`}
          >
            <div className="relative shrink-0">
              <img src={user.photo} alt={user.fullname} className="w-12 h-12 rounded-xl object-cover" />
              {user.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-gray-900"}`}>{user.fullname}</span>
                <span className="text-[11px] text-gray-400 shrink-0 ml-2">{last ? timeAgoLabel(last.timestamp) : ""}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className={`text-xs truncate ${u > 0 ? (dark ? "text-gray-200" : "text-gray-700") : "text-gray-400"}`}>
                  {last ? (last.senderId === currentUser.id ? "You: " : "") + last.text : "Say hi 👋"}
                </span>
                {u > 0 && (
                  <span className="ml-2 shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-green-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {u}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chat Screen                                                        */
/* ------------------------------------------------------------------ */

function ChatScreen({ contact, currentUser, messages, onSend, onBack, typing, dark }) {
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, typing]);

  const send = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-3 px-3 py-3 border-b ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
        <button onClick={onBack}>
          <ArrowLeft size={20} className={dark ? "text-white" : "text-gray-700"} />
        </button>
        <div className="relative shrink-0">
          <img src={contact.photo} alt={contact.fullname} className="w-9 h-9 rounded-xl object-cover" />
          {contact.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-gray-900"}`}>{contact.fullname}</p>
          <p className="text-[11px] text-gray-400">
            {typing ? <span className="text-green-500">typing…</span> : contact.online ? "Online" : `Last seen ${contact.lastSeen || "recently"}`}
          </p>
        </div>
        <Phone size={18} className="text-blue-500" />
        <Video size={18} className="text-blue-500" />
      </div>

      <div className={`flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2 ${dark ? "bg-gray-950" : "bg-gray-50"}`}>
        {messages.map((m) => {
          const mine = m.senderId === currentUser.id;
          return (
            <div key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                  mine ? "bg-green-500 text-white rounded-br-sm" : dark ? "bg-gray-800 text-gray-100 rounded-bl-sm" : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                }`}
              >
                {m.text}
              </div>
              <div className="flex items-center gap-1 mt-0.5 px-1">
                <span className="text-[10px] text-gray-400">{m.timestamp}</span>
                {mine && (m.status === "read" ? <CheckCheck size={12} className="text-blue-500" /> : <Check size={12} className="text-gray-400" />)}
              </div>
            </div>
          );
        })}
        {typing && (
          <div className="flex items-start">
            <div className={`rounded-xl rounded-bl-sm px-3 py-2 ${dark ? "bg-gray-800" : "bg-white shadow-sm"}`}>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className={`flex items-center gap-2 px-3 py-2.5 border-t ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
        <button><Smile size={20} className="text-gray-400" /></button>
        <button><Paperclip size={20} className="text-gray-400" /></button>
        <button><Camera size={20} className="text-gray-400" /></button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message"
          className={`flex-1 rounded-xl px-3 py-2 text-sm outline-none ${dark ? "bg-gray-800 text-white placeholder-gray-500" : "bg-gray-100 text-gray-800 placeholder-gray-400"}`}
        />
        <button onClick={send} className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
          <Send size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Contacts Screen                                                    */
/* ------------------------------------------------------------------ */

function ContactsScreen({ users, currentUser, openChat, dark }) {
  const [query, setQuery] = useState("");
  const contacts = users.filter((u) => u.id !== currentUser.id && u.fullname.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Contacts" dark={dark} />
      <div className={`px-4 py-3 border-b ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
        <TextField icon={Search} placeholder="Search contacts" value={query} onChange={(e) => setQuery(e.target.value)} dark={dark} />
      </div>
      <div className={`flex-1 overflow-y-auto ${dark ? "bg-gray-900" : "bg-white"}`}>
        {contacts.map((u) => (
          <button
            key={u.id}
            onClick={() => openChat(u.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 border-b ${dark ? "border-gray-800 active:bg-gray-800" : "border-gray-50 active:bg-gray-50"}`}
          >
            <div className="relative shrink-0">
              <img src={u.photo} alt={u.fullname} className="w-11 h-11 rounded-xl object-cover" />
              {u.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-gray-900"}`}>{u.fullname}</p>
              <p className="text-xs text-gray-400">{u.online ? "Online" : `Last seen ${u.lastSeen || "recently"}`}</p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Calls Screen                                                       */
/* ------------------------------------------------------------------ */

function CallsScreen({ calls, users, dark, onCall }) {
  const [tab, setTab] = useState("all");
  const filtered = calls.filter((c) => {
    if (tab === "missed") return c.missed;
    if (tab === "voice") return c.type === "voice";
    if (tab === "video") return c.type === "video";
    return true;
  });

  const tabs = [
    { key: "all", label: "All" },
    { key: "voice", label: "Voice" },
    { key: "video", label: "Video" },
    { key: "missed", label: "Missed" },
  ];

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Calls" dark={dark} />
      <div className={`flex gap-2 px-4 py-3 border-b overflow-x-auto ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 ${
              tab === t.key ? "bg-green-500 text-white" : dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className={`flex-1 overflow-y-auto ${dark ? "bg-gray-900" : "bg-white"}`}>
        {filtered.length === 0 && <p className="text-center text-sm text-gray-400 mt-10">No calls yet</p>}
        {filtered.map((c) => {
          const u = users.find((usr) => usr.id === c.userId);
          if (!u) return null;
          const DirIcon = c.missed ? PhoneMissed : c.direction === "incoming" ? PhoneIncoming : PhoneOutgoing;
          const dirColor = c.missed ? "text-red-500" : "text-green-500";
          return (
            <div key={c.id} className={`flex items-center gap-3 px-4 py-3 border-b ${dark ? "border-gray-800" : "border-gray-50"}`}>
              <img src={u.photo} alt={u.fullname} className="w-11 h-11 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${c.missed ? "text-red-500" : dark ? "text-white" : "text-gray-900"}`}>{u.fullname}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <DirIcon size={12} className={dirColor} />
                  <span className="text-[11px] text-gray-400">{c.timestamp}{c.duration ? ` · ${c.duration}` : ""}</span>
                </div>
              </div>
              <button onClick={() => onCall(u, c.type)} className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                {c.type === "video" ? <Video size={14} className="text-white" /> : <Phone size={14} className="text-white" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Profile Screen                                                     */
/* ------------------------------------------------------------------ */

function ProfileScreen({ user, goEdit, goSettings, onLogout, dark }) {
  return (
    <div className={`flex flex-col h-full overflow-y-auto ${dark ? "bg-gray-900" : "bg-white"}`}>
      <ScreenHeader title="Profile" dark={dark} />
      <div className="flex flex-col items-center py-8 px-6">
        <img src={user.photo} alt={user.fullname} className="w-24 h-24 rounded-xl object-cover shadow-md" />
        <h2 className={`text-lg font-bold mt-4 ${dark ? "text-white" : "text-gray-900"}`}>{user.fullname}</h2>
        <p className="text-sm text-gray-400">{user.email}</p>
        {user.bio && <p className={`text-sm text-center mt-3 ${dark ? "text-gray-300" : "text-gray-600"}`}>{user.bio}</p>}
        {user.phone && <p className="text-sm text-gray-400 mt-1">{user.phone}</p>}
      </div>

      <div className="px-6 flex flex-col gap-3">
        <PrimaryButton onClick={goEdit} color="green">Edit Profile</PrimaryButton>
        <button
          onClick={goSettings}
          className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${dark ? "border-gray-700 text-gray-200" : "border-gray-200 text-gray-700"}`}
        >
          <SettingsIcon size={18} className="text-blue-500" /> Settings
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-500"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}

function EditProfileScreen({ user, onSave, onBack, dark }) {
  const [fullname, setFullname] = useState(user.fullname);
  const [bio, setBio] = useState(user.bio || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [photo, setPhoto] = useState(user.photo);
  const fileRef = useRef(null);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  return (
    <div className={`flex flex-col h-full overflow-y-auto ${dark ? "bg-gray-900" : "bg-white"}`}>
      <ScreenHeader title="Edit Profile" onBack={onBack} dark={dark} />
      <div className="px-6 py-6 flex flex-col gap-4">
        <div className="flex flex-col items-center">
          <button onClick={() => fileRef.current?.click()} className="relative">
            <img src={photo} alt="profile" className="w-20 h-20 rounded-xl object-cover" />
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center">
              <Camera size={12} className="text-white" />
            </span>
          </button>
          <input type="file" accept="image/*" ref={fileRef} onChange={handlePhoto} className="hidden" />
        </div>
        <TextField icon={User} placeholder="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)} dark={dark} />
        <TextField icon={Info} placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} dark={dark} />
        <TextField icon={Phone} placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} dark={dark} />
        <PrimaryButton color="green" onClick={() => onSave({ fullname, bio, phone, photo })}>Save Changes</PrimaryButton>
      </div>
    </div>
  );
}

function ChangePasswordScreen({ onBack, onSave, dark }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!current || !next || !confirm) return setError("All fields are required");
    if (next !== confirm) return setError("New passwords do not match");
    setError("");
    onSave(next);
  };

  return (
    <div className={`flex flex-col h-full overflow-y-auto ${dark ? "bg-gray-900" : "bg-white"}`}>
      <ScreenHeader title="Change Password" onBack={onBack} dark={dark} />
      <div className="px-6 py-6 flex flex-col gap-4">
        <TextField icon={KeyRound} type="password" placeholder="Current password" value={current} onChange={(e) => setCurrent(e.target.value)} dark={dark} />
        <TextField icon={Lock} type="password" placeholder="New password" value={next} onChange={(e) => setNext(e.target.value)} dark={dark} />
        <TextField icon={Lock} type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} dark={dark} />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <PrimaryButton color="blue" onClick={submit}>Update Password</PrimaryButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings Screen                                                    */
/* ------------------------------------------------------------------ */

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${on ? "bg-green-500 justify-end" : "bg-gray-300 justify-start"}`}
    >
      <span className="w-5 h-5 rounded-full bg-white shadow" />
    </button>
  );
}

function SettingsScreen({ dark, setDark, notifications, setNotifications, onBack, goChangePw, goInfo, onLogout }) {
  return (
    <div className={`flex flex-col h-full overflow-y-auto ${dark ? "bg-gray-900" : "bg-white"}`}>
      <ScreenHeader title="Settings" onBack={onBack} dark={dark} />
      <div className="px-4 py-4 flex flex-col gap-2">
        <div className={`flex items-center justify-between rounded-xl px-4 py-3.5 ${dark ? "bg-gray-800" : "bg-gray-50"}`}>
          <div className="flex items-center gap-3">
            <Moon size={18} className="text-blue-500" />
            <span className={`text-sm font-medium ${dark ? "text-gray-100" : "text-gray-800"}`}>Dark Mode</span>
          </div>
          <Toggle on={dark} onChange={setDark} />
        </div>
        <div className={`flex items-center justify-between rounded-xl px-4 py-3.5 ${dark ? "bg-gray-800" : "bg-gray-50"}`}>
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-blue-500" />
            <span className={`text-sm font-medium ${dark ? "text-gray-100" : "text-gray-800"}`}>Notifications</span>
          </div>
          <Toggle on={notifications} onChange={setNotifications} />
        </div>

        {[
          { icon: Shield, label: "Privacy", action: () => goInfo("privacy") },
          { icon: KeyRound, label: "Change Password", action: goChangePw },
          { icon: Info, label: "About", action: () => goInfo("about") },
          { icon: HelpCircle, label: "Help", action: () => goInfo("help") },
        ].map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            onClick={action}
            className={`flex items-center justify-between rounded-xl px-4 py-3.5 ${dark ? "bg-gray-800" : "bg-gray-50"}`}
          >
            <div className="flex items-center gap-3">
              <Icon size={18} className="text-blue-500" />
              <span className={`text-sm font-medium ${dark ? "text-gray-100" : "text-gray-800"}`}>{label}</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        ))}

        <button onClick={onLogout} className="flex items-center gap-3 rounded-xl px-4 py-3.5 mt-2 border border-red-200">
          <LogOut size={18} className="text-red-500" />
          <span className="text-sm font-medium text-red-500">Logout</span>
        </button>
      </div>
    </div>
  );
}

function InfoScreen({ kind, onBack, dark }) {
  const content = {
    privacy: {
      title: "Privacy",
      body: "Control who can see your online status, last seen, and read receipts. Your messages are only visible to you and the people you chat with.",
    },
    about: {
      title: "About",
      body: "ChatMe v1.0.0 — a simple, modern way to stay in touch. Built with care for fast, clean conversations.",
    },
    help: {
      title: "Help",
      body: "Need a hand? Reach out to support@chatme.com or browse frequently asked questions in the community forum.",
    },
  }[kind];

  return (
    <div className={`flex flex-col h-full overflow-y-auto ${dark ? "bg-gray-900" : "bg-white"}`}>
      <ScreenHeader title={content.title} onBack={onBack} dark={dark} />
      <p className={`px-6 py-6 text-sm leading-relaxed ${dark ? "text-gray-300" : "text-gray-600"}`}>{content.body}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Root App                                                           */
/* ------------------------------------------------------------------ */

export default function App() {
  const [users, setUsers] = useState(SEED_USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [screen, setScreen] = useState("splash");
  const [activeTab, setActiveTab] = useState("chats");
  const [activeChatId, setActiveChatId] = useState(null);
  const [messagesData, setMessagesData] = useState(SEED_MESSAGES);
  const [unread, setUnread] = useState(SEED_UNREAD);
  const [calls, setCalls] = useState(SEED_CALLS);
  const [dark, setDark] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [typingFor, setTypingFor] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (screen === "splash") {
      const t = setTimeout(() => setScreen("signin"), 3000);
      return () => clearTimeout(t);
    }
  }, [screen]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const handleSignUp = (data) => {
    const newUser = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      fullname: data.fullname,
      email: data.email,
      password: data.password,
      photo: data.photo || "https://i.pravatar.cc/150?img=68",
      bio: "",
      phone: "",
      created_at: new Date().toISOString().slice(0, 10),
      online: true,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setMessagesData({});
    setUnread({});
    setScreen("home");
    setActiveTab("chats");
  };

  const handleSignIn = (user) => {
    setCurrentUser(user);
    setScreen("home");
    setActiveTab("chats");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setScreen("signin");
    setActiveChatId(null);
  };

  const openChat = (userId) => {
    setActiveChatId(userId);
    setUnread((prev) => ({ ...prev, [userId]: 0 }));
    setScreen("chat");
  };

  const handleSend = (text) => {
    if (!currentUser || !activeChatId) return;
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const newMsg = { id: Date.now(), senderId: currentUser.id, text, timestamp, status: "sent" };
    setMessagesData((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));

    setTimeout(() => {
      setMessagesData((prev) => ({
        ...prev,
        [activeChatId]: (prev[activeChatId] || []).map((m) => (m.id === newMsg.id ? { ...m, status: "delivered" } : m)),
      }));
    }, 700);

    setTimeout(() => setTypingFor(activeChatId), 1200);

    setTimeout(() => {
      setTypingFor(null);
      const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      setMessagesData((prev) => ({
        ...prev,
        [activeChatId]: [
          ...(prev[activeChatId] || []).map((m) => (m.id === newMsg.id ? { ...m, status: "read" } : m)),
          { id: Date.now() + 1, senderId: activeChatId, text: reply, timestamp: replyTime, status: "delivered" },
        ],
      }));
    }, 2800);
  };

  const handleCall = (user, type) => {
    showToast(`Calling ${user.fullname}… (${type})`);
  };

  let body = null;
  const dk = dark;

  if (screen === "splash") body = <SplashScreen dark={dk} />;
  else if (screen === "signup")
    body = <SignUpScreen users={users} onSignUp={handleSignUp} goSignIn={() => setScreen("signin")} dark={dk} />;
  else if (screen === "signin")
    body = (
      <SignInScreen
        users={users}
        onSignIn={handleSignIn}
        goSignUp={() => setScreen("signup")}
        goReset={() => setScreen("reset")}
        dark={dk}
      />
    );
  else if (screen === "reset") body = <ResetPasswordScreen goSignIn={() => setScreen("signin")} dark={dk} />;
  else if (screen === "chat" && activeChatId) {
    const contact = users.find((u) => u.id === activeChatId);
    body = (
      <ChatScreen
        contact={contact}
        currentUser={currentUser}
        messages={messagesData[activeChatId] || []}
        onSend={handleSend}
        onBack={() => setScreen("home")}
        typing={typingFor === activeChatId}
        dark={dk}
      />
    );
  } else if (screen === "editProfile") {
    body = (
      <EditProfileScreen
        user={currentUser}
        onBack={() => setScreen("profile")}
        dark={dk}
        onSave={(updates) => {
          const updated = { ...currentUser, ...updates };
          setCurrentUser(updated);
          setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
          showToast("Profile updated");
          setScreen("profile");
        }}
      />
    );
  } else if (screen === "settings") {
    body = (
      <SettingsScreen
        dark={dk}
        setDark={setDark}
        notifications={notifications}
        setNotifications={setNotifications}
        onBack={() => setScreen("profile")}
        goChangePw={() => setScreen("changePassword")}
        goInfo={(kind) => setScreen("info:" + kind)}
        onLogout={handleLogout}
      />
    );
  } else if (screen === "changePassword") {
    body = (
      <ChangePasswordScreen
        dark={dk}
        onBack={() => setScreen("settings")}
        onSave={(pw) => {
          const updated = { ...currentUser, password: pw };
          setCurrentUser(updated);
          setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
          showToast("Password updated");
          setScreen("settings");
        }}
      />
    );
  } else if (screen.startsWith("info:")) {
    body = <InfoScreen kind={screen.split(":")[1]} onBack={() => setScreen("settings")} dark={dk} />;
  } else if (currentUser) {
    // main tabbed area
    let tabBody = null;
    if (activeTab === "chats")
      tabBody = <HomeScreen users={users} currentUser={currentUser} messagesData={messagesData} unread={unread} openChat={openChat} dark={dk} />;
    else if (activeTab === "contacts")
      tabBody = <ContactsScreen users={users} currentUser={currentUser} openChat={openChat} dark={dk} />;
    else if (activeTab === "calls")
      tabBody = <CallsScreen calls={calls} users={users} dark={dk} onCall={handleCall} />;
    else if (activeTab === "profile")
      tabBody = (
        <ProfileScreen
          user={currentUser}
          goEdit={() => setScreen("editProfile")}
          goSettings={() => setScreen("settings")}
          onLogout={handleLogout}
          dark={dk}
        />
      );
    body = (
      <div className="flex flex-col h-full">
        <div className="flex-1 min-h-0">{tabBody}</div>
        <BottomNav active={activeTab} onChange={(k) => { setActiveTab(k); setScreen(k); }} dark={dk} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200 py-4">
      <Toast message={toast} />
      <div
        className={`relative w-full max-w-sm h-[720px] rounded-xl shadow-2xl overflow-hidden border ${dk ? "border-gray-800" : "border-gray-200"}`}
        style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      >
        {body}
      </div>
    </div>
  );
}

import React, { useState } from 'react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const user = {
    name: "Mohamed Emaan",
    email: "emmann.2006@gmail.com",
    tier: "Gold VIP",
    points: 1250,
    wallet: 450,
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'orders', label: 'My Orders', icon: '📦' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'rewards', label: 'Rewards & Loyalty', icon: '🏆' },
    { id: 'settings', label: 'Settings & Security', icon: '⚙️' },
    { id: 'support', label: 'Help & Support', icon: '💬' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView user={user} setTab={setActiveTab} />;
      case 'orders':
        return <OrdersView />;
      case 'wishlist':
        return <WishlistView />;
      case 'addresses':
        return <AddressView />;
      case 'rewards':
        return <RewardsView points={user.points} tier={user.tier} />;
      case 'settings':
        return <SettingsView />;
      case 'support':
        return <SupportView />;
      default:
        return <DashboardView user={user} setTab={setActiveTab} />;
    }
  };

  // Avatar Upload State
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = React.useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => setAvatar(null);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 mt-4 font-sans text-slate-800">
      
      {/* Mobile Top Header (hidden on Desktop) */}
      <div className="md:hidden flex items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative">
        <div 
          className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-md cursor-pointer overflow-hidden border-2 border-white relative group"
          onClick={() => fileInputRef.current.click()}
        >
          {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : user.name.charAt(0)}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs">Edit</span>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-md">{user.tier}</span>
        </div>
        {avatar && <button onClick={removeAvatar} className="absolute right-4 top-4 text-xs text-rose-500 font-semibold bg-rose-50 px-2 py-1 rounded">Remove</button>}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Desktop Sidebar (hidden on Mobile) */}
        <aside className="hidden md:flex flex-col w-72 flex-shrink-0 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 relative text-center">
            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleAvatarChange} />
            <div 
              className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-md cursor-pointer overflow-hidden border-4 border-white relative group"
              onClick={() => fileInputRef.current.click()}
            >
              {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : user.name.charAt(0)}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-semibold">📷 Upload</span>
              </div>
            </div>
            {avatar && <button onClick={removeAvatar} className="text-xs text-rose-500 hover:underline">Remove Photo</button>}
            
            <div className="mt-2">
              <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
              <span className="text-sm text-slate-500">{user.email}</span>
            </div>
          </div>
          
          <nav className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {menuItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 text-left text-sm font-semibold transition-colors
                  ${activeTab === item.id 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                    : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
              >
                <span className="text-lg">{item.icon}</span> {item.label}
              </button>
            ))}
            <button className="w-full flex items-center gap-3 px-6 py-4 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100">
              <span className="text-lg">🚪</span> Logout
            </button>
          </nav>
        </aside>

        {/* Mobile Horizontal Scroll Menu */}
        <nav className="md:hidden flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors border
                ${activeTab === item.id 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 min-h-[600px]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// ── SUB-COMPONENTS ──────────────────────────────────────────────

const DashboardView = ({ user, setTab }) => (
  <div className="animate-fade-in">
    <h2 className="text-2xl font-bold mb-6 text-slate-900">Overview</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-sm text-blue-600 font-semibold">Total Orders</p>
        <h3 className="text-2xl font-black text-blue-900 mt-1">12</h3>
      </div>
      <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
        <p className="text-sm text-rose-600 font-semibold">Wishlist</p>
        <h3 className="text-2xl font-black text-rose-900 mt-1">5 Items</h3>
      </div>
      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
        <p className="text-sm text-emerald-600 font-semibold">Wallet</p>
        <h3 className="text-2xl font-black text-emerald-900 mt-1">₹{user.wallet}</h3>
      </div>
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
        <p className="text-sm text-amber-600 font-semibold">Points</p>
        <h3 className="text-2xl font-black text-amber-900 mt-1">{user.points}</h3>
      </div>
    </div>
    
    <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button onClick={() => setTab('orders')} className="p-4 border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-300 transition text-left">
        <span className="text-2xl mb-2 block">📦</span>
        <h4 className="font-bold text-slate-800">Track Orders</h4>
        <p className="text-xs text-slate-500 mt-1">View status of recent purchases</p>
      </button>
      <button onClick={() => setTab('addresses')} className="p-4 border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-300 transition text-left">
        <span className="text-2xl mb-2 block">📍</span>
        <h4 className="font-bold text-slate-800">Manage Addresses</h4>
        <p className="text-xs text-slate-500 mt-1">Add or edit delivery locations</p>
      </button>
      <button onClick={() => setTab('support')} className="p-4 border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-300 transition text-left">
        <span className="text-2xl mb-2 block">💬</span>
        <h4 className="font-bold text-slate-800">Get Help</h4>
        <p className="text-xs text-slate-500 mt-1">Contact our 24/7 support team</p>
      </button>
    </div>
  </div>
);

const OrdersView = () => (
  <div className="animate-fade-in">
    <h2 className="text-2xl font-bold mb-6 text-slate-900">Order History</h2>
    <div className="space-y-4">
      {/* Mock Order Card */}
      <div className="border border-slate-200 rounded-xl p-4 md:p-6 hover:shadow-sm transition">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 pb-4 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-400 font-mono">ORDER #ORD-7392-XT</p>
            <p className="text-sm font-semibold text-slate-700 mt-1">Placed on Oct 01, 2026</p>
          </div>
          <div className="text-left md:text-right">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold inline-block">✅ Delivered</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">🎧</div>
          <div className="flex-grow">
            <h4 className="font-bold text-slate-800">Premium Wireless Headphones</h4>
            <p className="text-sm text-slate-500 mt-1">Qty: 1 • Color: Matte Black</p>
            <p className="font-bold text-blue-600 mt-1">₹4,999</p>
          </div>
          <div className="hidden md:flex flex-col gap-2">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50">View Invoice</button>
            <button className="px-4 py-2 text-rose-600 text-sm font-semibold hover:underline">Return Item</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const WishlistView = () => (
  <div className="animate-fade-in text-center py-12">
    <span className="text-6xl block mb-4">❤️</span>
    <h3 className="text-xl font-bold text-slate-800">Your Wishlist is Empty</h3>
    <p className="text-slate-500 mt-2">Explore our products and tap the heart icon to save them here.</p>
    <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Start Shopping</button>
  </div>
);

const AddressView = () => (
  <div className="animate-fade-in">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-slate-900">Saved Addresses</h2>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm">+ Add New</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="border-2 border-blue-500 bg-blue-50 p-4 rounded-xl relative">
        <span className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">DEFAULT</span>
        <h4 className="font-bold text-slate-800 mb-1">Home</h4>
        <p className="text-sm text-slate-600 leading-relaxed">
          123, Nexus Tech Park<br/>
          OMR, Chennai, Tamil Nadu - 600097<br/>
          Phone: +91 98765 43210
        </p>
        <div className="mt-4 flex gap-4 text-sm font-semibold text-blue-600">
          <button className="hover:underline">Edit</button>
          <button className="hover:underline">Delete</button>
        </div>
      </div>
    </div>
  </div>
);

const RewardsView = ({ points, tier }) => (
  <div className="animate-fade-in">
    <h2 className="text-2xl font-bold mb-6 text-slate-900">Nexus Rewards</h2>
    <div className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8">
      <p className="uppercase text-amber-100 font-bold tracking-wider text-sm">Current Tier: {tier}</p>
      <h3 className="text-4xl md:text-5xl font-black mt-2">{points} <span className="text-2xl font-medium">pts</span></h3>
      <div className="w-full bg-amber-900/30 rounded-full h-2 mt-6">
        <div className="bg-white h-2 rounded-full" style={{width: '75%'}}></div>
      </div>
      <p className="text-amber-100 text-sm mt-2">Earn 250 more points to unlock Platinum Tier!</p>
    </div>
    <h3 className="font-bold text-lg mb-4">Available Coupons</h3>
    <div className="border border-slate-200 p-4 rounded-xl flex justify-between items-center bg-slate-50">
      <div>
        <p className="font-bold text-rose-600">₹500 OFF</p>
        <p className="text-sm text-slate-500">On orders above ₹2000 (Costs 500 pts)</p>
      </div>
      <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold">Redeem</button>
    </div>
  </div>
);

const SettingsView = () => (
  <div className="animate-fade-in">
    <h2 className="text-2xl font-bold mb-6 text-slate-900">Security & Preferences</h2>
    
    <div className="space-y-6">
      <div className="border border-slate-200 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4">AI Personalization</h3>
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="font-semibold text-slate-800">Improve Recommendations</p>
            <p className="text-sm text-slate-500">Allow AI to use browsing history for better product suggestions.</p>
          </div>
          <div className="w-11 h-6 bg-blue-600 rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
          </div>
        </label>
      </div>

      <div className="border border-slate-200 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4 text-rose-600">Security</h3>
        <button className="w-full text-left py-3 border-b border-slate-100 font-semibold text-slate-700 hover:text-blue-600">Change Password</button>
        <button className="w-full text-left py-3 border-b border-slate-100 font-semibold text-slate-700 hover:text-blue-600">Enable 2-Factor Auth (2FA)</button>
        <button className="w-full text-left py-3 font-semibold text-rose-600 hover:text-rose-800">Log out of all devices</button>
      </div>
    </div>
  </div>
);

const SupportView = () => (
  <div className="animate-fade-in">
    <h2 className="text-2xl font-bold mb-6 text-slate-900">Help Center</h2>
    <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl text-center mb-6">
      <span className="text-4xl mb-4 block">🤖</span>
      <h3 className="font-bold text-lg">Nexus AI Assistant</h3>
      <p className="text-sm text-slate-500 mb-4">Get instant answers about orders, refunds, and tracking.</p>
      <button className="px-6 py-2 bg-slate-800 text-white rounded-lg font-semibold shadow-sm">Start Chat</button>
    </div>
    
    <h3 className="font-bold text-lg mb-4">Frequently Asked Questions</h3>
    <div className="space-y-3">
      {['How do I track my order?', 'What is the return policy?', 'How do I redeem loyalty points?'].map((q, i) => (
        <details key={i} className="group border border-slate-200 bg-white rounded-lg">
          <summary className="p-4 font-semibold cursor-pointer list-none flex justify-between">
            {q} <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="px-4 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
            This is a dummy response generated by the help center. Our standard return policy is 7 days from the date of delivery.
          </div>
        </details>
      ))}
    </div>
  </div>
);

export default Profile;

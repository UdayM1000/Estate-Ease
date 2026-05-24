import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck,
  FileText,
  Loader2,
  Mail,
  Users,
  Eye,
  X,
  BedDouble,
  Bath,
  Square,
  UserPlus,
  Star,
  ShieldCheck,
  TrendingUp,
  Building,
  ChevronRight,
  Crown,
  MoreVertical,
  Trash2,
  Edit
} from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { generateAdminReport } from "../../services/reportGenerator";
import AdminNavbar from "../AdminNavbar";
import PropertyCard from "../PropertyCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, bookings: 0, contacts: 0 });
  const [properties, setProperties] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  // 🔹 Add Admin form state
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, bookingsRes, contactsRes, propsRes] = await Promise.all([
          axiosInstance.get("/admin/users"),
          axiosInstance.get("/admin/bookings"),
          axiosInstance.get("/admin/contacts"),
          axiosInstance.get("/properties")
        ]);

        // Fix: Robust data extraction
        const propData = propsRes.data.content || propsRes.data.properties || propsRes.data;
        const userData = usersRes.data.content || usersRes.data;

        setStats({
          users: Array.isArray(userData) ? userData.length : 0,
          bookings: (bookingsRes.data.content || bookingsRes.data).length || 0,
          contacts: (contactsRes.data.content || contactsRes.data).length || 0
        });

        setProperties(Array.isArray(propData) ? propData : []);
        // Filter admins from users list if applicable
        setAdmins(Array.isArray(userData) ? userData.filter(u => u.role === 'ADMIN') : []);

      } catch (error) {
        console.error("Data fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* =======================
     CREATE ADMIN
     ======================= */
  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    if (!adminEmail || !adminPassword) {
      setAdminMessage("❌ All fields are required");
      return;
    }

    try {
      setAdminLoading(true);
      setAdminMessage("");

      const res = await axiosInstance.post("/admin/create", {
        email: adminEmail,
        password: adminPassword
      });

      // Update admin list instantly
      setAdmins(prev => [...prev, res.data]);

      setAdminMessage("✅ Admin created successfully");
      setAdminEmail("");
      setAdminPassword("");

      // Auto close modal
      setTimeout(() => setShowAddAdmin(false), 1200);

    } catch (err) {
      console.error(err);
      setAdminMessage("❌ Failed to create admin");
    } finally {
      setAdminLoading(false);
    }
  };

  const toggleFeatured = async (id, currentStatus) => {
    try {
      await axiosInstance.patch(`/properties/${id}`, { isFeatured: !currentStatus });
      setProperties(properties.map(p => p.id === id ? { ...p, isFeatured: !currentStatus } : p));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <>
      <AdminNavbar />
      <div className="mt-17 lg:mt-31 w-full"></div>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-4 md:p-8 pt-32 lg:pt-40">
        <div className="max-w-[1600px] mx-auto">
          
          {/* HEADER with gradient accent */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-1.5 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                  System Control
                </h1>
              </div>
              <p className="text-slate-500 text-lg ml-4">Manage admins, property inventory, and analytics reports.</p>
            </div>
            
            <div className="flex gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddAdmin(true)}
                className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl hover:shadow-lg hover:border-indigo-200 transition-all duration-300 font-semibold group"
              >
                <UserPlus size={20} className="group-hover:text-indigo-500 transition-colors" /> 
                <span>Add Admin</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => generateAdminReport(stats, properties)}
                disabled={isGenerating || loading} 
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-200 font-semibold"
              >
                <FileText size={20} /> 
                <span>Generate Report</span>
              </motion.button>
            </div>
          </motion.header>

          {/* ADMINS LIST - Modern glass card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {admins.slice(0, 5).map((admin, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="w-12 h-12 rounded-full border-2 border-indigo-800 bg-gradient-to-br from-indigo-400 to-indigo-500 flex items-center justify-center font-bold text-sm shadow-lg"
                    >
                      {admin.name?.charAt(0) || admin.email?.charAt(0).toUpperCase() || 'A'}
                    </motion.div>
                  ))}
                  {admins.length > 5 && (
                    <div className="w-12 h-12 rounded-full border-2 border-indigo-800 bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-sm">
                      +{admins.length - 5}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xl flex items-center gap-2">
                    <ShieldCheck size={20} className="text-indigo-300" />
                    Active Administrators
                  </h4>
                  <p className="text-indigo-200 text-sm mt-1">{admins.length} accounts with full system access</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">All systems operational</span>
              </div>
            </div>
          </motion.div>

          {/* STATS SECTION - Modern metric cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {[
              { title: "Total Users", val: stats.users, icon: <Users size={24} />, gradient: "from-blue-500 to-blue-600", bgGradient: "from-blue-50 to-blue-100", statColor: "text-blue-600" },
              { title: "Bookings", val: stats.bookings, icon: <CalendarCheck size={24} />, gradient: "from-purple-500 to-purple-600", bgGradient: "from-purple-50 to-purple-100", statColor: "text-purple-600" },
              { title: "Enquiries", val: stats.contacts, icon: <Mail size={24} />, gradient: "from-orange-500 to-orange-600", bgGradient: "from-orange-50 to-orange-100", statColor: "text-orange-600" }
            ].map((s, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                className="group relative bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${s.bgGradient} rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity`}></div>
                <div className="relative p-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} shadow-lg flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {s.icon}
                  </div>
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{s.title}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                      {loading ? <Loader2 size={32} className="animate-spin text-slate-400" /> : s.val.toLocaleString()}
                    </h3>
                    <TrendingUp size={18} className={`${s.statColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  <div className="mt-3 h-1 w-16 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full w-3/4 bg-gradient-to-r ${s.gradient} rounded-full`}></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* PROPERTY TABLE - Modern data table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden backdrop-blur-sm"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building size={22} className="text-indigo-500" />
                  <h2 className="font-bold text-2xl text-slate-800">Property Inventory</h2>
                </div>
                <p className="text-slate-500 text-sm ml-8">Manage your property listings, featured status, and visibility</p>
              </div>
              <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-xs font-medium text-indigo-600">{properties.length} Total Properties</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-8 py-5 rounded-tl-2xl">Preview</th>
                    <th className="px-8 py-5">Property Details</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Price</th>
                    <th className="px-8 py-5 text-right rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {properties.map((p, idx) => (
                    <motion.tr 
                      key={p.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      <td className="px-8 py-5">
                        <div className="relative group-hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden">
                          <img 
                            src={p.imageUrls?.[0] || p.imageUrl || "https://via.placeholder.com/80x60"} 
                            className="w-20 h-16 rounded-xl object-cover bg-slate-100 transform group-hover:scale-105 transition-transform duration-300" 
                            alt="" 
                          />
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{p.title}</div>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                          {p.location}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <motion.button 
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleFeatured(p.id, p.isFeatured)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all duration-300 ${
                            p.isFeatured 
                              ? "bg-amber-50 text-amber-600 border border-amber-200 shadow-sm hover:bg-amber-100" 
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          <Star size={12} fill={p.isFeatured ? "currentColor" : "none"} />
                          {p.isFeatured ? "Featured" : "Standard"}
                        </motion.button>
                      </td>
                      <td className="px-8 py-5">
                        <div className="font-extrabold text-indigo-600 text-lg">₹{p.price.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">/ negotiable</div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedProperty(p)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <Eye size={14} /> View Property
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      {/* PROPERTY CARD MODAL - Enhanced */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedProperty(null)} 
              className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.8, opacity: 0, y: 20 }} 
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setSelectedProperty(null)} 
                className="absolute top-4 right-4 z-[1100] bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 transition-all duration-200"
              >
                <X size={18} />
              </button>
              <PropertyCard 
                item={{ ...selectedProperty, imageUrls: selectedProperty.imageUrls || [selectedProperty.imageUrl] }} 
                onBook={() => {}} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD ADMIN MODAL - Modern glass morphism */}
      <AnimatePresence>
        {showAddAdmin && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddAdmin(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-b-3xl"></div>
              <div className="relative pt-12 pb-8 px-8">
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => setShowAddAdmin(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <UserPlus size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Create Admin</h2>
                    <p className="text-indigo-100 text-sm">Grant administrative privileges</p>
                  </div>
                </div>

                <form onSubmit={handleCreateAdmin} className="space-y-5 mt-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="admin@example.com"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={adminLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white p-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all duration-300 mt-4"
                  >
                    {adminLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      "Create Admin Account"
                    )}
                  </motion.button>

                  {adminMessage && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-center font-medium py-2 rounded-xl ${
                        adminMessage.includes("✅") ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                      }`}
                    >
                      {adminMessage}
                    </motion.p>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
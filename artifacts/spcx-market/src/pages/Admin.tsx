import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [investors, setInvestors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const authenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/investors', {
        headers: { 'x-admin-password': password }
      });
      if (res.ok) {
        const data = await res.json();
        setInvestors(data);
        setIsAuthenticated(true);
        toast.success("Authenticated successfully");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Failed to authenticate");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvestors = async () => {
    try {
      const res = await fetch('/api/admin/investors', {
        headers: { 'x-admin-password': password }
      });
      if (res.ok) {
        const data = await res.json();
        setInvestors(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/investors/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Investor ${status}`);
        fetchInvestors();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] bg-[#050a0f] text-white flex flex-col justify-center items-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="text-xs text-white/50 font-display tracking-[0.3em] uppercase mb-4">Admin</div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-widest">SPCX Market</h1>
          </div>
          
          <form onSubmit={authenticate} className="space-y-6">
            <input
              type="password"
              placeholder="ADMIN PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/30 text-white placeholder:text-white/40 px-6 py-4 focus:outline-none focus:border-white/80 focus:bg-white/5 transition-all font-display tracking-widest uppercase"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-display font-bold text-xl tracking-[0.2em] uppercase py-4 hover:bg-white/90 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isLoading ? "Checking..." : "Authenticate"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#050a0f] text-white p-6 sm:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-widest mb-1">Admin Panel</h1>
            <p className="text-sm text-white/50 font-display tracking-wider uppercase">SPCX MARKET, inc • {investors.length} Investors</p>
          </div>
          <button 
            onClick={() => {
              setIsAuthenticated(false);
              setPassword('');
              setInvestors([]);
            }}
            className="self-start sm:self-auto text-sm text-white/50 hover:text-white font-display tracking-widest uppercase border border-white/20 px-4 py-2 hover:bg-white/5 transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/20 text-white/50 font-display tracking-widest uppercase text-sm">
                <th className="py-4 px-4 font-normal">Name</th>
                <th className="py-4 px-4 font-normal">Email</th>
                <th className="py-4 px-4 font-normal">Date</th>
                <th className="py-4 px-4 font-normal">Status</th>
                <th className="py-4 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {investors.map((inv) => (
                <tr key={inv.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium">{inv.fullName}</td>
                  <td className="py-4 px-4 text-white/70">{inv.email}</td>
                  <td className="py-4 px-4 text-white/50 text-sm">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      inv.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      inv.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {inv.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => updateStatus(inv.id, 'approved')}
                        disabled={inv.status === 'approved'}
                        className="text-xs font-display tracking-widest uppercase px-3 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(inv.id, 'rejected')}
                        disabled={inv.status === 'rejected'}
                        className="text-xs font-display tracking-widest uppercase px-3 py-1.5 bg-red-500/20 text-red-200 hover:bg-red-500/40 disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {investors.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-white/50 font-display tracking-widest uppercase">
                    No investors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

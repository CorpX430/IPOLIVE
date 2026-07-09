import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Menu, Bell, User, Mail, Shield, ChevronRight, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import SideNav from '../components/SideNav';

type NotifKey = 'emailUpdates' | 'priceAlerts' | 'portfolioUpdates' | 'newsDigest';

interface Settings {
  notifications: Record<NotifKey, boolean>;
}

const DEFAULT_SETTINGS: Settings = {
  notifications: {
    emailUpdates: true,
    priceAlerts: true,
    portfolioUpdates: false,
    newsDigest: false,
  },
};

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${on ? 'bg-[#1a8a4a]' : 'bg-white/15'}`}
      aria-checked={on}
      role="switch"
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h2 className="text-[10px] font-display font-bold tracking-[0.25em] uppercase text-white/40 mb-3 px-1">
        {title}
      </h2>
      <div className="bg-[#0a0f14] border border-white/8 rounded-xl overflow-hidden divide-y divide-white/5">
        {children}
      </div>
    </motion.div>
  );
}

function Row({ icon: Icon, label, sub, children }: { icon?: React.ElementType; label: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex items-center gap-3 min-w-0">
        {Icon && <Icon className="w-4 h-4 text-white/40 shrink-0" />}
        <div className="min-w-0">
          <div className="text-sm font-display tracking-wide text-white">{label}</div>
          {sub && <div className="text-xs text-white/40 tracking-wide mt-0.5 truncate">{sub}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState<{ fullName: string; email: string; status?: string } | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Load user + settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('spcx_user');
    if (!stored) { setLocation('/signin'); return; }
    const u = JSON.parse(stored);
    setUser(u);
    setDraftName(u.fullName ?? '');

    const raw = localStorage.getItem('spcx_settings');
    if (raw) {
      try { setSettings(JSON.parse(raw)); } catch {}
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('spcx_user');
    setLocation('/');
  };

  const saveName = () => {
    if (!draftName.trim()) { toast.error('Name cannot be empty'); return; }
    const updated = { ...user, fullName: draftName.trim() };
    localStorage.setItem('spcx_user', JSON.stringify(updated));
    setUser(updated as any);
    setEditingName(false);
    toast.success('Display name updated');
  };

  const cancelEdit = () => {
    setDraftName(user?.fullName ?? '');
    setEditingName(false);
  };

  const setNotif = (key: NotifKey, val: boolean) => {
    const next = { ...settings, notifications: { ...settings.notifications, [key]: val } };
    setSettings(next);
    localStorage.setItem('spcx_settings', JSON.stringify(next));
  };

  const statusColor = (s?: string) =>
    s === 'approved' ? 'bg-green-500/15 text-green-400 border-green-500/20' :
    s === 'rejected' ? 'bg-red-500/15 text-red-400 border-red-500/20' :
    'bg-yellow-500/15 text-yellow-400 border-yellow-500/20';

  const initials = (user?.fullName ?? '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };

  return (
    <div className="min-h-[100dvh] bg-[#050a0f] text-white selection:bg-white/20 flex flex-col">
      <SideNav open={menuOpen} onClose={() => setMenuOpen(false)} onSignOut={handleSignOut} />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <button onClick={() => setMenuOpen(true)} className="text-white/70 hover:text-white transition-colors cursor-pointer">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-display font-bold tracking-widest text-sm uppercase">Settings</span>
        <button className="text-white/70 hover:text-white transition-colors cursor-pointer">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        <motion.div variants={container} initial="hidden" animate="show">

          {/* Profile avatar + name */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-10"
          >
            <div className="w-20 h-20 rounded-full bg-white/8 border border-white/10 flex items-center justify-center mb-4">
              <span className="font-display font-bold text-2xl tracking-widest">{initials}</span>
            </div>
            {editingName ? (
              <div className="flex items-center gap-2 w-full max-w-xs">
                <input
                  autoFocus
                  value={draftName}
                  onChange={e => setDraftName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') cancelEdit(); }}
                  className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white text-center font-display tracking-wide focus:outline-none focus:border-white/50 text-lg"
                />
                <button onClick={saveName} className="w-9 h-9 rounded-full bg-[#1a8a4a] flex items-center justify-center cursor-pointer hover:bg-[#1a9a52] transition-colors">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={cancelEdit} className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center cursor-pointer hover:bg-white/15 transition-colors">
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingName(true)}
                className="group flex items-center gap-2 cursor-pointer"
              >
                <span className="font-display font-bold text-xl tracking-widest">
                  {user?.fullName ?? '—'}
                </span>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
              </button>
            )}
            <span className="text-xs text-white/40 tracking-wider mt-1">{user?.email}</span>
            {user?.status && (
              <span className={`mt-3 inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-display font-bold tracking-widest uppercase border ${statusColor(user.status)}`}>
                {user.status === 'approved' ? 'Investor Access Active' : user.status === 'rejected' ? 'Access Denied' : 'Access Pending'}
              </span>
            )}
          </motion.div>

          {/* Account */}
          <Section title="Account">
            <Row icon={User} label="Display Name" sub={user?.fullName ?? '—'}>
              <button
                onClick={() => setEditingName(true)}
                className="text-[10px] font-display tracking-widest uppercase text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                Edit
              </button>
            </Row>
            <Row icon={Mail} label="Email Address" sub={user?.email ?? '—'}>
              <span className="text-[10px] font-display tracking-widest uppercase text-white/25">Read-only</span>
            </Row>
            <Row icon={Shield} label="Investor Status">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-display font-bold tracking-widest uppercase border ${statusColor(user?.status)}`}>
                {user?.status ?? 'unknown'}
              </span>
            </Row>
          </Section>

          {/* Notifications */}
          <Section title="Notifications">
            {(
              [
                { key: 'emailUpdates' as NotifKey, label: 'Email Updates', sub: 'Company announcements and filings' },
                { key: 'priceAlerts' as NotifKey, label: 'Price Alerts', sub: 'Notify when SPCX moves ±5%' },
                { key: 'portfolioUpdates' as NotifKey, label: 'Portfolio Updates', sub: 'Holdings and balance changes' },
                { key: 'newsDigest' as NotifKey, label: 'Weekly Digest', sub: 'SpaceX news every Monday' },
              ] as const
            ).map(item => (
              <Row key={item.key} label={item.label} sub={item.sub}>
                <Toggle on={settings.notifications[item.key]} onChange={v => setNotif(item.key, v)} />
              </Row>
            ))}
          </Section>

          {/* App info */}
          <Section title="About">
            <Row label="App Version" sub="SPCX Market">
              <span className="text-xs text-white/30 font-display tracking-widest">v1.0.0</span>
            </Row>
            <Row label="Market Data" sub="Simulated · Not real financial advice">
              <span className="text-[10px] text-white/25 font-display tracking-widest uppercase">Demo</span>
            </Row>
          </Section>

          {/* Sign out */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={handleSignOut}
              className="w-full mt-2 py-4 border border-red-500/20 rounded-xl text-red-400 font-display font-bold tracking-widest text-sm uppercase hover:bg-red-500/8 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}

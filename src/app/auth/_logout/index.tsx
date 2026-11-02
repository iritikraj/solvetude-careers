'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="inline-flex items-center cursor-pointer gap-2 rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 transition-all hover:bg-white/10 hover:text-white disabled:opacity-50"
    >
      {isLoggingOut ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <LogOut size={14} />
      )}
      <span className="mt-px">{isLoggingOut ? '...' : 'Logout'}</span>
    </button>
  );
}
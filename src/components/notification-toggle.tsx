'use client';

import React from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { useFCM } from '@/hooks/use-fcm';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationToggle() {
  const { permission, requestPermission, isSupported } = useFCM();
  const [isPending, setIsPending] = React.useState(false);

  if (!isSupported) return null;

  const handleToggle = async () => {
    setIsPending(true);
    await requestPermission();
    setIsPending(false);
  };

  const isEnabled = permission === 'granted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-4 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow"
    >
      <div className={`p-2.5 rounded-xl ${isEnabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
        <AnimatePresence mode="wait">
          {isEnabled ? (
            <motion.div
              key="bell"
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 20 }}
            >
              <Bell className="w-5 h-5 fill-current" />
            </motion.div>
          ) : (
            <motion.div
              key="bell-off"
              initial={{ scale: 0.5, rotate: 20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: -20 }}
            >
              <BellOff className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-semibold">Push Notifications</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {isEnabled 
            ? "You're all set! We'll alert you for new properties." 
            : "Get instant alerts for properties in your area."}
        </p>
      </div>

      <Button
        variant={isEnabled ? "outline" : "default"}
        size="sm"
        onClick={handleToggle}
        disabled={isPending || isEnabled}
        className="rounded-xl h-9 px-4 transition-all"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isEnabled ? (
          "Enabled"
        ) : (
          "Enable"
        )}
      </Button>
    </motion.div>
  );
}

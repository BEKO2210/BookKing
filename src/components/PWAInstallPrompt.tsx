import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export function PWAInstallPrompt() {
  const { canInstall, install, dismiss } = usePWAInstall();

  return (
    <AnimatePresence>
      {canInstall && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 lg:bottom-6 lg:left-auto lg:right-6 lg:w-[360px] z-50"
        >
          <div className="card p-4 shadow-lg border-primary-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-50 rounded-xl shrink-0">
                <Download size={20} className="text-primary-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm">
                  BookKing installieren
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Fügen Sie BookKing zum Homescreen hinzu für schnellen Zugriff auf Ihre Termine.
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={install}
                    className="btn-primary text-xs py-1.5 px-3"
                  >
                    Installieren
                  </button>
                  <button
                    onClick={dismiss}
                    className="btn-secondary text-xs py-1.5 px-3"
                  >
                    Später
                  </button>
                </div>
              </div>
              <button
                onClick={dismiss}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

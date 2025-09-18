'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ReferralTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [storedRefCode, setStoredRefCode] = useState<string | null>(null);

  useEffect(() => {
    // Get stored ref code from localStorage (client-side only)
    const stored = localStorage.getItem('ref_code');
    setStoredRefCode(stored);

    const trackReferral = async () => {
      const refCode = searchParams.get('ref');

      if (refCode) {
        // Generate or get session ID
        let sessionId = sessionStorage.getItem('ref_session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          sessionStorage.setItem('ref_session_id', sessionId);
        }

        // Track the visit
        try {
          await fetch('/api/referrals/track', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: refCode,
              page: pathname,
              sessionId
            })
          });

          // Store in localStorage for persistence
          localStorage.setItem('ref_code', refCode);
          localStorage.setItem('ref_tracked_at', new Date().toISOString());
          setStoredRefCode(refCode);
        } catch (error) {
          console.error('Error tracking referral:', error);
        }
      }
    };

    trackReferral();
  }, [pathname, searchParams]);

  // Check if user was referred and show banner
  const refCode = searchParams.get('ref') || storedRefCode;

  if (refCode) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
          <p className="text-sm text-center text-blue-800">
            🎉 Vous bénéficiez d'un accès privilégié via notre partenaire (Code: <strong>{refCode}</strong>)
          </p>
        </div>
      </div>
    );
  }

  return null;
}
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { runWhenIdle } from '@/lib/defer';

// Client-only lazy mount — the chat widget (AI SDK + framer-motion bundle)
// is fetched and executed only after hydration, never blocking first paint.
const AIChatAgent = dynamic(() => import('./AIChatAgent'), { ssr: false });

/**
 * The bundle fetch previously started immediately at hydration, competing
 * with the initial mobile paint. It now waits for an idle frame (bounded at
 * 2s) so the widget chunk only loads once the page has settled.
 */
export default function AIChatAgentDeferred() {
  const [ready, setReady] = useState(false);

  useEffect(() => runWhenIdle(() => setReady(true), 2000), []);

  return ready ? <AIChatAgent /> : null;
}

'use client';

import dynamic from 'next/dynamic';

// Client-only lazy mount — the chat widget (AI SDK + framer-motion bundle)
// is fetched and executed only after hydration, never blocking first paint.
const AIChatAgent = dynamic(() => import('./AIChatAgent'), { ssr: false });

export default AIChatAgent;

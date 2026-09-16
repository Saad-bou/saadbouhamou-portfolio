import { useCallback, useEffect, useRef, useState } from 'react';

export type VoiceStatus = 'idle' | 'listening' | 'speaking' | 'error';

export interface VoiceModeSupport {
  recognition: boolean;
  synthesis: boolean;
}

export interface UseVoiceModeOptions {
  onTranscript: (text: string) => void;
}

export interface VoiceModeController {
  status: VoiceStatus;
  interim: string;
  errorMessage: string | null;
  support: VoiceModeSupport;
  toggleListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike;
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

const SPEECH_MAX_CHARS = 600;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function hasSpeechSynthesis(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function pickRecognitionLang(): string {
  if (typeof navigator === 'undefined') return 'en-US';
  const lang = (navigator.language || 'en-US').toLowerCase();
  if (lang.startsWith('ar')) return 'ar-SA';
  if (lang.startsWith('fr')) return 'fr-FR';
  if (lang.startsWith('en')) return 'en-US';
  return 'en-US';
}

function detectSpeechLang(text: string): string {
  if (/[\u0600-\u06FF]/.test(text)) return 'ar-SA';
  if (typeof navigator === 'undefined') return 'en-US';
  const lang = (navigator.language || 'en-US').toLowerCase();
  if (lang.startsWith('fr')) return 'fr-FR';
  if (lang.startsWith('en')) return 'en-US';
  return 'en-US';
}

function capForSpeech(text: string): string {
  if (text.length <= SPEECH_MAX_CHARS) return text;
  const slice = text.slice(0, SPEECH_MAX_CHARS);
  const lastBoundary = Math.max(
    slice.lastIndexOf('.'),
    slice.lastIndexOf('!'),
    slice.lastIndexOf('?'),
    slice.lastIndexOf('\n')
  );
  const end =
    lastBoundary > SPEECH_MAX_CHARS * 0.5 ? lastBoundary + 1 : SPEECH_MAX_CHARS;
  return text.slice(0, end).trim();
}

export function useVoiceMode({
  onTranscript,
}: UseVoiceModeOptions): VoiceModeController {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [interim, setInterim] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const listeningRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  // Full cleanup on unmount: abort recognition + cancel speech + no leaks.
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      const recognition = recognitionRef.current;
      if (recognition) {
        try {
          recognition.abort();
        } catch {
          // noop
        }
        recognitionRef.current = null;
      }
      if (hasSpeechSynthesis()) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    if (hasSpeechSynthesis()) {
      window.speechSynthesis.cancel();
    }
    if (!listeningRef.current && mountedRef.current) {
      setStatus('idle');
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!hasSpeechSynthesis()) return;
    const clean = text.trim();
    if (!clean) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(capForSpeech(clean));
    utterance.lang = detectSpeechLang(clean);
    utterance.onstart = () => {
      if (!mountedRef.current) return;
      setStatus('speaking');
    };
    const finish = () => {
      if (!mountedRef.current) return;
      if (!listeningRef.current) setStatus('idle');
    };
    utterance.onend = finish;
    utterance.onerror = finish;
    synth.speak(utterance);
  }, []);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.stop();
    } catch {
      // noop
    }
  }, []);

  const startListening = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setErrorMessage('Voice input is not supported in this browser.');
      setStatus('error');
      return;
    }
    if (hasSpeechSynthesis()) {
      window.speechSynthesis.cancel();
    }

    const recognition = new Ctor();
    recognition.lang = pickRecognitionLang();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      if (!mountedRef.current) return;
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) finalText += text;
        else interimText += text;
      }
      if (interimText) setInterim(interimText);
      if (finalText.trim()) {
        setInterim('');
        onTranscriptRef.current(finalText.trim());
      }
    };

    recognition.onerror = (event) => {
      if (!mountedRef.current) return;
      const err = event.error;
      if (err === 'not-allowed' || err === 'service-not-allowed') {
        setErrorMessage(
          'Microphone access was denied. Allow it in browser settings, or type your message instead.'
        );
        setStatus('error');
      } else if (err === 'no-speech' || err === 'aborted') {
        setErrorMessage(null);
      } else {
        setErrorMessage('Voice input failed. Please try again or type your message.');
        setStatus('error');
      }
    };

    recognition.onend = () => {
      listeningRef.current = false;
      recognitionRef.current = null;
      if (!mountedRef.current) return;
      setStatus((prev) => (prev === 'error' ? 'error' : 'idle'));
    };

    recognitionRef.current = recognition;
    listeningRef.current = true;
    setErrorMessage(null);
    setInterim('');
    setStatus('listening');
    try {
      recognition.start();
    } catch {
      listeningRef.current = false;
      recognitionRef.current = null;
      setErrorMessage('Could not start voice input. Please try again.');
      setStatus('error');
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (recognitionRef.current) {
      stopListening();
    } else {
      startListening();
    }
  }, [startListening, stopListening]);

  const support: VoiceModeSupport = {
    recognition: getRecognitionCtor() !== null,
    synthesis: hasSpeechSynthesis(),
  };

  return {
    status,
    interim,
    errorMessage,
    support,
    toggleListening,
    speak,
    stopSpeaking,
  };
}

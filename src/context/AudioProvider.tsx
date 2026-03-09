import { useAudioPlayer } from "expo-audio";
import * as Speech from "expo-speech";
import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from "react";

type AudioContextType = {
    toggleAlertSound: (loop?: boolean) => Promise<void>;
    stopAlertSound: () => Promise<void>;
    speakMessage: (text: string) => void;
    pauseTTS: () => void;
    resumeTTS: () => void;
    stopTTS: () => void;
    isPlaying: boolean;
    isSpeaking: boolean;
    isPaused: boolean;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

type Props = {
    children: ReactNode;
    alertSoundFile?: any;
};

export const AudioProvider = ({ children, alertSoundFile }: Props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const player = useAudioPlayer(alertSoundFile || require("@/assets/sounds/luva.mp3"));

    const ttsTextRef = useRef<string>("");
    const ttsIndexRef = useRef(0);
    const pausedRef = useRef(false); // ✅ controle de pausa real-time

    /* =========================
       PLAYER DE ÁUDIO
    ========================= */
    const toggleAlertSound = useCallback(async (loop = true) => {
        try {
            player.loop = loop;
            await player.seekTo(0);
            await player.play();
            setIsPlaying(true);
        } catch {
            setIsPlaying(false);
        }
    }, [player]);

    const stopAlertSound = useCallback(async () => {
        try {
            player.loop = false;
            await player.pause();
            await player.seekTo(0);
            setIsPlaying(false);
        } catch (e) {
            console.warn("Erro ao parar áudio:", e);
            setIsPlaying(false);
        }
    }, [player]);

    /* =========================
       TTS
    ========================= */
    const speakMessage = useCallback((text: string) => {
        if (isSpeaking) return;

        ttsTextRef.current = text;
        ttsIndexRef.current = 0;
        pausedRef.current = false;
        setIsPaused(false);
        setIsSpeaking(true);

        const parts = text.replace(/\n/g, " ").split(/(?<=[.!?])\s+/);

        const speakNext = (i: number) => {
            if (i >= parts.length) {
                setIsSpeaking(false);
                setIsPaused(false);
                ttsIndexRef.current = 0;
                return;
            }

            ttsIndexRef.current = i;

            Speech.speak(parts[i], {
                language: "pt-BR",
                rate: 0.85,
                pitch: 1,
                onDone: () => {
                    if (!pausedRef.current) speakNext(i + 1); // ✅ usa a ref
                },
                onStopped: () => setIsSpeaking(false),
                onError: () => setIsSpeaking(false),
            });
        };

        speakNext(0);
    }, [isSpeaking]);

    const pauseTTS = useCallback(() => {
        if (!isSpeaking) return;
        Speech.stop();
        pausedRef.current = true;
        setIsPaused(true);
        setIsSpeaking(false);
    }, [isSpeaking]);

    const resumeTTS = useCallback(() => {
        if (!pausedRef.current || !ttsTextRef.current) return;

        pausedRef.current = false;
        setIsPaused(false);
        setIsSpeaking(true);

        const parts = ttsTextRef.current.replace(/\n/g, " ").split(/(?<=[.!?])\s+/);
        const startIndex = ttsIndexRef.current + 1; // continua da próxima frase

        const speakNext = (i: number) => {
            if (i >= parts.length) {
                setIsSpeaking(false);
                setIsPaused(false);
                ttsIndexRef.current = 0;
                return;
            }

            ttsIndexRef.current = i;

            Speech.speak(parts[i], {
                language: "pt-BR",
                rate: 0.85,
                pitch: 1,
                onDone: () => {
                    if (!pausedRef.current) speakNext(i + 1); // ✅ usa a ref
                },
                onStopped: () => setIsSpeaking(false),
                onError: () => setIsSpeaking(false),
            });
        };

        speakNext(startIndex);
    }, []);

    const stopTTS = useCallback(() => {
        Speech.stop();
        pausedRef.current = false;
        ttsIndexRef.current = 0;
        ttsTextRef.current = "";
        setIsPaused(false);
        setIsSpeaking(false);
    }, []);

    const contextValue = useMemo(
        () => ({
            toggleAlertSound,
            stopAlertSound,
            speakMessage,
            pauseTTS,
            resumeTTS,
            stopTTS,
            isPlaying,
            isSpeaking,
            isPaused,
        }),
        [
            toggleAlertSound,
            stopAlertSound,
            speakMessage,
            pauseTTS,
            resumeTTS,
            stopTTS,
            isPlaying,
            isSpeaking,
            isPaused,
        ]
    );

    return <AudioContext.Provider value={contextValue}>{children}</AudioContext.Provider>;
};

/* =========================
   HOOK DE CONSUMO
========================= */
export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error("useAudio deve ser usado dentro de AudioProvider");
    return context;
};
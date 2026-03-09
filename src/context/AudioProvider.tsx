import { useAudioPlayer } from "expo-audio";
import * as Speech from "expo-speech";
import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { Alert } from "react-native";

type AudioContextType = {
    toggleAlertSound: (loop?: boolean) => Promise<void>;
    speakMessage: (text: string) => void;
    pauseTTS: () => void;
    resumeTTS: () => void;
    stopTTS: () => void;
    isPlaying: boolean;
    isSpeaking: boolean;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

type Props = {
    children: ReactNode;
    alertSoundFile?: any; // caminho para arquivo de alerta, default mp3
};

export const AudioProvider = ({ children, alertSoundFile }: Props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const ttsPausedRef = React.useRef(false);

    /* =========================
       PLAYER DE ÁUDIO
    ========================= */
    const player = useAudioPlayer(alertSoundFile || require("@/assets/sounds/luva.mp3"));

    const playAlertSound = useCallback(async (loop = true) => {
        try {
            player.loop = loop;
            await player.seekTo(0);
            await player.play();
            setIsPlaying(true);
        } catch {
            Alert.alert("Erro de Áudio", "Não foi possível reproduzir o som de alerta.");
            setIsPlaying(false);
        }
    }, [player]);

    const stopAlertSound = useCallback(async () => {
        try {
            await player.pause();
            await player.seekTo(0);
            setIsPlaying(false);
        } catch { }
    }, [player]);

    const toggleAlertSound = useCallback(async (loop = true) => {
        if (isPlaying) {
            await stopAlertSound();
        } else {
            await playAlertSound(loop);
        }
    }, [isPlaying, playAlertSound, stopAlertSound]);

    /* =========================
       TTS
    ========================= */
    const speakMessage = useCallback((text: string) => {
        if (isSpeaking) return;

        setIsSpeaking(true);
        ttsPausedRef.current = false;

        Speech.stop();

        const parts = text.replace(/\n/g, " ").split(/(?<=[.!?])\s+/);

        const speakNext = (i: number) => {
            if (i >= parts.length) {
                setIsSpeaking(false);
                return;
            }

            Speech.speak(parts[i], {
                language: "pt-BR",
                rate: 0.85,
                pitch: 1,
                onDone: () => {
                    if (!ttsPausedRef.current) speakNext(i + 1);
                },
                onStopped: () => setIsSpeaking(false),
                onError: () => setIsSpeaking(false),
            });
        };

        speakNext(0);
    }, [isSpeaking]);

    const pauseTTS = useCallback(() => {
        Speech.stop();
        ttsPausedRef.current = true;
        setIsSpeaking(false);
    }, []);

    const resumeTTS = useCallback(() => {
        ttsPausedRef.current = false;
        // Para simplificação, a continuação precisa de re-speak do texto ou salvar índice
    }, []);

    const stopTTS = useCallback(() => {
        Speech.stop();
        ttsPausedRef.current = false;
        setIsSpeaking(false);
    }, []);

    const contextValue = useMemo(
        () => ({
            toggleAlertSound,
            speakMessage,
            pauseTTS,
            resumeTTS,
            stopTTS,
            isPlaying,
            isSpeaking,
        }),
        [
            toggleAlertSound,
            speakMessage,
            pauseTTS,
            resumeTTS,
            stopTTS,
            isPlaying,
            isSpeaking,
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
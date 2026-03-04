import { useAudioPlayer } from "expo-audio";
import {
    forwardRef,
    useCallback,
    useImperativeHandle,
} from "react";
import { Alert } from "react-native";

export type AlertSoundHandle = {
    play: () => void;
    stop: () => void;
};

export const AlertSoundPlayer = forwardRef<AlertSoundHandle>(
    (_, ref) => {
        const player = useAudioPlayer(
            require("../../assets/sounds/metal_gear.mp3")
        );

        const play = useCallback(() => {
            try {
                if (player.playing) {
                    player.seekTo(0);
                }
                player.play();
            } catch {
                Alert.alert(
                    "Erro de Áudio",
                    "Não foi possível reproduzir o som de alerta."
                );
            }
        }, [player]);

        const stop = useCallback(() => {
            player.pause();
            player.seekTo(0);
        }, [player]);

        useImperativeHandle(ref, () => ({
            play,
            stop,
        }));

        return null; // não renderiza nada
    }
);
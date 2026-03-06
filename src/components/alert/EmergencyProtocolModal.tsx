import { hardwareService } from "@/services/HardwareService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useMemo, useState } from "react";
import {
    AccessibilityInfo,
    Modal,
    ScrollView,
    Text,
    View,
} from "react-native";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { createStyles } from "@/styles/components/EmergencyProtocolModalStyles";

export type EmergencyAlertData = {
    level: string;
    structure: string;
    title: string;
    message: string;
    isSimulation?: boolean;
    isEfni?: boolean;
};

type Props = {
    visible: boolean;
    alertData: EmergencyAlertData;
    onClose?: () => void;
    onAcknowledge?: () => void;
};

export function EmergencyProtocolModal({
    visible,
    alertData,
    onClose,
}: Props) {
    const { theme } = useTheme();
    const router = useRouter();

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [speechIndex, setSpeechIndex] = useState(0);

    /* ==============================
       SEVERIDADE
    ============================== */

    const severityColor = alertData.level.includes("3")
        ? theme.danger
        : alertData.isEfni
            ? theme.primary
            : theme.border;

    const styles = useMemo(
        () => createStyles(theme, severityColor),
        [theme, severityColor]
    );

    const highContrastText =
        theme.background === "#000000" ? "#FFFFFF" : theme.text;

    /* ==============================
       QUEBRAR TEXTO EM FRASES
    ============================== */

    const speechParts = useMemo(() => {
        return alertData.message
            .replace(/\n/g, " ")
            .split(/(?<=[.!?])\s+/);
    }, [alertData.message]);

    /* ==============================
       TTS CONTROLADO
    ============================== */

    const speakNext = (index: number) => {
        if (index >= speechParts.length) {
            setIsSpeaking(false);
            setIsPaused(false);
            setSpeechIndex(0);
            return;
        }

        setSpeechIndex(index);

        Speech.speak(speechParts[index], {
            language: "pt-BR",
            rate: 0.85,
            pitch: 1,

            onDone: () => {
                speakNext(index + 1);
            },

            onStopped: () => {
                setIsSpeaking(false);
            },

            onError: () => {
                setIsSpeaking(false);
            },
        });
    };

    const speakMessage = () => {
        if (isSpeaking) {
            Speech.stop();
            setIsSpeaking(false);
            setIsPaused(true);
            return;
        }

        setIsSpeaking(true);
        setIsPaused(false);

        speakNext(speechIndex);
    };

    /* ==============================
       ACESSIBILIDADE
    ============================== */

    useEffect(() => {
        if (visible) {
            AccessibilityInfo.announceForAccessibility(
                `Alerta ${alertData.level}. ${alertData.title}`
            );
        }
    }, [visible]);

    /* ==============================
       RESET AO FECHAR
    ============================== */

    useEffect(() => {
        if (!visible) {
            Speech.stop();
            setIsSpeaking(false);
            setIsPaused(false);
            setSpeechIndex(0);
        }
    }, [visible]);

    /* ==============================
       CONFIRMAR
    ============================== */

    const handleAcknowledge = async () => {
        Speech.stop();

        await hardwareService.vibrateSuccess();

        onClose?.();

        router.replace("/");
    };

    /* ==============================
       BOTÃO TTS
    ============================== */

    const speakButtonTitle = isSpeaking
        ? "PAUSAR ÁUDIO"
        : isPaused
            ? "CONTINUAR ÁUDIO"
            : "OUVIR MENSAGEM";

    const speakButtonIcon = isSpeaking
        ? "pause"
        : isPaused
            ? "play"
            : "volume-high";

    /* ==============================
       BADGE
    ============================== */

    const badgeText = alertData.isSimulation
        ? "SIMULADO"
        : alertData.isEfni
            ? "EXERCÍCIO INTERNO - EFNI"
            : "ALERTA OFICIAL";

    return (
        <Modal visible={visible} animationType="slide" transparent accessibilityViewIsModal>
            <View style={styles.overlay}>
                <View
                    style={styles.container}
                    accessible
                    accessibilityRole="alert"
                    accessibilityLiveRegion="assertive"
                >
                    {/* HEADER */}

                    <View style={styles.header}>
                        <Ionicons
                            name="warning"
                            size={32}
                            color={severityColor}
                            accessibilityIgnoresInvertColors
                        />

                        <View style={styles.headerTextContainer}>
                            <Text
                                style={[styles.title, { color: highContrastText }]}
                                allowFontScaling
                                maxFontSizeMultiplier={1.6}
                            >
                                {alertData.title}
                            </Text>

                            <Text
                                style={[styles.subtitle, { color: severityColor }]}
                                allowFontScaling
                            >
                                {alertData.level} • {alertData.structure}
                            </Text>
                        </View>
                    </View>

                    {/* BADGE */}

                    <View style={[styles.badge, { backgroundColor: severityColor }]}>
                        <Text style={styles.badgeText}>{badgeText}</Text>
                    </View>

                    {/* MENSAGEM */}

                    <ScrollView style={styles.messageScroll} showsVerticalScrollIndicator>
                        <Text
                            style={[styles.messageText, { color: highContrastText }]}
                            allowFontScaling
                            maxFontSizeMultiplier={1.8}
                        >
                            {alertData.message}
                        </Text>
                    </ScrollView>

                    {/* BOTÕES */}

                    <View style={styles.buttons}>
                        <Button
                            title={speakButtonTitle}
                            icon={speakButtonIcon}
                            onPress={speakMessage}
                            variantStyle={{
                                backgroundColor: theme.background,
                                borderColor: theme.border,
                                borderWidth: 2,
                                minHeight: 56,
                            }}
                            textStyle={{
                                color: highContrastText,
                                fontWeight: "700",
                                fontSize: 16,
                            }}
                        />

                        <View style={styles.spacer} />

                        <Button
                            title="CONFIRMAR E SAIR"
                            icon="checkmark-circle"
                            onPress={handleAcknowledge}
                            variantStyle={{
                                backgroundColor: severityColor,
                                minHeight: 60,
                                borderRadius: 12,
                            }}
                            textStyle={{
                                color: "#FFFFFF",
                                fontWeight: "900",
                                fontSize: 17,
                                letterSpacing: 1,
                            }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}
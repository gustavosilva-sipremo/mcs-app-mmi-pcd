import { hardwareService } from "@/services/HardwareService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  AccessibilityInfo,
  Modal,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Button } from "@/components/ui/Button";
import { useAudio } from "@/context/AudioProvider";
import {
  emergencyCopy,
  type EmergencyAlertData,
} from "@/features/alerts/content";
import { useTheme } from "@/context/ThemeContext";
import { createStyles } from "@/styles/components/EmergencyProtocolModalStyles";

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
    onAcknowledge,
}: Props) {
    const { theme } = useTheme();
    const router = useRouter();
    const { speakMessage, pauseTTS, resumeTTS, stopTTS, isSpeaking } = useAudio(); // ✅ agora com pause/resume
    const [isPaused, setIsPaused] = useState(false);

    const styles = useMemo(
        () => createStyles(theme, alertData.level.includes("3") ? theme.danger : alertData.isEfni ? theme.primary : theme.border),
        [theme, alertData]
    );

    const highContrastText = theme.background === "#000000" ? "#FFFFFF" : theme.text;

    /* ==============================
       ACESSIBILIDADE
    ============================== */
    useEffect(() => {
        if (visible) {
            AccessibilityInfo.announceForAccessibility(`Alerta ${alertData.level}. ${alertData.title}`);
        }
    }, [visible, alertData]);

    /* ==============================
       RESET AO FECHAR
    ============================== */
    useEffect(() => {
        if (!visible) {
            stopTTS();
            setIsPaused(false);
        }
    }, [visible, stopTTS]);

    /* ==============================
       CONFIRMAR
    ============================== */
    const handleAcknowledge = async () => {
        stopTTS();
        await hardwareService.vibrateSuccess();
        if (onAcknowledge) {
            onAcknowledge();
            return;
        }
        onClose?.();
        router.replace("/");
    };

    /* ==============================
       BOTÃO TTS
    ============================== */
    const handleSpeakPress = () => {
        if (isSpeaking && !isPaused) {
            pauseTTS();
            setIsPaused(true);
        } else if (isPaused) {
            resumeTTS();
            setIsPaused(false);
        } else {
            speakMessage(alertData.message);
            setIsPaused(false);
        }
    };

    const speakButtonTitle = isSpeaking
        ? isPaused
            ? emergencyCopy.ptBR.modal.resume
            : emergencyCopy.ptBR.modal.pause
        : emergencyCopy.ptBR.modal.speak;

    const speakButtonIcon = isSpeaking
        ? isPaused
        ? "play"
            : "pause"
        : "volume-high";

    const badgeText = alertData.isSimulation
        ? emergencyCopy.ptBR.modal.simulatedBadge
        : alertData.isEfni
            ? emergencyCopy.ptBR.modal.efniBadge
            : emergencyCopy.ptBR.modal.officialBadge;

    const severityColor = alertData.level.includes("3") ? theme.danger : alertData.isEfni ? theme.primary : theme.border;

    return (
        <Modal visible={visible} animationType="slide" transparent accessibilityViewIsModal>
            <View style={styles.overlay}>
                <View style={styles.container} accessible accessibilityRole="alert" accessibilityLiveRegion="assertive">
                    {/* HEADER */}
                    <View style={styles.header}>
                        <Ionicons name="warning" size={32} color={severityColor} accessibilityIgnoresInvertColors />
                        <View style={styles.headerTextContainer}>
                            <Text style={[styles.title, { color: highContrastText }]} allowFontScaling maxFontSizeMultiplier={1.6}>
                                {alertData.title}
                            </Text>
                            <Text style={[styles.subtitle, { color: severityColor }]} allowFontScaling>
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
                        <Text style={[styles.messageText, { color: highContrastText }]} allowFontScaling maxFontSizeMultiplier={1.8}>
                            {alertData.message}
                        </Text>
                    </ScrollView>

                    {/* BOTÕES */}
                    <View style={styles.buttons}>
                        <Button
                            title={speakButtonTitle}
                            icon={speakButtonIcon}
                            onPress={handleSpeakPress}
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
                            title={emergencyCopy.ptBR.modal.acknowledge}
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
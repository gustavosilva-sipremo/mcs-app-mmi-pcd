// src/components/alert/EmergencyProtocolModal.tsx

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import {
    AccessibilityInfo,
    Modal,
    ScrollView,
    Text,
    View,
} from "react-native";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { styles } from "@/styles/alertStyles";

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

    /* ==============================
       SEVERIDADE VISUAL
    ============================== */

    const severityColor =
        alertData.level.includes("3")
            ? theme.danger
            : alertData.isEfni
                ? theme.primary
                : theme.border;

    /* ==============================
       FALA CONTROLADA
    ============================== */

    const speakMessage = () => {
        if (isSpeaking) return;

        setIsSpeaking(true);

        Speech.stop();

        Speech.speak(alertData.message, {
            language: "pt-BR",
            rate: 0.85,
            pitch: 1,
            onDone: () => setIsSpeaking(false),
            onStopped: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
        });
    };

    /* ==============================
       FOCO AUTOMÁTICO P/ LEITOR
    ============================== */

    useEffect(() => {
        if (visible) {
            AccessibilityInfo.announceForAccessibility(
                `Alerta ${alertData.level}. ${alertData.title}`
            );
        }
    }, [visible]);

    /* ==============================
       CONFIRMAÇÃO
    ============================== */

    const handleAcknowledge = async () => {
        Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
        );

        Speech.stop();

        onClose?.();

        router.replace("/");
    };

    /* ==============================
       CORES ACESSÍVEIS
    ============================== */

    const highContrastText =
        theme.background === "#000000"
            ? "#FFFFFF"
            : theme.text;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            accessibilityViewIsModal
        >
            <View
                style={[
                    styles.modalOverlay,
                    { backgroundColor: "#000000CC" }, // fundo mais acessível
                ]}
            >
                <View
                    style={[
                        styles.modalContent,
                        {
                            backgroundColor: theme.card,
                            borderColor: severityColor,
                            borderWidth: 3,
                            borderRadius: 18,
                            padding: 22,
                        },
                    ]}
                    accessible
                    accessibilityRole="alert"
                    accessibilityLiveRegion="assertive"
                >
                    {/* HEADER */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 16,
                        }}
                    >
                        <Ionicons
                            name="warning"
                            size={32}
                            color={severityColor}
                            accessibilityIgnoresInvertColors
                        />

                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "900",
                                    color: highContrastText,
                                }}
                                allowFontScaling
                                maxFontSizeMultiplier={1.6}
                            >
                                {alertData.title}
                            </Text>

                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "700",
                                    color: severityColor,
                                    marginTop: 4,
                                }}
                                allowFontScaling
                            >
                                {alertData.level} • {alertData.structure}
                            </Text>
                        </View>
                    </View>

                    {/* BADGE */}
                    <View
                        style={{
                            backgroundColor: severityColor,
                            paddingVertical: 8,
                            paddingHorizontal: 14,
                            borderRadius: 8,
                            alignSelf: "flex-start",
                            marginBottom: 18,
                        }}
                    >
                        <Text
                            style={{
                                color: "#FFFFFF",
                                fontWeight: "900",
                                fontSize: 13,
                                letterSpacing: 1,
                            }}
                        >
                            {alertData.isSimulation
                                ? "SIMULADO"
                                : alertData.isEfni
                                    ? "EXERCÍCIO INTERNO - EFNI"
                                    : "ALERTA OFICIAL"}
                        </Text>
                    </View>

                    {/* MENSAGEM */}
                    <ScrollView
                        style={{ maxHeight: 300 }}
                        showsVerticalScrollIndicator
                        accessible
                    >
                        <Text
                            style={{
                                fontSize: 17,
                                lineHeight: 26,
                                color: highContrastText,
                                fontWeight: "500",
                            }}
                            allowFontScaling
                            maxFontSizeMultiplier={1.8}
                        >
                            {alertData.message}
                        </Text>
                    </ScrollView>

                    {/* BOTÕES */}
                    <View style={{ marginTop: 26 }}>
                        <Button
                            title={
                                isSpeaking
                                    ? "REPRODUZINDO..."
                                    : "OUVIR MENSAGEM"
                            }
                            icon="volume-high"
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
                            accessibilityRole="button"
                            accessibilityLabel="Ouvir mensagem de emergência"
                        />

                        <View style={{ height: 14 }} />

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
                            accessibilityRole="button"
                            accessibilityLabel="Confirmar ciência do alerta e retornar à tela inicial"
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}
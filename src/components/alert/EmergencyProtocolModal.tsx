// src/components/alert/EmergencyProtocolModal.tsx

import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import React from "react";
import { Modal, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { styles } from "@/styles/alertStyles";

type Props = {
    visible: boolean;
    onClose: () => void;
    onRepeat?: () => void;
};

export function EmergencyProtocolModal({
    visible,
    onClose,
    onRepeat,
}: Props) {
    const { theme } = useTheme();

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View
                style={[
                    styles.modalOverlay,
                    { backgroundColor: theme.background + "F2" },
                ]}
            >
                <View
                    style={[
                        styles.modalContent,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <View style={styles.modalHeader}>
                        <Ionicons
                            name="business"
                            size={28}
                            color={theme.primary}
                        />
                        <Text
                            style={[
                                styles.modalTitle,
                                { color: theme.text },
                            ]}
                        >
                            MMI MINERADORA
                        </Text>
                    </View>

                    <Text style={[styles.modalSub, { color: theme.text }]}>
                        Instruções de Emergência
                    </Text>

                    <View
                        style={[
                            styles.divider,
                            { backgroundColor: theme.border },
                        ]}
                    />

                    {[
                        { label: "Local", val: "Setor Norte" },
                        { label: "Motivo", val: "Instabilidade" },
                        { label: "Rota", val: "Ponto B" },
                    ].map((item, i) => (
                        <View
                            key={i}
                            style={[
                                styles.infoItem,
                                {
                                    backgroundColor: theme.background,
                                    borderColor: theme.border,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.infoText,
                                    { color: theme.text },
                                ]}
                            >
                                <Text style={{ fontWeight: "900" }}>
                                    {item.label}:
                                </Text>{" "}
                                {item.val}
                            </Text>
                        </View>
                    ))}

                    <Button
                        title="OUVIR NOVAMENTE"
                        icon="volume-high"
                        variantStyle={[
                            styles.secondaryButton,
                            {
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                            },
                        ]}
                        textStyle={{ color: theme.text }}
                        onPress={
                            onRepeat ??
                            (() =>
                                Speech.speak(
                                    "Repetindo instruções de evacuação.",
                                    { language: "pt-BR" }
                                ))
                        }
                    />

                    <Button
                        title="ENCERRAR ALERTA"
                        icon="log-out"
                        variantStyle={[
                            styles.dangerButton,
                            { backgroundColor: theme.danger },
                        ]}
                        textStyle={[
                            styles.dangerButtonText,
                            { color: theme.background },
                        ]}
                        onPress={onClose}
                    />
                </View>
            </View>
        </Modal>
    );
}
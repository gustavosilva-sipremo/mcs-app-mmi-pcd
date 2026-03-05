import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import React, { useCallback, useState } from "react";
import { Alert } from "react-native";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";

type TorchButtonProps = {
    activeLabel?: string;
    inactiveLabel?: string;
    showCameraView?: boolean; // permite esconder se quiser controlar externamente
};

export function TorchButton({
    activeLabel = "Desligar Lanterna",
    inactiveLabel = "Lanterna de Serviço",
    showCameraView = true,
}: TorchButtonProps) {
    const { theme, isHighContrast } = useTheme();

    const [isOn, setIsOn] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    const toggleTorch = useCallback(async () => {
        if (!permission?.granted) {
            const { granted } = await requestPermission();

            if (!granted) {
                Alert.alert(
                    "Permissão necessária",
                    "O acesso à câmera é obrigatório para utilizar a lanterna."
                );
                return;
            }
        }

        setIsOn((prev) => !prev);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, [permission, requestPermission]);

    return (
        <>
            <Button
                title={isOn ? activeLabel : inactiveLabel}
                icon={isOn ? "flashlight" : "flashlight-outline"}
                variantStyle={{
                    backgroundColor: isOn ? theme.primary : theme.card,
                    borderWidth: 1,
                    borderColor: theme.border,
                }}
                textStyle={{
                    color: isOn
                        ? isHighContrast
                            ? "#000"
                            : "#000"
                        : theme.text,
                }}
                accessibilityLabel={
                    isOn ? "Desligar lanterna" : "Ligar lanterna"
                }
                onPress={toggleTorch}
            />

            {showCameraView && permission?.granted && (
                <CameraView
                    style={{
                        position: "absolute",
                        width: 1,
                        height: 1,
                        opacity: 0,
                    }}
                    enableTorch={isOn}
                    facing="back"
                />
            )}
        </>
    );
}
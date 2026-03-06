import { useTorch } from "@/context/TorchProvider";
import { CameraView } from "expo-camera";
import React from "react";

export function TorchController() {
    const { isOn, permissionGranted } = useTorch();

    if (!permissionGranted) return null;

    return (
        <CameraView
            style={{
                position: "absolute",
                width: 1,
                height: 1,
                opacity: 0,
            }}
            pointerEvents="none"
            enableTorch={isOn}
            facing="back"
        />
    );
}
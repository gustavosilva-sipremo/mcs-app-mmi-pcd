import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { useTorch } from "@/context/TorchProvider";

export function TorchButton({
    inactiveLabel = "Lanterna",
    activeLabel = "Desligar Lanterna",
}: {
    inactiveLabel?: string;
    activeLabel?: string;
}) {
    const { theme } = useTheme();
    const { isOn, toggle } = useTorch();

    return (
        <Button
            title={isOn ? activeLabel : inactiveLabel}
            icon={isOn ? "flashlight" : "flashlight-outline"}
            variantStyle={{
                backgroundColor: isOn ? theme.primary : theme.card,
                borderWidth: 1,
                borderColor: theme.border,
            }}
            textStyle={{
                color: isOn ? "#000" : theme.text,
            }}
            onPress={toggle}
        />
    );
}
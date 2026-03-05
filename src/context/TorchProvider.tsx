import { useCameraPermissions } from "expo-camera";
import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { Alert } from "react-native";

type TorchSetter = boolean | ((prev: boolean) => boolean);

type TorchContextType = {
    isOn: boolean;
    toggle: () => Promise<void>;
    set: (value: TorchSetter) => Promise<void>;
    ensurePermission: () => Promise<boolean>;
    permissionGranted: boolean;
};

const TorchContext = createContext<TorchContextType | null>(null);

export function TorchProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isOn, setIsOn] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    /**
     * Garante permissão antes de qualquer ação
     */
    const ensurePermission = useCallback(async (): Promise<boolean> => {
        if (permission?.granted) return true;

        const { granted } = await requestPermission();

        if (!granted) {
            Alert.alert(
                "Permissão necessária",
                "O acesso à câmera é obrigatório para usar a lanterna."
            );
            return false;
        }

        return true;
    }, [permission, requestPermission]);

    /**
     * Toggle seguro
     */
    const toggle = useCallback(async () => {
        const allowed = await ensurePermission();
        if (!allowed) return;

        setIsOn((prev) => !prev);
    }, [ensurePermission]);

    /**
     * Setter global seguro
     * Aceita:
     *   set(true)
     *   set(false)
     *   set(prev => !prev)
     */
    const set = useCallback(
        async (value: TorchSetter) => {
            const allowed = await ensurePermission();
            if (!allowed) return;

            setIsOn((prev) =>
                typeof value === "function" ? value(prev) : value
            );
        },
        [ensurePermission]
    );

    /**
     * Memo para evitar re-render desnecessário
     */
    const contextValue = useMemo(
        () => ({
            isOn,
            toggle,
            set,
            ensurePermission,
            permissionGranted: !!permission?.granted,
        }),
        [isOn, toggle, set, ensurePermission, permission]
    );

    return (
        <TorchContext.Provider value={contextValue}>
            {children}
        </TorchContext.Provider>
    );
}

export function useTorch() {
    const context = useContext(TorchContext);

    if (!context) {
        throw new Error("useTorch must be used inside TorchProvider");
    }

    return context;
}
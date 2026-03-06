import * as Battery from "expo-battery";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";

type BatteryListener = (level: number) => void;

class HardwareService {
  private lastActionTime = 0;
  private actionCooldown = 350;

  private batteryLevel: number | null = null;
  private batteryListeners = new Set<BatteryListener>();
  private batterySubscription: Battery.Subscription | null = null;

  /* =========================
     ACTION GUARD (ANTI-SPAM)
  ========================= */

  private canTrigger(): boolean {
    const now = Date.now();

    if (now - this.lastActionTime < this.actionCooldown) {
      return false;
    }

    this.lastActionTime = now;
    return true;
  }

  /* =========================
     HAPTICS
  ========================= */

  async vibrateSuccess() {
    if (!this.canTrigger()) return;
    return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  async vibrateError() {
    if (!this.canTrigger()) return;
    return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  async vibrateWarning() {
    if (!this.canTrigger()) return;
    return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  async impactLight() {
    if (!this.canTrigger()) return;
    return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  /* =========================
     SPEECH
  ========================= */

  speak(text: string, options?: Speech.SpeechOptions) {
    Speech.stop();

    Speech.speak(text, {
      language: "pt-BR",
      rate: 0.9,
      pitch: 1,
      ...options,
    });
  }

  stopSpeech() {
    Speech.stop();
  }

  isSpeaking() {
    return Speech.isSpeakingAsync();
  }

  /* =========================
     BATTERY (CENTRALIZADO)
  ========================= */

  async initBattery() {
    if (this.batterySubscription) return;

    this.batteryLevel = await Battery.getBatteryLevelAsync();

    this.batterySubscription = Battery.addBatteryLevelListener(
      ({ batteryLevel }) => {
        this.batteryLevel = batteryLevel;

        this.batteryListeners.forEach((listener) => listener(batteryLevel));
      },
    );
  }

  async getBatteryLevel(): Promise<number | null> {
    if (this.batteryLevel === null) {
      this.batteryLevel = await Battery.getBatteryLevelAsync();
    }

    return this.batteryLevel;
  }

  getBatteryPercentage(): number | null {
    if (this.batteryLevel === null) return null;
    return Math.round(this.batteryLevel * 100);
  }

  isBatteryLow(threshold = 0.2) {
    if (this.batteryLevel === null) return false;
    return this.batteryLevel <= threshold;
  }

  subscribeBattery(listener: BatteryListener) {
    this.batteryListeners.add(listener);

    return () => {
      this.batteryListeners.delete(listener);
    };
  }

  destroyBattery() {
    this.batterySubscription?.remove();
    this.batterySubscription = null;
  }
}

export const hardwareService = new HardwareService();

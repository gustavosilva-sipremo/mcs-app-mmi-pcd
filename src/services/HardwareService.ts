import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";

class HardwareService {
  /* =========================
     HAPTICS
  ========================= */

  async vibrateSuccess() {
    return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  async vibrateError() {
    return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  async vibrateWarning() {
    return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  async impactLight() {
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
}

export const hardwareService = new HardwareService();

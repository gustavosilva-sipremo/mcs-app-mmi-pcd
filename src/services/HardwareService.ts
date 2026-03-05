import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";

class HardwareService {
  async vibrateSuccess() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  async vibrateError() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  speak(text: string) {
    Speech.speak(text, { language: "pt-BR", rate: 0.9 });
  }

  stopSpeech() {
    Speech.stop();
  }
}

export const hardwareService = new HardwareService();

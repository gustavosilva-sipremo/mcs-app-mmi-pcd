import { AudioPlayer } from "expo-audio";

class AudioService {
  private player?: AudioPlayer;

  register(player: AudioPlayer) {
    this.player = player;
  }

  async play() {
    if (!this.player) return;

    await this.player.seekTo(0);
    await this.player.play();
  }

  stop() {
    if (!this.player) return;

    this.player.pause();
    this.player.seekTo(0);
  }
}

export const audioService = new AudioService();

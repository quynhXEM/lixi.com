let audioContext: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioContext) audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  return audioContext;
}

export function playCelebrationSound(amount?: number) {
  if (typeof window === "undefined") return;
  try {
    const ctx = getContext();
    if (ctx.state === "suspended") ctx.resume();

    const level = amount ? (amount >= 50000 ? "high" : amount >= 20000 ? "mid" : "low") : "mid";
    const now = ctx.currentTime;

    if (level === "high") {
      // Âm thanh vui tai như tiếng xu rơi + nhạc vui
      // Tiếng xu rơi (high pitch, quick) - 8 tiếng
      for (let i = 0; i < 8; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800 + Math.random() * 400; // 800-1200 Hz
        osc.type = "sine";
        const delay = i * 0.05;
        gain.gain.setValueAtTime(0.25, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.15);
        osc.start(now + delay);
        osc.stop(now + delay + 0.2);
      }
      // Nhạc vui (chord) - sau tiếng xu
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = i < 2 ? "sine" : "triangle";
        gain.gain.setValueAtTime(0.3, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
        osc.start(now + 0.4);
        osc.stop(now + 0.75);
      });
    } else if (level === "mid") {
      // Tiếng xu rơi nhẹ nhàng - 5 tiếng
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 600 + Math.random() * 300; // 600-900 Hz
        osc.type = "sine";
        const delay = i * 0.08;
        gain.gain.setValueAtTime(0.2, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.2);
        osc.start(now + delay);
        osc.stop(now + delay + 0.25);
      }
      // Nhạc nhẹ
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.2, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.75);
        osc.start(now + 0.5);
        osc.stop(now + 0.8);
      });
    } else {
      // Tiếng xu rơi nhẹ - 3 tiếng
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 500 + Math.random() * 200; // 500-700 Hz
        osc.type = "sine";
        const delay = i * 0.1;
        gain.gain.setValueAtTime(0.15, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.25);
        osc.start(now + delay);
        osc.stop(now + delay + 0.3);
      }
      // Nốt thấp nhẹ
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 440; // A4
      osc.type = "sine";
      gain.gain.setValueAtTime(0.12, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now + 0.4);
      osc.stop(now + 0.65);
    }
  } catch {
    // Ignore if audio fails (autoplay policy, etc.)
  }
}

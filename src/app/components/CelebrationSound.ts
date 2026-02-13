let audioContext: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioContext) audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  return audioContext;
}

export function playCelebrationSound() {
  if (typeof window === "undefined") return;
  try {
    const ctx = getContext();
    if (ctx.state === "suspended") ctx.resume();

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    let startTime = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.28, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
      osc.start(startTime);
      osc.stop(startTime + 0.25);
      startTime += 0.18;
    });

    // Kết thúc bằng nốt cao vui
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.value = 1318.51; // E6
    osc2.type = "sine";
    gain2.gain.setValueAtTime(0.22, startTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
    osc2.start(startTime);
    osc2.stop(startTime + 0.45);
  } catch {
    // Ignore if audio fails (autoplay policy, etc.)
  }
}

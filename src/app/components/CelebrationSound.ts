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

    if (level === "high") {
      // "Wowww 😱" - nốt cao vui, nhiều tầng
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      let startTime = ctx.currentTime;
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = i < 2 ? "sine" : "triangle";
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
        startTime += 0.15;
      });
    } else if (level === "mid") {
      // "Ting ting ✨" - nhẹ nhàng
      const notes = [523.25, 659.25, 783.99];
      let startTime = ctx.currentTime;
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
        osc.start(startTime);
        osc.stop(startTime + 0.25);
        startTime += 0.2;
      });
    } else {
      // "Bruh... 🤡" - thấp, buồn cười
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 392; // G4
      osc.type = "sawtooth";
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch {
    // Ignore if audio fails (autoplay policy, etc.)
  }
}

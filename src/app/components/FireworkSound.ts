let audioContext: AudioContext | null = null;

function getContext(): AudioContext {
  if (typeof window === "undefined") return null!;
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

/** Tiếng nổ pháo hoa - gọi mỗi khi 1 quả pháo nổ */
export function playFireworkPop() {
  try {
    const ctx = getContext();
    if (!ctx || ctx.state === "suspended") return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80 + Math.random() * 40, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 0.08);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.12);
  } catch {
    // ignore
  }
}

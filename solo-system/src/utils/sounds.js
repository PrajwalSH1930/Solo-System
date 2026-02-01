const playSound = (frequency, duration, type = 'square') => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

export const systemSounds = {
  levelUp: () => {
    playSound(523.25, 0.5); // C5
    setTimeout(() => playSound(659.25, 0.5), 100); // E5
    setTimeout(() => playSound(783.99, 0.8), 200); // G5
  },
  click: () => playSound(800, 0.05, 'sine'),
  questComplete: () => {
    playSound(440, 0.2); // A4
    setTimeout(() => playSound(880, 0.2), 100); // A5
  }
};
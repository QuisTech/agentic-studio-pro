import fs from 'fs';
import path from 'path';

function writeWavHeader(fd: number, numSamples: number, sampleRate: number, numChannels: number, bitsPerSample: number) {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const subchunk2Size = numSamples * numChannels * (bitsPerSample / 8);
  const chunkSize = 36 + subchunk2Size;

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(chunkSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size
  header.writeUInt16LE(1, 20);  // AudioFormat (PCM = 1)
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(subchunk2Size, 40);

  fs.writeSync(fd, header, 0, header.length);
}

// Lush 9th ambient chords
const CHORDS = [
  [110.00, 130.81, 164.81, 196.00, 246.94, 329.63], // Am9
  [87.31, 110.00, 130.81, 164.81, 196.00, 261.63],  // Fmaj9
  [65.41, 82.41, 98.00, 123.47, 146.83, 196.00],   // Cmaj9
  [98.00, 123.47, 146.83, 164.81, 196.00, 246.94]   // G6
];

const CHORD_DURATION = 15; // 15s per chord
const SAMPLE_RATE = 44100;
const DURATION = 200; // 200s total (fully covers the longest video)
const NUM_CHANNELS = 2; // Stereo

async function main() {
  console.log('🎵 Synthesizing high-fidelity mathematical ambient backing synth wav...');
  const resourcesDir = path.join(__dirname, '..', 'resources');
  if (!fs.existsSync(resourcesDir)) {
    fs.mkdirSync(resourcesDir, { recursive: true });
  }

  const outputPath = path.join(resourcesDir, 'background_ambient.wav');
  const fd = fs.openSync(outputPath, 'w');

  const totalSamples = SAMPLE_RATE * DURATION;
  writeWavHeader(fd, totalSamples, SAMPLE_RATE, NUM_CHANNELS, 16);

  const bufferSize = 65536;
  const sampleBuffer = Buffer.alloc(bufferSize * NUM_CHANNELS * 2); // 16-bit stereo PCM
  let bufferIndex = 0;

  for (let s = 0; s < totalSamples; s++) {
    const t = s / SAMPLE_RATE;
    
    const chordIndex = Math.floor(t / CHORD_DURATION) % CHORDS.length;
    const freqs = CHORDS[chordIndex];
    
    // Slow swell LFO
    const chordTime = t % CHORD_DURATION;
    const swell = Math.sin((chordTime / CHORD_DURATION) * Math.PI);
    
    let leftSample = 0;
    let rightSample = 0;

    for (let f = 0; f < freqs.length; f++) {
      const freq = freqs[f];
      const phase = 2 * Math.PI * freq * t;
      const val = Math.sin(phase);
      
      const panning = f / (freqs.length - 1); // Stereo pan spread
      leftSample += val * (1 - panning) * 0.15;
      rightSample += val * panning * 0.15;
    }

    // Ambient rhythmic downbeat pulse (every 3.75s)
    const pulseTime = t % 3.75;
    const pulseDecay = Math.exp(-pulseTime * 2.0);
    const pulseSub = Math.sin(2 * Math.PI * 55 * t) * pulseDecay * 0.25; // 55Hz sub-bass
    leftSample += pulseSub;
    rightSample += pulseSub;

    leftSample *= swell * 32767 * 0.25;
    rightSample *= swell * 32767 * 0.25;

    leftSample = Math.max(-32768, Math.min(32767, leftSample));
    rightSample = Math.max(-32768, Math.min(32767, rightSample));

    sampleBuffer.writeInt16LE(Math.floor(leftSample), bufferIndex);
    sampleBuffer.writeInt16LE(Math.floor(rightSample), bufferIndex + 2);
    bufferIndex += 4;

    if (bufferIndex >= sampleBuffer.length) {
      fs.writeSync(fd, sampleBuffer, 0, sampleBuffer.length);
      bufferIndex = 0;
    }
  }

  if (bufferIndex > 0) {
    fs.writeSync(fd, sampleBuffer, 0, bufferIndex);
  }

  fs.closeSync(fd);
  console.log(`✅ Completed ambient synth backing WAV. Saved to:\n${outputPath}`);
}

main().catch(console.error);

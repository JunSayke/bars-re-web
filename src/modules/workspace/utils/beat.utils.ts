/**
 * @module: workspace
 * @layer: util
 * @scope: module
 */

const MIN_BPM = 40
const MAX_BPM = 240

// ---------------------------------------------------------------------------
// detectBpm
// ---------------------------------------------------------------------------

/**
 * Analyse an audio `ArrayBuffer` and return the dominant tempo as an integer
 * BPM, or `null` if detection fails or the result falls outside 40–240.
 *
 * Algorithm:
 *  1. Decode via `OfflineAudioContext.decodeAudioData`.
 *  2. Low-pass filter (IIR) the raw PCM to isolate kick/bass energy.
 *  3. Walk the filtered samples with a sliding energy window to collect
 *     inter-onset intervals.
 *  4. Bucket the intervals into candidate BPM values and pick the mode.
 *  5. Clamp to valid range; return `null` on any error or low confidence.
 */
export async function detectBpm(buffer: ArrayBuffer): Promise<number | null> {
  try {
    // --- 1. Decode audio ---
    const offlineCtx = new OfflineAudioContext(1, 1, 44100)
    let audioBuffer: AudioBuffer
    try {
      audioBuffer = await offlineCtx.decodeAudioData(buffer.slice(0))
    } catch {
      return null
    }

    // --- 2. Low-pass filter on a mono mix down ---
    const sampleRate = audioBuffer.sampleRate
    const rawData = audioBuffer.getChannelData(0)

    // Simple single-pole IIR low-pass (cutoff ≈ 150 Hz) to isolate bass/kick
    const cutoff = 150 / sampleRate // normalised frequency
    const alpha = 2 * Math.PI * cutoff / (2 * Math.PI * cutoff + 1)
    const filtered = new Float32Array(rawData.length)
    filtered[0] = rawData[0]
    for (let i = 1; i < rawData.length; i++) {
      filtered[i] = alpha * rawData[i] + (1 - alpha) * filtered[i - 1]
    }

    // --- 3. Energy windowing to find onset peaks ---
    const windowSize = Math.floor(sampleRate * 0.02) // 20 ms windows
    const energies: number[] = []

    for (let i = 0; i + windowSize < filtered.length; i += windowSize) {
      let energy = 0
      for (let j = i; j < i + windowSize; j++) {
        energy += filtered[j] * filtered[j]
      }
      energies.push(energy / windowSize)
    }

    // Compute local average energy for adaptive threshold
    const avgWindow = 50
    const onsets: number[] = [] // indices of onset windows

    for (let i = avgWindow; i < energies.length; i++) {
      let localAvg = 0
      for (let k = i - avgWindow; k < i; k++) localAvg += energies[k]
      localAvg /= avgWindow

      if (energies[i] > localAvg * 1.3 && (onsets.length === 0 || i - onsets[onsets.length - 1] > 5)) {
        onsets.push(i)
      }
    }

    if (onsets.length < 4) return null

    // --- 4. Inter-onset interval → BPM buckets ---
    const intervalsMs: number[] = []
    for (let i = 1; i < onsets.length; i++) {
      const ms = ((onsets[i] - onsets[i - 1]) * windowSize / sampleRate) * 1000
      intervalsMs.push(ms)
    }

    // Convert ms intervals to BPM candidates and bucket them
    const buckets: Record<number, number> = {}
    for (const ms of intervalsMs) {
      if (ms < 60000 / MAX_BPM || ms > 60000 / MIN_BPM) continue
      const bpm = Math.round(60000 / ms)
      buckets[bpm] = (buckets[bpm] ?? 0) + 1
    }

    const entries = Object.entries(buckets)
    if (entries.length === 0) return null

    // Pick the mode
    entries.sort((a, b) => b[1] - a[1])
    const topBpm = parseInt(entries[0][0], 10)
    const topCount = entries[0][1]

    // Require at least 4 supporting intervals for confidence
    if (topCount < 4) return null

    // --- 5. Clamp ---
    if (topBpm < MIN_BPM || topBpm > MAX_BPM) return null

    return topBpm
  } catch {
    return null
  }
}

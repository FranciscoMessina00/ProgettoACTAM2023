# ProgettoACTAM2023
The main project of ACTAM

We've crafted a two-channel synthesizer with a percussive character. One channel is built on an FM engine (from tone.js), while the other is tailored to deliver drum sounds.

The standout feature of our instrument is the ability to tweak all sound parameters for each step, enabling musicians to create highly unpredictable lines.

Let's delve into the key functionalities, starting with the first track based on an FM engine.

**FM Synth Track:**
- **Oscillator Section:** Comprising a carrier and a modulator, you can select the waveform for both by clicking the respective arrows. For the carrier, you can also choose the frequency (quantized notes are available by toggling the vertical switch). Regarding the modulator, you can set its frequency with the harmonicity parameter (modulator frequency equals the carrier frequency multiplied by the harmonicity value). The modulation amount determines the modulator oscillator's amplitude.

- **Amplitude Properties:** Define the attack and release of the sound in this section (designed for a percussive behavior). Below these controls are the LFO rate and amount knobs (the LFO modulates the modulator oscillator's amount parameter and can operate at audio rate, providing wild modulations and effects).

**Drum Track:**
- This second channel is dedicated to drums, featuring four independent channels: kick, snare, tom, and hat. These can be played simultaneously for each step, with different volumes selectable for these four instruments, effectively creating a complete drum machine within a single channel.

 - **Kick:** Control over frequency, volume release, pitch envelope release, and pitch sweep amount (this parameter works in tandem with frequency release).

 - **Snare:** Control over frequency, volume release, pitch sweep amount, and noise color (selectable between white, brown, and pink).

 - **Hat:** Control over the cutoff frequency of a hipass filter (filtering white noise) and volume release.

 - **Tom:** Control over frequency, volume release, and color (defining the amount of distortion on the sine tone).

- All these instruments share two parameters: pan position and gain.

- Additionally, you can select the global BPM. In the same section, you'll find controls related to play and stop, hear the selected step, and copy to all (copies the selected step's parameters to all steps).

The most significant aspect of our instrument is the flexibility to alter sound parameters for every step. To trigger a step, left-click it. If you wish to adjust step parameters, right-click it, and the knob positions will adjust based on the sound designed for that step. Then, you can freely modify the knob positions as desired.
import React, { useState, useEffect, useRef } from 'react';
import { Eye, Wind, RotateCcw, Play } from 'lucide-react';
import { GENERATED_IMAGES } from '../data/screenplayData';
import { soundscape } from '../utils/soundscape';

interface VigilTrialSimulatorProps {
  onSelectBeat?: (beatIndex: number) => void;
}

export const VigilTrialSimulator: React.FC<VigilTrialSimulatorProps> = ({ onSelectBeat }) => {
  const [trialState, setTrialState] = useState<'idle' | 'active' | 'conquered'>('idle');
  const [eyelidClosure, setEyelidClosure] = useState<number>(12); // 0 = wide open, 100 = shut
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [blinkCount, setBlinkCount] = useState<number>(0);
  const [staminaReserve, setStaminaReserve] = useState<number>(100);
  const [memoryEcho, setMemoryEcho] = useState<string>(
    '“Do not lie down. Do not close your eyes. Stand vigil here and stay awake for seven nights.”'
  );

  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  const MEMORY_ECHOES = [
    '“I crossed the mountains of darkness. I fought lions with my bare hands.”',
    '“For twelve agonizing days I sat beside Enkidu, holding his hand, waiting for him to wake.”',
    '“Only seven nights? I wrestled the Bull of Heaven! I felled the Cedar Forest!”',
    'Wind howls over the rocks. Gilgamesh stands rigid. His eyelids flutter.',
    'He blinks—once, twice. A deep, bone-crushing weariness washes over him.',
  ];

  const startVigil = () => {
    setTrialState('active');
    setEyelidClosure(15);
    setElapsedSeconds(0);
    setBlinkCount(0);
    setStaminaReserve(100);
    setMemoryEcho(MEMORY_ECHOES[0]);
    soundscape.initAndPlay('night_wind');
    lastTickRef.current = performance.now();
  };

  const resetVigil = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTrialState('idle');
    setEyelidClosure(12);
    setElapsedSeconds(0);
    setBlinkCount(0);
    setStaminaReserve(100);
    setMemoryEcho('“Do not lie down. Do not close your eyes. Stand vigil here and stay awake for seven nights.”');
  };

  const resistSleep = () => {
    if (trialState !== 'active') return;
    // Each effort to force eyes open consumes deep physical stamina, making subsequent seconds heavier
    setBlinkCount((prev) => prev + 1);
    setStaminaReserve((prev) => Math.max(0, prev - 11));
    setEyelidClosure((prev) => Math.max(8, prev - Math.max(10, staminaReserve * 0.28)));
  };

  useEffect(() => {
    if (trialState !== 'active') return;

    const step = (now: number) => {
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setElapsedSeconds((prev) => {
        const next = prev + dt;
        const echoIdx = Math.min(MEMORY_ECHOES.length - 1, Math.floor(next / 3.2));
        setMemoryEcho(MEMORY_ECHOES[echoIdx]);
        return next;
      });

      setEyelidClosure((prev) => {
        // Fatigue accelerates as stamina drops and time passes ("A single draft of sleep has conquered him already")
        const fatigueMultiplier = 1 + (100 - staminaReserve) * 0.032 + elapsedSeconds * 1.45;
        const nextClosure = prev + dt * 16.5 * fatigueMultiplier;
        if (nextClosure >= 100) {
          setTrialState('conquered');
          soundscape.triggerCueAccent('slumber_fall');
          return 100;
        }
        return nextClosure;
      });

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [trialState, staminaReserve, elapsedSeconds]);

  // Compute simulated night progress (he falls Moments Later on Night 1)
  const simulatedHours = (elapsedSeconds * 0.08).toFixed(2);

  return (
    <div className="border border-stone-800/90 bg-[#0D0F12] rounded-xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Interactive Viewport: Gilgamesh's First-Person / Shore Vigil View */}
        <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[440px] bg-black overflow-hidden flex flex-col justify-between select-none">
          {/* Underlying Scene Frame */}
          <img
            src={trialState === 'conquered' ? GENERATED_IMAGES.sleepConquered : GENERATED_IMAGES.vigilStand}
            alt="Gilgamesh standing vigil against the black sea at night"
            referrerPolicy="no-referrer"
            style={{
              filter: `blur(${Math.max(0, (eyelidClosure - 35) * 0.14)}px) brightness(${Math.max(0.15, 1 - eyelidClosure * 0.0075)})`,
              transform: `scale(${1 + eyelidClosure * 0.0008})`,
            }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-150"
          />

          {/* Top & Bottom Eyelid Shutter Overlays (Compositor transform only) */}
          <div
            style={{
              transform: `translateY(${-100 + eyelidClosure * 0.52}%)`,
            }}
            className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-[#050608] via-[#050608]/95 to-transparent pointer-events-none z-10 transition-transform duration-75"
          />
          <div
            style={{
              transform: `translateY(${100 - eyelidClosure * 0.52}%)`,
            }}
            className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-[#050608] via-[#050608]/95 to-transparent pointer-events-none z-10 transition-transform duration-75"
          />

          {/* Measured Scrim for Text Legibility */}
          <div className="relative z-20 p-6 flex items-center justify-between text-xs text-stone-300 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            <div className="flex items-center gap-2 font-script">
              <span>SCENE 11.05 · NIGHT VIGIL</span>
              <span aria-hidden="true">·</span>
              <span>TARGET: 7 NIGHTS (168.00 HRS)</span>
            </div>
            <div className="font-script tabular-nums text-[#C89D54]">
              ELAPSED: {simulatedHours} / 168.00 HRS
            </div>
          </div>

          {/* Center Dramatic Overlay */}
          <div className="relative z-20 px-6 py-8 text-center max-w-xl mx-auto my-auto">
            {trialState === 'idle' && (
              <div className="bg-black/75 backdrop-blur-sm border border-stone-800 p-6 rounded-lg">
                <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">
                  Interactive Staging Study · Death’s Little Brother
                </p>
                <h4 className="text-2xl font-serif-display text-stone-100 mb-3">
                  Stand Vigil on the Volcanic Shore
                </h4>
                <p className="text-sm text-stone-300 leading-relaxed mb-5">
                  Experience the physiological transition between Beat 07 and Beat 09. Once Gilgamesh stops moving on the cold stone, twelve days of grief and the crossing of Mount Mashu pull his eyelids shut.
                </p>
                <button
                  type="button"
                  onClick={startVigil}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C89D54] text-[#090A0C] text-xs font-semibold rounded-lg hover:bg-[#d8ae66] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  Start Vigil Trial
                </button>
              </div>
            )}

            {trialState === 'active' && (
              <div className="space-y-4">
                <p className="text-lg sm:text-xl font-serif-display italic text-stone-100 drop-shadow">
                  {memoryEcho}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resistSleep}
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#C89D54] text-[#090A0C] text-sm font-semibold rounded-lg hover:bg-[#d8ae66] active:scale-95 transition-all whitespace-nowrap shrink-0 shadow-lg cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    Clench Fists & Force Eyes Open
                  </button>
                </div>
              </div>
            )}

            {trialState === 'conquered' && (
              <div className="bg-black/85 backdrop-blur-sm border border-stone-800 p-6 rounded-lg">
                <p className="text-xs uppercase tracking-widest text-[#C89D54] mb-2">
                  Time Cut · Moments Later ({elapsedSeconds.toFixed(1)}s Survived)
                </p>
                <h4 className="text-2xl font-serif-display italic text-stone-100 mb-3">
                  “Look at the mighty hero who sought eternal life. A single draft of sleep has conquered him already.”
                </h4>
                <p className="text-xs text-stone-400 leading-relaxed mb-5">
                  His knees buckle. He hits the ground and rolls onto his side in deep, unconscious slumber after {blinkCount} attempts to fight the weariness.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={resetVigil}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 text-stone-100 text-xs font-medium rounded-lg hover:bg-stone-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Trial
                  </button>
                  {onSelectBeat && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectBeat(8);
                        document.getElementById('screenplay')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#C89D54] text-[#090A0C] text-xs font-semibold rounded-lg hover:bg-[#d8ae66] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Inspect Beat 09 in Screenplay
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="relative z-20 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-xs text-stone-400">
            <span>WIND VELOCITY: 34 KTS · WATERS OF DEATH</span>
            <span className="font-script tabular-nums">
              EYELID WEIGHT: {Math.round(eyelidClosure)}%
            </span>
          </div>
        </div>

        {/* Right Column: Dramatic Mechanics & Director's Breakdown */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#0D0F12] border-t lg:border-t-0 lg:border-l border-stone-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
              <span>Dramatic Irony Analysis</span>
              <span aria-hidden="true">·</span>
              <span>Tablet XI, Lines 209–224</span>
            </div>
            <h3 className="text-2xl font-serif-display text-stone-100 mb-3">
              Why the Hero Falls in Seconds
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed mb-6">
              Gilgamesh approaches immortality as a feat of combat—boasting of wrestling the Bull of Heaven and felling the Cedar Forest. Yet combat relies on adrenaline and action, whereas Utnapishtim demands stillness.
            </p>

            {/* Tabular Stamina Metrics */}
            <dl className="divide-y divide-stone-800/80 border-y border-stone-800/80 text-xs mb-6">
              <div className="py-3 flex items-center justify-between">
                <dt className="text-stone-400">Physical Reserve After Mount Mashu</dt>
                <dd className="font-script tabular-nums text-stone-200">{staminaReserve}%</dd>
              </div>
              <div className="py-3 flex items-center justify-between">
                <dt className="text-stone-400">Eyelid Shutter Obstruction</dt>
                <dd className="font-script tabular-nums text-[#C89D54]">{Math.round(eyelidClosure)}%</dd>
              </div>
              <div className="py-3 flex items-center justify-between">
                <dt className="text-stone-400">Voluntary Blinks Resisted</dt>
                <dd className="font-script tabular-nums text-stone-200">{blinkCount}</dd>
              </div>
              <div className="py-3 flex items-center justify-between">
                <dt className="text-stone-400">Required Vigil Duration</dt>
                <dd className="font-script tabular-nums text-stone-200">7 Nights · 06 Days</dd>
              </div>
            </dl>
          </div>

          <div className="pt-4 border-t border-stone-800/70 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <Wind className="w-4 h-4 text-[#C89D54] shrink-0" />
              <span>Sleep blows over him like sea mist the moment his jaw sets.</span>
            </div>
            {trialState === 'active' ? (
              <button
                type="button"
                onClick={resetVigil}
                className="px-3 py-1.5 text-xs font-medium text-stone-300 border border-stone-700 rounded-md hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Reset
              </button>
            ) : (
              <button
                type="button"
                onClick={startVigil}
                className="px-3.5 py-1.5 text-xs font-semibold bg-stone-100 text-stone-950 rounded-md hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {trialState === 'conquered' ? 'Try Again' : 'Begin Vigil'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

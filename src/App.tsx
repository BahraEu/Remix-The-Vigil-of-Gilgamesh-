import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Copy,
  Check,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Plus,
} from 'lucide-react';
import {
  DRAMATIC_BEATS,
  STORYBOARD_SHOTS,
  CONCORDANCE_ENTRIES,
  DramaticBeat,
  StoryboardShot,
} from './data/screenplayData';
import { soundscape } from './utils/soundscape';
import { VigilTrialSimulator } from './components/VigilTrialSimulator';

export default function App() {
  // Interactive Screenplay & Table Read State
  const [beats, setBeats] = useState<DramaticBeat[]>(DRAMATIC_BEATS);
  const [activeBeatIndex, setActiveBeatIndex] = useState<number>(0);
  const [isPlayingTableRead, setIsPlayingTableRead] = useState<boolean>(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [characterFilter, setCharacterFilter] = useState<'ALL' | 'GILGAMESH' | 'UTNAPISHTIM' | 'ACTION'>('ALL');
  const [scriptViewMode, setScriptViewMode] = useState<'formatted' | 'table' | 'fountain'>('formatted');
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Inline Editing & Custom Director Note State
  const [editingBeatId, setEditingBeatId] = useState<string | null>(null);
  const [draftSubtext, setDraftSubtext] = useState<string>('');
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [draftElementText, setDraftElementText] = useState<string>('');

  // Storyboard Filter & Lightbox Modal State
  const [shotLightingFilter, setShotLightingFilter] = useState<'ALL' | 'DUSK' | 'NIGHT'>('ALL');
  const [lightboxShotIndex, setLightboxShotIndex] = useState<number | null>(null);

  // Concordance Active Tab
  const [activeConcordanceId, setActiveConcordanceId] = useState<string>(CONCORDANCE_ENTRIES[0].id);

  const activeBeat = beats[activeBeatIndex] || beats[0];

  // Synchronized Table Read Auto-Advance Timer
  useEffect(() => {
    if (!isPlayingTableRead) return;

    const currentBeat = beats[activeBeatIndex];
    if (isAudioEnabled) {
      soundscape.initAndPlay(currentBeat.soundCue);
    }

    const timer = window.setTimeout(() => {
      if (activeBeatIndex < beats.length - 1) {
        setActiveBeatIndex((prev) => prev + 1);
      } else {
        setIsPlayingTableRead(false);
      }
    }, currentBeat.durationSec * 1000);

    return () => clearTimeout(timer);
  }, [isPlayingTableRead, activeBeatIndex, beats, isAudioEnabled]);

  // Keyboard navigation for Lightbox Modal
  useEffect(() => {
    if (lightboxShotIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxShotIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxShotIndex((prev) =>
          prev === null ? null : (prev + 1) % STORYBOARD_SHOTS.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxShotIndex((prev) =>
          prev === null ? null : (prev - 1 + STORYBOARD_SHOTS.length) % STORYBOARD_SHOTS.length
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxShotIndex]);

  const toggleTableRead = () => {
    if (!isPlayingTableRead) {
      if (activeBeatIndex === beats.length - 1) {
        setActiveBeatIndex(0);
      }
      setIsPlayingTableRead(true);
      setIsAudioEnabled(true);
      soundscape.initAndPlay(beats[activeBeatIndex].soundCue);
    } else {
      setIsPlayingTableRead(false);
    }
  };

  const toggleSoundscape = () => {
    if (isAudioEnabled) {
      soundscape.stop();
      setIsAudioEnabled(false);
    } else {
      const ok = soundscape.initAndPlay(activeBeat.soundCue);
      setIsAudioEnabled(ok);
    }
  };

  const handleSelectBeat = (index: number) => {
    setActiveBeatIndex(index);
    if (isAudioEnabled) {
      soundscape.triggerCueAccent(beats[index].soundCue);
    }
  };

  // Generate raw Fountain screenplay string for export or copy
  const fullFountainText = useMemo(() => {
    const lines: string[] = [
      'Title: THE VIGIL OF GILGAMESH',
      'Credit: Adapted from Tablet XI of the Standard Babylonian Epic of Gilgamesh',
      'Author: Sin-leqi-unninni / Screenplay Study',
      'Scene: EXT. DWELLING OF UTNAPISHTIM - EDGE OF THE WORLD',
      '',
    ];

    beats.forEach((beat) => {
      beat.elements.forEach((el) => {
        if (el.type === 'slugline') {
          lines.push(el.text);
          lines.push('');
        } else if (el.type === 'transition') {
          lines.push(`> ${el.text}`);
          lines.push('');
        } else if (el.type === 'action') {
          lines.push(el.text);
          lines.push('');
        } else if (el.type === 'dialogue') {
          lines.push(`${el.character}${el.contd ? " (CONT'D)" : ''}`);
          if (el.parenthetical) {
            lines.push(el.parenthetical);
          }
          lines.push(el.text);
          lines.push('');
        }
      });
    });

    return lines.join('\n');
  }, [beats]);

  const handleDownloadFountain = () => {
    const blob = new Blob([fullFountainText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'the_vigil_of_gilgamesh_tablet_xi.fountain';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(fullFountainText);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const startEditSubtext = (beat: DramaticBeat) => {
    setEditingBeatId(beat.id);
    setDraftSubtext(beat.directorSubtext);
  };

  const saveEditSubtext = (beatId: string) => {
    setBeats((prev) =>
      prev.map((b) => (b.id === beatId ? { ...b, directorSubtext: draftSubtext } : b))
    );
    setEditingBeatId(null);
  };

  const startEditElement = (elementId: string, currentText: string) => {
    setEditingElementId(elementId);
    setDraftElementText(currentText);
  };

  const saveEditElement = (beatId: string, elementId: string) => {
    setBeats((prev) =>
      prev.map((b) => {
        if (b.id !== beatId) return b;
        return {
          ...b,
          elements: b.elements.map((el) =>
            el.id === elementId ? { ...el, text: draftElementText } : el
          ),
        };
      })
    );
    setEditingElementId(null);
  };

  const filteredStoryboardShots = useMemo(() => {
    if (shotLightingFilter === 'ALL') return STORYBOARD_SHOTS;
    return STORYBOARD_SHOTS.filter((s) =>
      shotLightingFilter === 'DUSK'
        ? s.sceneHeading.includes('DUSK')
        : s.sceneHeading.includes('NIGHT')
    );
  }, [shotLightingFilter]);

  const activeLightboxShot: StoryboardShot | null =
    lightboxShotIndex !== null ? STORYBOARD_SHOTS[lightboxShotIndex] : null;

  return (
    <div className="min-h-screen bg-[#090A0C] text-[#EAE6DF] flex flex-col">
      {/* 1. Strict 3-Zone Top Navigation Bar Contract */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 lg:px-12 py-4 bg-[#090A0C]/90 backdrop-blur-md border-b border-stone-800/80">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-xl font-serif-display font-semibold tracking-tight text-stone-100 whitespace-nowrap shrink-0"
        >
          Tablet XI · The Vigil
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-400">
          <a
            href="#screenplay"
            className="hover:text-stone-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Screenplay
          </a>
          <a
            href="#storyboard"
            className="hover:text-stone-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Storyboard
          </a>
          <a
            href="#vigil-test"
            className="hover:text-stone-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Vigil Trial
          </a>
          <a
            href="#concordance"
            className="hover:text-stone-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Concordance
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleDownloadFountain}
            className="px-4 py-2 text-xs font-semibold text-[#090A0C] bg-[#C89D54] rounded-lg hover:bg-[#d8ae66] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Export Script
          </button>
        </div>
      </header>

      {/* 2. Split-Screen Hero & Full-Width Metrics Row Below */}
      <section className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 pt-8 lg:pt-12 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-4">
                <span>Scene 11.04 — 11.05</span>
                <span aria-hidden="true">·</span>
                <span>Edge of the World</span>
                <span aria-hidden="true">·</span>
                <span>Dusk to Night</span>
              </div>

              <h1
                style={{ textWrap: 'balance' }}
                className="text-4xl sm:text-5xl lg:text-[54px] font-serif-display font-medium text-stone-100 leading-[1.08] tracking-tight mb-6"
              >
                First Conquer Death’s Little Brother: Sleep.
              </h1>

              <p className="text-base text-stone-300 leading-relaxed mb-6 max-w-xl">
                Hollow-cheeked and clad in salt-crusted wolf pelts, Gilgamesh stumbles onto the black volcanic shingle across the Waters of Death to demand the secret of eternal life from Utnapishtim—only to face a seven-night vigil his exhausted mortal body cannot endure.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-stone-800/80">
              <blockquote className="text-lg font-serif-display italic text-stone-200 leading-snug">
                “I did not let them bury him. Not until a maggot fell from his nose. Then I knew. The same dark is waiting for me.”
              </blockquote>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    toggleTableRead();
                    document.getElementById('screenplay')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#C89D54] text-[#090A0C] text-xs font-semibold rounded-lg hover:bg-[#d8ae66] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isPlayingTableRead ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      Pause Table Read
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      Play Synchronized Table Read
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleSoundscape}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 border border-stone-700 text-stone-200 text-xs font-medium rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isAudioEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#C89D54]" />
                      Mute Coastal Surf
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                      Enable Coastal Soundscape
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Matching-Height Visual Container with Active Beat Frame */}
          <div className="lg:col-span-7 relative rounded-xl overflow-hidden border border-stone-800 bg-stone-950 min-h-[360px] lg:min-h-[480px] flex flex-col justify-between group">
            <img
              src={activeBeat.imageUrl}
              alt={activeBeat.title}
              referrerPolicy="no-referrer"
              className="w-full h-full lg:h-full object-cover absolute inset-0 transition-opacity duration-300"
            />

            {/* Top Measured Scrim */}
            <div className="relative z-10 p-5 flex items-center justify-between text-xs text-stone-300 bg-gradient-to-b from-black/80 via-black/35 to-transparent">
              <div className="flex items-center gap-2 font-script">
                <span>{activeBeat.shotId}</span>
                <span aria-hidden="true">·</span>
                <span>BEAT {activeBeat.beatNumber} OF 09</span>
                <span aria-hidden="true">·</span>
                <span>{activeBeat.scenePhase}</span>
              </div>
              <span className="font-script tabular-nums text-stone-300">
                TC {activeBeat.timecode}
              </span>
            </div>

            {/* Bottom Measured Scrim with Active Beat Caption & Quick Scrubbing */}
            <div className="relative z-10 p-6 pt-16 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-[#C89D54] font-script mb-1">
                    {activeBeat.cameraSpec}
                  </p>
                  <h2 className="text-2xl font-serif-display text-stone-100">
                    {activeBeat.beatNumber}. {activeBeat.title}
                  </h2>
                  <p className="text-xs text-stone-300 mt-1 max-w-xl line-clamp-2">
                    {activeBeat.directorSubtext}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    aria-label="Previous Beat"
                    onClick={() =>
                      handleSelectBeat((activeBeatIndex - 1 + beats.length) % beats.length)
                    }
                    className="p-2 rounded-lg bg-stone-900/90 border border-stone-700 text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next Beat"
                    onClick={() => handleSelectBeat((activeBeatIndex + 1) % beats.length)}
                    className="p-2 rounded-lg bg-stone-900/90 border border-stone-700 text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Production Telemetry Strip Below Hero Split */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-stone-800/90 divide-y sm:divide-y-0 sm:divide-x divide-stone-800/90 bg-[#0C0E11]">
          <div className="p-5">
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">
              Primary Location
            </p>
            <p className="text-lg font-serif-display text-stone-100">
              Dwelling of Utnapishtim
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              Volcanic Shore · Waters of Death
            </p>
          </div>

          <div className="p-5">
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">
              Dramatic Structure
            </p>
            <p className="text-lg font-serif-display text-stone-100 font-script tabular-nums">
              09 Beats · 05:05 Runtime
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              Exterior Dusk to Moments Later (Night)
            </p>
          </div>

          <div className="p-5">
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">
              Optical Format
            </p>
            <p className="text-lg font-serif-display text-stone-100">
              35mm Anamorphic 2.39:1
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              Panavision C-Series · 24mm to 85mm
            </p>
          </div>

          <div className="p-5">
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">
              Literary Source
            </p>
            <p className="text-lg font-serif-display text-stone-100">
              Standard Babylonian Tablet XI
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              Sin-leqi-unninni · Nineveh Archive
            </p>
          </div>
        </div>
      </section>

      {/* Subtle Editorial Section Divider Ribbon */}
      <div className="border-y border-stone-800/60 bg-[#0B0C0E] py-2.5 overflow-hidden select-none">
        <div className="animate-marquee text-xs uppercase tracking-widest text-stone-500 font-script">
          <span className="mx-8">
            ext. dwelling of utnapishtim · edge of the world · dusk
          </span>
          <span className="mx-8">·</span>
          <span className="mx-8">
            conquer death’s little brother: sleep · stand vigil for seven nights
          </span>
          <span className="mx-8">·</span>
          <span className="mx-8">
            ext. dwelling of utnapishtim · night (moments later)
          </span>
          <span className="mx-8">·</span>
          <span className="mx-8">
            ext. dwelling of utnapishtim · edge of the world · dusk
          </span>
          <span className="mx-8">·</span>
          <span className="mx-8">
            conquer death’s little brother: sleep · stand vigil for seven nights
          </span>
          <span className="mx-8">·</span>
          <span className="mx-8">
            ext. dwelling of utnapishtim · night (moments later)
          </span>
        </div>
      </div>

      {/* 3. Section 01: Interactive Screenplay & Director's Table Read */}
      <section id="screenplay" className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-14">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-2">
              <span>01 / Shooting Script & Staging Deck</span>
              <span aria-hidden="true">·</span>
              <span>Interactive Manuscript</span>
            </div>
            <h2
              style={{ textWrap: 'balance' }}
              className="text-3xl sm:text-4xl font-serif-display text-stone-100"
            >
              Annotated Screenplay & Director’s Monitor
            </h2>
          </div>

          {/* Functional Filter & View Controls (Segmented Buttons) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Character Filter Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-lg">
              {(['ALL', 'GILGAMESH', 'UTNAPISHTIM', 'ACTION'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setCharacterFilter(role)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    characterFilter === role
                      ? 'bg-[#C89D54] text-[#090A0C] font-semibold'
                      : 'text-stone-400 hover:text-stone-100'
                  }`}
                >
                  {role === 'ALL'
                    ? 'All Lines'
                    : role === 'GILGAMESH'
                    ? 'Gilgamesh'
                    : role === 'UTNAPISHTIM'
                    ? 'Utnapishtim'
                    : 'Stage Action'}
                </button>
              ))}
            </div>

            {/* View Mode Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-lg">
              {(
                [
                  { id: 'formatted', label: 'Formatted Script' },
                  { id: 'table', label: 'Shooting Table' },
                  { id: 'fountain', label: 'Fountain Source' },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setScriptViewMode(mode.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    scriptViewMode === mode.id
                      ? 'bg-stone-200 text-stone-950 font-semibold'
                      : 'text-stone-400 hover:text-stone-100'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopyScript}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-200 bg-stone-900 border border-stone-800 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copiedScript ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#C89D54]" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                  Copy Script
                </>
              )}
            </button>
          </div>
        </div>

        {/* Asymmetric Reading Canvas (65% Manuscript / 35% Sticky Director's Monitor) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 Columns: The Screenplay Page */}
          <div className="lg:col-span-8 bg-[#101216] border border-stone-800/90 rounded-xl p-6 sm:p-10">
            {scriptViewMode === 'formatted' && (
              <div className="max-w-2xl mx-auto space-y-8 font-script text-[15px] leading-relaxed">
                {beats.map((beat, bIdx) => {
                  const isCurrentBeat = bIdx === activeBeatIndex;

                  // Filter elements if characterFilter is active
                  const visibleElements = beat.elements.filter((el) => {
                    if (characterFilter === 'ALL') return true;
                    if (characterFilter === 'ACTION')
                      return el.type === 'action' || el.type === 'slugline' || el.type === 'transition';
                    return el.type === 'dialogue' && el.character === characterFilter;
                  });

                  if (visibleElements.length === 0) return null;

                  return (
                    <div
                      key={beat.id}
                      onClick={() => handleSelectBeat(bIdx)}
                      className={`p-5 sm:p-6 rounded-lg border transition-colors cursor-pointer ${
                        isCurrentBeat
                          ? 'bg-[#171A21] border-[#C89D54]/70'
                          : 'bg-transparent border-stone-800/60 hover:border-stone-700'
                      }`}
                    >
                      {/* Unboxed Beat Header Metadata */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-stone-800/80 text-xs text-stone-400 font-sans">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-200">
                            Beat {beat.beatNumber} · {beat.title}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{beat.shotId}</span>
                          <span aria-hidden="true">·</span>
                          <span>{beat.tabletVerseRef}</span>
                        </div>
                        <span className="font-script tabular-nums text-stone-400">
                          {beat.timecode}
                        </span>
                      </div>

                      {/* Screenplay Elements */}
                      <div className="space-y-4">
                        {visibleElements.map((el) => {
                          const isEditingThis = editingElementId === el.id;

                          if (el.type === 'slugline') {
                            return (
                              <div
                                key={el.id}
                                className="font-bold tracking-wide text-stone-100 uppercase pt-2 pb-1 border-b border-stone-800/50"
                              >
                                {el.text}
                              </div>
                            );
                          }

                          if (el.type === 'transition') {
                            return (
                              <div
                                key={el.id}
                                className="text-right font-bold tracking-wider text-[#C89D54] uppercase py-1"
                              >
                                {el.text}
                              </div>
                            );
                          }

                          if (el.type === 'action') {
                            return (
                              <div key={el.id} className="group/line relative text-stone-300">
                                {isEditingThis ? (
                                  <div
                                    className="space-y-2"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <textarea
                                      value={draftElementText}
                                      onChange={(e) => setDraftElementText(e.target.value)}
                                      rows={3}
                                      className="w-full bg-stone-950 border border-stone-700 rounded p-2.5 text-sm text-stone-100 focus:outline-none focus:border-[#C89D54]"
                                    />
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => saveEditElement(beat.id, el.id)}
                                        className="px-3 py-1 bg-[#C89D54] text-[#090A0C] text-xs font-semibold rounded cursor-pointer"
                                      >
                                        Save Line
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setEditingElementId(null)}
                                        className="px-3 py-1 bg-stone-800 text-stone-300 text-xs rounded cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-start justify-between gap-3">
                                    <p>{el.text}</p>
                                    <button
                                      type="button"
                                      title="Edit Action Line"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startEditElement(el.id, el.text);
                                      }}
                                      className="opacity-0 group-hover/line:opacity-100 p-1 text-stone-500 hover:text-stone-200 transition-opacity shrink-0 cursor-pointer"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          }

                          // Dialogue Block
                          return (
                            <div
                              key={el.id}
                              className="group/line pl-6 sm:pl-16 pr-4 sm:pr-12 py-1"
                            >
                              <div className="text-center sm:text-left sm:pl-16 font-semibold tracking-wider text-stone-100">
                                {el.character}
                                {el.contd ? " (CONT'D)" : ''}
                              </div>
                              {el.parenthetical && (
                                <div className="text-center sm:text-left sm:pl-10 text-stone-400 italic text-sm">
                                  {el.parenthetical}
                                </div>
                              )}
                              {isEditingThis ? (
                                <div
                                  className="mt-2 space-y-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <textarea
                                    value={draftElementText}
                                    onChange={(e) => setDraftElementText(e.target.value)}
                                    rows={3}
                                    className="w-full bg-stone-950 border border-stone-700 rounded p-2.5 text-sm text-stone-100 focus:outline-none focus:border-[#C89D54]"
                                  />
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => saveEditElement(beat.id, el.id)}
                                      className="px-3 py-1 bg-[#C89D54] text-[#090A0C] text-xs font-semibold rounded cursor-pointer"
                                    >
                                      Save Dialogue
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingElementId(null)}
                                      className="px-3 py-1 bg-stone-800 text-stone-300 text-xs rounded cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start justify-between gap-3 mt-0.5">
                                  <p className="text-stone-100">{el.text}</p>
                                  <button
                                    type="button"
                                    title="Edit Dialogue Line"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startEditElement(el.id, el.text);
                                    }}
                                    className="opacity-0 group-hover/line:opacity-100 p-1 text-stone-500 hover:text-stone-200 transition-opacity shrink-0 cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {scriptViewMode === 'table' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-stone-800 text-xs uppercase tracking-wider text-stone-400">
                      <th className="py-3 pr-4 font-medium">Beat / TC</th>
                      <th className="py-3 px-4 font-medium">Shot & Optics</th>
                      <th className="py-3 px-4 font-medium">Screenplay Action & Dialogue</th>
                      <th className="py-3 pl-4 font-medium">Director’s Staging Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/80 align-top">
                    {beats.map((beat, idx) => (
                      <tr
                        key={beat.id}
                        onClick={() => handleSelectBeat(idx)}
                        className={`transition-colors cursor-pointer ${
                          idx === activeBeatIndex ? 'bg-[#171A21]' : 'hover:bg-stone-900/50'
                        }`}
                      >
                        <td className="py-4 pr-4 font-script tabular-nums whitespace-nowrap">
                          <div className="font-semibold text-stone-100">
                            Beat {beat.beatNumber}
                          </div>
                          <div className="text-xs text-stone-400">{beat.timecode}</div>
                        </td>
                        <td className="py-4 px-4 text-xs text-stone-300">
                          <div className="font-semibold text-[#C89D54]">{beat.shotId}</div>
                          <div className="mt-1">{beat.cameraSpec}</div>
                        </td>
                        <td className="py-4 px-4 font-script text-xs space-y-2 text-stone-200">
                          {beat.elements.map((el) => (
                            <div key={el.id}>
                              {el.character ? (
                                <span className="font-semibold text-stone-100">
                                  {el.character}:{' '}
                                </span>
                              ) : null}
                              <span>{el.text}</span>
                            </div>
                          ))}
                        </td>
                        <td className="py-4 pl-4 text-xs text-stone-400 leading-relaxed">
                          {beat.directorSubtext}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {scriptViewMode === 'fountain' && (
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-800 text-xs text-stone-400">
                  <span>Standard Fountain Plain-Text Screenplay Syntax</span>
                  <button
                    type="button"
                    onClick={handleDownloadFountain}
                    className="inline-flex items-center gap-1.5 text-[#C89D54] hover:underline cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .fountain File
                  </button>
                </div>
                <pre className="font-script text-xs sm:text-sm text-stone-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {fullFountainText}
                </pre>
              </div>
            )}
          </div>

          {/* Right 4 Columns: Sticky Director's Monitor & Subtext Inspector */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 bg-[#101216] border border-stone-800/90 rounded-xl overflow-hidden">
            <div className="relative aspect-video bg-black border-b border-stone-800">
              <img
                src={activeBeat.imageUrl}
                alt={activeBeat.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-xs text-stone-200 font-script">
                <span>
                  {activeBeat.shotId} · BEAT {activeBeat.beatNumber}
                </span>
                <span className="tabular-nums">{activeBeat.timecode}</span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                  <span>Active Beat Monitor</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeBeat.scenePhase}</span>
                </div>
                <h3 className="text-2xl font-serif-display text-stone-100">
                  {activeBeat.beatNumber}. {activeBeat.title}
                </h3>
              </div>

              <dl className="divide-y divide-stone-800/80 border-y border-stone-800/80 text-xs">
                <div className="py-2.5 flex items-start justify-between gap-4">
                  <dt className="text-stone-400 shrink-0">Camera & Lens</dt>
                  <dd className="text-stone-200 text-right font-script">
                    {activeBeat.cameraSpec}
                  </dd>
                </div>
                <div className="py-2.5 flex items-start justify-between gap-4">
                  <dt className="text-stone-400 shrink-0">Lighting Key</dt>
                  <dd className="text-stone-200 text-right">{activeBeat.lightingNote}</dd>
                </div>
                <div className="py-2.5 flex items-start justify-between gap-4">
                  <dt className="text-stone-400 shrink-0">Tablet XI Source</dt>
                  <dd className="text-stone-200 text-right font-script">
                    {activeBeat.tabletVerseRef}
                  </dd>
                </div>
              </dl>

              {/* Editable Director's Subtext Note */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-stone-400">
                    Director’s Blocking & Subtext
                  </span>
                  {editingBeatId !== activeBeat.id && (
                    <button
                      type="button"
                      onClick={() => startEditSubtext(activeBeat)}
                      className="inline-flex items-center gap-1 text-xs text-[#C89D54] hover:underline cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Edit Note
                    </button>
                  )}
                </div>

                {editingBeatId === activeBeat.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={draftSubtext}
                      onChange={(e) => setDraftSubtext(e.target.value)}
                      rows={4}
                      className="w-full bg-stone-950 border border-stone-700 rounded-lg p-3 text-xs text-stone-100 focus:outline-none focus:border-[#C89D54]"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => saveEditSubtext(activeBeat.id)}
                        className="px-3 py-1.5 bg-[#C89D54] text-[#090A0C] text-xs font-semibold rounded-md cursor-pointer"
                      >
                        Save Note
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingBeatId(null)}
                        className="px-3 py-1.5 bg-stone-800 text-stone-300 text-xs rounded-md cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-stone-300 leading-relaxed">
                    {activeBeat.directorSubtext}
                  </p>
                )}
              </div>

              {/* Beat Quick-Jump Strip */}
              <div className="pt-2">
                <p className="text-xs text-stone-400 mb-2">Jump to Dramatic Beat</p>
                <div className="grid grid-cols-9 gap-1.5">
                  {beats.map((b, idx) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleSelectBeat(idx)}
                      className={`py-1.5 text-xs font-script tabular-nums rounded border transition-colors cursor-pointer ${
                        idx === activeBeatIndex
                          ? 'bg-[#C89D54] text-[#090A0C] border-[#C89D54] font-semibold'
                          : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-100'
                      }`}
                    >
                      {b.beatNumber}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* 4. Section 02: Cinematography & Anamorphic Storyboard Bento Grid */}
      <section
        id="storyboard"
        className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-14 border-t border-stone-800/80"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-2">
              <span>02 / Visual Architecture</span>
              <span aria-hidden="true">·</span>
              <span>35mm Anamorphic Storyboard</span>
            </div>
            <h2
              style={{ textWrap: 'balance' }}
              className="text-3xl sm:text-4xl font-serif-display text-stone-100"
            >
              Cinematography & Lighting Study
            </h2>
          </div>

          {/* Dusk vs Night Filter Segmented Buttons */}
          <div className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-lg self-start sm:self-auto">
            {(['ALL', 'DUSK', 'NIGHT'] as const).map((phase) => (
              <button
                key={phase}
                type="button"
                onClick={() => setShotLightingFilter(phase)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  shotLightingFilter === phase
                    ? 'bg-[#C89D54] text-[#090A0C] font-semibold'
                    : 'text-stone-400 hover:text-stone-100'
                }`}
              >
                {phase === 'ALL'
                  ? 'All Setups (5)'
                  : phase === 'DUSK'
                  ? 'Dusk Arrival'
                  : 'Night Vigil'}
              </button>
            ))}
          </div>
        </div>

        {/* Media-First Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStoryboardShots.map((shot) => {
            const globalIndex = STORYBOARD_SHOTS.findIndex((s) => s.id === shot.id);
            const isHeroSpan = shot.bentoSpan === 'hero' && shotLightingFilter === 'ALL';
            const isWideSpan = shot.bentoSpan === 'wide' && shotLightingFilter === 'ALL';

            return (
              <article
                key={shot.id}
                onClick={() => setLightboxShotIndex(globalIndex)}
                className={`group rounded-2xl overflow-hidden border border-stone-800/90 bg-[#101216] flex flex-col justify-between cursor-pointer hover:border-stone-600 transition-colors ${
                  isHeroSpan
                    ? 'md:col-span-2 lg:col-span-2 lg:row-span-2'
                    : isWideSpan
                    ? 'md:col-span-2 lg:col-span-2'
                    : ''
                }`}
              >
                <div
                  className={`relative bg-black overflow-hidden ${
                    isHeroSpan ? 'aspect-video lg:h-[380px]' : 'aspect-video'
                  }`}
                >
                  <img
                    src={shot.imageUrl}
                    alt={shot.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-stone-200 font-script">
                    <span>{shot.shotCode}</span>
                    <span className="inline-flex items-center gap-1 text-stone-300 group-hover:text-white">
                      <Maximize2 className="w-3.5 h-3.5" />
                      Inspect Frame
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2 text-xs text-stone-300 font-script">
                    <span>{shot.focalLength}</span>
                    <span aria-hidden="true">·</span>
                    <span>{shot.aperture}</span>
                    <span aria-hidden="true">·</span>
                    <span>{shot.colorTemp}</span>
                    <span aria-hidden="true">·</span>
                    <span>{shot.lightingRatio}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-serif-display text-stone-100 mb-2">
                      {shot.title}
                    </h3>
                    <p className="text-sm text-stone-400 leading-relaxed mb-4">
                      {shot.compositionNote}
                    </p>
                  </div>

                  <p className="pt-3 border-t border-stone-800/80 text-xs font-serif-display italic text-stone-300">
                    “{shot.featuredQuote}”
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 5. Section 03: Interactive Seven Nights Vigil Stamina Trial */}
      <section
        id="vigil-test"
        className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-14 border-t border-stone-800/80"
      >
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-2">
            <span>03 / Interactive Trial</span>
            <span aria-hidden="true">·</span>
            <span>Stand Vigil for Seven Nights</span>
          </div>
          <h2
            style={{ textWrap: 'balance' }}
            className="text-3xl sm:text-4xl font-serif-display text-stone-100"
          >
            The Test of Utnapishtim: Conquer Sleep
          </h2>
        </div>

        <VigilTrialSimulator onSelectBeat={(idx) => handleSelectBeat(idx)} />
      </section>

      {/* 6. Section 04: Tablet XI Archival Concordance & Museum Accession Detail */}
      <section
        id="concordance"
        className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-14 border-t border-stone-800/80"
      >
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-2">
            <span>04 / Curatorial Concordance</span>
            <span aria-hidden="true">·</span>
            <span>Standard Babylonian Cuneiform Archive</span>
          </div>
          <h2
            style={{ textWrap: 'balance' }}
            className="text-3xl sm:text-4xl font-serif-display text-stone-100"
          >
            From Clay Tablet XI to Screenplay Page
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 4 Columns: Museum Accession Metadata Grid */}
          <div className="lg:col-span-4 bg-[#101216] border border-stone-800/90 rounded-xl p-6">
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">
              Primary Source Witness
            </p>
            <h3 className="text-2xl font-serif-display text-stone-100 mb-4">
              Nineveh Flood & Vigil Tablet
            </h3>

            <dl className="divide-y divide-stone-800/80 border-y border-stone-800/80 text-xs">
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-stone-400">Accession Reference</dt>
                <dd className="font-script text-stone-200">K.3375 · Tablet XI</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-stone-400">Compiler / Scribe</dt>
                <dd className="text-stone-200 text-right">
                  Sin-leqi-unninni (c. 1200 BCE)
                </dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-stone-400">Medium & Script</dt>
                <dd className="text-stone-200 text-right">
                  Baked clay · Neo-Assyrian cuneiform
                </dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-stone-400">Dimensions</dt>
                <dd className="font-script tabular-nums text-stone-200">
                  15.24 × 13.33 cm
                </dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-stone-400">Provenance</dt>
                <dd className="text-stone-200 text-right">
                  Library of Ashurbanipal, Kouyunjik
                </dd>
              </div>
            </dl>

            <p className="text-xs text-stone-400 leading-relaxed mt-4">
              Select a passage on the right to compare the Akkadian cuneiform transliteration and Standard Babylonian verse against the modern screenplay scene.
            </p>
          </div>

          {/* Right 8 Columns: Interactive Verse-to-Scene Concordance */}
          <div className="lg:col-span-8 space-y-4">
            {CONCORDANCE_ENTRIES.map((entry) => {
              const isSelected = entry.id === activeConcordanceId;
              return (
                <div
                  key={entry.id}
                  onClick={() => setActiveConcordanceId(entry.id)}
                  className={`p-6 rounded-xl border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#14171D] border-[#C89D54]/70'
                      : 'bg-[#101216] border-stone-800/90 hover:border-stone-700'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs text-stone-400">
                    <span className="font-script text-[#C89D54]">{entry.tabletLines}</span>
                    <span className="font-script italic text-stone-400">
                      {entry.akkadianTransliteration}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-stone-800/80">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-stone-400 mb-2">
                        Standard Babylonian Verse
                      </p>
                      <p className="text-sm font-serif-display italic text-stone-200 leading-relaxed">
                        {entry.standardBabylonianTranslation}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-stone-400 mb-2">
                        Screenplay Adaptation
                      </p>
                      <p className="text-xs font-script text-stone-200 leading-relaxed">
                        {entry.screenplayAdaptation}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 pt-3 border-t border-stone-800/60 text-xs text-stone-400">
                    <strong className="text-stone-200 font-medium">Adaptation Note: </strong>
                    {entry.dramaticShiftNote}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clean Editorial Footer */}
      <footer className="mt-auto border-t border-stone-800/80 bg-[#07080A] py-8 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="font-serif-display text-sm text-stone-200">
              The Vigil of Gilgamesh
            </span>
            <span aria-hidden="true">·</span>
            <span>Screenplay & Cinematography Production Study</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#screenplay" className="hover:text-stone-200 transition-colors">
              Screenplay
            </a>
            <span aria-hidden="true">·</span>
            <a href="#storyboard" className="hover:text-stone-200 transition-colors">
              Storyboard
            </a>
            <span aria-hidden="true">·</span>
            <a href="#vigil-test" className="hover:text-stone-200 transition-colors">
              Vigil Trial
            </a>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleDownloadFountain}
              className="text-[#C89D54] hover:underline cursor-pointer"
            >
              Download Fountain Script
            </button>
          </div>
        </div>
      </footer>

      {/* Fullscreen High-Resolution Storyboard Lightbox Modal */}
      {activeLightboxShot && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
          onClick={() => setLightboxShotIndex(null)}
        >
          {/* Top Bar */}
          <div
            className="max-w-6xl w-full mx-auto flex items-center justify-between gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-xs text-stone-300 font-script">
              <span>{activeLightboxShot.shotCode}</span>
              <span aria-hidden="true">·</span>
              <span>{activeLightboxShot.focalLength}</span>
              <span aria-hidden="true">·</span>
              <span>{activeLightboxShot.aperture}</span>
              <span aria-hidden="true">·</span>
              <span>{activeLightboxShot.lensSeries}</span>
            </div>

            <button
              type="button"
              aria-label="Close Lightbox"
              onClick={() => setLightboxShotIndex(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-stone-200 hover:bg-stone-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
              Close (ESC)
            </button>
          </div>

          {/* Center High-Resolution Frame */}
          <div
            className="max-w-6xl w-full mx-auto my-auto py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-black aspect-video max-h-[70vh] mx-auto">
              <img
                src={activeLightboxShot.imageUrl}
                alt={activeLightboxShot.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Bottom Caption & Controls */}
          <div
            className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-t border-stone-800 pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-2xl font-serif-display text-stone-100">
                {activeLightboxShot.title}
              </h3>
              <p className="text-xs text-stone-400 mt-1 max-w-3xl">
                {activeLightboxShot.compositionNote}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setLightboxShotIndex((prev) =>
                    prev === null
                      ? 0
                      : (prev - 1 + STORYBOARD_SHOTS.length) % STORYBOARD_SHOTS.length
                  )
                }
                className="px-3.5 py-2 rounded-lg bg-stone-900 border border-stone-700 text-xs text-stone-200 hover:bg-stone-800 cursor-pointer"
              >
                Previous Frame
              </button>
              <button
                type="button"
                onClick={() =>
                  setLightboxShotIndex((prev) =>
                    prev === null ? 0 : (prev + 1) % STORYBOARD_SHOTS.length
                  )
                }
                className="px-3.5 py-2 rounded-lg bg-[#C89D54] text-[#090A0C] text-xs font-semibold hover:bg-[#d8ae66] cursor-pointer"
              >
                Next Frame
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

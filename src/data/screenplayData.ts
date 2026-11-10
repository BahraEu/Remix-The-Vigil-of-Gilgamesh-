export interface ScriptElement {
  id: string;
  type: 'slugline' | 'action' | 'dialogue' | 'transition';
  character?: 'GILGAMESH' | 'UTNAPISHTIM';
  contd?: boolean;
  parenthetical?: string;
  text: string;
}

export interface DramaticBeat {
  id: string;
  beatNumber: string;
  title: string;
  timecode: string;
  durationSec: number;
  scenePhase: 'DUSK' | 'NIGHT';
  shotId: string;
  imageUrl: string;
  cameraSpec: string;
  lightingNote: string;
  directorSubtext: string;
  soundCue: 'waves_dusk' | 'grief_whisper' | 'deluge_resonance' | 'vigil_oath' | 'night_wind' | 'slumber_fall';
  tabletVerseRef: string;
  elements: ScriptElement[];
}

export interface StoryboardShot {
  id: string;
  shotCode: string;
  title: string;
  sceneHeading: string;
  imageUrl: string;
  focalLength: string;
  aperture: string;
  lensSeries: string;
  movement: string;
  lightingRatio: string;
  colorTemp: string;
  compositionNote: string;
  featuredQuote: string;
  bentoSpan: 'hero' | 'standard' | 'wide';
}

export interface ConcordanceEntry {
  id: string;
  tabletLines: string;
  akkadianTransliteration: string;
  standardBabylonianTranslation: string;
  screenplayAdaptation: string;
  dramaticShiftNote: string;
}

export const GENERATED_IMAGES = {
  duskEstablishing: '/src/assets/images/hero_edge_of_world_dusk_1794282256578.jpg',
  gilgameshPleading: '/src/assets/images/shot_gilgamesh_pleading_1794282258053.jpg',
  utnapishtimStone: '/src/assets/images/shot_utnapishtim_stone_1794282262374.jpg',
  vigilStand: '/src/assets/images/shot_vigil_stand_1794282263949.jpg',
  sleepConquered: '/src/assets/images/shot_sleep_conquered_1794282263385.jpg',
};

export const DRAMATIC_BEATS: DramaticBeat[] = [
  {
    id: 'beat-01',
    beatNumber: '01',
    title: 'Arrival at the Waters of Death',
    timecode: '00:00 — 00:28',
    durationSec: 8,
    scenePhase: 'DUSK',
    shotId: 'SHOT 1A',
    imageUrl: GENERATED_IMAGES.duskEstablishing,
    cameraSpec: '35mm Anamorphic · T2.0 · Low Dollied Track In',
    lightingNote: 'Overcast twilight sky at 4800K; wet obsidian pebbles catching steel-gray sea reflections.',
    directorSubtext: 'Establish the physical toll of the twelve-league journey through Mount Mashu. Gilgamesh enters the frame not as a sovereign, but as an animal reduced to survival.',
    soundCue: 'waves_dusk',
    tabletVerseRef: 'Tablet XI, Lines 1–7',
    elements: [
      {
        id: 'el-1',
        type: 'slugline',
        text: 'EXT. DWELLING OF UTNAPISHTIM - EDGE OF THE WORLD - DUSK',
      },
      {
        id: 'el-2',
        type: 'action',
        text: 'Gray waves slap against black, volcanic pebbles. Mist rolls across the Waters of Death.',
      },
      {
        id: 'el-3',
        type: 'action',
        text: 'GILGAMESH (30s) stumbles onto the rocky shore. He is barely recognizable as the King of Uruk: hollow-cheeked, unwashed, clad in ragged, salt-crusted animal skins. His hands tremble with sheer physical exhaustion.',
      },
      {
        id: 'el-4',
        type: 'action',
        text: 'Sitting serenely atop a carved stone slab is UTNAPISHTIM (70s, but ageless). His eyes are calm, untroubled by time or sorrow.',
      },
    ],
  },
  {
    id: 'beat-02',
    beatNumber: '02',
    title: 'The King on His Knees',
    timecode: '00:28 — 00:54',
    durationSec: 7,
    scenePhase: 'DUSK',
    shotId: 'SHOT 1B',
    imageUrl: GENERATED_IMAGES.gilgameshPleading,
    cameraSpec: '85mm Anamorphic Close-Up · T2.4 · Handheld Subtle Tremor',
    lightingNote: 'Soft diffused top light; deep eye-socket shadows emphasizing hollow cheeks.',
    directorSubtext: 'The posture reversal is total: the two-thirds divine king kneels in wet gravel below the mortal who received eternal life.',
    soundCue: 'waves_dusk',
    tabletVerseRef: 'Tablet XI, Lines 20–34',
    elements: [
      {
        id: 'el-5',
        type: 'action',
        text: 'Gilgamesh collapses to his knees before him, chest heaving.',
      },
      {
        id: 'el-6',
        type: 'dialogue',
        character: 'GILGAMESH',
        parenthetical: '(hoarse, pleading)',
        text: 'I crossed the mountains of darkness. I fought lions with my bare hands. Tell me your secret. Tell me how you escaped the grave.',
      },
    ],
  },
  {
    id: 'beat-03',
    beatNumber: '03',
    title: 'The Question of the Immortal',
    timecode: '00:54 — 01:18',
    durationSec: 6,
    scenePhase: 'DUSK',
    shotId: 'SHOT 1C',
    imageUrl: GENERATED_IMAGES.utnapishtimStone,
    cameraSpec: '50mm Prime · T2.8 · Locked Tripod Stone Stillness',
    lightingNote: 'Cool slate backlight separating silver hair from rolling sea mist.',
    directorSubtext: 'Camera switches from handheld tremor on Gilgamesh to locked-off stillness on Utnapishtim. He does not lean forward; time has no urgency for him.',
    soundCue: 'waves_dusk',
    tabletVerseRef: 'Tablet XI, Lines 35–47',
    elements: [
      {
        id: 'el-7',
        type: 'action',
        text: 'Utnapishtim looks down at him, pity flickering in his eyes.',
      },
      {
        id: 'el-8',
        type: 'dialogue',
        character: 'UTNAPISHTIM',
        text: 'You wear the pelts of wolves, Gilgamesh, yet your eyes are full of terror. What drives a king into the waste?',
      },
    ],
  },
  {
    id: 'beat-04',
    beatNumber: '04',
    title: 'Twelve Days Beside Enkidu',
    timecode: '01:18 — 01:58',
    durationSec: 9,
    scenePhase: 'DUSK',
    shotId: 'SHOT 1D',
    imageUrl: GENERATED_IMAGES.gilgameshPleading,
    cameraSpec: '85mm Extreme Close-Up · T2.0 · Slow Push-In',
    lightingNote: 'Single specular highlight catching the tear track through caked salt and dust.',
    directorSubtext: 'The emotional core of the scene. The terror of mortality is born from visceral physical decay—the maggot falling from Enkidu’s nose.',
    soundCue: 'grief_whisper',
    tabletVerseRef: 'Tablet X, Lines 58–71 / XI',
    elements: [
      {
        id: 'el-9',
        type: 'dialogue',
        character: 'GILGAMESH',
        text: 'Enkidu. My brother. He was struck down by a sickness from the gods. For twelve agonizing days I sat beside him, holding his hand, waiting for him to wake.',
      },
      {
        id: 'el-10',
        type: 'action',
        text: "A tear cuts through the grime caked on Gilgamesh's cheek.",
      },
      {
        id: 'el-11',
        type: 'dialogue',
        character: 'GILGAMESH',
        contd: true,
        text: 'I did not let them bury him. Not until a maggot fell from his nose. Then I knew. The same dark is waiting for me. I cannot die, Utnapishtim. I will not.',
      },
    ],
  },
  {
    id: 'beat-05',
    beatNumber: '05',
    title: 'The One-Time Decree of the Deluge',
    timecode: '01:58 — 02:40',
    durationSec: 9,
    scenePhase: 'DUSK',
    shotId: 'SHOT 1E',
    imageUrl: GENERATED_IMAGES.utnapishtimStone,
    cameraSpec: '50mm Anamorphic · T2.8 · Static Two-Shot Profile',
    lightingNote: 'Horizon light drops half a stop as twilight deepens toward night.',
    directorSubtext: 'Utnapishtim dismantles the hero’s exceptionalism: immortality was not won by strength, but granted once after cosmic catastrophe.',
    soundCue: 'deluge_resonance',
    tabletVerseRef: 'Tablet XI, Lines 187–206',
    elements: [
      {
        id: 'el-12',
        type: 'dialogue',
        character: 'UTNAPISHTIM',
        parenthetical: '(shakes his head gently)',
        text: 'The gods granted me life because of the great deluge. They sought to wipe out all of mankind. I built the ark in secret, saving my house, the craftsmen, and the seed of every living beast. When the waters receded, the council wept and gave me eternal days. It was a one-time decree. Do you expect the gods to convene an assembly for you?',
      },
    ],
  },
  {
    id: 'beat-06',
    beatNumber: '06',
    title: 'Conquer Death’s Little Brother',
    timecode: '02:40 — 03:20',
    durationSec: 8,
    scenePhase: 'DUSK',
    shotId: 'SHOT 1F',
    imageUrl: GENERATED_IMAGES.duskEstablishing,
    cameraSpec: '35mm Wide · T2.4 · Low Angle on Basalt Slab',
    lightingNote: 'Cold slate reflections on wet volcanic stones; knuckles pale against black basalt.',
    directorSubtext: 'Gilgamesh still believes immortality is a martial trial he can wrestle into submission. Utnapishtim gives him the simplest, most impossible test.',
    soundCue: 'vigil_oath',
    tabletVerseRef: 'Tablet XI, Lines 207–211',
    elements: [
      {
        id: 'el-13',
        type: 'action',
        text: 'Gilgamesh grips the stones, his knuckles white.',
      },
      {
        id: 'el-14',
        type: 'dialogue',
        character: 'GILGAMESH',
        text: 'Test me. Give me any task.',
      },
      {
        id: 'el-15',
        type: 'dialogue',
        character: 'UTNAPISHTIM',
        text: 'You want to conquer death? Then first conquer death’s little brother: sleep.',
      },
      {
        id: 'el-16',
        type: 'action',
        text: 'Utnapishtim gestures to the cold, bare stone beside him.',
      },
      {
        id: 'el-17',
        type: 'dialogue',
        character: 'UTNAPISHTIM',
        contd: true,
        text: 'Do not lie down. Do not close your eyes. Stand vigil here and stay awake for seven nights.',
      },
    ],
  },
  {
    id: 'beat-07',
    beatNumber: '07',
    title: 'The Hubris of the Hero',
    timecode: '03:20 — 03:50',
    durationSec: 7,
    scenePhase: 'DUSK',
    shotId: 'SHOT 1G',
    imageUrl: GENERATED_IMAGES.vigilStand,
    cameraSpec: '24mm Wide Low Angle · T2.8 · Heroic Framing Against Sea',
    lightingNote: 'Last sliver of dusk vanishes; cold blue-silver moonlight breaks through storm clouds.',
    directorSubtext: 'A brief flash of the old King of Uruk—arrogant, defiant, planting his feet as if preparing to wrestle Humbaba or the Bull of Heaven.',
    soundCue: 'vigil_oath',
    tabletVerseRef: 'Tablet XI, Lines 212–214',
    elements: [
      {
        id: 'el-18',
        type: 'dialogue',
        character: 'GILGAMESH',
        text: 'Only seven nights? I wrestled the Bull of Heaven! I felled the Cedar Forest! Seven nights is nothing!',
      },
      {
        id: 'el-19',
        type: 'action',
        text: 'Gilgamesh plants his feet wide. He glares out at the black sea, jaw set, clenching his fists to fight the fatigue pulling at his skull.',
      },
      {
        id: 'el-20',
        type: 'dialogue',
        character: 'UTNAPISHTIM',
        text: 'Then let the vigil begin.',
      },
    ],
  },
  {
    id: 'beat-08',
    beatNumber: '08',
    title: 'Time Cut — The First Gust of Night',
    timecode: '03:50 — 04:22',
    durationSec: 8,
    scenePhase: 'NIGHT',
    shotId: 'SHOT 2A',
    imageUrl: GENERATED_IMAGES.vigilStand,
    cameraSpec: '50mm Anamorphic · T2.0 · Rack Focus from Sea Spray to Eyelids',
    lightingNote: 'Hard nocturnal moonlight at 5600K; deep obsidian shadows across the shore.',
    directorSubtext: 'The cruel irony of the TIME CUT: "MOMENTS LATER." He does not last six days; he does not even last six minutes once his body stops moving.',
    soundCue: 'night_wind',
    tabletVerseRef: 'Tablet XI, Lines 215–218',
    elements: [
      {
        id: 'el-21',
        type: 'transition',
        text: 'TIME CUT:',
      },
      {
        id: 'el-22',
        type: 'slugline',
        text: 'EXT. DWELLING OF UTNAPISHTIM - NIGHT (MOMENTS LATER)',
      },
      {
        id: 'el-23',
        type: 'action',
        text: 'Wind howls over the rocks.',
      },
      {
        id: 'el-24',
        type: 'action',
        text: 'Gilgamesh stands rigid. His eyelids flutter.',
      },
      {
        id: 'el-25',
        type: 'action',
        text: 'He blinks—once, twice. A deep, bone-crushing weariness washes over him.',
      },
    ],
  },
  {
    id: 'beat-09',
    beatNumber: '09',
    title: 'Conquered by a Single Draft of Sleep',
    timecode: '04:22 — 05:05',
    durationSec: 9,
    scenePhase: 'NIGHT',
    shotId: 'SHOT 2B',
    imageUrl: GENERATED_IMAGES.sleepConquered,
    cameraSpec: '35mm Crane High Angle · T2.2 · Slow Boom Up to Wide Shore',
    lightingNote: 'Silver moonlight rims Utnapishtim on the basalt block while Gilgamesh sinks into shadow.',
    directorSubtext: 'No music—only the wind and the slow rhythmic breathing of a mortal man finally surrendering to nature.',
    soundCue: 'slumber_fall',
    tabletVerseRef: 'Tablet XI, Lines 219–224',
    elements: [
      {
        id: 'el-26',
        type: 'action',
        text: 'His knees buckle. He hits the ground.',
      },
      {
        id: 'el-27',
        type: 'action',
        text: 'Gilgamesh rolls onto his side, his breath slowing into a deep, unconscious slumber.',
      },
      {
        id: 'el-28',
        type: 'action',
        text: 'Across the stone, Utnapishtim watches in silence. He does not look angry—only sorrowful.',
      },
      {
        id: 'el-29',
        type: 'dialogue',
        character: 'UTNAPISHTIM',
        parenthetical: '(whispering to the wind)',
        text: 'Look at the mighty hero who sought eternal life. A single draft of sleep has conquered him already.',
      },
    ],
  },
];

export const STORYBOARD_SHOTS: StoryboardShot[] = [
  {
    id: 'sb-1',
    shotCode: 'SCENE 11.04 · SHOT 1A',
    title: 'Establishing — The Shore at the Edge of the World',
    sceneHeading: 'EXT. DWELLING OF UTNAPISHTIM - DUSK',
    imageUrl: GENERATED_IMAGES.duskEstablishing,
    focalLength: '35mm Anamorphic',
    aperture: 'T2.0',
    lensSeries: 'Panavision C-Series',
    movement: 'Slow low-angle dolly track along wet volcanic shingle',
    lightingRatio: '4:1 Natural Overcast Twilight',
    colorTemp: '4600K Cool Slate',
    compositionNote: 'Asymmetric two-tier framing: Utnapishtim elevated on the cuneiform-inscribed basalt monolith at right; Gilgamesh collapsed below the horizon line against the breaking gray surf.',
    featuredQuote: 'Gray waves slap against black, volcanic pebbles. Mist rolls across the Waters of Death.',
    bentoSpan: 'hero',
  },
  {
    id: 'sb-2',
    shotCode: 'SCENE 11.04 · SHOT 1B',
    title: 'Close-Up — The Tear Through the Grime',
    sceneHeading: 'EXT. DWELLING OF UTNAPISHTIM - DUSK',
    imageUrl: GENERATED_IMAGES.gilgameshPleading,
    focalLength: '85mm Anamorphic',
    aperture: 'T2.0',
    lensSeries: 'Panavision C-Series',
    movement: 'Handheld micro-tremor matching ragged breathing',
    lightingRatio: '6:1 Chiaroscuro Dusk',
    colorTemp: '4400K Desaturated Earth',
    compositionNote: 'Shallow depth of field isolates the white knuckles gripping wet obsidian stone and the single tear cutting through salt-crusted dirt.',
    featuredQuote: 'I did not let them bury him. Not until a maggot fell from his nose. Then I knew.',
    bentoSpan: 'standard',
  },
  {
    id: 'sb-3',
    shotCode: 'SCENE 11.04 · SHOT 1C',
    title: 'Medium — The Ageless Witness of the Deluge',
    sceneHeading: 'EXT. DWELLING OF UTNAPISHTIM - DUSK',
    imageUrl: GENERATED_IMAGES.utnapishtimStone,
    focalLength: '50mm Anamorphic',
    aperture: 'T2.8',
    lensSeries: 'Panavision C-Series',
    movement: 'Locked tripod — absolute stillness',
    lightingRatio: '3:1 Diffused Sea Mist',
    colorTemp: '4800K Silver Ash',
    compositionNote: 'Centered pyramidal posture atop the carved stone slab. Rolling fog softens the horizon line, erasing the boundary between sea and sky.',
    featuredQuote: 'When the waters receded, the council wept and gave me eternal days. It was a one-time decree.',
    bentoSpan: 'standard',
  },
  {
    id: 'sb-4',
    shotCode: 'SCENE 11.04 · SHOT 1G',
    title: 'Low Angle — Defiance Against the Vigil',
    sceneHeading: 'EXT. DWELLING OF UTNAPISHTIM - DUSK / NIGHT TRANSITION',
    imageUrl: GENERATED_IMAGES.vigilStand,
    focalLength: '24mm Anamorphic',
    aperture: 'T2.8',
    lensSeries: 'Panavision C-Series',
    movement: 'Slow push-in as wind velocity rises',
    lightingRatio: '8:1 Storm Moonlight',
    colorTemp: '5400K Cold Moon',
    compositionNote: 'Wide stance echoes classical heroic statuary before the TIME CUT immediately subverts his boast with fluttering eyelids.',
    featuredQuote: 'Only seven nights? I wrestled the Bull of Heaven! I felled the Cedar Forest! Seven nights is nothing!',
    bentoSpan: 'standard',
  },
  {
    id: 'sb-5',
    shotCode: 'SCENE 11.05 · SHOT 2B',
    title: 'Nocturnal Wide — Death’s Little Brother',
    sceneHeading: 'EXT. DWELLING OF UTNAPISHTIM - NIGHT (MOMENTS LATER)',
    imageUrl: GENERATED_IMAGES.sleepConquered,
    focalLength: '35mm Anamorphic',
    aperture: 'T2.2',
    lensSeries: 'Panavision C-Series',
    movement: 'High-angle crane rise into the howling wind',
    lightingRatio: '10:1 Nocturnal Chiaroscuro',
    colorTemp: '5600K Obsidian Night',
    compositionNote: 'Mirrors the opening establishing geometry, except Gilgamesh has collapsed from kneeling supplicant to unconscious sleeper on the stones.',
    featuredQuote: 'Look at the mighty hero who sought eternal life. A single draft of sleep has conquered him already.',
    bentoSpan: 'wide',
  },
];

export const CONCORDANCE_ENTRIES: ConcordanceEntry[] = [
  {
    id: 'conc-1',
    tabletLines: 'Tablet X, ii 1–14 · Tablet XI, 1–7',
    akkadianTransliteration: 'am-mī-ni ib-ši-ma lēt-ka ud-du-da pānū-ka qal-pū',
    standardBabylonianTranslation:
      '“Why are your cheeks so hollowed, and why is your face so sunken? Why is your heart so wretched, and your features so worn? Why is there grief in your belly, and your face like one who has traveled a distant road?”',
    screenplayAdaptation:
      'GILGAMESH (30s) stumbles onto the rocky shore. He is barely recognizable as the King of Uruk: hollow-cheeked, unwashed, clad in ragged, salt-crusted animal skins. / UTNAPISHTIM: “You wear the pelts of wolves, Gilgamesh, yet your eyes are full of terror.”',
    dramaticShiftNote:
      'Translates Utnapishtim’s repetitive epic interrogation into immediate visual staging (trembling hands, salt-crusted pelts) and a single piercing question.',
  },
  {
    id: 'conc-2',
    tabletLines: 'Tablet X, ii 58–72',
    akkadianTransliteration: '6 ur-ri u 7 mu-šī eli-šu ab-ki ul ad-din-šu ana qa-ba-ri',
    standardBabylonianTranslation:
      '“Six days and seven nights I wept over him; I did not allow him to be buried until a maggot fell out of his nose. Then I was afraid in the face of death, and I roamed the wild.”',
    screenplayAdaptation:
      'GILGAMESH: “For twelve agonizing days I sat beside him, holding his hand, waiting for him to wake. I did not let them bury him. Not until a maggot fell from his nose. Then I knew. The same dark is waiting for me.”',
    dramaticShiftNote:
      'Preserves the famous visceral image from the Standard Babylonian version—the maggot falling from Enkidu’s nostril—as the turning point from grief to existential dread.',
  },
  {
    id: 'conc-3',
    tabletLines: 'Tablet XI, 197–208',
    akkadianTransliteration: 'inanna ana kāša mannu ilāni upahharakkum-ma balāṭa ša tubta’’ûutta',
    standardBabylonianTranslation:
      '“Target of the Deluge: the gods convened in assembly and granted me eternal life. Bricks were laid for that one event. Now then, for your sake, who will assemble the gods so that you may find the life you seek?”',
    screenplayAdaptation:
      'UTNAPISHTIM: “When the waters receded, the council wept and gave me eternal days. It was a one-time decree. Do you expect the gods to convene an assembly for you?”',
    dramaticShiftNote:
      'Condenses the 190-line Flood myth into a five-sentence theological verdict, maintaining forward dramatic momentum toward the Vigil test.',
  },
  {
    id: 'conc-4',
    tabletLines: 'Tablet XI, 209–220',
    akkadianTransliteration: 'gana lā tattaṣlal 6 ur-ri u 7 mu-šī ... šittu kīma imbari inappuš eli-šu',
    standardBabylonianTranslation:
      '“Come, do not sleep for six days and seven nights! As soon as Gilgamesh squatted down on his haunches, sleep like a wet fog blew over him. Utnapishtim said: Look at the young man who wanted eternal life! Sleep like a mist blows over him.”',
    screenplayAdaptation:
      'TIME CUT: EXT. DWELLING OF UTNAPISHTIM - NIGHT (MOMENTS LATER). He blinks—once, twice... His knees buckle. He hits the ground. UTNAPISHTIM: “Look at the mighty hero who sought eternal life. A single draft of sleep has conquered him already.”',
    dramaticShiftNote:
      'Uses the cinematic grammar of a sharp TIME CUT (“MOMENTS LATER”) to dramatize the ancient poem’s suddenness: sleep strikes like sea mist the instant he stops moving.',
  },
];

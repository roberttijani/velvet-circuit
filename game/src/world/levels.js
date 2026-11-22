/**
 * levels.js - Handcrafted Multi-Floor Blueprints for Velvet Circuit
 * Defines 3 progressive tactical floors: Gallery, Server Vault, and Penthouse Safe.
 */

export const LEVEL_1_GALLERY = {
  id: 1,
  name: "THE LUMINARY GALLERY",
  subtitle: "GROUND FLOOR // EXHIBITION WING",
  blueprintCode: "BLPR-SEC01-ATRIUM",
  floorType: "gallery",
  thiefStart: { x: 90, y: 390, facing: 0 },
  loot: {
    name: "THE STAR OF ALEXANDRIA",
    x: 880,
    y: 240,
    radius: 28,
    type: "diamond",
    glowColor: "#00F0FF",
    value: "$2,500,000",
    description: "Flawless 140-carat blue diamond on illuminated obsidian plinth"
  },
  extraction: {
    name: "EXFIL TRANSIT CAR",
    x: 1200,
    y: 360,
    w: 60,
    h: 80
  },
  rooms: [
    { name: "RECEPTION FOYER", x: 40, y: 300, w: 220, h: 150, tag: "R-01" },
    { name: "CLASSICAL WING", x: 40, y: 40, w: 320, h: 240, tag: "R-02" },
    { name: "CENTRAL ROTUNDA", x: 380, y: 40, w: 460, h: 410, tag: "R-03" },
    { name: "SECURITY ANTECHAMBER", x: 860, y: 40, w: 380, h: 160, tag: "R-04" },
    { name: "VIP GEM VAULT", x: 860, y: 220, w: 280, h: 230, tag: "R-05" },
    { name: "EAST LOADING DOCK", x: 1160, y: 220, w: 100, h: 230, tag: "R-06" }
  ],
  walls: [
    // Outer perimeter
    { x1: 30, y1: 30, x2: 1250, y2: 30 },
    { x1: 1250, y1: 30, x2: 1250, y2: 450 },
    { x1: 1250, y1: 450, x2: 30, y2: 450 },
    { x1: 30, y1: 450, x2: 30, y2: 30 },

    // Interior partitions with door openings
    // Foyer to Classical Wing (x=30..260, y=290)
    { x1: 30, y1: 290, x2: 130, y2: 290 },
    { x1: 190, y1: 290, x2: 370, y2: 290 },

    // Classical Wing to Rotunda (x=370, y=30..450)
    { x1: 370, y1: 30, x2: 370, y2: 140 },
    { x1: 370, y1: 200, x2: 370, y2: 330 },
    { x1: 370, y1: 390, x2: 370, y2: 450 },

    // Rotunda to Gem Vault / Antechamber (x=850, y=30..450)
    { x1: 850, y1: 30, x2: 850, y2: 120 },
    { x1: 850, y1: 170, x2: 850, y2: 320 },
    { x1: 850, y1: 380, x2: 850, y2: 450 },

    // Divider between Antechamber and Gem Vault (y=210)
    { x1: 850, y1: 210, x2: 970, y2: 210 },
    { x1: 1030, y1: 210, x2: 1150, y2: 210 },

    // Gem Vault to East Dock (x=1150, y=210..450)
    { x1: 1150, y1: 210, x2: 1150, y2: 330 },
    { x1: 1150, y1: 390, x2: 1150, y2: 450 }
  ],
  furniture: [
    // Classical Wing statues/plinths
    { type: "plinth", x: 120, y: 110, w: 40, h: 40, label: "MARBLE BUST" },
    { type: "plinth", x: 250, y: 110, w: 40, h: 40, label: "BRONZE VASE" },
    { type: "vitrine", x: 180, y: 200, w: 70, h: 36, label: "RELIC CASE" },

    // Central Rotunda display cases & columns
    { type: "column", x: 470, y: 130, w: 40, h: 40, label: "CORINTHIAN COL" },
    { type: "column", x: 730, y: 130, w: 40, h: 40, label: "CORINTHIAN COL" },
    { type: "column", x: 470, y: 350, w: 40, h: 40, label: "CORINTHIAN COL" },
    { type: "column", x: 730, y: 350, w: 40, h: 40, label: "CORINTHIAN COL" },
    { type: "vitrine", x: 570, y: 220, w: 80, h: 40, label: "GOLDEN CROWN" },

    // Security Antechamber desk
    { type: "desk", x: 930, y: 100, w: 80, h: 40, label: "GUARD CONSOLE" },

    // VIP Gem Vault central plinth (holds loot)
    { type: "loot_pedestal", x: 860, y: 220, w: 40, h: 40, label: "STAR VITRINE" }
  ],
  lasers: [
    // Corridors protected by cycling laser tripwires
    {
      id: "L1",
      x1: 850,
      y1: 120,
      x2: 850,
      y2: 170,
      period: 3.5,
      duty: 0.6,
      phase: 0.0,
      color: "#FF003C"
    },
    {
      id: "L2",
      x1: 1150,
      y1: 330,
      x2: 1150,
      y2: 390,
      period: 4.0,
      duty: 0.55,
      phase: 1.5,
      color: "#FF003C"
    }
  ],
  terminals: [
    {
      id: "TERM_1",
      x: 950,
      y: 80,
      label: "LASER OVERRIDE",
      type: "laser_override",
      hacked: false,
      hackTime: 1.2
    }
  ],
  cameras: [
    {
      id: "CAM_1",
      x: 370,
      y: 40,
      mountAngle: Math.PI * 0.75, // pointing down-left into classical wing
      sweepAngle: 1.0,
      sweepSpeed: 0.8,
      range: 220,
      fov: 0.85
    },
    {
      id: "CAM_2",
      x: 850,
      y: 440,
      mountAngle: -Math.PI * 0.75, // pointing up-left into rotunda
      sweepAngle: 1.2,
      sweepSpeed: 0.7,
      range: 240,
      fov: 0.8
    }
  ],
  guards: [
    {
      id: "G1",
      name: "Sentry Vance",
      x: 300,
      y: 180,
      speed: 65,
      viewDist: 210,
      fov: 1.25,
      facing: 0,
      patrol: [
        { x: 300, y: 180, wait: 2.0 },
        { x: 140, y: 180, wait: 1.8 },
        { x: 140, y: 80, wait: 1.5 },
        { x: 300, y: 80, wait: 1.5 }
      ]
    },
    {
      id: "G2",
      name: "Sentry Blake",
      x: 600,
      y: 330,
      speed: 70,
      viewDist: 220,
      fov: 1.25,
      facing: Math.PI,
      patrol: [
        { x: 600, y: 330, wait: 1.5 },
        { x: 740, y: 330, wait: 1.5 },
        { x: 740, y: 150, wait: 1.8 },
        { x: 600, y: 150, wait: 1.5 }
      ]
    }
  ]
};

export const LEVEL_2_SERVER_VAULT = {
  id: 2,
  name: "THE OBSIDIAN MAINFRAME",
  subtitle: "SUB-LEVEL B2 // DATA REPOSITORY",
  blueprintCode: "BLPR-SEC02-MAINFRAME",
  floorType: "server",
  thiefStart: { x: 80, y: 80, facing: 0 },
  loot: {
    name: "QUANTUM CRYPTO CIPHER",
    x: 1040,
    y: 240,
    radius: 28,
    type: "cube",
    glowColor: "#00F0FF",
    value: "$10,000,000",
    description: "Cold-storage optical crystal holding sovereign bank encryption keys"
  },
  extraction: {
    name: "VENT CHUTE EXFIL",
    x: 80,
    y: 390,
    w: 60,
    h: 50
  },
  rooms: [
    { name: "ACCESS CORRIDOR", x: 40, y: 40, w: 200, h: 400, tag: "S-01" },
    { name: "SERVER RACK ARRAY NORTH", x: 260, y: 40, w: 400, h: 180, tag: "S-02" },
    { name: "SERVER RACK ARRAY SOUTH", x: 260, y: 240, w: 400, h: 200, tag: "S-03" },
    { name: "OPTICAL INTERFACE LAB", x: 680, y: 40, w: 280, h: 400, tag: "S-04" },
    { name: "PRIMARY CRYPTO CORE", x: 980, y: 120, w: 260, h: 250, tag: "S-05" }
  ],
  walls: [
    // Outer perimeter
    { x1: 30, y1: 30, x2: 1250, y2: 30 },
    { x1: 1250, y1: 30, x2: 1250, y2: 450 },
    { x1: 1250, y1: 450, x2: 30, y2: 450 },
    { x1: 30, y1: 450, x2: 30, y2: 30 },

    // Access Corridor to Server Banks (x=240)
    { x1: 240, y1: 30, x2: 240, y2: 130 },
    { x1: 240, y1: 190, x2: 240, y2: 310 },
    { x1: 240, y1: 370, x2: 240, y2: 450 },

    // Divider between North & South Server Array (y=230)
    { x1: 240, y1: 230, x2: 440, y2: 230 },
    { x1: 500, y1: 230, x2: 670, y2: 230 },

    // Server Arrays to Optical Lab (x=670)
    { x1: 670, y1: 30, x2: 670, y2: 120 },
    { x1: 670, y1: 180, x2: 670, y2: 320 },
    { x1: 670, y1: 380, x2: 670, y2: 450 },

    // Optical Lab to Crypto Core (x=970)
    { x1: 970, y1: 110, x2: 1250, y2: 110 },
    { x1: 970, y1: 110, x2: 970, y2: 200 },
    { x1: 970, y1: 260, x2: 970, y2: 380 },
    { x1: 970, y1: 380, x2: 1250, y2: 380 }
  ],
  furniture: [
    // North Server Racks
    { type: "server", x: 310, y: 80, w: 90, h: 35, label: "RACK N-01" },
    { type: "server", x: 460, y: 80, w: 90, h: 35, label: "RACK N-02" },
    { type: "server", x: 310, y: 150, w: 90, h: 35, label: "RACK N-03" },
    { type: "server", x: 460, y: 150, w: 90, h: 35, label: "RACK N-04" },

    // South Server Racks
    { type: "server", x: 310, y: 290, w: 90, h: 35, label: "RACK S-01" },
    { type: "server", x: 460, y: 290, w: 90, h: 35, label: "RACK S-02" },
    { type: "server", x: 310, y: 360, w: 90, h: 35, label: "RACK S-03" },
    { type: "server", x: 460, y: 360, w: 90, h: 35, label: "RACK S-04" },

    // Optical Lab Terminals
    { type: "desk", x: 740, y: 120, w: 80, h: 40, label: "DIAGNOSTIC RIG" },
    { type: "desk", x: 740, y: 310, w: 80, h: 40, label: "MAINFRAME TERMINAL" },

    // Core Plinth
    { type: "loot_pedestal", x: 1040, y: 240, w: 44, h: 44, label: "CRYPTO CRADLE" }
  ],
  lasers: [
    // Dual crossing laser corridors
    {
      id: "L2_1",
      x1: 670,
      y1: 120,
      x2: 670,
      y2: 180,
      period: 3.0,
      duty: 0.65,
      phase: 0.0,
      color: "#FF003C"
    },
    {
      id: "L2_2",
      x1: 970,
      y1: 200,
      x2: 970,
      y2: 260,
      period: 3.2,
      duty: 0.7,
      phase: 1.2,
      color: "#FF003C"
    },
    {
      id: "L2_3",
      x1: 720,
      y1: 230,
      x2: 860,
      y2: 230,
      period: 4.0,
      duty: 0.5,
      phase: 0.5,
      color: "#FF003C"
    }
  ],
  terminals: [
    {
      id: "TERM_2A",
      x: 750,
      y: 90,
      label: "SECURITY GATE BYPASS",
      type: "door_release",
      hacked: false,
      hackTime: 1.5
    }
  ],
  cameras: [
    {
      id: "CAM_2A",
      x: 240,
      y: 40,
      mountAngle: Math.PI * 0.25,
      sweepAngle: 1.1,
      sweepSpeed: 0.9,
      range: 230,
      fov: 0.8
    },
    {
      id: "CAM_2B",
      x: 670,
      y: 440,
      mountAngle: -Math.PI * 0.25,
      sweepAngle: 1.2,
      sweepSpeed: 0.85,
      range: 240,
      fov: 0.85
    },
    {
      id: "CAM_2C",
      x: 1240,
      y: 120,
      mountAngle: Math.PI,
      sweepAngle: 0.9,
      sweepSpeed: 1.0,
      range: 230,
      fov: 0.75
    }
  ],
  guards: [
    {
      id: "G2_1",
      name: "Enforcer Thorne",
      x: 580,
      y: 120,
      speed: 75,
      viewDist: 220,
      fov: 1.3,
      facing: 0,
      patrol: [
        { x: 580, y: 120, wait: 1.5 },
        { x: 280, y: 120, wait: 2.0 },
        { x: 280, y: 200, wait: 1.2 },
        { x: 580, y: 200, wait: 1.5 }
      ]
    },
    {
      id: "G2_2",
      name: "Enforcer Cross",
      x: 380,
      y: 330,
      speed: 70,
      viewDist: 220,
      fov: 1.3,
      facing: Math.PI,
      patrol: [
        { x: 380, y: 330, wait: 1.6 },
        { x: 580, y: 330, wait: 1.8 },
        { x: 580, y: 410, wait: 1.4 },
        { x: 380, y: 410, wait: 1.5 }
      ]
    },
    {
      id: "G2_3",
      name: "Patrol Mercer",
      x: 820,
      y: 350,
      speed: 80,
      viewDist: 230,
      fov: 1.35,
      facing: -Math.PI * 0.5,
      patrol: [
        { x: 820, y: 350, wait: 2.0 },
        { x: 820, y: 150, wait: 2.0 },
        { x: 920, y: 150, wait: 1.5 },
        { x: 920, y: 350, wait: 1.5 }
      ]
    }
  ]
};

export const LEVEL_3_PENTHOUSE_SAFE = {
  id: 3,
  name: "THE SOVEREIGN SANCTUM",
  subtitle: "PENTHOUSE LEVEL 88 // EXECUTIVE SAFE",
  blueprintCode: "BLPR-SEC03-SANCTUM",
  floorType: "penthouse",
  thiefStart: { x: 80, y: 240, facing: 0 },
  loot: {
    name: "THE SOVEREIGN LEDGER & BULLION",
    x: 1070,
    y: 240,
    radius: 32,
    type: "safe",
    glowColor: "#FFD700",
    value: "$50,000,000",
    description: "Multi-ton titanium biometric vault storing the syndicate bearer bonds"
  },
  extraction: {
    name: "ROOFTOP SKY-CRANE",
    x: 70,
    y: 370,
    w: 70,
    h: 60
  },
  rooms: [
    { name: "SKY BRIDGE ANTECHAMBER", x: 40, y: 120, w: 200, h: 240, tag: "P-01" },
    { name: "GRAND MEZZANINE SUITE", x: 260, y: 40, w: 440, h: 400, tag: "P-02" },
    { name: "EXECUTIVE BOARDROOM", x: 720, y: 40, w: 240, h: 200, tag: "P-03" },
    { name: "HIGH-VOLTAGE INTERLOCK", x: 720, y: 260, w: 240, h: 180, tag: "P-04" },
    { name: "MASTER TITANIUM SAFE", x: 980, y: 90, w: 260, h: 300, tag: "P-05" }
  ],
  walls: [
    // Outer perimeter
    { x1: 30, y1: 30, x2: 1250, y2: 30 },
    { x1: 1250, y1: 30, x2: 1250, y2: 450 },
    { x1: 1250, y1: 450, x2: 30, y2: 450 },
    { x1: 30, y1: 450, x2: 30, y2: 30 },

    // Skybridge to Mezzanine (x=240)
    { x1: 240, y1: 30, x2: 240, y2: 180 },
    { x1: 240, y1: 290, x2: 240, y2: 450 },

    // Mezzanine to Boardroom & Interlock (x=710)
    { x1: 710, y1: 30, x2: 710, y2: 130 },
    { x1: 710, y1: 190, x2: 710, y2: 290 },
    { x1: 710, y1: 350, x2: 710, y2: 450 },

    // Divider between Boardroom & Interlock (y=250)
    { x1: 710, y1: 250, x2: 810, y2: 250 },
    { x1: 870, y1: 250, x2: 970, y2: 250 },

    // Vault wall & blast doors (x=970)
    { x1: 970, y1: 30, x2: 970, y2: 190 },
    { x1: 970, y1: 290, x2: 970, y2: 450 }
  ],
  furniture: [
    // Mezzanine luxury furniture & decorative columns
    { type: "column", x: 380, y: 120, w: 42, h: 42, label: "MARBLE COLUMN" },
    { type: "column", x: 580, y: 120, w: 42, h: 42, label: "MARBLE COLUMN" },
    { type: "column", x: 380, y: 340, w: 42, h: 42, label: "MARBLE COLUMN" },
    { type: "column", x: 580, y: 340, w: 42, h: 42, label: "MARBLE COLUMN" },
    { type: "desk", x: 450, y: 220, w: 100, h: 46, label: "GLASS LOUNGE" },

    // Boardroom table
    { type: "desk", x: 770, y: 100, w: 120, h: 50, label: "MAHOGANY TABLE" },

    // Master Safe Door Frame
    { type: "loot_pedestal", x: 1070, y: 240, w: 60, h: 60, label: "TITANIUM VAULT" }
  ],
  lasers: [
    // Multiple synchronized security laser sweeps
    {
      id: "L3_1",
      x1: 710,
      y1: 130,
      x2: 710,
      y2: 190,
      period: 2.8,
      duty: 0.65,
      phase: 0.0,
      color: "#FF003C"
    },
    {
      id: "L3_2",
      x1: 710,
      y1: 290,
      x2: 710,
      y2: 350,
      period: 2.8,
      duty: 0.65,
      phase: 1.4,
      color: "#FF003C"
    },
    {
      id: "L3_3",
      x1: 970,
      y1: 190,
      x2: 970,
      y2: 290,
      period: 3.5,
      duty: 0.75,
      phase: 0.7,
      color: "#FF003C"
    }
  ],
  terminals: [
    {
      id: "TERM_3A",
      x: 820,
      y: 70,
      label: "CIPHER OVERRIDE CONSOLE",
      type: "laser_override",
      hacked: false,
      hackTime: 1.8
    }
  ],
  cameras: [
    {
      id: "CAM_3A",
      x: 240,
      y: 40,
      mountAngle: Math.PI * 0.35,
      sweepAngle: 1.2,
      sweepSpeed: 0.9,
      range: 240,
      fov: 0.85
    },
    {
      id: "CAM_3B",
      x: 710,
      y: 440,
      mountAngle: -Math.PI * 0.6,
      sweepAngle: 1.3,
      sweepSpeed: 0.8,
      range: 250,
      fov: 0.8
    },
    {
      id: "CAM_3C",
      x: 1240,
      y: 40,
      mountAngle: Math.PI * 0.85,
      sweepAngle: 1.1,
      sweepSpeed: 0.95,
      range: 260,
      fov: 0.85
    }
  ],
  guards: [
    {
      id: "G3_1",
      name: "Elite Cmdr Kane",
      x: 320,
      y: 160,
      speed: 80,
      viewDist: 230,
      fov: 1.3,
      facing: 0,
      patrol: [
        { x: 320, y: 160, wait: 1.5 },
        { x: 640, y: 160, wait: 1.5 },
        { x: 640, y: 310, wait: 1.5 },
        { x: 320, y: 310, wait: 1.5 }
      ]
    },
    {
      id: "G3_2",
      name: "Elite Guard Sterling",
      x: 840,
      y: 180,
      speed: 85,
      viewDist: 240,
      fov: 1.3,
      facing: -Math.PI * 0.5,
      patrol: [
        { x: 840, y: 180, wait: 1.5 },
        { x: 840, y: 360, wait: 1.8 },
        { x: 760, y: 360, wait: 1.4 },
        { x: 760, y: 180, wait: 1.5 }
      ]
    },
    {
      id: "G3_3",
      name: "Vault Enforcer Ramos",
      x: 1120,
      y: 160,
      speed: 75,
      viewDist: 230,
      fov: 1.3,
      facing: Math.PI,
      patrol: [
        { x: 1120, y: 160, wait: 2.0 },
        { x: 1120, y: 320, wait: 2.0 }
      ]
    }
  ]
};

export const HEIST_LEVELS = [
  LEVEL_1_GALLERY,
  LEVEL_2_SERVER_VAULT,
  LEVEL_3_PENTHOUSE_SAFE
];

/**
 * levels.js - Handcrafted Multi-Floor Blueprints for Velvet Circuit (v3)
 * Features 3 progressive tactical floors: The Luminary Gallery, The Obsidian Mainframe,
 * and The Sovereign Sanctum. Clamped strictly within safe viewport margins (40..1240, 44..448),
 * with non-overlapping terminal and exfil coordinates.
 */

export const LEVEL_1_GALLERY = {
  id: 1,
  name: "THE LUMINARY GALLERY",
  subtitle: "GROUND FLOOR // EXHIBITION WING",
  blueprintCode: "BLPR-SEC01-ATRIUM",
  floorType: "gallery",
  lootValue: "$140,000,000",
  artworks: [
    { x: 215, y: 46, w: 42, h: 18, palette: ["#1E293B", "#F59E0B", "#0284C7"] },
    { x: 280, y: 46, w: 42, h: 18, palette: ["#0F172A", "#10B981", "#E2E8F0"] },
    { x: 590, y: 46, w: 50, h: 18, palette: ["#1E1B4B", "#EC4899", "#818CF8"] },
    { x: 740, y: 46, w: 50, h: 18, palette: ["#14532D", "#FDE047", "#38BDF8"] }
  ],
  thiefStart: { x: 100, y: 380, facing: 0 },
  loot: {
    name: "THE STAR OF ALEXANDRIA",
    x: 980,
    y: 335,
    radius: 26,
    type: "diamond",
    glowColor: "#00F0FF",
    value: "$2,500,000",
    description: "Flawless 140-carat blue diamond on illuminated obsidian plinth"
  },
  extraction: {
    name: "EXFIL TRANSIT CAR",
    x: 1140,
    y: 340,
    w: 80,
    h: 88
  },
  rooms: [
    { name: "RECEPTION FOYER", x: 44, y: 280, w: 236, h: 164, tag: "R-01" },
    { name: "CLASSICAL WING", x: 44, y: 48, w: 316, h: 224, tag: "R-02" },
    { name: "CENTRAL ROTUNDA", x: 368, y: 48, w: 472, h: 396, tag: "R-03" },
    { name: "SECURITY ANTECHAMBER", x: 848, y: 48, w: 264, h: 172, tag: "R-04" },
    { name: "VIP GEM VAULT", x: 848, y: 228, w: 264, h: 216, tag: "R-05" },
    { name: "EXFIL", x: 1120, y: 48, w: 116, h: 396, tag: "R-06" }
  ],
  walls: [
    { x1: 40, y1: 44, x2: 1240, y2: 44 },
    { x1: 1240, y1: 44, x2: 1240, y2: 448 },
    { x1: 1240, y1: 448, x2: 40, y2: 448 },
    { x1: 40, y1: 448, x2: 40, y2: 44 },

    { x1: 40, y1: 276, x2: 130, y2: 276 },
    { x1: 190, y1: 276, x2: 364, y2: 276 },

    { x1: 364, y1: 44, x2: 364, y2: 140 },
    { x1: 364, y1: 200, x2: 364, y2: 330 },
    { x1: 364, y1: 390, x2: 364, y2: 448 },

    { x1: 844, y1: 44, x2: 844, y2: 120 },
    { x1: 844, y1: 170, x2: 844, y2: 320 },
    { x1: 844, y1: 380, x2: 844, y2: 448 },

    { x1: 844, y1: 224, x2: 950, y2: 224 },
    { x1: 1010, y1: 224, x2: 1116, y2: 224 },

    { x1: 1116, y1: 44, x2: 1116, y2: 330 },
    { x1: 1116, y1: 390, x2: 1116, y2: 448 }
  ],
  carpetRunners: [
    { x: 374, y: 228, w: 460, h: 36, color: "rgba(120, 15, 30, 0.55)" },
    { x: 586, y: 56, w: 36, h: 380, color: "rgba(120, 15, 30, 0.55)" },
    { x: 852, y: 325, w: 256, h: 36, color: "rgba(120, 15, 30, 0.65)" }
  ],
  furniture: [
    { type: "plinth", x: 120, y: 110, w: 36, h: 36, label: "MARBLE BUST" },
    { type: "plinth", x: 260, y: 110, w: 36, h: 36, label: "BRONZE VASE" },
    { type: "vitrine", x: 170, y: 195, w: 76, h: 34, label: "RELIC CASE" },

    { type: "column", x: 470, y: 125, w: 38, h: 38, label: "CORINTHIAN COL" },
    { type: "column", x: 700, y: 125, w: 38, h: 38, label: "CORINTHIAN COL" },
    { type: "column", x: 470, y: 330, w: 38, h: 38, label: "CORINTHIAN COL" },
    { type: "column", x: 700, y: 330, w: 38, h: 38, label: "CORINTHIAN COL" },
    { type: "vitrine", x: 565, y: 222, w: 78, h: 36, label: "GOLDEN CROWN" },

    { type: "desk", x: 920, y: 95, w: 76, h: 36, label: "SECURITY DESK" },
    { type: "loot_pedestal", x: 960, y: 315, w: 40, h: 40, label: "STAR VITRINE" }
  ],
  lasers: [
    {
      id: "L1",
      x1: 844,
      y1: 120,
      x2: 844,
      y2: 170,
      period: 3.5,
      duty: 0.6,
      phase: 0.0,
      color: "#FF003C"
    },
    {
      id: "L2",
      x1: 1116,
      y1: 330,
      x2: 1116,
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
      x: 940,
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
      x: 372,
      y: 88,
      mountAngle: Math.PI * 0.35,
      sweepAngle: 1.0,
      sweepSpeed: 0.8,
      range: 240,
      fov: 0.85
    },
    {
      id: "CAM_2",
      x: 836,
      y: 436,
      mountAngle: -Math.PI * 0.70,
      sweepAngle: 1.1,
      sweepSpeed: 0.7,
      range: 240,
      fov: 0.82
    }
  ],
  guards: [
    {
      id: "G1",
      name: "Sentry Vance",
      x: 290,
      y: 175,
      speed: 65,
      viewDist: 210,
      fov: 1.25,
      facing: 0,
      patrol: [
        { x: 290, y: 175, wait: 2.0 },
        { x: 130, y: 175, wait: 1.8 },
        { x: 130, y: 80, wait: 1.5 },
        { x: 290, y: 80, wait: 1.5 }
      ]
    },
    {
      id: "G2",
      name: "Sentry Blake",
      x: 600,
      y: 330,
      speed: 70,
      viewDist: 215,
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
  lootValue: "$85,000,000",
  thiefStart: { x: 90, y: 90, facing: 0 },
  loot: {
    name: "QUANTUM CRYPTO CIPHER",
    x: 1080,
    y: 245,
    radius: 26,
    type: "cube",
    glowColor: "#00F0FF",
    value: "$10,000,000",
    description: "Cold-storage optical crystal holding sovereign bank encryption keys"
  },
  extraction: {
    name: "VENT CHUTE EXFIL",
    x: 65,
    y: 360,
    w: 75,
    h: 70
  },
  rooms: [
    { name: "ACCESS CORRIDOR", x: 44, y: 48, w: 196, h: 396, tag: "S-01" },
    { name: "SERVER RACK NORTH", x: 248, y: 48, w: 412, h: 180, tag: "S-02" },
    { name: "SERVER RACK SOUTH", x: 248, y: 236, w: 412, h: 208, tag: "S-03" },
    { name: "OPTICAL INTERFACE LAB", x: 668, y: 48, w: 292, h: 396, tag: "S-04" },
    { name: "PRIMARY CRYPTO CORE", x: 968, y: 120, w: 268, h: 250, tag: "S-05" }
  ],
  walls: [
    { x1: 40, y1: 44, x2: 1240, y2: 44 },
    { x1: 1240, y1: 44, x2: 1240, y2: 448 },
    { x1: 1240, y1: 448, x2: 40, y2: 448 },
    { x1: 40, y1: 448, x2: 40, y2: 44 },

    { x1: 244, y1: 44, x2: 244, y2: 140 },
    { x1: 244, y1: 200, x2: 244, y2: 300 },
    { x1: 244, y1: 360, x2: 244, y2: 448 },

    { x1: 244, y1: 232, x2: 440, y2: 232 },
    { x1: 500, y1: 232, x2: 664, y2: 232 },

    { x1: 664, y1: 44, x2: 664, y2: 130 },
    { x1: 664, y1: 190, x2: 664, y2: 310 },
    { x1: 664, y1: 370, x2: 664, y2: 448 },

    { x1: 964, y1: 116, x2: 1240, y2: 116 },
    { x1: 964, y1: 116, x2: 964, y2: 200 },
    { x1: 964, y1: 260, x2: 964, y2: 374 },
    { x1: 964, y1: 374, x2: 1240, y2: 374 }
  ],
  conduits: [
    { x1: 244, y1: 170, x2: 664, y2: 170 },
    { x1: 470, y1: 50, x2: 470, y2: 440 },
    { x1: 664, y1: 250, x2: 964, y2: 250 }
  ],
  furniture: [
    { type: "server", x: 300, y: 75, w: 90, h: 34, label: "RACK N-01" },
    { type: "server", x: 450, y: 75, w: 90, h: 34, label: "RACK N-02" },
    { type: "server", x: 300, y: 145, w: 90, h: 34, label: "RACK N-03" },
    { type: "server", x: 450, y: 145, w: 90, h: 34, label: "RACK N-04" },

    { type: "server", x: 300, y: 280, w: 90, h: 34, label: "RACK S-01" },
    { type: "server", x: 450, y: 280, w: 90, h: 34, label: "RACK S-02" },
    { type: "server", x: 300, y: 350, w: 90, h: 34, label: "RACK S-03" },
    { type: "server", x: 450, y: 350, w: 90, h: 34, label: "RACK S-04" },

    { type: "desk", x: 740, y: 110, w: 76, h: 36, label: "DIAGNOSTIC RIG" },
    { type: "desk", x: 740, y: 310, w: 76, h: 36, label: "CONSOLE S-04" },

    { type: "loot_pedestal", x: 1060, y: 225, w: 40, h: 40, label: "CRYPTO CRADLE" }
  ],
  lasers: [
    {
      id: "L2_1",
      x1: 664,
      y1: 130,
      x2: 664,
      y2: 190,
      period: 3.0,
      duty: 0.65,
      phase: 0.0,
      color: "#FF003C"
    },
    {
      id: "L2_2",
      x1: 964,
      y1: 200,
      x2: 964,
      y2: 260,
      period: 3.2,
      duty: 0.7,
      phase: 1.2,
      color: "#FF003C"
    }
  ],
  terminals: [
    {
      id: "TERM_2A",
      x: 750,
      y: 85,
      label: "GATE BYPASS",
      type: "door_release",
      hacked: false,
      hackTime: 1.5
    }
  ],
  cameras: [
    {
      id: "CAM_2A",
      x: 252,
      y: 150,
      mountAngle: Math.PI * 0.25,
      sweepAngle: 1.0,
      sweepSpeed: 0.9,
      range: 230,
      fov: 0.8
    },
    {
      id: "CAM_2B",
      x: 656,
      y: 434,
      mountAngle: -Math.PI * 0.28,
      sweepAngle: 1.1,
      sweepSpeed: 0.85,
      range: 230,
      fov: 0.85
    },
    {
      id: "CAM_2C",
      x: 1230,
      y: 126,
      mountAngle: Math.PI,
      sweepAngle: 0.9,
      sweepSpeed: 1.0,
      range: 220,
      fov: 0.75
    }
  ],
  guards: [
    {
      id: "G2_1",
      name: "Enforcer Thorne",
      x: 560,
      y: 110,
      speed: 75,
      viewDist: 215,
      fov: 1.3,
      facing: 0,
      patrol: [
        { x: 560, y: 110, wait: 1.5 },
        { x: 270, y: 110, wait: 2.0 },
        { x: 270, y: 195, wait: 1.2 },
        { x: 560, y: 195, wait: 1.5 }
      ]
    },
    {
      id: "G2_2",
      name: "Enforcer Cross",
      x: 370,
      y: 320,
      speed: 70,
      viewDist: 215,
      fov: 1.3,
      facing: Math.PI,
      patrol: [
        { x: 370, y: 320, wait: 1.6 },
        { x: 570, y: 320, wait: 1.8 },
        { x: 570, y: 405, wait: 1.4 },
        { x: 370, y: 405, wait: 1.5 }
      ]
    },
    {
      id: "G2_3",
      name: "Patrol Mercer",
      x: 810,
      y: 260,
      speed: 80,
      viewDist: 225,
      fov: 1.35,
      facing: -Math.PI * 0.70, // facing open room, not the desk!
      patrol: [
        { x: 810, y: 260, wait: 2.0 },
        { x: 810, y: 140, wait: 2.0 },
        { x: 910, y: 140, wait: 1.5 },
        { x: 910, y: 340, wait: 1.5 }
      ]
    }
  ]
};

export const LEVEL_3_PENTHOUSE_SAFE = {
  id: 3,
  name: "THE SOVEREIGN SANCTUM",
  subtitle: "PENTHOUSE LVL 88 //",
  blueprintCode: "BLPR-SEC03-SANCTUM",
  floorType: "penthouse",
  lootValue: "$62,500,000",
  vaultDoor: { x: 960, y: 240, radius: 26 },
  thiefStart: { x: 90, y: 240, facing: 0 },
  loot: {
    name: "SOVEREIGN LEDGER & BULLION",
    x: 1080,
    y: 245,
    radius: 30,
    type: "safe",
    glowColor: "#FFD700",
    value: "$50,000,000",
    description: "Multi-ton titanium biometric vault storing the syndicate bearer bonds"
  },
  extraction: {
    name: "ROOFTOP SKY-CRANE",
    x: 65,
    y: 350,
    w: 80,
    h: 80
  },
  rooms: [
    { name: "SKY BRIDGE FOYER", x: 44, y: 110, w: 196, h: 260, tag: "P-01" },
    { name: "GRAND MEZZANINE SUITE", x: 248, y: 48, w: 452, h: 396, tag: "P-02" },
    { name: "EXECUTIVE BOARDROOM", x: 708, y: 48, w: 248, h: 196, tag: "P-03" },
    { name: "HIGH-VOLTAGE INTERLOCK", x: 708, y: 252, w: 248, h: 192, tag: "P-04" },
    { name: "TITANIUM MASTER VAULT", x: 964, y: 90, w: 272, h: 300, tag: "P-05" }
  ],
  walls: [
    { x1: 40, y1: 44, x2: 1240, y2: 44 },
    { x1: 1240, y1: 44, x2: 1240, y2: 448 },
    { x1: 1240, y1: 448, x2: 40, y2: 448 },
    { x1: 40, y1: 448, x2: 40, y2: 44 },

    { x1: 244, y1: 44, x2: 244, y2: 180 },
    { x1: 244, y1: 290, x2: 244, y2: 448 },

    { x1: 704, y1: 44, x2: 704, y2: 130 },
    { x1: 704, y1: 190, x2: 704, y2: 290 },
    { x1: 704, y1: 350, x2: 704, y2: 448 },

    { x1: 704, y1: 248, x2: 800, y2: 248 },
    { x1: 860, y1: 248, x2: 960, y2: 248 },

    { x1: 960, y1: 44, x2: 960, y2: 185 },
    { x1: 960, y1: 295, x2: 960, y2: 448 }
  ],
  furniture: [
    { type: "column", x: 370, y: 120, w: 40, h: 40, label: "MARBLE COLUMN" },
    { type: "column", x: 570, y: 120, w: 40, h: 40, label: "MARBLE COLUMN" },
    { type: "column", x: 370, y: 330, w: 40, h: 40, label: "MARBLE COLUMN" },
    { type: "column", x: 570, y: 330, w: 40, h: 40, label: "MARBLE COLUMN" },
    { type: "desk", x: 440, y: 220, w: 96, h: 44, label: "GLASS LOUNGE" },

    { type: "desk", x: 760, y: 130, w: 110, h: 48, label: "BOARD TABLE" },
    { type: "loot_pedestal", x: 1060, y: 225, w: 50, h: 50, label: "SAFE LOCK" }
  ],
  lasers: [
    {
      id: "L3_1",
      x1: 704,
      y1: 130,
      x2: 704,
      y2: 190,
      period: 2.8,
      duty: 0.65,
      phase: 0.0,
      color: "#FF003C"
    },
    {
      id: "L3_2",
      x1: 704,
      y1: 290,
      x2: 704,
      y2: 350,
      period: 2.8,
      duty: 0.65,
      phase: 1.4,
      color: "#FF003C"
    },
    {
      id: "L3_3",
      x1: 960,
      y1: 185,
      x2: 960,
      y2: 295,
      period: 3.5,
      duty: 0.75,
      phase: 0.7,
      color: "#FF003C"
    }
  ],
  terminals: [
    {
      id: "TERM_3A",
      x: 810,
      y: 96, // shifted down from y:70 so it never overlaps P-03 header!
      label: "CIPHER CONSOLE",
      type: "laser_override",
      hacked: false,
      hackTime: 1.8
    }
  ],
  cameras: [
    {
      id: "CAM_3A",
      x: 252,
      y: 52,
      mountAngle: Math.PI * 0.35,
      sweepAngle: 1.15,
      sweepSpeed: 0.9,
      range: 235,
      fov: 0.85
    },
    {
      id: "CAM_3B",
      x: 696,
      y: 434,
      mountAngle: -Math.PI * 0.6,
      sweepAngle: 1.25,
      sweepSpeed: 0.8,
      range: 240,
      fov: 0.8
    },
    {
      id: "CAM_3C",
      x: 1230,
      y: 50,
      mountAngle: Math.PI * 0.82,
      sweepAngle: 1.05,
      sweepSpeed: 0.95,
      range: 245,
      fov: 0.85
    }
  ],
  guards: [
    {
      id: "G3_1",
      name: "Elite Cmdr Kane",
      x: 320,
      y: 155,
      speed: 80,
      viewDist: 225,
      fov: 1.3,
      facing: 0,
      patrol: [
        { x: 320, y: 155, wait: 1.5 },
        { x: 630, y: 155, wait: 1.5 },
        { x: 630, y: 305, wait: 1.5 },
        { x: 320, y: 305, wait: 1.5 }
      ]
    },
    {
      id: "G3_2",
      name: "Elite Guard Sterling",
      x: 830,
      y: 175,
      speed: 85,
      viewDist: 235,
      fov: 1.3,
      facing: -Math.PI * 0.5,
      patrol: [
        { x: 830, y: 175, wait: 1.5 },
        { x: 830, y: 350, wait: 1.8 },
        { x: 750, y: 350, wait: 1.4 },
        { x: 750, y: 175, wait: 1.5 }
      ]
    },
    {
      id: "G3_3",
      name: "Vault Enforcer Ramos",
      x: 1100,
      y: 160,
      speed: 75,
      viewDist: 220,
      fov: 1.3,
      facing: Math.PI,
      patrol: [
        { x: 1100, y: 160, wait: 2.0 },
        { x: 1100, y: 310, wait: 2.0 }
      ]
    }
  ]
};

export const HEIST_LEVELS = [
  LEVEL_1_GALLERY,
  LEVEL_2_SERVER_VAULT,
  LEVEL_3_PENTHOUSE_SAFE
];

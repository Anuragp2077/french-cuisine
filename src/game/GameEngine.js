import { FOOD_ICONS, drawFoodIcon } from "./foodArt";
import {
  BOSS_MILESTONES,
  bossPunch,
  createBoss,
  drawBoss,
  drawBossHud,
  drawHazards,
  drawRing,
  updateBoss,
  updateHazards,
} from "./bosses";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const rand = (min, max) => min + Math.random() * (max - min);
const PX_PER_METER = 34;

const PICKUPS = {
  coffee: { icon: "coffee", label: "SPRINT", color: "#d9a441" },
  baguette: { icon: "baguette", label: "BOUCLIER", color: "#f0e9df" },
  camembert: { icon: "camembert", label: "AIMANT", color: "#d88996" },
  brulee: { icon: "brulee", label: "+150", color: "#c5a66b" },
};

const hash = (n) => {
  const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();

  if (ctx.roundRect) {
    ctx.roundRect(x, y, width, height, r);
    return;
  }

  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

/* =========================================================
   AUDIO — tiny WebAudio kit, no asset files
========================================================= */

class Sfx {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.enabled = true;
  }

  resume() {
    if (!this.enabled) {
      return;
    }

    if (!this.ctx) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;

      if (!AudioCtor) {
        return;
      }

      this.ctx = new AudioCtor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.2;
      this.master.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  tone({ freq = 440, to = null, dur = 0.12, type = "sine", gain = 0.4, delay = 0 }) {
    if (!this.enabled) {
      return;
    }

    this.resume();

    if (!this.ctx) {
      return;
    }

    const start = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const envelope = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);

    if (to) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), start + dur);
    }

    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(gain, start + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + dur);

    osc.connect(envelope);
    envelope.connect(this.master);
    osc.start(start);
    osc.stop(start + dur + 0.03);
  }

  noise({ dur = 0.25, gain = 0.35, freq = 900 } = {}) {
    if (!this.enabled) {
      return;
    }

    this.resume();

    if (!this.ctx) {
      return;
    }

    const frames = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, frames, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < frames; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = freq;

    const envelope = this.ctx.createGain();
    envelope.gain.value = gain;

    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.master);
    source.start();
  }

  play(name, level = 1) {
    if (!this.enabled) {
      return;
    }

    switch (name) {
      case "jump":
        this.tone({ freq: 300, to: 540, dur: 0.13, type: "triangle", gain: 0.26 });
        break;
      case "double":
        this.tone({ freq: 470, to: 780, dur: 0.14, type: "triangle", gain: 0.24 });
        break;
      case "land":
        this.tone({ freq: 150, to: 90, dur: 0.09, type: "sine", gain: 0.14 });
        break;
      case "collect":
        this.tone({
          freq: 640 + level * 60,
          to: 1120 + level * 80,
          dur: 0.11,
          type: "square",
          gain: 0.11,
        });
        break;
      case "hit":
        this.noise({ dur: 0.3, gain: 0.4 });
        this.tone({ freq: 170, to: 65, dur: 0.32, type: "sawtooth", gain: 0.16 });
        break;
      case "win":
        [523, 659, 784, 1046].forEach((freq, index) => {
          this.tone({
            freq,
            dur: 0.3,
            type: "triangle",
            gain: 0.2,
            delay: index * 0.13,
          });
        });
        break;
      case "lose":
        [330, 262, 196].forEach((freq, index) => {
          this.tone({
            freq,
            dur: 0.4,
            type: "sine",
            gain: 0.18,
            delay: index * 0.15,
          });
        });
        break;
      /* — the ring — */
      case "bossIntro":
        /* musette waltz, three beats, slightly flat like a café accordion */
        [392, 494, 587].forEach((freq, index) => {
          this.tone({
            freq,
            dur: 0.26,
            type: "sawtooth",
            gain: 0.13,
            delay: index * 0.17,
          });
          this.tone({
            freq: freq * 1.006,
            dur: 0.24,
            type: "triangle",
            gain: 0.1,
            delay: index * 0.17 + 0.01,
          });
        });
        this.tone({ freq: 98, dur: 0.5, type: "sine", gain: 0.18, delay: 0.34 });
        break;
      case "punch":
        this.tone({ freq: 210, to: 70, dur: 0.09, type: "square", gain: 0.24 });
        this.noise({ dur: 0.07, gain: 0.22, freq: 1600 });
        break;
      case "whack":
        this.noise({ dur: 0.12, gain: 0.34, freq: 2100 });
        this.tone({ freq: 320, to: 150, dur: 0.08, type: "triangle", gain: 0.18 });
        break;
      case "thud":
        this.tone({ freq: 96, to: 42, dur: 0.22, type: "sine", gain: 0.34 });
        this.noise({ dur: 0.16, gain: 0.2, freq: 400 });
        break;
      case "boing":
        this.tone({ freq: 260, to: 820, dur: 0.2, type: "triangle", gain: 0.18 });
        break;
      case "cork":
        this.tone({ freq: 780, to: 190, dur: 0.08, type: "square", gain: 0.2 });
        this.noise({ dur: 0.05, gain: 0.16, freq: 2400 });
        break;
      case "whoosh":
        this.noise({ dur: 0.22, gain: 0.16, freq: 700 });
        break;
      case "pouet":
        this.tone({ freq: 440, dur: 0.09, type: "square", gain: 0.16 });
        this.tone({ freq: 554, dur: 0.11, type: "square", gain: 0.16, delay: 0.1 });
        break;
      case "bell":
        this.tone({ freq: 1560, dur: 0.07, type: "triangle", gain: 0.22 });
        this.tone({ freq: 2080, dur: 0.09, type: "triangle", gain: 0.16, delay: 0.06 });
        break;
      case "coo":
        this.tone({ freq: 640, to: 430, dur: 0.2, type: "sine", gain: 0.14 });
        this.tone({ freq: 600, to: 400, dur: 0.22, type: "sine", gain: 0.12, delay: 0.22 });
        break;
      case "ko":
        this.tone({ freq: 84, to: 38, dur: 0.7, type: "sine", gain: 0.34 });
        this.noise({ dur: 0.4, gain: 0.22, freq: 1200 });
        [523, 659, 784].forEach((freq, index) => {
          this.tone({ freq, dur: 0.22, type: "triangle", gain: 0.14, delay: 0.3 + index * 0.1 });
        });
        break;
      default:
        break;
    }
  }

  destroy() {
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

/* =========================================================
   THE THREE SERVICES
========================================================= */

export const DIFFICULTIES = {
  breakfast: {
    id: "breakfast",
    nameFr: "Petit-déjeuner",
    nameEn: "Breakfast",
    tagFr: "Croissants au saut du lit",
    tagEn: "Croissants at first light",
    copyFr:
      "Le service le plus doux : rythme posé, larges arcs de viennoiseries.",
    copyEn:
      "The gentlest service: an easy pace and wide arcs of pastries.",
    speed: 336,
    length: 1100,
    hearts: 3,
    density: 0.8,
    pace: 1,
    accent: "#d88996",
    foods: ["croissant", "baguette", "chouquette", "coffee", "macaron", "crepe"],
    stars: [24, 48, 70],
    sky: ["#1a1020", "#43121c", "#8a4a3a"],
    ground: "#20150f",
    far: "#2a1524",
    mid: "#3a1b1c",
  },

  lunch: {
    id: "lunch",
    nameFr: "Déjeuner",
    nameEn: "Lunch",
    tagFr: "Le service du midi",
    tagEn: "The midday service",
    copyFr:
      "Le rythme des grands jours : quiches, croques et fromages en série.",
    copyEn:
      "The rhythm of a busy day: quiches, croques and cheese in sequence.",
    speed: 382,
    length: 1500,
    hearts: 3,
    density: 0.94,
    pace: 2,
    accent: "#c5a66b",
    foods: ["quiche", "croque", "camembert", "baguette", "wine", "crepe"],
    stars: [32, 64, 92],
    sky: ["#101a26", "#2c3b45", "#8a6a42"],
    ground: "#191410",
    far: "#1d2a33",
    mid: "#33302c",
  },

  dinner: {
    id: "dinner",
    nameFr: "Dîner",
    nameEn: "Dinner",
    tagFr: "Le grand service",
    tagEn: "The grand service",
    copyFr:
      "Le service de gala : plus rapide, plus serré, avec les grands plats.",
    copyEn:
      "The gala service: faster, tighter, with the great dishes.",
    speed: 428,
    length: 2100,
    hearts: 3,
    density: 1,
    pace: 3,
    accent: "#d9a441",
    foods: ["stew", "brulee", "wine", "camembert", "quiche", "baguette"],
    stars: [48, 90, 130],
    sky: ["#0b1020", "#241a33", "#5c2a3c"],
    ground: "#161017",
    far: "#181a2c",
    mid: "#2e2233",
  },
};

export const DIFFICULTY_KEYS = ["breakfast", "lunch", "dinner"];

/* =========================================================
   ENGINE
========================================================= */

export class GameEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.onEvent = options.onEvent || (() => {});
    this.difficultyKey =
      options.difficulty && DIFFICULTIES[options.difficulty]
        ? options.difficulty
        : "lunch";
    this.best = options.best || 0;
    this.sfx = new Sfx();
    this.sfx.enabled = options.sound !== false;
    this.reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.time = 0;
    this.lastTs = 0;
    this.raf = 0;
    this.destroyed = false;
    this.statTimer = 0;
    this.shake = 0;
    this.slow = 1;
    this.slowTimer = 0;
    this.flash = 0;
    this.held = false;
    this.fastFall = false;
    this.jumpBuffer = 0;
    this.coyote = 0;
    this.state = "attract";
    this.arriveTimer = 0;
    this.prevState = "attract";
    this.particles = [];
    this.obstacles = [];
    this.platforms = [];
    this.foods = [];
    this.camera = { x: 0 };
    this.player = null;
    this.lastStats = null;
    this.boss = null;
    this.ring = null;
    this.hazards = [];
    this.bossIndex = 0;
    this.bossMilestones = [];
    this.bossIntroTimer = 0;
    this.bossWinTimer = 0;
    this.moveDir = 0;
    this.punchTimer = 0;
    this.punchCooldown = 0;
    this.shield = false;
    this.boostTimer = 0;
    this.magnetTimer = 0;
    this.slideTimer = 0;
    this.slideCooldown = 0;
    this.pickups = [];
    this.overheads = [];
    this.pickupX = 0;
    this.overheadX = 0;
    this.rage = 0;
    this.rageReady = false;

    this.handleKeyDown = (event) => this.onKeyDown(event);
    this.handleKeyUp = (event) => this.onKeyUp(event);
    this.handlePointerDown = (event) => this.onPointerDown(event);
    this.handlePointerUp = () => {
      this.held = false;
    };
    this.handleVisibility = () => {
      if (document.hidden && this.state === "running") {
        this.setPaused(true);
      }
    };
    this.handleResize = () => this.resize();

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("pointerup", this.handlePointerUp);
    window.addEventListener("pointercancel", this.handlePointerUp);
    document.addEventListener("visibilitychange", this.handleVisibility);
    canvas.addEventListener("pointerdown", this.handlePointerDown);

    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas.parentElement || canvas);

    this.resize();
    this.resetWorld("attract");
    this.render();

    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
  }

  /* -------------------------------------------------------
     SETUP
  ------------------------------------------------------- */

  get cfg() {
    return DIFFICULTIES[this.difficultyKey];
  }

  pxPerMeter() {
    return PX_PER_METER * this.speedScale;
  }

  speedNow() {
    const progress = clamp(this.distance / this.cfg.length, 0, 1);
    const boost = this.boostTimer > 0 ? 1.26 : 1;
    return this.cfg.speed * this.speedScale * (1 + progress * 0.14) * boost;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.w = Math.max(300, Math.round(rect.width || this.canvas.parentElement?.clientWidth || 900));
    this.h = Math.max(240, Math.round(rect.height || 460));
    this.canvas.width = Math.round(this.w * dpr);
    this.canvas.height = Math.round(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const previousGround = this.groundY || 0;

    this.groundY = this.h * 0.8;
    this.playerH = clamp(this.h * 0.132, 44, 86);
    this.playerW = this.playerH * 0.42;
    this.speedScale =
      clamp(this.h / 720, 0.74, 1.06) * (this.w < 660 ? 0.9 : 1);
    this.camOffset = this.w * (this.w < 660 ? 0.24 : 0.28);

    this.vignette = this.ctx.createRadialGradient(
      this.w / 2,
      this.h * 0.46,
      Math.min(this.w, this.h) * 0.32,
      this.w / 2,
      this.h * 0.52,
      Math.max(this.w, this.h) * 0.78
    );
    this.vignette.addColorStop(0, "rgba(8,6,5,0)");
    this.vignette.addColorStop(1, "rgba(8,6,5,0.55)");

    const shift = this.groundY - previousGround;

    if (shift && this.player) {
      this.player.y += shift;

      for (const obstacle of this.obstacles) obstacle.y += shift;
      for (const platform of this.platforms) platform.y += shift;
      for (const food of this.foods) food.y += shift;
    }

    /* resizing clears the canvas — repaint straight away so a new frame
       never flashes empty (and the scene still shows in a background tab) */
    if (this.player) {
      this.render();
    }
  }

  resetWorld(nextState = "attract") {
    const cfg = this.cfg;

    this.state = nextState;
    this.player = {
      x: 0,
      y: this.groundY - this.playerH,
      vy: 0,
      w: this.playerW,
      h: this.playerH,
      grounded: true,
      platform: null,
      jumps: 0,
      run: 0,
      squash: 0,
      invuln: 0,
    };

    this.obstacles = [];
    this.platforms = [];
    this.foods = [];
    this.particles = [];
    this.hearts = cfg.hearts;
    this.foodCount = 0;
    this.score = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.multiplier = 1;
    this.distance = 0;
    this.startX = 0;
    this.finishX = this.pxPerMeter() * cfg.length + 150;
    this.genX = nextState === "running" ? this.speedNow() * 1.9 : 240;
    this.camera.x = this.player.x - this.camOffset;
    this.jumpBuffer = 0;
    this.coyote = 0;
    this.shake = 0;
    this.slow = 1;
    this.slowTimer = 0;
    this.flash = 0;
    this.arriveTimer = 0;
    this.statTimer = 0;
    this.lastStats = null;
    this.boss = null;
    this.ring = null;
    this.hazards = [];
    this.bossIndex = 0;
    this.bossMilestones = BOSS_MILESTONES.filter((mark) => mark < cfg.length - 60);
    this.bossIntroTimer = 0;
    this.bossWinTimer = 0;
    this.moveDir = 0;
    this.punchTimer = 0;
    this.punchCooldown = 0;
    this.shield = false;
    this.boostTimer = 0;
    this.magnetTimer = 0;
    this.slideTimer = 0;
    this.slideCooldown = 0;
    this.pickups = [];
    this.overheads = [];
    this.rage = 0;
    this.rageReady = false;
    this.pickupX = this.pxPerMeter() * 80;
    this.overheadX = this.pxPerMeter() * 120;

    this.emitStats(true);
  }

  /* -------------------------------------------------------
     PUBLIC CONTROLS
  ------------------------------------------------------- */

  setDifficulty(key) {
    if (!DIFFICULTIES[key]) {
      return;
    }

    this.difficultyKey = key;
    this.resetWorld("attract");
  }

  setSound(enabled) {
    this.sfx.enabled = Boolean(enabled);

    if (enabled) {
      this.sfx.resume();
    }
  }

  setBest(value) {
    this.best = Number(value) || 0;
  }

  startRun() {
    this.sfx.resume();
    this.resetWorld("running");
  }

  toAttract() {
    this.resetWorld("attract");
  }

  setPaused(paused) {
    if (
      paused &&
      (this.state === "running" || this.state === "attract" || this.bossActive())
    ) {
      this.prevState = this.state;
      this.state = "paused";
      this.emit("paused");
      return;
    }

    if (!paused && this.state === "paused") {
      this.state = this.prevState || "running";
      this.emit("resumed");
    }
  }

  togglePause() {
    this.setPaused(this.state !== "paused");
  }

  pressJump() {
    this.sfx.resume();
    this.held = true;

    if (this.state === "attract") {
      this.doJump();
      return;
    }

    if (this.state !== "running" && this.state !== "bossFight") {
      return;
    }

    this.jumpBuffer = 0.14;
  }

  releaseJump() {
    this.held = false;
  }

  pressSlide() {
    if (this.state !== "running" && this.state !== "bossFight") {
      return;
    }

    const player = this.player;

    if (!player || !player.grounded || this.slideCooldown > 0) {
      return;
    }

    this.slideTimer = 0.55;
    this.slideCooldown = 0.9;
    player.squash = 0.18;
    this.spawnDust(player.x + player.w / 2, player.y + player.h, 4);
    this.sfx.play("whoosh");
  }

  bossActive() {
    return (
      this.state === "bossIntro" ||
      this.state === "bossFight" ||
      this.state === "bossWin"
    );
  }

  setMove(direction) {
    this.moveDir = clamp(direction, -1, 1);
  }

  pressPunch() {
    if (this.state !== "bossFight" || this.punchCooldown > 0) {
      return;
    }

    const superPunch = this.rageReady;

    this.punchCooldown = superPunch ? 0.5 : 0.36;
    this.punchTimer = superPunch ? 0.3 : 0.24;
    this.rageReady = false;

    if (superPunch) {
      this.rage = 0;
      this.shake = this.reduced ? 0 : 16;
      this.sfx.play("ko");
      this.spawnText(
        this.player.x + this.player.w / 2,
        this.player.y - 10,
        "COLÈRE !",
        "#d9a441"
      );
    } else {
      this.sfx.play("punch");
    }

    bossPunch(this, superPunch);
  }

  addRage(amount) {
    if (this.rageReady) {
      return;
    }

    this.rage = clamp(this.rage + amount, 0, 1);

    if (this.rage >= 1) {
      this.rageReady = true;
      this.spawnText(
        this.player.x + this.player.w / 2,
        this.player.y - 12,
        "COLÈRE PRÊTE",
        "#d9a441"
      );
      this.sfx.play("bell");
      this.emitStats(true);
    }
  }

  /* -------------------------------------------------------
     INPUT
  ------------------------------------------------------- */

  onKeyDown(event) {
    const code = event.code;

    if (code === "Space" || code === "ArrowUp" || code === "KeyW") {
      event.preventDefault();

      if (event.repeat) {
        return;
      }

      this.held = true;
      this.pressJump();
      return;
    }

    if (code === "ArrowDown" || code === "KeyS") {
      event.preventDefault();

      if (this.player && this.player.grounded) {
        this.pressSlide();
      } else {
        this.fastFall = true;
      }

      return;
    }

    if (code === "ArrowLeft" || code === "KeyA") {
      event.preventDefault();
      this.moveDir = -1;
      return;
    }

    if (code === "ArrowRight" || code === "KeyD") {
      event.preventDefault();
      this.moveDir = 1;
      return;
    }

    if (code === "KeyJ" || code === "KeyF" || code === "KeyX") {
      event.preventDefault();
      this.pressPunch();
      return;
    }

    if (code === "Escape" || code === "KeyP") {
      event.preventDefault();

      if (this.state === "running" || this.state === "paused" || this.bossActive()) {
        this.togglePause();
      }
    }
  }

  onKeyUp(event) {
    if (
      event.code === "Space" ||
      event.code === "ArrowUp" ||
      event.code === "KeyW"
    ) {
      this.held = false;
      this.releaseJump();
    }

    if (event.code === "ArrowDown" || event.code === "KeyS") {
      this.fastFall = false;
    }

    if (event.code === "ArrowLeft" || event.code === "KeyA") {
      if (this.moveDir < 0) {
        this.moveDir = 0;
      }
    }

    if (event.code === "ArrowRight" || event.code === "KeyD") {
      if (this.moveDir > 0) {
        this.moveDir = 0;
      }
    }
  }

  onPointerDown(event) {
    if (event.target !== this.canvas || this.state === "paused") {
      return;
    }

    this.held = true;
    this.pressJump();
  }

  /* -------------------------------------------------------
     JUMP + PHYSICS
  ------------------------------------------------------- */

  doJump() {
    const player = this.player;

    if (!player) {
      return false;
    }

    const gravity = 4400 * (this.playerH / 70);
    const jumpHeight = this.playerH * 2.9;
    const baseVelocity = Math.sqrt(2 * gravity * jumpHeight);

    if (player.grounded || this.coyote > 0) {
      player.vy = -baseVelocity;
      player.jumps = 1;
      player.grounded = false;
      player.platform = null;
      this.spawnDust(player.x + player.w / 2, player.y + player.h, 6);
      this.sfx.play("jump");
    } else if (player.jumps < 2) {
      player.vy = -baseVelocity * 0.86;
      player.jumps = 2;
      this.spawnRing(player.x + player.w / 2, player.y + player.h);
      this.sfx.play("double");
    } else {
      return false;
    }

    player.squash = -0.16;
    this.slideTimer = 0;
    this.jumpBuffer = 0;
    this.coyote = 0;
    return true;
  }

  /* -------------------------------------------------------
     WORLD GENERATION
  ------------------------------------------------------- */

  generate(untilX) {
    let guard = 0;

    while (this.genX < untilX && guard < 40) {
      this.spawnPattern(this.genX);
      guard += 1;
    }

    while (this.pickupX < untilX) {
      this.spawnPickup(this.pickupX);
      this.pickupX += this.pxPerMeter() * rand(95, 150);
    }

    /* a guaranteed low sign now and then, so sliding always has a job */
    while (this.overheadX < untilX) {
      const blocked = this.obstacles.some(
        (obstacle) =>
          Math.abs(obstacle.x - this.overheadX) < this.playerH * 2.2 ||
          Math.abs(obstacle.x + obstacle.w - this.overheadX) < this.playerH * 2.2
      );

      if (!blocked) {
        this.addOverhead(this.overheadX, Math.random() < 0.5 ? "sign" : "ham");
      }

      this.overheadX += this.pxPerMeter() * rand(135, 200);
    }
  }

  addFood(x, y, icon) {
    const art = FOOD_ICONS[icon] || FOOD_ICONS.baguette;

    this.foods.push({
      x,
      y,
      icon,
      accent: art.accent,
      phase: rand(0, Math.PI * 2),
      dead: false,
    });
  }

  addFoodArc(x, width, count, baseHeight) {
    const icons = this.cfg.foods;
    const playerH = this.playerH;

    for (let i = 0; i < count; i += 1) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const arc = Math.sin(Math.PI * t);
      const icon = icons[Math.floor(rand(0, icons.length))];

      this.addFood(
        x + width * t,
        this.groundY - playerH * (baseHeight + arc * 0.95),
        icon
      );
    }
  }

  addObstacle(x, kind) {
    const playerH = this.playerH;
    const sizes = {
      crate: { w: playerH * 0.62, h: playerH * 0.6 },
      pot: { w: playerH * 0.78, h: playerH * 0.44 },
      stack: { w: playerH * 0.52, h: playerH * 0.9 },
      bottle: { w: playerH * 0.44, h: playerH * 0.72 },
    };
    const size = sizes[kind] || sizes.crate;

    this.obstacles.push({
      x,
      y: this.groundY - size.h,
      w: size.w,
      h: size.h,
      kind,
      seed: rand(0, 10),
    });
  }

  addPlatform(x, width) {
    const top = this.groundY - this.playerH * rand(1.32, 1.8);

    this.platforms.push({ x, y: top, w: width, h: 13 });

    const icons = this.cfg.foods;
    const count = 2 + Math.floor(rand(0, 2));

    for (let i = 0; i < count; i += 1) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      this.addFood(
        x + width * (0.2 + t * 0.6),
        top - this.playerH * rand(0.34, 0.55),
        icons[Math.floor(rand(0, icons.length))]
      );
    }

    return top;
  }

  addOverhead(x, kind) {
    const ph = this.playerH;
    const width = kind === "ham" ? ph * 0.76 : ph * 1.02;
    const height = kind === "ham" ? ph * 0.5 : ph * 0.44;
    const gap = ph * 0.6;

    this.overheads.push({
      x,
      y: this.groundY - gap - height,
      w: width,
      h: height,
      kind,
      seed: rand(0, 10),
    });
  }

  spawnPickup(x) {
    const keys = Object.keys(PICKUPS);
    const kind = keys[Math.floor(rand(0, keys.length))];

    this.pickups.push({
      x,
      y: this.groundY - this.playerH * rand(1.15, 2.05),
      kind,
      phase: rand(0, Math.PI * 2),
      dead: false,
    });
  }

  spawnPattern(x) {
    const cfg = this.cfg;
    const progress = clamp(this.distance / cfg.length, 0, 1);
    const density = cfg.density + progress * 0.16;
    const playerH = this.playerH;
    const speed = this.speedNow();
    const roll = Math.random();
    let width;

    if (roll < 0.22) {
      /* A clear run of dishes — a small breather. */
      width = playerH * rand(2.6, 4.2);
      this.addFoodArc(x + width * 0.5, width, 4 + Math.floor(rand(0, 2)), 0.9);
    } else if (roll < 0.48) {
      /* One obstacle, with food arcing above it. */
      const kind = ["crate", "pot", "bottle"][Math.floor(rand(0, 3))];

      this.addObstacle(x, kind);
      width = playerH * 0.9;
      this.addFoodArc(
        x - playerH * 0.35,
        playerH * 1.7,
        3,
        1.35 + (kind === "pot" ? 0.1 : 0)
      );
    } else if (roll < 0.66) {
      /* A shelf of marble with the good things on top. */
      width = playerH * rand(2.2, 3.4);
      this.addPlatform(x, width);
    } else if (roll < 0.82) {
      /* A taller stack — rewards a well-timed second jump. */
      this.addObstacle(x, "stack");
      this.addFoodArc(x - playerH * 0.2, playerH * 1.4, 2, 2.5);
      width = playerH * 0.8;
    } else if (roll < 0.84 && this.difficultyKey !== "breakfast") {
      /* Two obstacles in a row, only once the pace has warmed up. */
      const gap = playerH * (1.35 + rand(0, 0.25));
      const kind = ["crate", "pot"][Math.floor(rand(0, 2))];

      this.addObstacle(x, kind);
      this.addObstacle(x + gap, kind);
      this.addFoodArc(x - playerH * 0.2, gap + playerH * 0.9, 3, 1.5);
      width = gap;
    } else if (
      roll < 0.95 &&
      (this.difficultyKey !== "breakfast" || progress > 0.5)
    ) {
      /* a sign hung low enough that only a slide gets under it */
      width = playerH * 2.1;
      this.addOverhead(x, Math.random() < 0.5 ? "sign" : "ham");
      this.addFoodArc(x - playerH * 0.4, playerH * 0.9, 2, 0.5);
    } else if (this.difficultyKey === "dinner") {
      /* Three small pots — a rhythm test, reserved for the dinner service. */
      const gap = playerH * 1.45;

      this.addObstacle(x, "pot");
      this.addObstacle(x + gap, "crate");
      this.addObstacle(x + gap * 2, "pot");
      width = gap * 2 + playerH * 0.5;
    } else {
      width = playerH * 2.4;
      this.addFoodArc(x, width, 4, 1.1);
    }

    const minGap = speed * (1.05 / density) + playerH * 1.25;

    this.genX = x + width + minGap + rand(0, speed * 0.35);
  }

  /* -------------------------------------------------------
     UPDATE
  ------------------------------------------------------- */

  update(dt) {
    const cfg = this.cfg;
    const player = this.player;

    this.time += dt;

    if (this.slowTimer > 0) {
      this.slowTimer -= dt;

      if (this.slowTimer <= 0) {
        this.slow = 1;
      }
    }

    if (this.flash > 0) {
      this.flash = Math.max(0, this.flash - dt * 3.2);
    }

    if (this.shake > 0) {
      this.shake = Math.max(0, this.shake - dt * 42);
    }

    if (this.statTimer > 0) {
      this.statTimer -= dt;
    }

    if (player.invuln > 0) {
      player.invuln = Math.max(0, player.invuln - dt);
    }

    if (
      this.state === "over" ||
      this.state === "complete" ||
      this.state === "paused"
    ) {
      this.updateParticles(dt);

      if (this.state === "complete" && !this.reduced) {
        this.confettiTimer = (this.confettiTimer || 0) - dt;

        if (this.confettiTimer <= 0) {
          this.confettiTimer = 0.6;
          this.spawnConfetti(10);
        }
      }

      return;
    }

    const running = this.state === "running";
    const attract = this.state === "attract";
    const arriving = this.state === "arriving";
    const bossing =
      this.state === "bossIntro" ||
      this.state === "bossFight" ||
      this.state === "bossWin";

    let speed = 0;

    if (running) {
      speed = this.speedNow();
    } else if (attract) {
      speed = cfg.speed * this.speedScale * 0.36;
    } else if (arriving) {
      const k = clamp(this.arriveTimer / 2.1, 0, 1);
      speed = this.speedNow() * k * k;
      this.arriveTimer -= dt;

      if (this.arriveTimer <= 0) {
        this.state = "complete";
        this.confettiTimer = 0.6;
        this.emit("complete", this.buildStats(true));
        return;
      }
    }

    if (!bossing) {
      player.x += speed * dt;
      this.camera.x = player.x - this.camOffset;
    }

    if (running) {
      this.distance = (player.x - this.startX) / this.pxPerMeter();

      if (
        this.bossIndex < this.bossMilestones.length &&
        this.distance >= this.bossMilestones[this.bossIndex]
      ) {
        this.beginBoss();
      }

      if (this.state === "running" && this.distance >= cfg.length) {
        this.arrive();
      }
    }

    if (bossing) {
      player.x += this.moveDir * this.playerH * 7.4 * dt;
      player.x = clamp(
        player.x,
        this.ring.left + 6,
        this.ring.right - player.w - 6
      );
      player.run += dt * Math.abs(this.moveDir) * 5.2;
    } else {
      player.run += dt * (speed / (this.playerH * 3.4));
    }

    /* ----- physics ----- */
    const gravity = 4400 * (this.playerH / 70);

    if (player.grounded && player.platform) {
      const center = player.x + player.w * 0.5;

      if (
        center < player.platform.x - 6 ||
        center > player.platform.x + player.platform.w + 6
      ) {
        player.grounded = false;
        player.platform = null;
      }
    }

    if (!player.grounded) {
      let gravityMultiplier = 1;

      if (this.fastFall) {
        gravityMultiplier = 2.4;
      } else if (!this.held && player.vy < -140) {
        gravityMultiplier = 1.6;
      }

      player.vy += gravity * gravityMultiplier * dt;

      const previousBottom = player.y + player.h;

      player.y += player.vy * dt;

      if (player.vy > 0) {
        for (const platform of this.platforms) {
          if (
            player.x + player.w * 0.85 < platform.x ||
            player.x + player.w * 0.15 > platform.x + platform.w
          ) {
            continue;
          }

          const bottom = player.y + player.h;

          if (previousBottom <= platform.y + 8 && bottom >= platform.y) {
            player.y = platform.y - player.h;
            player.vy = 0;
            player.grounded = true;
            player.platform = platform;
            player.jumps = 0;
            this.spawnDust(player.x + player.w / 2, player.y + player.h, 7);
            break;
          }
        }
      }

      if (player.y + player.h >= this.groundY) {
        const impact = player.vy;

        player.y = this.groundY - player.h;
        player.vy = 0;
        player.grounded = true;
        player.platform = null;
        player.jumps = 0;

        if (impact > 120) {
          this.spawnDust(player.x + player.w / 2, this.groundY, 9);
          player.squash = 0.14;
          this.sfx.play("land");
        }
      }
    }

    player.squash = lerp(player.squash, 0, Math.min(1, dt * 10));

    if (this.slideTimer > 0) {
      this.slideTimer = Math.max(0, this.slideTimer - dt);

      if (!player.grounded) {
        this.slideTimer = 0;
      }

      if (this.slideTimer <= 0) {
        player.squash = 0;
      }
    }

    if (this.slideCooldown > 0) {
      this.slideCooldown = Math.max(0, this.slideCooldown - dt);
    }

    if (this.boostTimer > 0) {
      this.boostTimer = Math.max(0, this.boostTimer - dt);
    }

    if (this.magnetTimer > 0) {
      this.magnetTimer = Math.max(0, this.magnetTimer - dt);
    }

    if (player.grounded) {
      this.coyote = 0.09;
    } else {
      this.coyote = Math.max(0, this.coyote - dt);
    }

    if (this.jumpBuffer > 0) {
      this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);

      if (player.grounded || this.coyote > 0 || player.jumps === 1) {
        this.doJump();
      }
    }

    if (this.bossActive()) {
      this.updateBossPhase(dt);
    }

    /* ----- combo timer ----- */
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;

      if (this.comboTimer <= 0) {
        this.combo = 0;
        this.multiplier = 1;
      }
    }

    /* ----- attract mode autopilot ----- */
    if (attract && player.grounded) {
      for (const obstacle of this.obstacles) {
        const distance = obstacle.x - (player.x + player.w);

        if (distance > 0 && distance < this.playerH * 1.05) {
          this.doJump();
          break;
        }
      }
    }

    /* ----- content ----- */
    if (!bossing) {
      this.generate(this.camera.x + this.w * 2.2);
    }

    /* ----- collisions ----- */
    if (running) {
      const box = this.playerBox();

      for (const obstacle of this.obstacles) {
        const obstacleX = obstacle.x + obstacle.w * 0.1;
        const obstacleWidth = obstacle.w * 0.8;

        if (
          obstacleX > box.x + box.w ||
          obstacleX + obstacleWidth < box.x ||
          obstacle.y > box.y + box.h ||
          obstacle.y + obstacle.h < box.y
        ) {
          continue;
        }

        this.hit();
        break;
      }

      for (const overhead of this.overheads) {
        if (
          overhead.x > box.x + box.w ||
          overhead.x + overhead.w < box.x ||
          overhead.y > box.y + box.h ||
          overhead.y + overhead.h < box.y
        ) {
          continue;
        }

        this.hit();
        break;
      }

      for (const food of this.foods) {
        if (food.dead) {
          continue;
        }

        if (this.magnetTimer > 0) {
          const pullX = player.x + player.w / 2 - food.x;
          const pullY = player.y + player.h * 0.5 - food.y;
          const pullDistance = Math.hypot(pullX, pullY);

          if (pullDistance < this.playerH * 5.5 && pullDistance > 1) {
            const pull = Math.min(1, (this.playerH * 8 * dt) / pullDistance);
            food.x += pullX * pull;
            food.y += pullY * pull;
          }
        }

        const dx = food.x - (player.x + player.w / 2);
        const dy = food.y - (player.y + player.h * 0.5);

        if (dx * dx + dy * dy < Math.pow(this.playerH * 0.56, 2)) {
          food.dead = true;
          this.collect(food);
        }
      }

      for (const pickup of this.pickups) {
        if (pickup.dead) {
          continue;
        }

        const dx = pickup.x - (player.x + player.w / 2);
        const dy = pickup.y - (player.y + player.h * 0.5);

        if (dx * dx + dy * dy < Math.pow(this.playerH * 0.72, 2)) {
          this.collectPickup(pickup);
        }
      }
    } else if (attract) {
      for (const food of this.foods) {
        if (food.dead) {
          continue;
        }

        const dx = food.x - (player.x + player.w / 2);
        const dy = food.y - (player.y + player.h * 0.5);

        if (dx * dx + dy * dy < Math.pow(this.playerH * 0.62, 2)) {
          food.dead = true;
          this.spawnSpark(food.x, food.y, 5, food.accent);
        }
      }
    }

    this.foods = this.foods.filter(
      (food) => !food.dead && food.x > this.camera.x - 200
    );
    this.pickups = this.pickups.filter(
      (pickup) => !pickup.dead && pickup.x > this.camera.x - 220
    );
    this.overheads = this.overheads.filter(
      (overhead) => overhead.x + overhead.w > this.camera.x - 260
    );
    this.obstacles = this.obstacles.filter(
      (obstacle) => obstacle.x + obstacle.w > this.camera.x - 260
    );
    this.platforms = this.platforms.filter(
      (platform) => platform.x + platform.w > this.camera.x - 260
    );

    if (
      this.ring &&
      !this.bossActive() &&
      this.camera.x > this.ring.right + 280
    ) {
      this.ring = null;
    }

    this.updateParticles(dt);

    if (running || this.bossActive()) {
      this.emitStats();
    }
  }

  playerBox() {
    const player = this.player;
    const sliding = this.slideTimer > 0;
    const height = player.h * (sliding ? 0.47 : 0.9);

    return {
      x: player.x + player.w * 0.24,
      y: player.y + player.h - height,
      w: player.w * 0.52,
      h: height,
    };
  }

  collect(food) {
    this.foodCount += 1;
    this.combo += 1;
    this.comboTimer = 1.8;
    this.multiplier = clamp(1 + Math.floor(this.combo / 4), 1, 5);
    this.score += 10 * this.multiplier;

    this.spawnSpark(food.x, food.y, 9, food.accent);
    this.sfx.play("collect", this.multiplier);
    this.emitStats(true);
  }

  collectPickup(pickup) {
    pickup.dead = true;
    this.spawnSpark(pickup.x, pickup.y, 14, PICKUPS[pickup.kind].color);
    this.sfx.play("collect", 3);

    if (pickup.kind === "coffee") {
      this.boostTimer = 4.5;
      this.spawnText(pickup.x, pickup.y - 12, "SPRINT", "#d9a441");
    } else if (pickup.kind === "baguette") {
      this.shield = true;
      this.spawnText(pickup.x, pickup.y - 12, "BOUCLIER", "#f0e9df");
    } else if (pickup.kind === "camembert") {
      this.magnetTimer = 6;
      this.spawnText(pickup.x, pickup.y - 12, "AIMANT", "#d88996");
    } else {
      this.score += 150;
      this.spawnText(pickup.x, pickup.y - 12, "+150", "#c5a66b");
    }

    this.emitStats(true);
  }

  spawnText(x, y, text, color) {
    this.addParticle({
      type: "text",
      x,
      y,
      vx: rand(-8, 8),
      vy: -74,
      life: 0.95,
      max: 0.95,
      size: clamp(this.playerH * 0.2, 11, 15),
      color: color || "#f0e9df",
      text,
      gravity: 0,
      rot: 0,
      vr: 0,
      drag: 1.1,
    });
  }

  hit() {
    const player = this.player;

    if (
      (this.state !== "running" && this.state !== "bossFight") ||
      player.invuln > 0
    ) {
      return;
    }

    /* a baguette takes the hit instead of a heart */
    if (this.shield) {
      this.shield = false;
      player.invuln = 1.3;
      this.shake = this.reduced ? 0 : 10;
      this.flash = 0.5;
      this.sfx.play("boing");
      this.spawnSpark(
        player.x + player.w * 0.5,
        player.y + player.h * 0.4,
        14,
        "#f0e9df"
      );
      this.spawnText(player.x + player.w / 2, player.y - 6, "BOUCLIER", "#f0e9df");
      this.emitStats(true);
      return;
    }

    this.hearts -= 1;
    player.invuln = this.state === "bossFight" ? 1.6 : 2.2;
    this.shake = this.reduced ? 0 : 18;
    this.slow = 0.35;
    this.slowTimer = 0.22;
    this.flash = 1;
    this.combo = 0;
    this.multiplier = 1;
    this.comboTimer = 0;

    this.spawnShards(player.x + player.w * 0.8, player.y + player.h * 0.5, 14);
    this.sfx.play("hit");
    this.emitStats(true);

    if (this.hearts <= 0) {
      this.endRun();
    }
  }

  arrive() {
    this.state = "arriving";
    this.arriveTimer = 2.1;
    this.sfx.play("win");
    this.spawnConfetti(70);

    if (this.player) {
      this.player.invuln = 2.4;
    }
  }

  endRun() {
    this.state = "over";
    this.sfx.play("lose");
    this.emit("gameover", this.buildStats(false));
  }

  /* -------------------------------------------------------
     LE RING
  ------------------------------------------------------- */

  beginBoss() {
    const tier = this.bossIndex;
    const width = Math.min(this.w * 0.9, this.playerH * 19);
    const center = this.camera.x + this.w / 2;

    this.bossIndex += 1;
    this.ring = {
      left: center - width / 2,
      right: center + width / 2,
      width,
    };

    const from = this.ring.left - this.playerH * 3;
    const to = this.ring.right + this.playerH * 3;

    this.obstacles = this.obstacles.filter(
      (obstacle) => obstacle.x + obstacle.w < from || obstacle.x > to
    );
    this.platforms = this.platforms.filter(
      (platform) => platform.x + platform.w < from || platform.x > to
    );
    this.foods = this.foods.filter((food) => food.x < from || food.x > to);
    this.pickups = this.pickups.filter(
      (pickup) => pickup.x < from || pickup.x > to
    );
    this.overheads = [];
    this.hazards = [];

    this.player.x = this.ring.left + width * 0.16;
    this.player.y = this.groundY - this.player.h;
    this.player.vy = 0;
    this.player.grounded = true;
    this.player.platform = null;
    this.player.jumps = 0;
    this.player.invuln = Math.max(this.player.invuln, 0.6);
    this.player.run = 0;

    /* the crowd carries him into the ring: never start a fight on one heart */
    this.hearts = Math.max(this.hearts, 2);

    this.boss = createBoss(this, tier);
    this.state = "bossIntro";
    this.bossIntroTimer = 2.6;
    this.moveDir = 0;
    this.punchTimer = 0;
    this.punchCooldown = 0;
    this.shake = this.reduced ? 0 : 12;

    this.sfx.play("bossIntro");
    this.emit("bossstart", { tier });
    this.emitStats(true);
  }

  updateBossPhase(dt) {
    if (this.punchCooldown > 0) {
      this.punchCooldown = Math.max(0, this.punchCooldown - dt);
    }

    if (this.punchTimer > 0) {
      this.punchTimer = Math.max(0, this.punchTimer - dt);
    }

    if (this.state === "bossIntro") {
      this.bossIntroTimer -= dt;

      if (this.boss) {
        updateBoss(this, this.boss, dt);
      }

      if (this.bossIntroTimer <= 0) {
        this.state = "bossFight";
        this.bossIntroTimer = 0;
        this.sfx.play("bell");
        this.emitStats(true);
      }

      return;
    }

    if (this.state === "bossWin") {
      this.bossWinTimer -= dt;

      if (this.boss) {
        updateBoss(this, this.boss, dt);
      }

      if (this.bossWinTimer <= 0) {
        this.resumeRun();
      }

      return;
    }

    if (this.boss) {
      updateBoss(this, this.boss, dt);
    }

    updateHazards(this, dt);
  }

  resumeRun() {
    const player = this.player;

    this.state = "running";
    this.boss = null;
    this.hazards = [];
    this.bossWinTimer = 0;
    this.moveDir = 0;
    this.slideTimer = 0;
    this.slideCooldown = 0;
    this.startX = player.x - this.distance * this.pxPerMeter();
    this.genX = player.x + this.speedNow() * 2.4;
    this.camera.x = player.x - this.camOffset;
    player.invuln = Math.max(player.invuln, 1.4);

    this.emit("bossend");
    this.emitStats(true);
  }

  buildStats(completed) {
    const cfg = this.cfg;
    const hearts = Math.max(0, this.hearts);
    const distance = Math.round(this.distance);
    let score = this.score + distance + hearts * 120;

    if (completed) {
      score += 400;
    }

    let stars = 0;

    if (completed) {
      stars = 1;

      if (this.foodCount >= cfg.stars[1]) {
        stars = 2;
      }

      if (this.foodCount >= cfg.stars[2] && hearts === cfg.hearts) {
        stars = 3;
      }
    }

    return {
      difficulty: this.difficultyKey,
      distance,
      food: this.foodCount,
      score: Math.round(score),
      hearts,
      completed,
      stars,
    };
  }

  emitStats(force = false) {
    if (!force) {
      if (this.statTimer > 0) {
        return;
      }

      this.statTimer = 0.12;
    }

    const stats = {
      distance: Math.round(this.distance),
      food: this.foodCount,
      score: Math.round(this.score),
      hearts: this.hearts,
      multiplier: this.multiplier,
      rage: this.rage,
      rageReady: this.rageReady,
      shield: this.shield,
      boost: this.boostTimer > 0,
      magnet: this.magnetTimer > 0,
      progress: clamp(this.distance / this.cfg.length, 0, 1),
      length: this.cfg.length,
      boss: this.boss
        ? {
            hp: this.boss.hp,
            maxHp: this.boss.maxHp,
            round: this.boss.tier + 1,
            nameFr: this.boss.def.nameFr,
            nameEn: this.boss.def.nameEn,
            fighting: this.state === "bossFight",
          }
        : null,
    };

    this.lastStats = stats;
    this.emit("stats", stats);
  }

  emit(type, payload = {}) {
    this.onEvent({ type, ...payload });
  }

  /* -------------------------------------------------------
     PARTICLES
  ------------------------------------------------------- */

  addParticle(particle) {
    if (this.particles.length > 340) {
      this.particles.shift();
    }

    this.particles.push(particle);
  }

  spawnDust(x, y, count) {
    const total = this.reduced ? Math.ceil(count / 2) : count;

    for (let i = 0; i < total; i += 1) {
      this.addParticle({
        type: "dust",
        x,
        y,
        vx: rand(-70, 40),
        vy: rand(-95, -20),
        life: rand(0.3, 0.6),
        max: 0.6,
        size: rand(3, 7),
        color: "#e8dcc8",
        gravity: 130,
        rot: 0,
        vr: 0,
        drag: 2.2,
      });
    }
  }

  spawnRing(x, y) {
    this.addParticle({
      type: "ring",
      x,
      y,
      vx: 0,
      vy: 0,
      life: 0.35,
      max: 0.35,
      size: this.playerH * 0.4,
      color: "#d9a441",
      gravity: 0,
      rot: 0,
      vr: 0,
      drag: 0,
    });
  }

  spawnSpark(x, y, count, color) {
    const total = this.reduced ? Math.ceil(count / 2) : count;

    for (let i = 0; i < total; i += 1) {
      this.addParticle({
        type: "spark",
        x,
        y,
        vx: rand(-120, 120),
        vy: rand(-170, 30),
        life: rand(0.25, 0.5),
        max: 0.5,
        size: rand(2, 4.5),
        color: color || "#d9a441",
        gravity: 240,
        rot: rand(0, 3),
        vr: rand(-6, 6),
        drag: 1.4,
      });
    }
  }

  spawnShards(x, y, count) {
    const total = this.reduced ? Math.ceil(count / 2) : count;

    for (let i = 0; i < total; i += 1) {
      this.addParticle({
        type: "shard",
        x,
        y,
        vx: rand(-150, 190),
        vy: rand(-330, -70),
        life: rand(0.5, 0.9),
        max: 0.9,
        size: rand(5, 12),
        color: i % 3 === 0 ? "#d88996" : "#f0e9df",
        gravity: 950,
        rot: rand(0, 6),
        vr: rand(-9, 9),
        drag: 0.6,
      });
    }
  }

  spawnConfetti(count) {
    const colors = ["#d9a441", "#d88996", "#f0e9df", "#8a4d39", "#c5a66b"];
    const total = this.reduced ? Math.ceil(count / 3) : count;

    for (let i = 0; i < total; i += 1) {
      this.addParticle({
        type: "confetti",
        x: this.camera.x + rand(0, this.w),
        y: rand(-220, this.h * 0.35),
        vx: rand(-40, 50),
        vy: rand(70, 200),
        life: rand(1.8, 3),
        max: 3,
        size: rand(5, 10),
        color: colors[Math.floor(rand(0, colors.length))],
        gravity: 110,
        rot: rand(0, 6),
        vr: rand(-7, 7),
        drag: 0.25,
      });
    }
  }

  updateParticles(dt) {
    for (const particle of this.particles) {
      particle.life -= dt;
      particle.vy += particle.gravity * dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.rot += particle.vr * dt;

      if (particle.drag) {
        const damping = Math.max(0, 1 - particle.drag * dt);
        particle.vx *= damping;
        particle.vy *= damping;
      }
    }

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  /* -------------------------------------------------------
     LOOP
  ------------------------------------------------------- */

  loop(timestamp) {
    if (this.destroyed) {
      return;
    }

    this.raf = requestAnimationFrame(this.loop);

    if (!this.lastTs) {
      this.lastTs = timestamp;
    }

    const raw = (timestamp - this.lastTs) / 1000;
    this.lastTs = timestamp;
    const dt = Math.min(Math.max(raw, 0), 1 / 30);

    if (this.state === "paused") {
      this.render();
      return;
    }

    this.update(dt * (this.slowTimer > 0 ? this.slow : 1));
    this.render();
  }

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  render() {
    const ctx = this.ctx;
    const cfg = this.cfg;

    ctx.clearRect(0, 0, this.w, this.h);
    ctx.save();

    if (this.shake > 0.2) {
      ctx.translate(rand(-this.shake, this.shake), rand(-this.shake, this.shake) * 0.6);
    }

    this.drawSky(cfg);
    this.drawStars();
    this.drawSkyline(0.1, {
      color: cfg.far,
      baseY: this.groundY - 34,
      spacing: 158,
      minH: 80,
      maxH: 210,
      seed: 11,
    });
    this.drawTowers(0.17, cfg);
    this.drawSkyline(0.27, {
      color: cfg.mid,
      baseY: this.groundY + 4,
      spacing: 118,
      minH: 62,
      maxH: 168,
      seed: 37,
      windows: true,
    });
    this.drawLights(0.52);
    this.drawGround(cfg);
    this.drawSteam();
    this.drawFinish();
    drawRing(this);
    this.drawPlatforms();
    this.drawObstacles();
    this.drawOverheads();
    this.drawFoods();
    this.drawPickups();
    drawHazards(this);

    if (this.boss) {
      drawBoss(this, this.boss);
    }

    this.drawParticles();
    this.drawPlayer();
    ctx.restore();

    this.drawVignette();

    if (this.flash > 0) {
      ctx.fillStyle = `rgba(216, 137, 150, ${this.flash * 0.18})`;
      ctx.fillRect(0, 0, this.w, this.h);
    }

    if (
      this.state === "running" ||
      this.state === "arriving" ||
      this.state === "over" ||
      this.state === "complete" ||
      this.bossActive()
    ) {
      this.drawHud();
    }

    if (this.boss) {
      drawBossHud(this);
    }
  }

  drawSky(cfg) {
    const ctx = this.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, this.groundY + 20);

    gradient.addColorStop(0, cfg.sky[0]);
    gradient.addColorStop(0.55, cfg.sky[1]);
    gradient.addColorStop(1, cfg.sky[2]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.w, this.groundY + 24);

    const sunX = this.w * 0.74 - (this.camera.x * 0.012) % (this.w * 1.4);
    const sunY = this.h * 0.34;
    const sunR = Math.min(this.w, this.h) * 0.16;

    const glow = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, sunR * 2.6);
    glow.addColorStop(0, "rgba(217,164,65,0.4)");
    glow.addColorStop(0.4, "rgba(217,164,65,0.12)");
    glow.addColorStop(1, "rgba(217,164,65,0)");

    ctx.fillStyle = glow;
    ctx.fillRect(sunX - sunR * 2.6, sunY - sunR * 2.6, sunR * 5.2, sunR * 5.2);

    ctx.fillStyle = "rgba(240,233,223,0.82)";
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR * 0.42, 0, Math.PI * 2);
    ctx.fill();
  }

  drawStars() {
    const ctx = this.ctx;
    const cam = this.camera.x * 0.03;

    for (let i = 0; i < 46; i += 1) {
      const x = ((hash(i) * this.w * 2 - cam) % this.w + this.w) % this.w;
      const y = hash(i + 5.7) * this.groundY * 0.55;
      const twinkle = 0.32 + 0.3 * Math.sin(this.time * 1.6 + i);

      ctx.fillStyle = `rgba(240,233,223,${twinkle * 0.6})`;
      ctx.beginPath();
      ctx.arc(x, y, hash(i + 2.1) * 1.4 + 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawSkyline(factor, options) {
    const ctx = this.ctx;
    const { color, baseY, spacing, minH, maxH, seed, windows } = options;
    const cam = this.camera.x * factor;
    const start = Math.floor(cam / spacing) - 1;
    const end = start + Math.ceil(this.w / spacing) + 3;

    for (let i = start; i <= end; i += 1) {
      const height = minH + hash(i + seed) * (maxH - minH);
      const width = spacing * (0.58 + hash(i * 1.7 + seed) * 0.32);
      const x = i * spacing - cam;
      const roof = hash(i * 2.3 + seed);

      ctx.fillStyle = color;
      ctx.fillRect(x, baseY - height, width, height + 8);

      if (roof > 0.8) {
        ctx.fillRect(x + width * 0.4, baseY - height - 16, width * 0.14, 16);
      } else if (roof > 0.64) {
        ctx.beginPath();
        ctx.moveTo(x, baseY - height);
        ctx.lineTo(x + width / 2, baseY - height - 18);
        ctx.lineTo(x + width, baseY - height);
        ctx.closePath();
        ctx.fill();
      }

      if (windows) {
        for (let k = 0; k < 6; k += 1) {
          if (hash(i * 3.1 + k * 5.7 + seed) < 0.52) {
            continue;
          }

          ctx.fillStyle = `rgba(217,164,65,${0.28 + hash(i + k) * 0.35})`;
          ctx.fillRect(
            x + width * 0.16 + (k % 2) * width * 0.42,
            baseY - height + 16 + Math.floor(k / 2) * 24,
            6,
            9
          );
        }
      }
    }
  }

  drawTowers(factor, cfg) {
    const ctx = this.ctx;
    const cam = this.camera.x * factor;
    const spacing = 2400;
    const start = Math.floor(cam / spacing) - 1;
    const end = start + Math.ceil(this.w / spacing) + 2;

    ctx.fillStyle = cfg.far;

    for (let i = start; i <= end; i += 1) {
      const x = i * spacing - cam + hash(i) * 640;
      const height = 180 + hash(i + 3) * 80;
      const baseY = this.groundY - 20;
      const width = height * 0.42;

      ctx.beginPath();
      ctx.moveTo(x - width * 0.5, baseY);
      ctx.quadraticCurveTo(
        x - width * 0.16,
        baseY - height * 0.56,
        x - width * 0.05,
        baseY - height * 0.72
      );
      ctx.lineTo(x + width * 0.05, baseY - height * 0.72);
      ctx.quadraticCurveTo(
        x + width * 0.16,
        baseY - height * 0.56,
        x + width * 0.5,
        baseY
      );
      ctx.closePath();
      ctx.fill();

      ctx.fillRect(x - width * 0.3, baseY - height * 0.22, width * 0.6, height * 0.05);
      ctx.fillRect(x - height * 0.014, baseY - height * 0.96, height * 0.028, height * 0.26);
    }
  }

  drawLights(factor) {
    const ctx = this.ctx;
    const cam = this.camera.x * factor;
    const spacing = 350;
    const y = this.groundY - this.h * 0.46;
    const sag = 26;
    const start = Math.floor(cam / spacing) - 1;
    const end = start + Math.ceil(this.w / spacing) + 2;

    for (let i = start; i <= end; i += 1) {
      const x = i * spacing - cam;

      ctx.strokeStyle = "rgba(240,233,223,0.14)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + spacing / 2, y + sag, x + spacing, y);
      ctx.stroke();

      for (let k = 1; k < 8; k += 1) {
        const t = k / 8;
        const bulbX = x + spacing * t;
        const bulbY = y + sag * 2 * t * (1 - t) + 6;
        const twinkle = 0.55 + 0.45 * Math.sin(this.time * 2 + i + k);

        ctx.fillStyle = `rgba(217,164,65,${0.45 * twinkle})`;
        ctx.beginPath();
        ctx.arc(bulbX, bulbY, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  drawGround(cfg) {
    const ctx = this.ctx;
    const groundY = this.groundY;
    const height = this.h - groundY;

    ctx.fillStyle = cfg.ground;
    ctx.fillRect(0, groundY, this.w, height);

    const sheen = ctx.createLinearGradient(0, groundY, 0, groundY + height);
    sheen.addColorStop(0, "rgba(240,233,223,0.07)");
    sheen.addColorStop(0.35, "rgba(240,233,223,0.01)");
    sheen.addColorStop(1, "rgba(0,0,0,0.28)");

    ctx.fillStyle = sheen;
    ctx.fillRect(0, groundY, this.w, height);

    ctx.strokeStyle = "rgba(240,233,223,0.06)";
    ctx.lineWidth = 1;

    const tile = 96;
    const offset = -(this.camera.x % tile);

    for (let x = offset; x < this.w + tile; x += tile) {
      ctx.beginPath();
      ctx.moveTo(x, groundY + 12);
      ctx.lineTo(x - 24, this.h);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(0, groundY + height * 0.42);
    ctx.lineTo(this.w, groundY + height * 0.42);
    ctx.stroke();

    ctx.fillStyle = "rgba(197,166,107,0.55)";
    ctx.fillRect(0, groundY - 2, this.w, 2.5);

    ctx.fillStyle = "rgba(240,233,223,0.1)";
    ctx.fillRect(0, groundY + 3, this.w, 1);
  }

  drawSteam() {
    const ctx = this.ctx;

    for (let i = 0; i < 12; i += 1) {
      const seed = i * 7.3;
      const travel = (this.w + 320);
      const x =
        ((seed * 137 - this.camera.x * 0.32) % travel + travel) % travel - 160;
      const rise = (this.time * 20 + seed * 37) % 220;
      const y = this.groundY - 24 - rise;
      const alpha = (1 - rise / 220) * 0.07;

      ctx.fillStyle = `rgba(240,233,223,${alpha})`;
      ctx.beginPath();
      ctx.arc(x + Math.sin(this.time + seed) * 12, y, 14 + rise * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawFinish() {
    const ctx = this.ctx;
    const x = this.finishX - this.camera.x;

    if (x < -420 || x > this.w + 760) {
      return;
    }

    const groundY = this.groundY;
    const glow = ctx.createRadialGradient(x, groundY - 150, 20, x, groundY - 150, 360);

    glow.addColorStop(0, "rgba(217,164,65,0.34)");
    glow.addColorStop(1, "rgba(217,164,65,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(x - 360, groundY - 510, 720, 520);

    ctx.fillStyle = "#2a1f18";
    ctx.fillRect(x - 122, groundY - 246, 26, 246);
    ctx.fillRect(x + 96, groundY - 246, 26, 246);

    ctx.strokeStyle = "#c5a66b";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(x - 122, groundY - 240);
    ctx.quadraticCurveTo(x, groundY - 348, x + 122, groundY - 240);
    ctx.stroke();

    ctx.fillStyle = "rgba(240,233,223,0.94)";
    roundRect(ctx, x - 104, groundY - 306, 208, 56, 5);
    ctx.fill();

    ctx.fillStyle = "#3b0d16";
    ctx.font = "600 22px 'Cormorant Garamond', Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("À TABLE", x, groundY - 278);

    ctx.fillStyle = "rgba(240,233,223,0.55)";
    ctx.font = "600 8px Inter, Arial, sans-serif";
    ctx.fillText("FIN DU SERVICE", x, groundY - 236);

    /* the table itself */
    ctx.fillStyle = "#4a3122";
    ctx.fillRect(x + 158, groundY - 40, 250, 11);
    ctx.fillRect(x + 178, groundY - 29, 9, 29);
    ctx.fillRect(x + 378, groundY - 29, 9, 29);

    drawFoodIcon(ctx, "stew", x + 200, groundY - 58, 34);
    drawFoodIcon(ctx, this.cfg.foods[1], x + 248, groundY - 58, 30);
    drawFoodIcon(ctx, "wine", x + 302, groundY - 58, 30);
    drawFoodIcon(ctx, "baguette", x + 356, groundY - 58, 30);

    ctx.strokeStyle = "rgba(217,164,65,0.5)";
    ctx.lineWidth = 2;
    ctx.setLineDash([9, 10]);
    ctx.beginPath();
    ctx.moveTo(x, groundY - 218);
    ctx.lineTo(x, groundY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawPlatforms() {
    const ctx = this.ctx;

    for (const platform of this.platforms) {
      const x = platform.x - this.camera.x;

      if (x + platform.w < -80 || x > this.w + 80) {
        continue;
      }

      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.beginPath();
      ctx.ellipse(
        x + platform.w / 2,
        this.groundY + 7,
        platform.w * 0.42,
        6,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.fillStyle = "#33261d";
      roundRect(ctx, x, platform.y, platform.w, platform.h, 4);
      ctx.fill();

      ctx.fillStyle = "rgba(197,166,107,0.85)";
      ctx.fillRect(x + 2, platform.y, platform.w - 4, 2.5);

      ctx.fillStyle = "rgba(240,233,223,0.08)";
      ctx.fillRect(x + 2, platform.y + 3, platform.w - 4, 1);

      ctx.fillStyle = "rgba(216,137,150,0.35)";
      ctx.fillRect(x + platform.w * 0.12, platform.y + platform.h, platform.w * 0.76, 1.5);
    }
  }

  drawObstacles() {
    const ctx = this.ctx;

    for (const obstacle of this.obstacles) {
      const x = obstacle.x - this.camera.x;

      if (x + obstacle.w < -80 || x > this.w + 80) {
        continue;
      }

      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(
        x + obstacle.w / 2,
        this.groundY + 5,
        obstacle.w * 0.6,
        5,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      if (obstacle.kind === "crate") {
        ctx.fillStyle = "#6b4a2c";
        ctx.fillRect(x, obstacle.y, obstacle.w, obstacle.h);
        ctx.strokeStyle = "#3c2818";
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, obstacle.y + 1, obstacle.w - 2, obstacle.h - 2);
        ctx.beginPath();
        ctx.moveTo(x + 3, obstacle.y + 3);
        ctx.lineTo(x + obstacle.w - 3, obstacle.y + obstacle.h - 3);
        ctx.moveTo(x + obstacle.w - 3, obstacle.y + 3);
        ctx.lineTo(x + 3, obstacle.y + obstacle.h - 3);
        ctx.stroke();
        ctx.fillStyle = "rgba(217,164,65,0.7)";
        ctx.fillRect(x + obstacle.w * 0.3, obstacle.y + obstacle.h * 0.45, obstacle.w * 0.4, 3);
      } else if (obstacle.kind === "pot") {
        ctx.fillStyle = "#8a4d39";
        roundRect(ctx, x, obstacle.y + obstacle.h * 0.16, obstacle.w, obstacle.h * 0.84, 4);
        ctx.fill();
        ctx.strokeStyle = "#4a2418";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#c5a66b";
        ctx.fillRect(x - 5, obstacle.y + obstacle.h * 0.24, 7, 4);
        ctx.fillRect(x + obstacle.w - 2, obstacle.y + obstacle.h * 0.24, 7, 4);
        ctx.fillStyle = "#c5a66b";
        roundRect(ctx, x - 2, obstacle.y + obstacle.h * 0.08, obstacle.w + 4, 5, 2);
        ctx.fill();
        ctx.fillStyle = "rgba(240,233,223,0.18)";
        ctx.fillRect(x + obstacle.w * 0.16, obstacle.y + obstacle.h * 0.3, 3, obstacle.h * 0.42);
      } else if (obstacle.kind === "stack") {
        for (let i = 0; i < 5; i += 1) {
          const plateW = obstacle.w - i * 3;
          const plateY = obstacle.y + obstacle.h - (i + 1) * (obstacle.h / 5);

          ctx.fillStyle = i % 2 === 0 ? "#efe6d6" : "#d8c9b2";
          roundRect(ctx, x + (obstacle.w - plateW) / 2, plateY, plateW, obstacle.h / 5 - 1.5, 3);
          ctx.fill();
          ctx.fillStyle = "rgba(197,166,107,0.5)";
          ctx.fillRect(x + (obstacle.w - plateW) / 2 + 2, plateY + obstacle.h / 5 - 3, plateW - 4, 1);
        }
      } else {
        const bottleX = x + obstacle.w * 0.1;
        const bottleW = obstacle.w * 0.44;
        const neckW = bottleW * 0.34;

        ctx.fillStyle = "#3f2a1c";
        roundRect(ctx, bottleX, obstacle.y + obstacle.h * 0.28, bottleW, obstacle.h * 0.72, 4);
        ctx.fill();
        ctx.fillStyle = "#3f2a1c";
        ctx.fillRect(
          bottleX + (bottleW - neckW) / 2,
          obstacle.y + obstacle.h * 0.06,
          neckW,
          obstacle.h * 0.26
        );
        ctx.fillStyle = "#8d1f2f";
        ctx.fillRect(bottleX + 3, obstacle.y + obstacle.h * 0.18, bottleW - 6, 8);

        ctx.fillStyle = "#5b3a24";
        roundRect(
          ctx,
          x + obstacle.w * 0.58,
          obstacle.y + obstacle.h * 0.46,
          obstacle.w * 0.4,
          obstacle.h * 0.54,
          4
        );
        ctx.fill();
        ctx.fillStyle = "rgba(240,233,223,0.2)";
        ctx.fillRect(x + obstacle.w * 0.62, obstacle.y + obstacle.h * 0.56, 2, obstacle.h * 0.32);
      }
    }
  }

  drawFoods() {
    const ctx = this.ctx;
    const size = this.playerH * 0.5;

    for (const food of this.foods) {
      const x = food.x - this.camera.x;

      if (x < -70 || x > this.w + 70) {
        continue;
      }

      const bob = Math.sin(this.time * 2.6 + food.phase) * 3;
      const y = food.y + bob;

      const glow = ctx.createRadialGradient(x, y, 2, x, y, size * 1.15);
      glow.addColorStop(0, this.alphaColor(food.accent, 0.34));
      glow.addColorStop(1, this.alphaColor(food.accent, 0));
      ctx.fillStyle = glow;
      ctx.fillRect(x - size * 1.2, y - size * 1.2, size * 2.4, size * 2.4);

      drawFoodIcon(ctx, food.icon, x, y, size, {
        rotation: Math.sin(this.time * 1.7 + food.phase) * 0.11,
      });
    }
  }

  drawOverheads() {
    const ctx = this.ctx;
    const ph = this.playerH;
    const beamY = this.groundY - ph * 2.8;

    for (const overhead of this.overheads) {
      const x = overhead.x - this.camera.x;

      if (x + overhead.w < -140 || x > this.w + 140) {
        continue;
      }

      ctx.fillStyle = "#2b1d15";
      ctx.fillRect(x - ph * 0.4, beamY, overhead.w + ph * 0.8, ph * 0.09);
      ctx.fillStyle = "rgba(197,166,107,0.45)";
      ctx.fillRect(x - ph * 0.4, beamY, overhead.w + ph * 0.8, 1.5);

      const sway = Math.sin(this.time * 1.2 + overhead.seed) * 1.5;

      ctx.save();
      ctx.translate(x + overhead.w / 2 + sway, 0);

      ctx.strokeStyle = "rgba(240,233,223,0.22)";
      ctx.lineWidth = 1.3;

      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(side * overhead.w * 0.3, beamY + ph * 0.09);
        ctx.lineTo(side * overhead.w * 0.3, overhead.y);
        ctx.stroke();
      }

      ctx.translate(-overhead.w / 2, 0);

      if (overhead.kind === "ham") {
        ctx.fillStyle = "#a85a4a";
        ctx.beginPath();
        ctx.ellipse(
          overhead.w / 2,
          overhead.y + overhead.h * 0.55,
          overhead.w * 0.42,
          overhead.h * 0.44,
          0.1,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.fillStyle = "#e8c39a";
        ctx.beginPath();
        ctx.arc(
          overhead.w / 2 + overhead.w * 0.3,
          overhead.y + overhead.h * 0.2,
          overhead.h * 0.1,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.fillStyle = "rgba(240,233,223,0.22)";
        ctx.beginPath();
        ctx.ellipse(
          overhead.w * 0.36,
          overhead.y + overhead.h * 0.42,
          overhead.w * 0.12,
          overhead.h * 0.16,
          0.3,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else {
        ctx.fillStyle = "#3a2418";
        roundRect(ctx, 0, overhead.y, overhead.w, overhead.h, 3);
        ctx.fill();
        ctx.strokeStyle = "rgba(217,164,65,0.7)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#d9a441";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `700 ${Math.max(6, Math.round(overhead.h * 0.24))}px Inter, Arial, sans-serif`;
        ctx.fillText(
          overhead.seed > 5 ? "PAIN" : "JAMBON",
          overhead.w / 2,
          overhead.y + overhead.h * 0.5
        );
      }

      ctx.restore();
    }
  }

  drawPickups() {
    const ctx = this.ctx;
    const size = this.playerH * 0.46;

    for (const pickup of this.pickups) {
      const x = pickup.x - this.camera.x;

      if (x < -80 || x > this.w + 80) {
        continue;
      }

      const def = PICKUPS[pickup.kind];
      const y = pickup.y + Math.sin(this.time * 2.2 + pickup.phase) * 4;

      ctx.save();
      ctx.translate(x, y);

      const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, size * 1.6);
      glow.addColorStop(0, this.alphaColor(def.color, 0.45));
      glow.addColorStop(1, this.alphaColor(def.color, 0));
      ctx.fillStyle = glow;
      ctx.fillRect(-size * 1.7, -size * 1.7, size * 3.4, size * 3.4);

      ctx.fillStyle = "rgba(12,8,6,0.48)";
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = this.alphaColor(def.color, 0.8);
      ctx.lineWidth = 1.4;
      ctx.stroke();

      drawFoodIcon(ctx, def.icon, 0, 0, size, {
        rotation: Math.sin(this.time * 1.4 + pickup.phase) * 0.08,
      });

      ctx.fillStyle = def.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `700 ${Math.max(7, Math.round(size * 0.32))}px Inter, Arial, sans-serif`;
      ctx.fillText(def.label, 0, size * 1.02);

      ctx.restore();
    }
  }

  drawParticles() {
    const ctx = this.ctx;

    for (const particle of this.particles) {
      const x = particle.x - this.camera.x;

      if (x < -90 || x > this.w + 90) {
        continue;
      }

      const alpha = clamp(particle.life / particle.max, 0, 1);

      ctx.globalAlpha = alpha;

      if (particle.type === "dust") {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(x, particle.y, particle.size * (1.5 - alpha * 0.5), 0, Math.PI * 2);
        ctx.fill();
      } else if (particle.type === "ring") {
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, particle.y, particle.size * (1 + (1 - alpha) * 1.8), 0, Math.PI * 2);
        ctx.stroke();
      } else if (particle.type === "spark") {
        ctx.fillStyle = particle.color;
        ctx.save();
        ctx.translate(x, particle.y);
        ctx.rotate(particle.rot);
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        ctx.restore();
      } else if (particle.type === "shard") {
        ctx.fillStyle = particle.color;
        ctx.save();
        ctx.translate(x, particle.y);
        ctx.rotate(particle.rot);
        ctx.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size * 0.5);
        ctx.restore();
      } else if (particle.type === "text") {
        ctx.fillStyle = particle.color;
        ctx.font = `700 ${Math.round(particle.size)}px Inter, Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(particle.text, x, particle.y);
      } else if (particle.type === "confetti") {
        ctx.fillStyle = particle.color;
        ctx.save();
        ctx.translate(x, particle.y);
        ctx.rotate(particle.rot);
        ctx.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size * 0.5);
        ctx.restore();
      }
    }

    ctx.globalAlpha = 1;
  }

  drawPlayer() {
    const ctx = this.ctx;
    const player = this.player;

    if (!player) {
      return;
    }

    const H = player.h;
    const W = player.w;
    const centerX = player.x + W / 2 - this.camera.x;
    const feetY = player.y + H;
    const airborne = !player.grounded;
    const run = player.run;
    const bounce = airborne ? 0 : Math.abs(Math.sin(run)) * H * 0.025;
    const lean = airborne
      ? clamp(player.vy / 4200, -0.1, 0.16)
      : 0.05 + Math.sin(run * 2) * 0.015;

    ctx.save();
    ctx.translate(centerX, feetY + bounce);

    /* shadow */
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(0, 4, W * 0.72, H * 0.055, 0, 0, Math.PI * 2);
    ctx.fill();

    if (player.invuln > 0) {
      ctx.globalAlpha = 0.45 + 0.55 * Math.abs(Math.sin(this.time * 22));
      ctx.strokeStyle = "rgba(217,164,65,0.55)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -H * 0.5, W * 0.95, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    const squash = player.squash;

    ctx.rotate(lean);
    ctx.scale(1 - squash, 1 + squash);

    if (this.slideTimer > 0) {
      ctx.scale(1.18, 0.56);
    }

    const hipY = -H * 0.44;
    const shoulderY = -H * 0.79;
    const headY = -H * 0.92;
    const legSwing = airborne
      ? H * 0.09
      : Math.sin(run) * H * 0.15;
    const armSwing = airborne ? -H * 0.06 : Math.sin(run + Math.PI) * H * 0.12;

    /* legs */
    ctx.lineCap = "round";
    ctx.strokeStyle = "#141b2b";
    ctx.lineWidth = H * 0.115;

    ctx.beginPath();
    ctx.moveTo(-W * 0.12, hipY);
    ctx.lineTo(-W * 0.12 + legSwing * 0.7, hipY + H * 0.2);
    ctx.lineTo(-W * 0.12 + legSwing, hipY + H * 0.4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(W * 0.12, hipY);
    ctx.lineTo(W * 0.12 - legSwing * 0.7, hipY + H * 0.2);
    ctx.lineTo(W * 0.12 - legSwing, hipY + H * 0.4);
    ctx.stroke();

    /* shoes */
    ctx.fillStyle = "#0b0d14";
    ctx.beginPath();
    ctx.ellipse(-W * 0.12 + legSwing, hipY + H * 0.42, W * 0.2, H * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(W * 0.12 - legSwing, hipY + H * 0.42, W * 0.2, H * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();

    /* jacket */
    ctx.fillStyle = "#1c2740";
    roundRect(ctx, -W * 0.42, shoulderY, W * 0.84, -hipY + H * 0.02, W * 0.14);
    ctx.fill();

    /* jacket lapels */
    ctx.strokeStyle = "rgba(240,233,223,0.16)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-W * 0.18, shoulderY + H * 0.02);
    ctx.lineTo(0, shoulderY + H * 0.1);
    ctx.lineTo(W * 0.18, shoulderY + H * 0.02);
    ctx.stroke();

    /* shirt */
    ctx.fillStyle = "#f2ece1";
    ctx.beginPath();
    ctx.moveTo(-W * 0.16, shoulderY + H * 0.015);
    ctx.lineTo(W * 0.16, shoulderY + H * 0.015);
    ctx.lineTo(0, shoulderY + H * 0.15);
    ctx.closePath();
    ctx.fill();

    /* tie */
    ctx.fillStyle = "#0f1830";
    ctx.beginPath();
    ctx.moveTo(-W * 0.055, shoulderY + H * 0.03);
    ctx.lineTo(W * 0.055, shoulderY + H * 0.03);
    ctx.lineTo(W * 0.02, shoulderY + H * 0.17);
    ctx.lineTo(-W * 0.02, shoulderY + H * 0.17);
    ctx.closePath();
    ctx.fill();

    /* napkin tucked into the collar */
    ctx.fillStyle = "rgba(242,236,225,0.92)";
    ctx.beginPath();
    ctx.moveTo(W * 0.02, shoulderY + H * 0.02);
    ctx.lineTo(W * 0.24, shoulderY + H * 0.02);
    ctx.lineTo(W * 0.13, shoulderY + H * 0.14);
    ctx.closePath();
    ctx.fill();

    /* tricolour rosette */
    ctx.fillStyle = "#345191";
    ctx.fillRect(-W * 0.33, shoulderY + H * 0.12, W * 0.045, H * 0.035);
    ctx.fillStyle = "#f2ece1";
    ctx.fillRect(-W * 0.285, shoulderY + H * 0.12, W * 0.045, H * 0.035);
    ctx.fillStyle = "#a83447";
    ctx.fillRect(-W * 0.24, shoulderY + H * 0.12, W * 0.045, H * 0.035);

    /* arms */
    ctx.strokeStyle = "#1c2740";
    ctx.lineWidth = H * 0.095;

    ctx.beginPath();
    ctx.moveTo(-W * 0.32, shoulderY + H * 0.06);
    ctx.lineTo(-W * 0.44, shoulderY + H * 0.2 + armSwing * 0.4);
    ctx.lineTo(-W * 0.4 + armSwing * 0.3, shoulderY + H * 0.3 + armSwing);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(W * 0.32, shoulderY + H * 0.06);
    ctx.lineTo(W * 0.44, shoulderY + H * 0.2 - armSwing * 0.4);
    ctx.lineTo(W * 0.4 - armSwing * 0.3, shoulderY + H * 0.3 - armSwing);
    ctx.stroke();

    /* hands */
    ctx.fillStyle = "#e3bd98";
    ctx.beginPath();
    ctx.arc(-W * 0.4 + armSwing * 0.3, shoulderY + H * 0.32 + armSwing, H * 0.045, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(W * 0.4 - armSwing * 0.3, shoulderY + H * 0.32 - armSwing, H * 0.045, 0, Math.PI * 2);
    ctx.fill();

    /* head */
    ctx.fillStyle = "#e8c39a";
    ctx.beginPath();
    ctx.arc(0, headY, H * 0.135, 0, Math.PI * 2);
    ctx.fill();

    /* hair */
    ctx.fillStyle = "#31221a";
    ctx.beginPath();
    ctx.arc(0, headY - H * 0.018, H * 0.138, Math.PI * 1.03, Math.PI * 1.97);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-H * 0.01, headY - H * 0.095, H * 0.135, H * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();

    /* ear */
    ctx.fillStyle = "#dcb38b";
    ctx.beginPath();
    ctx.arc(-H * 0.125, headY + H * 0.005, H * 0.03, 0, Math.PI * 2);
    ctx.fill();

    /* face */
    ctx.fillStyle = "#3a2a22";
    ctx.beginPath();
    ctx.arc(H * 0.055, headY - H * 0.012, H * 0.0135, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(H * 0.108, headY - H * 0.01, H * 0.012, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(58,42,34,0.7)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(H * 0.07, headY + H * 0.045, H * 0.035, 0.25, Math.PI - 0.2);
    ctx.stroke();

    /* the jab */
    if (this.punchTimer > 0) {
      const phase = 1 - this.punchTimer / 0.24;
      const reach = Math.sin(clamp(phase, 0, 1) * Math.PI);
      const fistX = W * 0.5 + W * 0.62 * reach;
      const fistY = shoulderY + H * 0.24;

      ctx.strokeStyle = "#1c2740";
      ctx.lineWidth = H * 0.09;
      ctx.beginPath();
      ctx.moveTo(W * 0.32, shoulderY + H * 0.1);
      ctx.lineTo(fistX, fistY);
      ctx.stroke();

      ctx.fillStyle = "#e3bd98";
      roundRect(ctx, fistX - H * 0.02, fistY - H * 0.055, H * 0.1, H * 0.11, H * 0.035);
      ctx.fill();

      ctx.strokeStyle = "rgba(240,233,223,0.5)";
      ctx.lineWidth = 2;

      for (let i = 0; i < 3; i += 1) {
        const lineY = fistY - H * 0.06 + i * H * 0.06;

        ctx.beginPath();
        ctx.moveTo(fistX + H * 0.12, lineY);
        ctx.lineTo(fistX + H * 0.12 + H * 0.12 * reach, lineY);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  drawVignette() {
    const ctx = this.ctx;

    if (this.vignette) {
      ctx.fillStyle = this.vignette;
      ctx.fillRect(0, 0, this.w, this.h);
    }

    ctx.fillStyle = "rgba(10,8,7,0.18)";
    ctx.fillRect(0, 0, this.w, 2);
    ctx.fillRect(0, this.h - 2, this.w, 2);
  }

  drawHud() {
    const ctx = this.ctx;
    const cfg = this.cfg;
    const pad = Math.max(14, this.w * 0.024);
    const toqueSize = clamp(this.h * 0.05, 18, 27);
    const smallFont = clamp(this.h * 0.017, 9, 12);

    ctx.save();
    ctx.textBaseline = "middle";

    /* lives — chef toques */
    for (let i = 0; i < cfg.hearts; i += 1) {
      this.drawToque(
        pad + i * (toqueSize + 9) + toqueSize / 2,
        pad + toqueSize / 2,
        toqueSize,
        i < this.hearts
      );
    }

    /* the ring keeps only the hearts: the scorecard owns the rest */
    if (!this.bossActive()) {
    /* collected dishes + combo */
    const foodY = pad + toqueSize + smallFont + 12;

    drawFoodIcon(ctx, cfg.foods[0], pad + 9, foodY, 20, { alpha: 0.95 });

    ctx.fillStyle = "rgba(240,233,223,0.92)";
    ctx.font = `600 ${Math.round(smallFont * 1.15)}px Inter, Arial, sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(`× ${this.foodCount}`, pad + 24, foodY + 1);

    if (this.multiplier > 1) {
      const badgeX = pad + 24 + Math.round(smallFont * 2.4) + 18;

      ctx.fillStyle = "rgba(217,164,65,0.18)";
      roundRect(ctx, badgeX, foodY - 9, 34, 18, 9);
      ctx.fill();
      ctx.strokeStyle = "rgba(217,164,65,0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#d9a441";
      ctx.textAlign = "center";
      ctx.font = `700 ${Math.round(smallFont * 0.95)}px Inter, Arial, sans-serif`;
      ctx.fillText(`×${this.multiplier}`, badgeX + 17, foodY + 1);

      ctx.fillStyle = "rgba(217,164,65,0.16)";
      ctx.fillRect(badgeX, foodY + 12, 34, 2);
      ctx.fillStyle = "rgba(217,164,65,0.8)";
      ctx.fillRect(badgeX, foodY + 12, 34 * clamp(this.comboTimer / 1.8, 0, 1), 2);
    }

    /* active pickups */
    const chips = [];

    if (this.shield) {
      chips.push({ label: "BOUCLIER", color: "#f0e9df" });
    }

    if (this.boostTimer > 0) {
      chips.push({ label: `SPRINT ${Math.ceil(this.boostTimer)}s`, color: "#d9a441" });
    }

    if (this.magnetTimer > 0) {
      chips.push({ label: `AIMANT ${Math.ceil(this.magnetTimer)}s`, color: "#d88996" });
    }

    let chipX = pad;

    for (const chip of chips) {
      const chipWidth = 12 + chip.label.length * smallFont * 0.6;

      ctx.fillStyle = "rgba(10,8,7,0.45)";
      roundRect(ctx, chipX, foodY + 20, chipWidth, 16, 8);
      ctx.fill();
      ctx.strokeStyle = this.alphaColor(chip.color, 0.5);
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = chip.color;
      ctx.textAlign = "center";
      ctx.font = `700 ${Math.round(smallFont * 0.78)}px Inter, Arial, sans-serif`;
      ctx.fillText(chip.label, chipX + chipWidth / 2, foodY + 28);

      chipX += chipWidth + 6;
    }

    /* score */
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(240,233,223,0.95)";
    ctx.font = `400 ${Math.round(clamp(this.h * 0.045, 20, 32))}px 'Cormorant Garamond', Georgia, serif`;
    ctx.fillText(String(Math.round(this.score)).padStart(4, "0"), this.w - pad, pad + 12);

    ctx.fillStyle = "rgba(240,233,223,0.42)";
    ctx.font = `600 ${Math.round(smallFont * 0.85)}px Inter, Arial, sans-serif`;
    ctx.fillText(
      `RECORD ${this.best > 0 ? this.best : "—"}`,
      this.w - pad,
      pad + 12 + clamp(this.h * 0.045, 20, 32) * 0.62
    );
    }

    /* progress — the ring borrows this band for the scorecard */
    if (!this.bossActive()) {
      const barWidth = Math.min(this.w * 0.38, 360);
      const barX = (this.w - barWidth) / 2;
      const barY = pad + 10;
      const progress = clamp(this.distance / cfg.length, 0, 1);

      ctx.fillStyle = "rgba(240,233,223,0.14)";
      roundRect(ctx, barX, barY, barWidth, 4, 2);
      ctx.fill();

      const fill = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
      fill.addColorStop(0, "rgba(216,137,150,0.9)");
      fill.addColorStop(1, "rgba(217,164,65,0.95)");
      ctx.fillStyle = fill;
      roundRect(ctx, barX, barY, Math.max(4, barWidth * progress), 4, 2);
      ctx.fill();

      drawFoodIcon(ctx, "brulee", barX + barWidth + 14, barY + 2, 16, { alpha: 0.7 });

      ctx.fillStyle = "rgba(240,233,223,0.55)";
      ctx.textAlign = "center";
      ctx.font = `600 ${Math.round(smallFont * 0.8)}px Inter, Arial, sans-serif`;
      ctx.fillText(
        `${Math.round(this.distance)} / ${cfg.length} M`,
        barX + barWidth / 2,
        barY + 18
      );
    }

    ctx.restore();
  }

  drawToque(x, y, size, filled) {
    const ctx = this.ctx;

    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = filled ? "#f0e9df" : "rgba(240,233,223,0.2)";

    ctx.beginPath();
    ctx.arc(-size * 0.22, -size * 0.04, size * 0.25, Math.PI, 0);
    ctx.arc(0, -size * 0.2, size * 0.3, Math.PI * 1.08, -0.12);
    ctx.arc(size * 0.22, -size * 0.04, size * 0.25, Math.PI, 0);
    ctx.closePath();
    ctx.fill();

    roundRect(ctx, -size * 0.4, size * 0.04, size * 0.8, size * 0.22, 2);
    ctx.fill();

    ctx.restore();
  }

  alphaColor(hex, alpha) {
    if (!hex || hex[0] !== "#") {
      return `rgba(217,164,65,${alpha})`;
    }

    const value = hex.replace("#", "");
    const bigint = parseInt(
      value.length === 3
        ? value
            .split("")
            .map((character) => character + character)
            .join("")
        : value,
      16
    );

    return `rgba(${(bigint >> 16) & 255},${(bigint >> 8) & 255},${bigint & 255},${alpha})`;
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);

    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("pointerup", this.handlePointerUp);
    window.removeEventListener("pointercancel", this.handlePointerUp);
    document.removeEventListener("visibilitychange", this.handleVisibility);
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.observer?.disconnect();
    this.sfx.destroy();
  }
}

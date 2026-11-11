import { drawFoodIcon } from "./foodArt";

/* =========================================================
   LE RING — the bosses that interrupt the service
========================================================= */

export const BOSS_MILESTONES = [100, 500, 1000, 2000, 4000, 8000];

const CREAM = "#f0e9df";
const GOLD = "#d9a441";
const ROSE = "#d88996";
const BURGUNDY = "#3b0d16";
const BLUE = "#345191";
const TRICOLOR = [BLUE, CREAM, "#a83447"];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const rand = (min, max) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

const serif = (size, weight = 500) =>
  `${weight} ${Math.round(size)}px 'Cormorant Garamond', Georgia, serif`;
const sans = (size, weight = 600) =>
  `${weight} ${Math.round(size)}px Inter, Arial, sans-serif`;

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

/* Every boss is a bad-tempered French archetype who takes the
   president's run personally. Lines are the comedy engine here. */

export const BOSSES = [
  {
    id: "pedestrian",
    nameFr: "Le Piéton Furieux",
    nameEn: "The Furious Pedestrian",
    tagFr: "Il traversait, lui.",
    tagEn: "He was crossing, actually.",
    attacks: ["charge", "throw", "slam"],
    projectile: "baguette",
    roundLabel: "LE PASSAGE PIÉTON",
    palette: {
      coat: "#2b3f6b",
      trim: "#a83447",
      trousers: "#20222c",
      hat: "beret",
      stripes: true,
      apron: false,
      scarf: true,
      moustache: true,
      monocle: false,
      item: "baguette",
    },
    lines: {
      enter: ["TU AS TRAVERSÉ HORS DES CLOUS !"],
      telegraph: ["NON MAIS OH !", "C'EST INADMISSIBLE.", "OOH LÀ LÀ."],
      attack: ["Attention, je m'énerve.", "Tu vas voir !", "Pouet pouet !"],
      hurt: ["Aïe ! Purée !", "Bof.", "Je boude, très fort."],
      defeat: ["Bon. D'accord. J'ai rien dit.", "Je retourne manifester."],
    },
  },
  {
    id: "waiter",
    nameFr: "Le Serveur Colérique",
    nameEn: "The Furious Waiter",
    tagFr: "On ne claque pas des doigts.",
    tagEn: "One does not snap one's fingers.",
    attacks: ["throw", "slam", "charge"],
    projectile: "plate",
    roundLabel: "LE SERVICE EN SALLE",
    palette: {
      coat: "#191b24",
      trim: "#d9a441",
      trousers: "#16161c",
      hat: "hair",
      stripes: false,
      apron: true,
      scarf: false,
      moustache: true,
      monocle: false,
      item: "tray",
    },
    lines: {
      enter: ["VOUS N'AVEZ PAS DIT BONJOUR !"],
      telegraph: ["Monsieur...", "Je suis navré d'insister.", "C'est du vol."],
      attack: ["L'addition !", "Ça vient, ça vient !", "Trop de sel, monsieur."],
      hurt: ["Ah ! Mon plateau !", "C'est pas possible.", "Je vais le dire au chef."],
      defeat: ["Je reprends votre assiette.", "Très bien. TRÈS BIEN."],
    },
  },
  {
    id: "mime",
    nameFr: "Le Mime Susceptible",
    nameEn: "The Touchy Mime",
    tagFr: "Il ne dit rien. C'est le pire.",
    tagEn: "He says nothing. That's the worst part.",
    attacks: ["spin", "throw", "slam"],
    projectile: "pie",
    roundLabel: "LE SILENCE",
    palette: {
      coat: "#1b1b22",
      trim: "#f0e9df",
      trousers: "#14141a",
      hat: "mime",
      stripes: true,
      apron: false,
      scarf: false,
      moustache: false,
      monocle: false,
      item: "none",
    },
    lines: {
      enter: ["...", "(il est très vexé)"],
      telegraph: ["...", "...!", "…"],
      attack: ["(tarte invisible)", "(mur invisible)", "(silence insultant)"],
      hurt: ["...", "(il note quelque chose)", "…"],
      defeat: ["(il applaudit, lentement)", "(fin du numéro)"],
    },
  },
  {
    id: "fromager",
    nameFr: "Le Fromager Suprême",
    nameEn: "The Supreme Cheesemonger",
    tagFr: "Ne touchez pas à son camembert.",
    tagEn: "Do not touch his camembert.",
    attacks: ["roll", "throw", "slam"],
    projectile: "camembert",
    roundLabel: "LA MEILLEURE AFFAIRE",
    palette: {
      coat: "#6b4b2a",
      trim: "#c5a66b",
      trousers: "#2c2118",
      hat: "chef",
      stripes: false,
      apron: true,
      scarf: false,
      moustache: true,
      monocle: false,
      item: "cheese",
    },
    lines: {
      enter: ["TOUCHE PAS À MON CAMEMBERT !"],
      telegraph: ["Attention, il est bien fait.", "Ça sent bon, hein ?", "Doucement !"],
      attack: ["Roule, mon petit !", "Un peu de croûte !", "Ça pique le nez."],
      hurt: ["Mon affinage !", "Bof, c'est du lait.", "Sacrilège !"],
      defeat: ["Il était trop fait de toute façon.", "Goûtez, au moins."],
    },
  },
  {
    id: "critic",
    nameFr: "Le Critique Gastronomique",
    nameEn: "The Food Critic",
    tagFr: "Une étoile. Pas deux.",
    tagEn: "One star. Not two.",
    attacks: ["throw", "charge", "summon"],
    projectile: "plate",
    roundLabel: "LA DÉGUSTATION",
    palette: {
      coat: "#22352a",
      trim: "#d9a441",
      trousers: "#1b201c",
      hat: "fedora",
      stripes: false,
      apron: false,
      scarf: false,
      moustache: false,
      monocle: true,
      item: "fork",
    },
    lines: {
      enter: ["TROP DE SEL. ZÉRO ÉTOILE."],
      telegraph: ["Hum.", "Intéressant... non.", "Je note, je note."],
      attack: ["Ma fourchette juge.", "C'est tiède.", "La texture, franchement."],
      hurt: ["Ma note baisse.", "Quelle audace.", "Je suis atterré."],
      defeat: ["Deux étoiles. Peut-être.", "Je reviendrai, incognito."],
    },
  },
];

/* ---------------------------------------------------------
   CREATION
--------------------------------------------------------- */

export function createBoss(engine, tier) {
  const def = BOSSES[tier % BOSSES.length];
  const height = engine.playerH * 1.72;
  const width = height * 0.56;
  const ring = engine.ring;
  const maxHp = 3 + Math.floor(tier / 2);

  return {
    def,
    tier,
    w: width,
    h: height,
    x: ring.right - width - ring.width * 0.06,
    y: engine.groundY - height - height * 1.4,
    vx: 0,
    vy: 0,
    hp: maxHp,
    maxHp,
    mode: "enter",
    timer: 0.95,
    attackIndex: 0,
    pending: def.attacks[0],
    facing: -1,
    flash: 0,
    invuln: 0,
    tilt: 0,
    spin: 0,
    walk: 0,
    taunt: def.lines.enter[0],
    tauntTimer: 3.4,
    koTimer: 0,
  };
}

/* ---------------------------------------------------------
   GEOMETRY
--------------------------------------------------------- */

function playerBox(engine) {
  const player = engine.player;

  return {
    x: player.x + player.w * 0.22,
    y: player.y + player.h * 0.06,
    w: player.w * 0.56,
    h: player.h * 0.9,
  };
}

function bossBox(boss) {
  return {
    x: boss.x + boss.w * 0.2,
    y: boss.y + boss.h * 0.06,
    w: boss.w * 0.6,
    h: boss.h * 0.9,
  };
}

function overlaps(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

/* ---------------------------------------------------------
   HAZARDS
--------------------------------------------------------- */

function spawnHazard(engine, hazard) {
  engine.hazards.push({
    kind: "plate",
    gravity: 1900,
    vx: 0,
    vy: 0,
    w: engine.playerH * 0.4,
    h: engine.playerH * 0.4,
    rot: 0,
    spin: 0,
    life: 3,
    dead: false,
    ...hazard,
  });
}

function hazardBox(hazard) {
  return {
    x: hazard.x - hazard.w / 2,
    y: hazard.y - hazard.h / 2,
    w: hazard.w,
    h: hazard.h,
  };
}

export function updateHazards(engine, dt) {
  const ring = engine.ring;
  const player = engine.player;
  
  for (const hazard of engine.hazards) {
    if (hazard.dead) {
      continue;
    }

    hazard.life -= dt;
    hazard.rot += hazard.spin * dt;

    if (hazard.kind === "pigeon") {
      hazard.x += hazard.vx * dt;
      hazard.wing = (hazard.wing || 0) + dt * 16;

      if (ring && (hazard.x < ring.left - 90 || hazard.x > ring.right + 90)) {
        hazard.dead = true;
      }

      if (hazard.life <= 0) {
        hazard.dead = true;
      }
    } else if (hazard.kind === "wave") {
      hazard.x += hazard.vx * dt;

      if (hazard.life <= 0) {
        hazard.dead = true;
      }
    } else {
      hazard.vy += hazard.gravity * dt;
      hazard.x += hazard.vx * dt;
      hazard.y += hazard.vy * dt;

      if (
        hazard.y > engine.groundY + 50 ||
        hazard.life <= 0 ||
        hazard.x < engine.camera.x - 160 ||
        hazard.x > engine.camera.x + engine.w + 160
      ) {
        hazard.dead = true;
      }
    }

    if (
      !hazard.dead &&
      player.invuln <= 0 &&
      overlaps(hazardBox(hazard), playerBox(engine))
    ) {
      hazard.dead = true;
      engine.hit();
      engine.spawnSpark(hazard.x, hazard.y, 7, ROSE);
    }
  }

  engine.hazards = engine.hazards.filter((hazard) => !hazard.dead);
}

function throwProjectile(engine, boss) {
  const player = engine.player;
  const playerX = player.x + player.w / 2;
  const bossX = boss.x + boss.w / 2;
  const speed = engine.playerH * 6.4;
  const flight = Math.max(0.5, Math.abs(playerX - bossX) / speed);
  const size = engine.playerH * (boss.def.projectile === "camembert" ? 0.6 : 0.46);

  spawnHazard(engine, {
    kind: boss.def.projectile,
    x: bossX,
    y: boss.y + boss.h * 0.34,
    vx: (playerX - bossX) / flight,
    vy: -engine.playerH * 4.5,
    w: size,
    h: size * 0.72,
    gravity: 1700,
    spin: rand(-8, 8),
    life: 3,
  });

  engine.sfx.play("cork");
}

function spawnWaves(engine, boss) {
  const height = engine.playerH * 0.5;

  for (const direction of [-1, 1]) {
    spawnHazard(engine, {
      kind: "wave",
      x: boss.x + boss.w / 2,
      y: engine.groundY - height / 2,
      vx: direction * engine.playerH * 3.9,
      vy: 0,
      w: engine.playerH * 0.7,
      h: height,
      gravity: 0,
      life: 1.9,
    });
  }

  engine.shake = engine.reduced ? 0 : 16;
  engine.spawnDust(boss.x + boss.w / 2, engine.groundY, 14);
  engine.sfx.play("thud");
}

function summonPigeons(engine) {
  const ring = engine.ring;

  for (const side of [-1, 1]) {
    spawnHazard(engine, {
      kind: "pigeon",
      x: side < 0 ? ring.left + 18 : ring.right - 18,
      y: engine.groundY - engine.playerH * 0.34,
      vx: side < 0 ? engine.playerH * 2.9 : -engine.playerH * 2.9,
      w: engine.playerH * 0.5,
      h: engine.playerH * 0.34,
      gravity: 0,
      life: 9,
      wing: 0,
    });
  }

  engine.sfx.play("coo");
}

/* ---------------------------------------------------------
   BOSS AI
--------------------------------------------------------- */

function recover(engine, boss, duration) {
  boss.mode = "recover";
  boss.timer = duration;
  boss.vx = 0;
}

function executeAttack(engine, boss) {
  const player = engine.player;
  const direction =
    player.x + player.w / 2 < boss.x + boss.w / 2 ? -1 : 1;

  boss.facing = direction;
  boss.taunt = pick(boss.def.lines.attack);
  boss.tauntTimer = 1.5;

  switch (boss.pending) {
    case "throw":
      throwProjectile(engine, boss);
      recover(engine, boss, 0.65);
      return;

    case "slam":
      boss.mode = "slam";
      boss.vy = -Math.sqrt(2 * 2500 * engine.playerH * 2.1);
      engine.sfx.play("jump");
      return;

    case "summon":
      summonPigeons(engine);
      recover(engine, boss, 0.75);
      return;

    case "spin":
    case "roll":
    case "charge":
    default:
      boss.mode = "charge";
      boss.timer = boss.pending === "roll" ? 0.7 : 0.62;
      boss.vx = direction * engine.playerH * (boss.pending === "roll" ? 7.6 : 6.2);
      engine.sfx.play("whoosh");
      return;
  }
}

function landSlam(engine, boss) {
  boss.y = engine.groundY - boss.h;
  boss.vy = 0;
  spawnWaves(engine, boss);
  recover(engine, boss, 0.65);
}

export function updateBoss(engine, boss, dt) {
  boss.flash = Math.max(0, boss.flash - dt * 3.8);

  if (boss.invuln > 0) {
    boss.invuln = Math.max(0, boss.invuln - dt);
  }

  if (boss.tauntTimer > 0) {
    boss.tauntTimer -= dt;

    if (boss.tauntTimer <= 0) {
      boss.taunt = "";
    }
  }

  boss.tilt = boss.tilt * Math.max(0, 1 - dt * 6);
  boss.walk += dt * (boss.mode === "charge" ? 16 : 2.6);

  if (boss.mode === "ko") {
    boss.koTimer += dt;
    boss.vy += 2300 * dt;
    boss.x += boss.vx * dt;
    boss.y += boss.vy * dt;
    boss.spin += dt * 6.5;
    return;
  }

  if (boss.mode === "enter") {
    const total = 0.95;

    boss.timer -= dt;

    const progress = 1 - clamp(boss.timer / total, 0, 1);

    boss.y = engine.groundY - boss.h - (1 - progress) * boss.h * 1.5;

    if (boss.timer <= 0) {
      boss.mode = "idle";
      boss.timer = 0.7;
      boss.y = engine.groundY - boss.h;
      engine.shake = engine.reduced ? 0 : 14;
      engine.spawnDust(boss.x + boss.w / 2, engine.groundY, 14);
      engine.sfx.play("thud");
    }

    return;
  }

  if (boss.mode === "idle") {
    if (engine.state !== "bossFight") {
      return;
    }

    boss.timer -= dt;

    if (boss.timer <= 0) {
      boss.pending = boss.def.attacks[boss.attackIndex % boss.def.attacks.length];
      boss.attackIndex += 1;
      boss.mode = "telegraph";
      boss.timer = 0.55;
      boss.taunt = pick(boss.def.lines.telegraph);
      boss.tauntTimer = 1.7;
      boss.tilt = -0.14;
      engine.sfx.play("pouet");
    }
  } else if (boss.mode === "telegraph") {
    boss.timer -= dt;

    if (boss.timer <= 0) {
      executeAttack(engine, boss);
    }
  } else if (boss.mode === "charge") {
    boss.x += boss.vx * dt;
    boss.timer -= dt;

    const ring = engine.ring;

    if (ring && (boss.x < ring.left + 6 || boss.x + boss.w > ring.right - 6)) {
      boss.x = clamp(boss.x, ring.left + 6, ring.right - boss.w - 6);
      engine.shake = engine.reduced ? 0 : 10;
      recover(engine, boss, 0.7);
    } else if (boss.timer <= 0) {
      recover(engine, boss, 0.7);
    }
  } else if (boss.mode === "slam") {
    boss.vy += 2500 * dt;
    boss.y += boss.vy * dt;

    if (boss.y + boss.h >= engine.groundY) {
      landSlam(engine, boss);
    }
  } else if (boss.mode === "recover") {
    boss.timer -= dt;

    if (boss.timer <= 0) {
      boss.mode = "idle";
      boss.timer = Math.max(0.55, 0.95 - boss.tier * 0.06);
    }
  }

  fightContact(engine, boss, dt);
}

function fightContact(engine, boss, dt) {
  if (boss.mode === "ko" || boss.mode === "enter") {
    return;
  }

  const player = engine.player;
  const box = playerBox(engine);
  const body = bossBox(boss);

  if (!overlaps(box, body)) {
    return;
  }

  const falling = player.vy > 60;
  const aboveWaist = player.y + player.h < boss.y + boss.h * 0.55;

  if (falling && aboveWaist) {
    damageBoss(engine, 1);
    player.y = boss.y - player.h - 2;
    player.vy = -Math.sqrt(2 * 4400 * (engine.playerH / 70) * engine.playerH * 2.1);
    player.grounded = false;
    player.jumps = 1;
    player.platform = null;
    engine.sfx.play("boing");
    return;
  }

  /* Only a charge is a real hit. Bumping into a standing boss
     just pushes the president back, so closing in to punch is safe. */
  if (boss.mode === "charge") {
    if (player.invuln <= 0) {
      engine.hit();
      player.vy = -engine.playerH * 4;
      player.grounded = false;
    }
  }

  const direction = player.x + player.w / 2 < boss.x + boss.w / 2 ? -1 : 1;

  player.x += direction * engine.playerH * 2.4 * dt;
}

/* ---------------------------------------------------------
   DAMAGE + PUNCH
--------------------------------------------------------- */

export function damageBoss(engine, amount) {
  const boss = engine.boss;

  if (!boss || boss.mode === "ko" || boss.invuln > 0) {
    return;
  }

  boss.hp = Math.max(0, boss.hp - amount);
  boss.invuln = 0.32;
  boss.flash = 1;
  boss.taunt = pick(boss.def.lines.hurt);
  boss.tauntTimer = 1.3;

  /* a well-timed jab cancels a wind-up */
  if (boss.mode === "telegraph") {
    boss.mode = "recover";
    boss.timer = 0.55;
    boss.vx = 0;
  }

  engine.score += 40 + boss.tier * 25;
  engine.addRage(0.25);
  engine.shake = engine.reduced ? 0 : 12;
  engine.sfx.play("whack");
  engine.spawnSpark(boss.x + boss.w / 2, boss.y + boss.h * 0.4, 12, CREAM);
  engine.emitStats(true);

  if (boss.hp <= 0) {
    defeatBoss(engine, boss);
  }
}

function defeatBoss(engine, boss) {
  boss.mode = "ko";
  boss.koTimer = 0;
  boss.vy = -engine.playerH * 11;
  boss.vx = engine.playerH * 2.6;
  boss.taunt = "";
  boss.tauntTimer = 0;

  engine.score += 250 * (boss.tier + 1);
  engine.hearts = Math.min(engine.cfg.hearts, engine.hearts + 2);
  engine.hazards = [];
  engine.state = "bossWin";
  engine.bossWinTimer = 2.7;
  engine.shake = engine.reduced ? 0 : 22;
  engine.spawnConfetti(70);
  engine.sfx.play("ko");
  engine.emit("bossdefeat", {
    tier: boss.tier,
    nameFr: boss.def.nameFr,
    nameEn: boss.def.nameEn,
    line: pick(boss.def.lines.defeat),
  });
  engine.emitStats(true);
}

export function bossPunch(engine, superPunch = false) {
  const player = engine.player;

  for (const hazard of engine.hazards) {
    if (hazard.dead || hazard.kind !== "pigeon") {
      continue;
    }

    const dx = hazard.x - (player.x + player.w / 2);

    if (Math.abs(dx) < engine.playerH * 1.1 && dx > -engine.playerH * 0.6) {
      hazard.dead = true;
      engine.score += 15;
      engine.spawnSpark(hazard.x, hazard.y, 8, ROSE);
      engine.sfx.play("whack");
    }
  }

  const boss = engine.boss;

  if (!boss || boss.mode === "ko" || boss.mode === "enter" || boss.invuln > 0) {
    return;
  }

  const reachRight = player.x + player.w + engine.playerH * 1.05;
  const reachLeft = player.x + player.w * 0.5;
  const body = bossBox(boss);

  const verticalOverlap =
    player.y + player.h * 0.15 < body.y + body.h &&
    player.y + player.h * 0.9 > body.y;

  if (verticalOverlap && body.x < reachRight && body.x + body.w > reachLeft) {
    damageBoss(engine, superPunch ? 2 : 1);

    if (superPunch) {
      engine.spawnSpark(body.x + body.w * 0.4, body.y + body.h * 0.4, 22, GOLD);
      engine.spawnText(
        engine.player.x + engine.player.w / 2,
        engine.player.y - 20,
        "SUPER COUP",
        GOLD
      );
      engine.shake = engine.reduced ? 0 : 22;
    }
  }
}

/* ---------------------------------------------------------
   DRAWING — the ring
--------------------------------------------------------- */

function drawCrowd(engine, left, right, ground) {
  const ctx = engine.ctx;
  const ph = engine.playerH;
  const count = Math.max(6, Math.round((right - left) / (ph * 0.66)));
  const span = right - left + ph * 1.4;

  /* grandstand behind the crowd */
  ctx.fillStyle = "rgba(10,7,6,0.6)";
  ctx.fillRect(left - ph * 0.7, ground - ph * 3.62, right - left + ph * 1.4, ph * 0.46);
  ctx.fillStyle = "rgba(217,164,65,0.16)";
  ctx.fillRect(left - ph * 0.7, ground - ph * 3.2, right - left + ph * 1.4, 1);

  for (let i = 0; i < count; i += 1) {
    const x = left - ph * 0.7 + ((i + 0.5) / count) * span;
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    const wobble = seed - Math.floor(seed);
    const bob = Math.sin(engine.time * 2.1 + i * 0.9) * ph * 0.018;
    const radius = ph * (0.075 + wobble * 0.03);
    const y = ground - ph * 3.36 + bob;

    ctx.fillStyle = "rgba(14,9,8,0.94)";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(x, y + radius * 1.7, radius * 1.5, radius * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(12,8,7,0.92)";
    ctx.beginPath();
    ctx.ellipse(x - radius * 0.12, y - radius * 0.72, radius * 1.12, radius * 0.34, -0.16, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRopes(engine, left, right, ground) {
  const ctx = engine.ctx;
  const ph = engine.playerH;
  const heights = [-3.05, -2.35, -1.65];

  heights.forEach((offset, index) => {
    ctx.strokeStyle = TRICOLOR[index];
    ctx.globalAlpha = index === 1 ? 0.9 : 0.85;
    ctx.lineWidth = Math.max(2, ph * 0.038);
    ctx.beginPath();
    ctx.moveTo(left - ph * 0.42, ground + ph * offset);
    ctx.quadraticCurveTo(
      (left + right) / 2,
      ground + ph * offset + ph * 0.13,
      right + ph * 0.42,
      ground + ph * offset
    );
    ctx.stroke();
  });

  ctx.globalAlpha = 1;
}

function drawPosts(engine, left, right, ground) {
  const ctx = engine.ctx;
  const ph = engine.playerH;
  const top = ground - ph * 3.62;
  const postW = Math.max(9, ph * 0.16);

  for (const x of [left - ph * 0.62, right + ph * 0.46]) {
    ctx.fillStyle = "#2a1d16";
    roundRect(ctx, x, top, postW, ground - top + 4, postW * 0.3);
    ctx.fill();

    ctx.fillStyle = "rgba(197,166,107,0.85)";
    ctx.fillRect(x + postW * 0.18, top + ph * 0.06, postW * 0.64, ph * 0.3);

    ctx.fillStyle = GOLD;
    ctx.beginPath();
    ctx.arc(x + postW / 2, top, postW * 0.62, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 3; i += 1) {
      ctx.fillStyle = TRICOLOR[i];
      ctx.fillRect(x - 3, top + ph * (0.75 + i * 0.12), postW + 6, ph * 0.07);
    }
  }

  /* brass bell on the right post */
  const bellX = right + ph * 0.46 + postW / 2;
  const bellY = top - ph * 0.1;
  const swing = Math.sin(engine.time * 3.4) * (engine.state === "bossIntro" ? 0.5 : 0.1);

  ctx.save();
  ctx.translate(bellX, bellY);
  ctx.rotate(swing);
  ctx.strokeStyle = "rgba(240,233,223,0.5)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, -ph * 0.16);
  ctx.lineTo(0, -ph * 0.02);
  ctx.stroke();

  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.moveTo(-ph * 0.1, ph * 0.12);
  ctx.quadraticCurveTo(-ph * 0.09, -ph * 0.06, 0, -ph * 0.06);
  ctx.quadraticCurveTo(ph * 0.09, -ph * 0.06, ph * 0.1, ph * 0.12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#8a4d39";
  ctx.beginPath();
  ctx.arc(0, ph * 0.15, ph * 0.035, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawRing(engine) {
  const ring = engine.ring;

  if (!ring) {
    return;
  }

  const ctx = engine.ctx;
  const camera = engine.camera.x;
  const left = ring.left - camera;
  const right = ring.right - camera;
  const ground = engine.groundY;
  const ph = engine.playerH;

  if (right < -ph * 4 || left > engine.w + ph * 4) {
    return;
  }

  /* mat */
  const mat = ctx.createLinearGradient(0, ground, 0, engine.h);
  mat.addColorStop(0, "#f1e7d5");
  mat.addColorStop(0.35, "#e5d7c1");
  mat.addColorStop(1, "#b7a289");

  ctx.fillStyle = mat;
  ctx.fillRect(left - ph * 0.7, ground - 3, right - left + ph * 1.4, engine.h - ground + 3);

  /* seams + hairline */
  ctx.strokeStyle = "rgba(59,13,22,0.1)";
  ctx.lineWidth = 1;

  for (let i = 1; i < 6; i += 1) {
    const x = left + ((right - left) * i) / 6;

    ctx.beginPath();
    ctx.moveTo(x, ground + 2);
    ctx.lineTo(x - ph * 0.5, engine.h);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(197,166,107,0.95)";
  ctx.fillRect(left - ph * 0.7, ground - 3, right - left + ph * 1.4, 2.4);

  /* tricolour apron stripe */
  const stripeW = Math.min((right - left) * 0.34, ph * 4);
  const stripeX = (left + right) / 2 - stripeW / 2;

  TRICOLOR.forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(stripeX + (stripeW / 3) * index, ground + ph * 1.28, stripeW / 3, 3);
  });

  ctx.globalAlpha = 1;

  drawCrowd(engine, left, right, ground);
  drawRopes(engine, left, right, ground);
  drawPosts(engine, left, right, ground);

  /* spotlights */
  ctx.save();
  ctx.globalAlpha = engine.reduced ? 0.05 : 0.075;

  for (const anchor of [left + (right - left) * 0.24, right - (right - left) * 0.24]) {
    const glow = ctx.createLinearGradient(anchor, 0, anchor, ground);
    glow.addColorStop(0, "rgba(240,233,223,0.9)");
    glow.addColorStop(1, "rgba(240,233,223,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.moveTo(anchor - ph * 0.3, 0);
    ctx.lineTo(anchor + ph * 0.3, 0);
    ctx.lineTo(anchor + ph * 2.4, ground);
    ctx.lineTo(anchor - ph * 2.4, ground);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();

  /* hanging banner */
  const boss = engine.boss;
  const bannerW = Math.min((right - left) * 0.5, ph * 4.2);
  const bannerH = ph * 0.86;
  const bannerX = (left + right) / 2 - bannerW / 2;
  const bannerY = ground - ph * 3.3;

  ctx.fillStyle = "rgba(18,12,9,0.86)";
  roundRect(ctx, bannerX, bannerY, bannerW, bannerH, 4);
  ctx.fill();
  ctx.strokeStyle = "rgba(217,164,65,0.55)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = CREAM;
  ctx.font = serif(bannerH * 0.38, 500);
  ctx.fillText("LE RING", (left + right) / 2, bannerY + bannerH * 0.4);

  ctx.fillStyle = "rgba(240,233,223,0.5)";
  ctx.font = sans(bannerH * 0.15, 600);
  ctx.fillText(
    boss ? boss.def.roundLabel : "LE GRAND BANQUET",
    (left + right) / 2,
    bannerY + bannerH * 0.74
  );
}

/* ---------------------------------------------------------
   DRAWING — bosses
--------------------------------------------------------- */

function drawHat(ctx, hat, h, W, headY, t) {
  if (hat === "beret" || hat === "mime") {
    ctx.fillStyle = hat === "mime" ? "#111118" : "#2a1f18";
    ctx.beginPath();
    ctx.ellipse(-h * 0.012, headY - h * 0.1, h * 0.155, h * 0.055, -0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = hat === "mime" ? "#111118" : "#2a1f18";
    ctx.beginPath();
    ctx.arc(h * 0.005, headY - h * 0.152, h * 0.022, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (hat === "chef") {
    ctx.fillStyle = CREAM;
    ctx.beginPath();
    ctx.arc(-h * 0.06, headY - h * 0.13, h * 0.07, 0, Math.PI * 2);
    ctx.arc(0, headY - h * 0.175, h * 0.085, 0, Math.PI * 2);
    ctx.arc(h * 0.065, headY - h * 0.13, h * 0.07, 0, Math.PI * 2);
    ctx.fill();
    roundRect(ctx, -h * 0.095, headY - h * 0.115, h * 0.19, h * 0.05, 2);
    ctx.fill();
    return;
  }

  if (hat === "fedora") {
    ctx.fillStyle = "#1d2019";
    ctx.beginPath();
    ctx.ellipse(0, headY - h * 0.1, h * 0.175, h * 0.038, 0, 0, Math.PI * 2);
    ctx.fill();
    roundRect(ctx, -h * 0.095, headY - h * 0.205, h * 0.19, h * 0.11, 4);
    ctx.fill();
    ctx.fillStyle = "rgba(217,164,65,0.5)";
    ctx.fillRect(-h * 0.09, headY - h * 0.14, h * 0.18, h * 0.016);
    return;
  }

  /* plain hair */
  ctx.fillStyle = "#2b1d16";
  ctx.beginPath();
  ctx.arc(0, headY - h * 0.015, h * 0.137, Math.PI * 1.02, Math.PI * 1.98);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-h * 0.005, headY - h * 0.09, h * 0.13, h * 0.045, 0, 0, Math.PI * 2);
  ctx.fill();
  void W;
  void t;
}

function drawHeldItem(ctx, item, h) {
  if (item === "none") {
    return;
  }

  if (item === "baguette") {
    ctx.save();
    ctx.rotate(-0.55);
    ctx.fillStyle = "#d3a25a";
    roundRect(ctx, -h * 0.045, -h * 0.42, h * 0.09, h * 0.42, h * 0.045);
    ctx.fill();
    ctx.strokeStyle = "rgba(120,76,32,0.55)";
    ctx.lineWidth = 1.2;

    for (let i = 0; i < 3; i += 1) {
      const y = -h * 0.34 + i * h * 0.09;
      ctx.beginPath();
      ctx.moveTo(-h * 0.03, y);
      ctx.lineTo(h * 0.03, y + h * 0.03);
      ctx.stroke();
    }

    ctx.restore();
    return;
  }

  if (item === "tray") {
    ctx.fillStyle = "#c9a05d";
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.06, h * 0.24, h * 0.055, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = CREAM;
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.085, h * 0.17, h * 0.036, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(168,52,71,0.6)";
    ctx.lineWidth = 1.4;
    ctx.stroke();
    return;
  }

  if (item === "cheese") {
    ctx.fillStyle = "#e8c86a";
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.08);
    ctx.lineTo(h * 0.26, h * 0.02);
    ctx.lineTo(h * 0.02, h * 0.08);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(160,110,40,0.5)";
    ctx.beginPath();
    ctx.arc(h * 0.11, -h * 0.01, h * 0.018, 0, Math.PI * 2);
    ctx.arc(h * 0.06, h * 0.04, h * 0.013, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (item === "fork") {
    ctx.strokeStyle = "#cfd3d6";
    ctx.lineWidth = Math.max(1.6, h * 0.022);
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.02);
    ctx.lineTo(h * 0.22, -h * 0.16);
    ctx.stroke();
    ctx.strokeStyle = "#cfd3d6";
    ctx.lineWidth = Math.max(1, h * 0.012);

    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(h * 0.2 + i * h * 0.012, -h * 0.15);
      ctx.lineTo(h * 0.24 + i * h * 0.012, -h * 0.2);
      ctx.stroke();
    }
  }
}

export function drawBoss(engine, boss) {
  if (!boss) {
    return;
  }

  const ctx = engine.ctx;
  const H = boss.h;
  const W = boss.w;
  const cx = boss.x + W / 2 - engine.camera.x;
  const feet = boss.y + H;
  const t = engine.time;
  const palette = boss.def.palette;

  if (cx < -H * 2 || cx > engine.w + H * 2) {
    return;
  }

  const bob = boss.mode === "ko" ? 0 : Math.sin(t * 3 + boss.tier) * H * 0.012;
  const airborne = boss.y + H < engine.groundY - 4;

  ctx.save();
  ctx.translate(cx, feet + bob);

  if (boss.facing === -1) {
    ctx.scale(-1, 1);
  }

  if (boss.mode === "ko") {
    ctx.rotate(boss.spin);
  }

  ctx.fillStyle = "rgba(59,13,22,0.24)";
  ctx.beginPath();
  ctx.ellipse(0, 5, W * 0.62, H * 0.045, 0, 0, Math.PI * 2);
  ctx.fill();

  const lean =
    boss.mode === "telegraph"
      ? -0.1
      : boss.mode === "charge"
        ? 0.14
        : boss.mode === "slam"
          ? 0.08
          : 0;

  ctx.rotate(lean);

  const hipY = -H * 0.44;
  const shoulderY = -H * 0.8;
  const headY = -H * 0.93;
  const step = airborne ? H * 0.05 : Math.sin(boss.walk) * H * (boss.mode === "charge" ? 0.14 : 0.03);

  /* legs */
  ctx.lineCap = "round";
  ctx.strokeStyle = palette.trousers;
  ctx.lineWidth = H * 0.1;

  for (const side of [-1, 1]) {
    const swing = step * side;

    ctx.beginPath();
    ctx.moveTo(side * W * 0.15, hipY);
    ctx.lineTo(side * W * 0.15 + swing * 0.7, hipY + H * 0.24);
    ctx.lineTo(side * W * 0.15 + swing, -H * 0.04);
    ctx.stroke();
  }

  ctx.fillStyle = "#141018";

  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(side * W * 0.15 + step * side, -H * 0.02, W * 0.19, H * 0.035, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /* torso */
  ctx.fillStyle = palette.coat;
  roundRect(ctx, -W * 0.42, shoulderY, W * 0.84, hipY - shoulderY + H * 0.06, W * 0.16);
  ctx.fill();

  if (palette.stripes) {
    ctx.save();
    roundRect(ctx, -W * 0.42, shoulderY, W * 0.84, hipY - shoulderY + H * 0.06, W * 0.16);
    ctx.clip();
    ctx.fillStyle = "rgba(240,233,223,0.62)";

    for (let i = 0; i < 5; i += 1) {
      ctx.fillRect(-W * 0.46, shoulderY + H * 0.05 + i * H * 0.085, W * 0.92, H * 0.026);
    }

    ctx.restore();
  }

  if (palette.apron) {
    ctx.fillStyle = "#efe6d6";
    roundRect(ctx, -W * 0.29, shoulderY + H * 0.13, W * 0.58, hipY - shoulderY + H * 0.03, 4);
    ctx.fill();
    ctx.strokeStyle = "rgba(59,13,22,0.14)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-W * 0.16, shoulderY + H * 0.13);
    ctx.lineTo(-W * 0.16, hipY + H * 0.02);
    ctx.stroke();
  }

  /* shirt + collar */
  ctx.fillStyle = CREAM;
  ctx.beginPath();
  ctx.moveTo(-W * 0.13, shoulderY + H * 0.01);
  ctx.lineTo(W * 0.13, shoulderY + H * 0.01);
  ctx.lineTo(0, shoulderY + H * 0.13);
  ctx.closePath();
  ctx.fill();

  if (palette.scarf) {
    ctx.fillStyle = palette.trim;
    roundRect(ctx, -W * 0.2, shoulderY + H * 0.02, W * 0.4, H * 0.05, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(W * 0.06, shoulderY + H * 0.05);
    ctx.lineTo(W * 0.18, shoulderY + H * 0.05);
    ctx.lineTo(W * 0.11, shoulderY + H * 0.19);
    ctx.closePath();
    ctx.fill();
  } else {
    /* bow tie for the critic */
    ctx.fillStyle = palette.trim;
    ctx.beginPath();
    ctx.moveTo(-W * 0.1, shoulderY + H * 0.05);
    ctx.lineTo(-W * 0.02, shoulderY + H * 0.07);
    ctx.lineTo(-W * 0.1, shoulderY + H * 0.09);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(W * 0.1, shoulderY + H * 0.05);
    ctx.lineTo(W * 0.02, shoulderY + H * 0.07);
    ctx.lineTo(W * 0.1, shoulderY + H * 0.09);
    ctx.closePath();
    ctx.fill();
  }

  /* arms */
  ctx.strokeStyle = palette.coat;
  ctx.lineWidth = H * 0.088;

  const lift = boss.mode === "telegraph" ? H * 0.16 : 0;

  ctx.beginPath();
  ctx.moveTo(-W * 0.3, shoulderY + H * 0.05);
  ctx.lineTo(-W * 0.47, shoulderY + H * 0.2 + lift * 0.4);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(W * 0.3, shoulderY + H * 0.05);
  ctx.lineTo(W * 0.47, shoulderY + H * 0.16 - lift);
  ctx.lineTo(W * 0.52, shoulderY + H * 0.3 - lift);
  ctx.stroke();

  ctx.fillStyle = palette.hat === "mime" ? "#f4efe6" : "#e3bd98";

  ctx.beginPath();
  ctx.arc(-W * 0.47, shoulderY + H * 0.22 + lift * 0.4, H * 0.042, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(W * 0.52, shoulderY + H * 0.31 - lift, H * 0.042, 0, Math.PI * 2);
  ctx.fill();

  /* head */
  ctx.fillStyle = palette.hat === "mime" ? "#f6f1e7" : "#e8c39a";
  ctx.beginPath();
  ctx.arc(0, headY, H * 0.132, 0, Math.PI * 2);
  ctx.fill();

  /* ear */
  ctx.fillStyle = palette.hat === "mime" ? "#e9e2d5" : "#dcb38b";
  ctx.beginPath();
  ctx.arc(-H * 0.12, headY + H * 0.005, H * 0.028, 0, Math.PI * 2);
  ctx.fill();

  /* big French nose */
  ctx.fillStyle = palette.hat === "mime" ? "#efe8db" : "#dcb38b";
  ctx.beginPath();
  ctx.ellipse(H * 0.105, headY + H * 0.028, H * 0.042, H * 0.028, 0.35, 0, Math.PI * 2);
  ctx.fill();

  /* eyes */
  const asleep = boss.mode === "ko";
  ctx.strokeStyle = "#3a2a22";
  ctx.fillStyle = "#3a2a22";
  ctx.lineWidth = 1.6;

  if (asleep) {
    for (const ex of [H * 0.045, H * 0.105]) {
      ctx.beginPath();
      ctx.moveTo(ex - H * 0.018, headY - H * 0.03);
      ctx.lineTo(ex + H * 0.018, headY + H * 0.01);
      ctx.moveTo(ex + H * 0.018, headY - H * 0.03);
      ctx.lineTo(ex - H * 0.018, headY + H * 0.01);
      ctx.stroke();
    }
  } else {
    for (const ex of [H * 0.045, H * 0.105]) {
      ctx.beginPath();
      ctx.arc(ex, headY - H * 0.01, H * 0.011, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* angry brows */
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(H * 0.022, headY - H * 0.045);
  ctx.lineTo(H * 0.07, headY - H * 0.032);
  ctx.moveTo(H * 0.132, headY - H * 0.042);
  ctx.lineTo(H * 0.086, headY - H * 0.03);
  ctx.stroke();

  /* moustache */
  if (palette.moustache) {
    ctx.strokeStyle = "#2a1f18";
    ctx.lineWidth = Math.max(2, H * 0.026);
    ctx.beginPath();
    ctx.moveTo(H * 0.045, headY + H * 0.06);
    ctx.quadraticCurveTo(H * 0.085, headY + H * 0.052, H * 0.118, headY + H * 0.062);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(H * 0.12, headY + H * 0.075);
    ctx.quadraticCurveTo(H * 0.07, headY + H * 0.09, H * 0.05, headY + H * 0.072);
    ctx.stroke();
  }

  /* monocle */
  if (palette.monocle) {
    ctx.strokeStyle = "rgba(217,164,65,0.95)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(H * 0.048, headY - H * 0.008, H * 0.032, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(H * 0.024, headY + H * 0.012);
    ctx.lineTo(-H * 0.02, headY + H * 0.09);
    ctx.stroke();
  }

  drawHat(ctx, palette.hat, H, W, headY, t);

  /* held item */
  ctx.save();
  ctx.translate(W * 0.52, shoulderY + H * 0.31 - lift);
  drawHeldItem(ctx, palette.item, H);
  ctx.restore();

  /* hurt flash */
  if (boss.flash > 0) {
    ctx.globalAlpha = boss.flash * 0.55;
    ctx.fillStyle = CREAM;
    roundRect(ctx, -W * 0.45, shoulderY - H * 0.03, W * 0.9, hipY - shoulderY + H * 0.12, W * 0.16);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, headY, H * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  ctx.restore();

  drawBossBubble(engine, boss);
}

function drawBossBubble(engine, boss) {
  if (!boss.taunt || boss.tauntTimer <= 0 || boss.mode === "enter") {
    return;
  }

  const ctx = engine.ctx;
  const maxWidth = Math.min(engine.w * 0.38, engine.playerH * 4.2);
  const words = boss.taunt.split(" ");
  const lines = [];
  let current = "";

  ctx.font = sans(engine.playerH * 0.185, 600);

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  const lineHeight = engine.playerH * 0.24;
  const padX = engine.playerH * 0.14;
  const padY = engine.playerH * 0.11;
  const textWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
  const boxW = textWidth + padX * 2;
  const boxH = lines.length * lineHeight + padY * 2;

  let x = boss.x + boss.w / 2 - engine.camera.x - boxW / 2;
  const y = boss.y - boxH - engine.playerH * 0.2;

  x = clamp(x, engine.playerH * 0.3, engine.w - boxW - engine.playerH * 0.3);

  ctx.save();
  ctx.globalAlpha = clamp(boss.tauntTimer / 0.28, 0, 1) * 0.96;

  ctx.fillStyle = "rgba(246,238,224,0.97)";
  ctx.strokeStyle = "rgba(59,13,22,0.22)";
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, boxW, boxH, 5);
  ctx.fill();
  ctx.stroke();

  /* tail */
  ctx.beginPath();
  ctx.moveTo(x + boxW * 0.5 - 6, y + boxH);
  ctx.lineTo(x + boxW * 0.5 + 6, y + boxH);
  ctx.lineTo(x + boxW * 0.5, y + boxH + 7);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = BURGUNDY;
  ctx.font = sans(engine.playerH * 0.185, 600);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  lines.forEach((line, index) => {
    ctx.fillText(line, x + padX, y + padY + lineHeight * (index + 0.5));
  });

  ctx.restore();
}

/* ---------------------------------------------------------
   DRAWING — hazards
--------------------------------------------------------- */

export function drawHazards(engine) {
  const ctx = engine.ctx;

  for (const hazard of engine.hazards) {
    const x = hazard.x - engine.camera.x;

    if (x < -120 || x > engine.w + 120) {
      continue;
    }

    ctx.save();
    ctx.translate(x, hazard.y);
    ctx.rotate(hazard.rot);

    if (hazard.kind === "baguette") {
      drawFoodIcon(ctx, "baguette", 0, 0, hazard.w * 1.5, { rotation: 0 });
    } else if (hazard.kind === "camembert") {
      drawFoodIcon(ctx, "camembert", 0, 0, hazard.w * 1.4, { rotation: 0 });
    } else if (hazard.kind === "pie") {
      ctx.fillStyle = "rgba(246,238,224,0.28)";
      ctx.strokeStyle = "rgba(246,238,224,0.85)";
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(0, 0, hazard.w * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (hazard.kind === "plate") {
      ctx.fillStyle = "rgba(240,233,223,0.96)";
      ctx.beginPath();
      ctx.ellipse(0, 0, hazard.w * 0.5, hazard.h * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(168,52,71,0.6)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.strokeStyle = "rgba(197,166,107,0.5)";
      ctx.beginPath();
      ctx.ellipse(0, 0, hazard.w * 0.3, hazard.h * 0.24, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (hazard.kind === "pigeon") {
      const flap = Math.sin(hazard.wing || 0) * hazard.h * 0.35;

      ctx.fillStyle = "#4c4a52";
      ctx.beginPath();
      ctx.ellipse(0, 0, hazard.w * 0.42, hazard.h * 0.34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hazard.w * 0.3, -hazard.h * 0.2, hazard.h * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#d9a441";
      ctx.beginPath();
      ctx.moveTo(hazard.w * 0.47, -hazard.h * 0.22);
      ctx.lineTo(hazard.w * 0.6, -hazard.h * 0.16);
      ctx.lineTo(hazard.w * 0.47, -hazard.h * 0.1);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#f0e9df";
      ctx.beginPath();
      ctx.arc(hazard.w * 0.34, -hazard.h * 0.24, hazard.h * 0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(76,74,82,0.9)";
      ctx.beginPath();
      ctx.ellipse(-hazard.w * 0.05, flap, hazard.w * 0.3, hazard.h * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (hazard.kind === "wave") {
      ctx.rotate(0);
      const w = hazard.w;
      const h = hazard.h;

      ctx.fillStyle = "rgba(240,233,223,0.9)";
      ctx.beginPath();
      ctx.moveTo(-w * 0.5, h * 0.5);
      ctx.quadraticCurveTo(-w * 0.15, -h * 0.62, 0, -h * 0.4);
      ctx.quadraticCurveTo(w * 0.18, -h * 0.3, w * 0.5, h * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(197,166,107,0.9)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
  }
}

/* ---------------------------------------------------------
   DRAWING — fight HUD
--------------------------------------------------------- */

export function drawBossHud(engine) {
  const boss = engine.boss;

  if (!boss) {
    return;
  }

  const ctx = engine.ctx;
  const pad = Math.max(14, engine.w * 0.024);
  const unit = clamp(engine.h * 0.017, 9, 12);

  if (engine.state === "bossIntro") {
    drawIntroCard(engine, boss);
    return;
  }

  /* scorecard in the band the distance bar leaves free */
  const barWidth = Math.min(engine.w * 0.72, 420);
  const x = (engine.w - barWidth) / 2;
  const y = pad + clamp(engine.h * 0.05, 18, 27) + 10;
  const height = unit * 3.9;

  ctx.save();
  ctx.textBaseline = "middle";

  ctx.fillStyle = "rgba(246,238,224,0.94)";
  roundRect(ctx, x, y, barWidth, height, 3);
  ctx.fill();
  ctx.strokeStyle = "rgba(59,13,22,0.18)";
  ctx.lineWidth = 1;
  ctx.stroke();

  TRICOLOR.forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + (barWidth / 3) * index, y, barWidth / 3, 2);
  });

  ctx.textAlign = "left";
  ctx.fillStyle = BURGUNDY;
  ctx.font = sans(unit * 0.82, 700);
  ctx.fillText(boss.def.nameFr.toUpperCase(), x + unit * 0.7, y + height * 0.34);

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(59,13,22,0.5)";
  ctx.font = sans(unit * 0.6, 600);
  ctx.fillText(`ROUND ${boss.tier + 1}`, x + barWidth - unit * 0.7, y + height * 0.34);

  const pipGap = 3;
  const pipW = (barWidth - unit * 1.4 - pipGap * (boss.maxHp - 1)) / boss.maxHp;

  for (let i = 0; i < boss.maxHp; i += 1) {
    ctx.fillStyle = i < boss.hp ? BURGUNDY : "rgba(59,13,22,0.15)";
    roundRect(ctx, x + unit * 0.7 + i * (pipW + pipGap), y + height * 0.56, pipW, unit * 0.45, 2);
    ctx.fill();
  }

  /* colère — land punches to charge a super */
  ctx.textAlign = "left";
  ctx.fillStyle = engine.rageReady ? GOLD : "rgba(59,13,22,0.42)";
  ctx.font = sans(unit * 0.54, 700);
  ctx.fillText(engine.rageReady ? "PRÊTE" : "COLÈRE", x + unit * 0.7, y + height * 0.82);

  const rageX = x + unit * 4.1;
  const rageW = barWidth - unit * 5;

  ctx.fillStyle = "rgba(59,13,22,0.13)";
  roundRect(ctx, rageX, y + height * 0.78, rageW, unit * 0.34, 2);
  ctx.fill();

  ctx.fillStyle = engine.rageReady ? GOLD : "rgba(168,52,71,0.62)";
  roundRect(
    ctx,
    rageX,
    y + height * 0.78,
    Math.max(2, rageW * clamp(engine.rage || 0, 0, 1)),
    unit * 0.34,
    2
  );
  ctx.fill();

  ctx.restore();
}

function drawIntroCard(engine, boss) {
  const ctx = engine.ctx;
  const progress = clamp(1 - engine.bossIntroTimer / 2.6, 0, 1);
  const appear = clamp(progress * 3, 0, 1);
  const out = clamp((progress - 0.85) / 0.15, 0, 1);
  const alpha = appear * (1 - out);

  const cardW = Math.min(engine.w * 0.84, 470);
  const cardH = clamp(engine.h * 0.32, 128, 200);
  const x = (engine.w - cardW) / 2;
  const y = (engine.h - cardH) / 2 - engine.h * 0.04 + (1 - appear) * 24;

  ctx.save();
  ctx.globalAlpha = alpha;

  ctx.fillStyle = "rgba(12,8,6,0.55)";
  ctx.fillRect(0, 0, engine.w, engine.h);

  ctx.fillStyle = "rgba(246,238,224,0.98)";
  roundRect(ctx, x, y, cardW, cardH, 4);
  ctx.fill();

  ctx.strokeStyle = "rgba(217,164,65,0.8)";
  ctx.lineWidth = 1;
  ctx.stroke();

  /* tricolour rule */
  const ruleW = cardW * 0.26;
  const ruleX = x + cardW / 2 - ruleW / 2;

  TRICOLOR.forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.fillRect(ruleX + (ruleW / 3) * index, y + 0, ruleW / 3, 3);
  });

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "rgba(59,13,22,0.5)";
  ctx.font = sans(cardH * 0.075, 700);
  ctx.fillText(`AU RING — ROUND ${boss.tier + 1}`, x + cardW / 2, y + cardH * 0.19);

  let nameSize = cardH * 0.26;
  ctx.font = serif(nameSize, 500);

  while (ctx.measureText(boss.def.nameFr).width > cardW * 0.86 && nameSize > 13) {
    nameSize -= 1;
    ctx.font = serif(nameSize, 500);
  }

  ctx.fillStyle = BURGUNDY;
  ctx.fillText(boss.def.nameFr, x + cardW / 2, y + cardH * 0.45);

  ctx.fillStyle = "rgba(59,13,22,0.62)";
  ctx.font = sans(cardH * 0.078, 600);
  ctx.fillText(boss.def.tagFr, x + cardW / 2, y + cardH * 0.63);

  ctx.fillStyle = "rgba(59,13,22,0.42)";
  ctx.font = sans(cardH * 0.066, 600);
  ctx.fillText(
    "SAUTEZ SUR SA TÊTE, FRAPPEZ, ESQUIVEZ",
    x + cardW / 2,
    y + cardH * 0.82
  );

  ctx.restore();
}

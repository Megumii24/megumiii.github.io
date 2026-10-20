/* ==========================================================================
   MARY GRACE ANN N. BABAGAY — McLAREN P1™ EDITION TELEMETRY ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const htmlEl = document.documentElement;

  /* --------------------------------------------------------------------------
     0. McLAREN "TAP TO START // MY PORTFOLIO" IGNITION GATE
     -------------------------------------------------------------------------- */
  const ignitionGate = document.getElementById('ignition-gate');
  const ignitionStartBtn = document.getElementById('ignition-start-btn');

  function playIgnitionStartupSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // V8 Starter Crank + Twin-Turbo Ignition Bark
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const turboOsc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const masterGain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      turboOsc.type = 'sine';

      // Crank (48Hz) -> Bark flare (210Hz) -> Settle (92Hz) -> Zoom-in Rev Surge (285Hz)
      osc1.frequency.setValueAtTime(48, now);
      osc1.frequency.exponentialRampToValueAtTime(210, now + 0.32);
      osc1.frequency.exponentialRampToValueAtTime(92, now + 0.85);
      osc1.frequency.exponentialRampToValueAtTime(285, now + 1.85);

      osc2.frequency.setValueAtTime(96, now);
      osc2.frequency.exponentialRampToValueAtTime(420, now + 0.32);
      osc2.frequency.exponentialRampToValueAtTime(184, now + 0.85);
      osc2.frequency.exponentialRampToValueAtTime(570, now + 1.85);

      turboOsc.frequency.setValueAtTime(1100, now);
      turboOsc.frequency.exponentialRampToValueAtTime(3800, now + 0.38);
      turboOsc.frequency.exponentialRampToValueAtTime(2100, now + 0.85);
      turboOsc.frequency.exponentialRampToValueAtTime(5200, now + 1.85);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.32);
      filter.frequency.exponentialRampToValueAtTime(950, now + 0.85);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 1.85);

      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.24, now + 0.18);
      masterGain.gain.setValueAtTime(0.2, now + 1.35);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.95);

      const turboGain = ctx.createGain();
      turboGain.gain.setValueAtTime(0.028, now);

      osc1.connect(filter);
      osc2.connect(filter);
      turboOsc.connect(turboGain);
      turboGain.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      turboOsc.start(now);
      osc1.stop(now + 2.0);
      osc2.stop(now + 2.0);
      turboOsc.stop(now + 2.0);
    } catch (e) {
      // Ignore audio autoplay errors
    }
  }

  if (ignitionGate && ignitionStartBtn) {
    const unlockPortfolio = () => {
      if (
        ignitionGate.classList.contains('is-zooming-p1') ||
        ignitionGate.classList.contains('is-igniting')
      ) {
        return;
      }

      playIgnitionStartupSound();
      // Stage 1 -> Stage 2: Reveal & Zoom In Front of McLaren P1
      ignitionGate.classList.add('is-zooming-p1');

      // Stage 2 -> Open Portfolio after the McLaren P1 Front Zoom-In finishes
      setTimeout(() => {
        ignitionGate.classList.add('is-igniting');
        document.body.classList.remove('gate-locked');

        // Sweep telemetry speedometer from 0 to 350 KM/H on unlock
        const spd = document.getElementById('speed-readout');
        if (spd) {
          spd.textContent = '0';
          animateNumber(spd, 350, 900);
        }
      }, 1550);

      setTimeout(() => {
        ignitionGate.remove();
      }, 2300);
    };

    ignitionStartBtn.addEventListener('click', unlockPortfolio);
    ignitionGate.addEventListener('click', (e) => {
      if (e.target === ignitionGate) unlockPortfolio();
    });
  }

  /* --------------------------------------------------------------------------
     1. ACTIVE DYNAMICS DRIVE MODE CONTROLLER (NORMAL / SPORT / TRACK / IPAS)
     -------------------------------------------------------------------------- */
  const modeButtons = document.querySelectorAll('.mode-btn');
  const rpmBarFill = document.getElementById('rpm-bar-fill');
  const speedReadout = document.getElementById('speed-readout');
  const gearReadout = document.getElementById('gear-readout');
  const clockSpeed = document.getElementById('clock-speed');
  const downforceVal = document.getElementById('downforce-val');
  const batteryVal = document.getElementById('battery-val');
  const aeroModeStatus = document.getElementById('aero-mode-status');

  const driveModes = {
    normal: {
      rpmWidth: '48%',
      speed: 240,
      gear: '4',
      clock: '3.60 GHz',
      downforce: '220 KG',
      battery: '100% ECO',
      aeroStatus: 'OPTIMAL CRUISE'
    },
    sport: {
      rpmWidth: '68%',
      speed: 310,
      gear: '4',
      clock: '4.30 GHz',
      downforce: '420 KG',
      battery: '96% SPORT',
      aeroStatus: 'AERO DEPLOYED'
    },
    track: {
      rpmWidth: '84%',
      speed: 350,
      gear: '4',
      clock: '4.80 GHz',
      downforce: '600 KG',
      battery: '98% IPAS',
      aeroStatus: 'RACE ACTIVE'
    },
    ipas: {
      rpmWidth: '98%',
      speed: 385,
      gear: '4',
      clock: '5.25 GHz OC',
      downforce: '600 KG MAX',
      battery: 'IPAS DISCHARGE',
      aeroStatus: '903 BHP FULL BOOST'
    }
  };

  function animateNumber(el, target, duration = 550) {
    const start = parseInt(el.textContent, 10) || 0;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      const config = driveModes[mode];
      if (!config) return;

      modeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      htmlEl.setAttribute('data-drive-mode', mode);
      rpmBarFill.style.width = config.rpmWidth;
      animateNumber(speedReadout, config.speed);
      gearReadout.textContent = config.gear;
      clockSpeed.textContent = config.clock;
      downforceVal.textContent = config.downforce;
      batteryVal.textContent = config.battery;
      aeroModeStatus.textContent = config.aeroStatus;
    });
  });

  /* --------------------------------------------------------------------------
     2. McLAREN P1 M838TQ 3.8L TWIN-TURBO V8 WEB AUDIO SYNTHESIZER & HOVER REV
     -------------------------------------------------------------------------- */
  const p1Stage = document.getElementById('p1-stage');
  const p1RevBadge = document.getElementById('p1-rev-badge');
  const p1AudioToggle = document.getElementById('p1-audio-toggle');
  const audioToggleText = document.getElementById('audio-toggle-text');
  const audioWaveIcon = document.getElementById('audio-wave');
  const exhaustGroup = document.getElementById('p1-exhaust-system');

  let audioCtx = null;
  let audioMuted = false;
  let activeEngineNodes = null;
  let smokeInterval = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  }

  // Unlock Web Audio on first user interaction anywhere on the page
  ['pointerdown', 'keydown', 'touchstart'].forEach((evt) => {
    window.addEventListener(evt, initAudioContext, { once: true, passive: true });
  });

  // Distortion curve for aggressive V8 exhaust harmonics
  function makeDistortionCurve(amount = 35) {
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;
    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  function startP1EngineSound() {
    if (audioMuted) return;
    initAudioContext();
    if (!audioCtx || activeEngineNodes) return;

    try {
      const now = audioCtx.currentTime;

      // Master Gain
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.01, now);
      masterGain.gain.exponentialRampToValueAtTime(0.24, now + 0.18);
      masterGain.connect(audioCtx.destination);

      // Exhaust Resonant Filter
      const exhaustFilter = audioCtx.createBiquadFilter();
      exhaustFilter.type = 'lowpass';
      exhaustFilter.frequency.setValueAtTime(320, now);
      exhaustFilter.frequency.exponentialRampToValueAtTime(1450, now + 0.55);
      exhaustFilter.Q.value = 4.2;

      // Waveshaper for flat-plane V8 growl
      const shaper = audioCtx.createWaveShaper();
      shaper.curve = makeDistortionCurve(42);
      shaper.oversample = '2x';

      exhaustFilter.connect(shaper);
      shaper.connect(masterGain);

      // V8 Bank 1 Oscillator (Sawtooth)
      const osc1 = audioCtx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(68, now);
      osc1.frequency.exponentialRampToValueAtTime(195, now + 0.55);

      // V8 Bank 2 Oscillator (Sub-harmonic + Fifth)
      const osc2 = audioCtx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(102, now);
      osc2.frequency.exponentialRampToValueAtTime(292, now + 0.55);

      // Crankshaft firing LFO modulation
      const lfo = audioCtx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(28, now);
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 14;
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);

      // Twin-Turbocharger Spool Whistle
      const turboOsc = audioCtx.createOscillator();
      turboOsc.type = 'sine';
      turboOsc.frequency.setValueAtTime(1150, now);
      turboOsc.frequency.exponentialRampToValueAtTime(2650, now + 0.65);

      const turboGain = audioCtx.createGain();
      turboGain.gain.setValueAtTime(0.005, now);
      turboGain.gain.exponentialRampToValueAtTime(0.045, now + 0.5);

      osc1.connect(exhaustFilter);
      osc2.connect(exhaustFilter);
      turboOsc.connect(turboGain);
      turboGain.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      lfo.start(now);
      turboOsc.start(now);

      activeEngineNodes = {
        masterGain,
        exhaustFilter,
        osc1,
        osc2,
        lfo,
        turboOsc,
        turboGain
      };

      if (audioToggleText) audioToggleText.textContent = 'V8 SOUND: ROARING';
    } catch (err) {
      // Ignore if browser blocked autoplay prior to first click
    }
  }

  function modulateP1Throttle(normX) {
    if (!activeEngineNodes || !audioCtx) return;
    const now = audioCtx.currentTime;
    const clamped = Math.max(0, Math.min(1, normX));
    const baseFreq = 135 + clamped * 115; // 135 Hz to 250 Hz flat-plane V8 shriek
    activeEngineNodes.osc1.frequency.setTargetAtTime(baseFreq, now, 0.06);
    activeEngineNodes.osc2.frequency.setTargetAtTime(baseFreq * 1.5, now, 0.06);
    activeEngineNodes.exhaustFilter.frequency.setTargetAtTime(900 + clamped * 1100, now, 0.06);
    activeEngineNodes.turboOsc.frequency.setTargetAtTime(1800 + clamped * 1400, now, 0.08);
  }

  function playExhaustOverrunPops() {
    if (audioMuted || !audioCtx) return;
    const now = audioCtx.currentTime;
    // 3 rapid McLaren P1 lift-off exhaust pops/crackles
    [0.04, 0.14, 0.26].forEach((offset, i) => {
      const popOsc = audioCtx.createOscillator();
      const popGain = audioCtx.createGain();
      popOsc.type = 'sawtooth';
      popOsc.frequency.setValueAtTime(150 - i * 22, now + offset);
      popOsc.frequency.exponentialRampToValueAtTime(38, now + offset + 0.075);

      popGain.gain.setValueAtTime(0.18, now + offset);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08);

      popOsc.connect(popGain);
      popGain.connect(audioCtx.destination);
      popOsc.start(now + offset);
      popOsc.stop(now + offset + 0.085);
    });
  }

  function stopP1EngineSound() {
    if (!activeEngineNodes || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const nodes = activeEngineNodes;
      activeEngineNodes = null;

      nodes.osc1.frequency.exponentialRampToValueAtTime(65, now + 0.32);
      nodes.osc2.frequency.exponentialRampToValueAtTime(95, now + 0.32);
      nodes.turboOsc.frequency.exponentialRampToValueAtTime(950, now + 0.3);
      nodes.masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      playExhaustOverrunPops();

      setTimeout(() => {
        try {
          nodes.osc1.stop();
          nodes.osc2.stop();
          nodes.lfo.stop();
          nodes.turboOsc.stop();
          nodes.masterGain.disconnect();
        } catch (e) {}
      }, 380);

      if (audioToggleText && !audioMuted) {
        audioToggleText.textContent = 'V8 SOUND: READY';
      }
    } catch (e) {
      activeEngineNodes = null;
    }
  }

  // Dynamic Exhaust Smoke Particle Spawner inside the SVG
  function spawnExhaustSmokeParticle() {
    if (!exhaustGroup) return;
    const ns = 'http://www.w3.org/2000/svg';
    const puff = document.createElementNS(ns, 'circle');
    const isUpper = Math.random() > 0.35;
    const startX = isUpper ? 742 : 748;
    const startY = isUpper ? 189 + (Math.random() * 8 - 4) : 230 + (Math.random() * 8 - 4);
    const radius = 10 + Math.random() * 14;

    puff.setAttribute('cx', startX);
    puff.setAttribute('cy', startY);
    puff.setAttribute('r', radius);
    puff.setAttribute('fill', 'url(#smokeGrad)');
    puff.setAttribute('filter', 'url(#smokeBlur)');
    puff.style.pointerEvents = 'none';

    exhaustGroup.appendChild(puff);

    const startTime = performance.now();
    const duration = 550 + Math.random() * 300;
    const driftX = 75 + Math.random() * 55;
    const driftY = -12 - Math.random() * 22;

    function animatePuff(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const curX = startX + driftX * t;
      const curY = startY + driftY * t;
      const scale = 1 + t * 1.9;
      const alpha = (1 - t) * 0.75;

      puff.setAttribute('cx', curX.toFixed(1));
      puff.setAttribute('cy', curY.toFixed(1));
      puff.setAttribute('r', (radius * scale).toFixed(1));
      puff.setAttribute('opacity', alpha.toFixed(2));

      if (t < 1) {
        requestAnimationFrame(animatePuff);
      } else {
        puff.remove();
      }
    }
    requestAnimationFrame(animatePuff);
  }

  if (p1AudioToggle) {
    p1AudioToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudioContext();
      audioMuted = !audioMuted;
      p1AudioToggle.classList.toggle('muted', audioMuted);
      if (audioMuted) {
        stopP1EngineSound();
        audioToggleText.textContent = 'V8 SOUND: MUTED';
        audioWaveIcon.textContent = '🔇';
      } else {
        audioToggleText.textContent = 'V8 SOUND: READY';
        audioWaveIcon.textContent = '🔊';
      }
    });
  }

  if (p1Stage) {
    p1Stage.addEventListener('mouseenter', () => {
      p1Stage.classList.add('is-revving');
      startP1EngineSound();
      if (p1RevBadge) p1RevBadge.textContent = '🔥 V8 + IPAS REVVING // 8,500 RPM';
      rpmBarFill.style.width = '97%';
      animateNumber(speedReadout, 378, 320);

      if (!smokeInterval) {
        spawnExhaustSmokeParticle();
        smokeInterval = setInterval(spawnExhaustSmokeParticle, 110);
      }
    });

    p1Stage.addEventListener('mousemove', (e) => {
      const rect = p1Stage.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width;
      modulateP1Throttle(normX);
    });

    p1Stage.addEventListener('mouseleave', () => {
      p1Stage.classList.remove('is-revving');
      stopP1EngineSound();
      if (p1RevBadge) p1RevBadge.textContent = '🔥 HOVER CAR TO REV V8 + TURBO';
      const currentMode = htmlEl.getAttribute('data-drive-mode') || 'track';
      if (driveModes[currentMode]) {
        rpmBarFill.style.width = driveModes[currentMode].rpmWidth;
        animateNumber(speedReadout, driveModes[currentMode].speed, 400);
      }
      if (smokeInterval) {
        clearInterval(smokeInterval);
        smokeInterval = null;
      }
    });

    // Clicking the car also unlocks audio & triggers a rev burst
    p1Stage.addEventListener('click', () => {
      initAudioContext();
      if (!activeEngineNodes) {
        startP1EngineSound();
      }
      spawnExhaustSmokeParticle();
      spawnExhaustSmokeParticle();
    });
  }

  /* --------------------------------------------------------------------------
     2B. LAUNCH CONTROL SIMULATION (1ST YEAR -> 4TH YEAR BSCOE ACCELERATION)
     -------------------------------------------------------------------------- */
  const launchBtn = document.getElementById('launch-control-btn');
  let isLaunching = false;

  if (launchBtn) {
    launchBtn.addEventListener('click', () => {
      if (isLaunching) return;
      isLaunching = true;
      initAudioContext();

      const originalHTML = launchBtn.innerHTML;
      launchBtn.innerHTML = '<span>🔥 LAUNCH CONTROL ACTIVE...</span>';

      if (p1Stage) p1Stage.classList.add('is-revving');
      startP1EngineSound();
      const launchSmokeTimer = setInterval(spawnExhaustSmokeParticle, 95);

      // Switch to IPAS boost visually during launch
      htmlEl.setAttribute('data-drive-mode', 'ipas');
      modeButtons.forEach((b) => b.classList.toggle('active', b.dataset.mode === 'ipas'));

      const gears = [
        { gear: '1', rpm: '65%', speed: 110, status: '1ST YR FOUNDATION', throttle: 0.25 },
        { gear: '2', rpm: '78%', speed: 205, status: '2ND YR CIRCUITS', throttle: 0.52 },
        { gear: '3', rpm: '90%', speed: 285, status: '3RD YR MICROPROCESSORS', throttle: 0.78 },
        { gear: '4', rpm: '98%', speed: 372, status: '4TH YR BSCOE APEX', throttle: 1.0 }
      ];

      gears.forEach((step, idx) => {
        setTimeout(() => {
          gearReadout.textContent = step.gear;
          rpmBarFill.style.width = step.rpm;
          animateNumber(speedReadout, step.speed, 350);
          aeroModeStatus.textContent = step.status;
          modulateP1Throttle(step.throttle);
        }, idx * 480);
      });

      setTimeout(() => {
        clearInterval(launchSmokeTimer);
        if (p1Stage) p1Stage.classList.remove('is-revving');
        stopP1EngineSound();
        htmlEl.setAttribute('data-drive-mode', 'track');
        modeButtons.forEach((b) => b.classList.toggle('active', b.dataset.mode === 'track'));
        rpmBarFill.style.width = driveModes.track.rpmWidth;
        animateNumber(speedReadout, driveModes.track.speed, 400);
        aeroModeStatus.textContent = driveModes.track.aeroStatus;
        launchBtn.innerHTML = originalHTML;
        isLaunching = false;
      }, 2200);
    });
  }

  /* --------------------------------------------------------------------------
     3. DRS (DRAG REDUCTION SYSTEM) WING TOGGLE
     -------------------------------------------------------------------------- */
  const drsBtn = document.getElementById('drs-toggle-btn');
  const drsIndicator = document.getElementById('drs-indicator');
  const drsStateText = document.getElementById('drs-state-text');
  const activeWing = document.getElementById('p1-active-wing');
  let drsActive = true;

  if (drsBtn) {
    drsBtn.addEventListener('click', () => {
      drsActive = !drsActive;
      drsIndicator.classList.toggle('closed', !drsActive);
      drsStateText.textContent = drsActive ? 'ACTIVE' : 'HIGH DOWNFORCE';
      if (activeWing) {
        activeWing.classList.toggle('drs-closed', !drsActive);
      }
      downforceVal.textContent = drsActive ? '600 KG (DRS)' : '750 KG (MAX)';
    });
  }

  /* --------------------------------------------------------------------------
     4. INTERACTIVE P1 BLUEPRINT CHASSIS CALLOUT NODES
     -------------------------------------------------------------------------- */
  const calloutNodes = document.querySelectorAll('.callout-node');
  const calloutText = document.getElementById('callout-text');

  calloutNodes.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      const info = node.getAttribute('data-callout');
      if (info && calloutText) {
        calloutText.textContent = info;
      }
    });
    node.addEventListener('click', () => {
      const info = node.getAttribute('data-callout');
      if (info && calloutText) {
        calloutText.textContent = info;
      }
    });
  });

  /* --------------------------------------------------------------------------
     5. PROJECT FILTERING & TELEMETRY INSPECTION MODAL
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach((card) => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const projectDetails = [
    {
      code: 'PROTO-P1 // 01 — EMBEDDED & IoT',
      title: 'Automatic Alcohol Dispenser Prototype',
      desc: 'Designed and built a touchless automatic alcohol dispenser prototype that detects hand proximity via an infrared/ultrasonic sensor and triggers a microcontroller-driven relay and mini pump for precise, contact-free sanitization.',
      specs: [
        { label: 'SENSOR', val: 'IR / Ultrasonic' },
        { label: 'ACTUATOR', val: 'Relay + DC Pump' },
        { label: 'OPERATION', val: '100% Touchless' }
      ],
      notes: 'Engineered by Mary Grace Ann N. Babagay as part of ICCT Cainta Campus Computer Engineering hardware prototyping, focusing on reliable sensor triggering, circuit protection, and practical everyday automation.'
    },
    {
      code: 'PROTO-P1 // 02 — SOFTWARE & WEB',
      title: 'PH Travelling App',
      desc: 'Developed a Philippine travel and tourism web platform designed to help travelers explore destinations across the Philippines, organize itineraries, and access structured local travel data.',
      specs: [
        { label: 'ROLE', val: 'Database Administrador' },
        { label: 'FRONTEND', val: 'HTML5 / CSS3 / JS' },
        { label: 'DATABASE', val: 'Relational SQL' }
      ],
      notes: 'Mary Grace Ann N. Babagay (RY) led the System Analysis and Database Administration—designing the entity-relationship schema, data flow diagrams, and database queries for smooth travel destination lookup.'
    },
    {
      code: 'PROTO-P1 // 03 — CURRENT PROJECT',
      title: 'FSL Translator (Filipino Sign Language)',
      desc: 'An active 4th-year BSCOE project focused on real-time Filipino Sign Language (FSL) translation to promote inclusive, accessible communication between FSL signers and non-signers.',
      specs: [
        { label: 'FOCUS', val: 'FSL Translation' },
        { label: 'ROLE', val: 'Database Administrador' },
        { label: 'STATUS', val: 'Active / In Progress' }
      ],
      notes: 'Currently in active development at ICCT Colleges Cainta Campus, combining gesture/sign dataset management, system workflow analysis, and responsive interface design.'
    }
  ];

  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalCode = document.getElementById('modal-code');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalSpecs = document.getElementById('modal-specs');
  const modalNotes = document.getElementById('modal-notes');

  document.querySelectorAll('.btn-inspect').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.project, 10);
      const item = projectDetails[index];
      if (!item || !modal) return;

      modalCode.textContent = item.code;
      modalTitle.textContent = item.title;
      modalDesc.textContent = item.desc;
      modalNotes.textContent = item.notes;

      modalSpecs.innerHTML = item.specs
        .map(
          (s) => `
          <div class="spec-card">
            <span class="spec-label">${s.label}</span>
            <div class="spec-value" style="font-size:1rem">${s.val}</div>
          </div>`
        )
        .join('');

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  /* --------------------------------------------------------------------------
     6. PIT RADIO CONTACT FORM & PRINT SPEC SHEET
     -------------------------------------------------------------------------- */
  const pitForm = document.getElementById('pit-radio-form');
  const formStatus = document.getElementById('form-status');

  if (pitForm) {
    pitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name').value.trim();
      const subject = document.getElementById('sender-subject').value;
      formStatus.textContent = `✓ TELEMETRY RECEIVED FROM ${name.toUpperCase()} [${subject.toUpperCase()}] — STAND BY FOR RESPONSE.`;
      pitForm.reset();
    });
  }

  const printSpecBtn = document.getElementById('print-spec-btn');
  if (printSpecBtn) {
    printSpecBtn.addEventListener('click', () => {
      window.print();
    });
  }

  /* --------------------------------------------------------------------------
     7. MOBILE MENU & SCROLL SPY NAVIGATION
     -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const hudNav = document.querySelector('.hud-nav');

  if (mobileMenuBtn && hudNav) {
    mobileMenuBtn.addEventListener('click', () => {
      hudNav.classList.toggle('open');
    });
    hudNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => hudNav.classList.remove('open'));
    });
  }

  const sections = document.querySelectorAll('main .section');
  const navLinks = document.querySelectorAll('.hud-nav__link[data-section]');

  window.addEventListener('scroll', () => {
    let current = 'cockpit';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 160;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  });

  /* --------------------------------------------------------------------------
     8. PHOTOREALISTIC 3D VOLCANO ORANGE McLAREN P1 STUDIO TURNTABLE RENDERER
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('aero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const keyStations = [
      { x: -248, pts: [[0, -37], [22, -37], [52, -36], [78, -36], [90, -38], [84, -44]] },
      { x: -234, pts: [[0, -27], [18, -27], [48, -24], [78, -24], [95, -31], [90, -44]] },
      { x: -206, pts: [[0, -16], [16, -17], [46, -12], [82, -8], [101, -21], [95, -44]] },
      { x: -168, pts: [[0, -7], [18, -12], [50, -2], [92, 7], [107, -14], [99, -45]] },
      { x: -135, pts: [[0, 1], [18, -2], [52, 5], [95, 12], [109, -12], [99, -45]] },
      { x: -96, pts: [[0, 12], [22, 12], [56, 13], [91, 10], [106, -14], [97, -45]] },
      { x: -52, pts: [[0, 35], [24, 34], [52, 26], [82, 8], [101, -17], [94, -45]] },
      { x: -8, pts: [[0, 52], [22, 50], [46, 39], [76, 8], [97, -19], [92, -45]] },
      { x: 32, pts: [[0, 57], [16, 53], [43, 42], [78, 12], [99, -17], [93, -45]] },
      { x: 78, pts: [[0, 47], [16, 44], [39, 34], [86, 20], [104, -13], [96, -45]] },
      { x: 122, pts: [[0, 33], [18, 31], [44, 27], [95, 28], [111, -9], [99, -45]] },
      { x: 158, pts: [[0, 23], [18, 22], [46, 21], [94, 25], [110, -10], [98, -45]] },
      { x: 194, pts: [[0, 16], [18, 16], [45, 16], [88, 17], [104, -14], [93, -44]] },
      { x: 226, pts: [[0, 12], [16, 12], [42, 11], [79, 9], [93, -18], [82, -41]] },
      { x: 242, pts: [[0, -2], [18, -2], [40, -4], [70, -8], [81, -25], [72, -39]] },
      { x: 248, pts: [[0, -18], [18, -18], [38, -19], [64, -22], [72, -32], [64, -39]] }
    ];

    function catmullRom(p0, p1, p2, p3, t) {
      const t2 = t * t;
      const t3 = t2 * t;
      return (
        0.5 *
        (2 * p1 +
          (-p0 + p2) * t +
          (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
          (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
      );
    }

    const lonSub = 3;
    const smoothStations = [];
    for (let i = 0; i < keyStations.length - 1; i++) {
      const s0 = keyStations[Math.max(0, i - 1)];
      const s1 = keyStations[i];
      const s2 = keyStations[i + 1];
      const s3 = keyStations[Math.min(keyStations.length - 1, i + 2)];

      const steps = i === keyStations.length - 2 ? lonSub + 1 : lonSub;
      for (let step = 0; step < steps; step++) {
        const t = step / lonSub;
        const x = catmullRom(s0.x, s1.x, s2.x, s3.x, t);
        const rawHalfPts = [];
        for (let k = 0; k < 6; k++) {
          const z = Math.max(0, catmullRom(s0.pts[k][0], s1.pts[k][0], s2.pts[k][0], s3.pts[k][0], t));
          const y = catmullRom(s0.pts[k][1], s1.pts[k][1], s2.pts[k][1], s3.pts[k][1], t);
          rawHalfPts.push([z, y]);
        }
        const halfPts = [];
        for (let k = 0; k < 5; k++) {
          const a0 = rawHalfPts[Math.max(0, k - 1)];
          const a1 = rawHalfPts[k];
          const a2 = rawHalfPts[k + 1];
          const a3 = rawHalfPts[Math.min(5, k + 2)];
          halfPts.push(a1);
          halfPts.push([
            Math.max(0, catmullRom(a0[0], a1[0], a2[0], a3[0], 0.5)),
            catmullRom(a0[1], a1[1], a2[1], a3[1], 0.5)
          ]);
        }
        halfPts.push(rawHalfPts[5]);
        smoothStations.push({ x, sFloat: i + t, halfPts });
      }
    }

    const vertices = [];
    const triangles = [];

    function addTri(a, b, c, mat = 'orange') {
      triangles.push({ a, b, c, mat });
    }

    const rowWidth = 21;
    smoothStations.forEach((st) => {
      const hp = st.halfPts;
      for (let k = 10; k >= 1; k--) {
        vertices.push({ x: st.x, y: hp[k][1], z: -hp[k][0] });
      }
      vertices.push({ x: st.x, y: hp[0][1], z: 0 });
      for (let k = 1; k <= 10; k++) {
        vertices.push({ x: st.x, y: hp[k][1], z: hp[k][0] });
      }
    });

    function getP1Material(sFloat, jIndex) {
      const dist = Math.abs(jIndex - 9.5);
      if (sFloat < 0.75) return 'carbon';
      if (sFloat < 1.85 && dist > 6.5) return 'carbon';
      if (sFloat < 1.65 && dist < 4.5) return 'carbon';
      if (sFloat >= 2.1 && sFloat <= 3.6 && dist >= 1.5 && dist <= 3.8) return 'vent';
      if (sFloat >= 4.7 && sFloat <= 9.2 && dist <= 5.6) return 'glass';
      if (sFloat > 9.2 && sFloat <= 12.6 && dist <= 3.6) return 'carbon';
      if (sFloat >= 5.2 && sFloat <= 10.1 && dist >= 6.2 && dist <= 8.8) return 'carbon';
      if (dist >= 8.8) return 'carbon';
      if (sFloat >= 13.0) return 'carbon';
      return 'orange';
    }

    for (let s = 0; s < smoothStations.length - 1; s++) {
      const sFloat = smoothStations[s].sFloat;
      for (let j = 0; j < rowWidth - 1; j++) {
        const i0 = s * rowWidth + j;
        const i1 = i0 + 1;
        const i2 = (s + 1) * rowWidth + j;
        const i3 = i2 + 1;
        const mat = getP1Material(sFloat, j);

        if (j < 10) {
          addTri(i0, i2, i3, mat);
          addTri(i0, i3, i1, mat);
        } else {
          addTri(i0, i2, i1, mat);
          addTri(i1, i2, i3, mat);
        }
      }
    }

    const wingBaseIdx = vertices.length;
    const wingPts = [
      [198, 43, -80], [202, 46, -56], [205, 47, -28], [206, 47, 0], [205, 47, 28], [202, 46, 56], [198, 43, 80],
      [232, 51, -78], [236, 54, -54], [238, 55, -28], [239, 55, 0], [238, 55, 28], [236, 54, 54], [232, 51, 78],
      [190, 18, -26], [212, 16, -26], [204, 46, -26], [224, 52, -26],
      [190, 18, 26], [212, 16, 26], [204, 46, 26], [224, 52, 26]
    ];
    wingPts.forEach((v) => vertices.push({ x: v[0], y: v[1], z: v[2] }));

    for (let j = 0; j < 6; j++) {
      const a = wingBaseIdx + j;
      const b = a + 1;
      const c = wingBaseIdx + 7 + j;
      const d = c + 1;
      addTri(a, c, d, 'orange');
      addTri(a, d, b, 'orange');
    }
    addTri(wingBaseIdx + 14, wingBaseIdx + 15, wingBaseIdx + 17, 'carbon');
    addTri(wingBaseIdx + 14, wingBaseIdx + 17, wingBaseIdx + 16, 'carbon');
    addTri(wingBaseIdx + 18, wingBaseIdx + 21, wingBaseIdx + 19, 'carbon');
    addTri(wingBaseIdx + 18, wingBaseIdx + 20, wingBaseIdx + 21, 'carbon');

    const mirBaseIdx = vertices.length;
    const mirPts = [
      [-40, 31, -74], [-32, 37, -100], [-20, 36, -99], [-28, 30, -74],
      [-40, 31, 74], [-32, 37, 100], [-20, 36, 99], [-28, 30, 74]
    ];
    mirPts.forEach((v) => vertices.push({ x: v[0], y: v[1], z: v[2] }));
    addTri(mirBaseIdx + 0, mirBaseIdx + 1, mirBaseIdx + 2, 'carbon');
    addTri(mirBaseIdx + 0, mirBaseIdx + 2, mirBaseIdx + 3, 'carbon');
    addTri(mirBaseIdx + 4, mirBaseIdx + 6, mirBaseIdx + 5, 'carbon');
    addTri(mirBaseIdx + 4, mirBaseIdx + 7, mirBaseIdx + 6, 'carbon');

    const p1SignatureLines = [
      { type: 'headlight', pts: [[-228, -21, -46], [-212, -14, -74], [-188, -7, -91], [-206, -19, -66], [-228, -21, -46]] },
      { type: 'headlight', pts: [[-228, -21, 46], [-212, -14, 74], [-188, -7, 91], [-206, -19, 66], [-228, -21, 46]] },
      { type: 'taillight', pts: [[231, 10, -28], [229, 13, -58], [224, 7, -84], [236, -3, -72], [239, -6, -42]] },
      { type: 'taillight', pts: [[231, 10, 28], [229, 13, 58], [224, 7, 84], [236, -3, 72], [239, -6, 42]] }
    ];

    // 4 Realistic 3D Pirelli P-Zero Wheels + Glowing Silver/White Carbon-Ceramic Brake Rotors
    const wheels3D = [
      { x: -135, y: -28, z: -98, r: 36, width: 25, isLeft: true },
      { x: -135, y: -28, z: 98, r: 36, width: 25, isLeft: false },
      { x: 156, y: -25, z: -100, r: 40, width: 29, isLeft: true },
      { x: 156, y: -25, z: 100, r: 40, width: 29, isLeft: false }
    ];

    let mouseYawOffset = 0;
    let scrollYawOffset = 0;
    let currentYaw = -0.55;
    let targetPitch = 0.12;
    let currentPitch = 0.12;
    let autoSpinAngle = -0.55;
    let wheelSpinAngle = 0;

    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / Math.max(width, 1)) * 2 - 1;
      const ny = (e.clientY / Math.max(height, 1)) * 2 - 1;
      mouseYawOffset = nx * 0.55;
      targetPitch = 0.12 + ny * 0.14;
    });

    window.addEventListener('scroll', () => {
      scrollYawOffset = window.scrollY * 0.0015;
    });

    function project3D(x, y, z, yaw, pitch, scale, cx, cy) {
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const y2 = y * cosP - z1 * sinP;
      const z2 = y * sinP + z1 * cosP;

      const fov = 760;
      const dist = 600;
      const depth = dist + z2;
      if (depth < 60) return null;

      const persp = (fov / depth) * scale;
      return {
        sx: cx + x1 * persp,
        sy: cy - y2 * persp,
        cx: x1,
        cy: y2,
        cz: z2,
        z: z2,
        persp
      };
    }

    function computeP1StudioColor(p0, p1, p2, mat) {
      const ux = p1.cx - p0.cx;
      const uy = p1.cy - p0.cy;
      const uz = p1.cz - p0.cz;
      const vx = p2.cx - p0.cx;
      const vy = p2.cy - p0.cy;
      const vz = p2.cz - p0.cz;

      let nx = uy * vz - uz * vy;
      let ny = uz * vx - ux * vz;
      let nz = ux * vy - uy * vx;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len;
      ny /= len;
      nz /= len;

      if (nz > 0) {
        nx = -nx;
        ny = -ny;
        nz = -nz;
      }

      const keyDot = Math.max(0, nx * -0.22 + ny * 0.86 + nz * -0.46);
      const sideDot = Math.max(0, nx * 0.65 + ny * 0.25 + nz * -0.71);
      const fresnel = Math.pow(1 - Math.min(1, Math.abs(nz)), 2.4);

      const hx = -0.12;
      const hy = 0.62;
      const hz = -0.77;
      const specDot = Math.max(0, nx * hx + ny * hy + nz * hz);

      if (mat === 'orange') {
        const diffuse = Math.pow(keyDot * 0.82 + sideDot * 0.28, 0.88);
        const clearcoat = Math.pow(specDot, 22);
        const flakeGlow = Math.pow(specDot, 6) * 0.38;

        const r = Math.min(255, Math.round(38 + diffuse * 198 + flakeGlow * 60 + clearcoat * 185 + fresnel * 48));
        const g = Math.min(255, Math.round(6 + diffuse * 64 + flakeGlow * 55 + clearcoat * 175 + fresnel * 18));
        const b = Math.min(255, Math.round(2 + diffuse * 6 + clearcoat * 145));
        return `rgb(${r}, ${g}, ${b})`;
      }

      if (mat === 'glass') {
        const glassSpec = Math.pow(specDot, 32);
        const skyRefl = Math.max(0, ny) * 0.22;
        const v = Math.min(255, Math.round(10 + skyRefl * 55 + glassSpec * 165 + fresnel * 28));
        return `rgb(${v}, ${Math.min(255, v + 3)}, ${Math.min(255, v + 8)})`;
      }

      if (mat === 'vent') {
        return 'rgb(8, 8, 10)';
      }

      const carbDiffuse = keyDot * 0.65 + sideDot * 0.25;
      const carbSpec = Math.pow(specDot, 16);
      const c = Math.min(255, Math.round(12 + carbDiffuse * 32 + carbSpec * 78 + fresnel * 18));
      return `rgb(${c}, ${c}, ${Math.min(255, c + 4)})`;
    }

    function drawStudioFloorAndShadow(yaw, pitch, scale, cx, cy) {
      const floorCenter = project3D(0, -48, 0, yaw, pitch, scale, cx, cy);
      if (!floorCenter) return;

      const spotW = Math.max(120, 440 * floorCenter.persp);
      const spotH = Math.max(40, 135 * floorCenter.persp);
      const floorGrad = ctx.createRadialGradient(
        floorCenter.sx,
        floorCenter.sy,
        spotH * 0.1,
        floorCenter.sx,
        floorCenter.sy,
        spotW
      );
      floorGrad.addColorStop(0, 'rgba(165, 162, 160, 0.34)');
      floorGrad.addColorStop(0.45, 'rgba(95, 92, 92, 0.18)');
      floorGrad.addColorStop(0.78, 'rgba(35, 34, 36, 0.06)');
      floorGrad.addColorStop(1, 'rgba(10, 10, 12, 0)');

      ctx.fillStyle = floorGrad;
      ctx.beginPath();
      ctx.ellipse(floorCenter.sx, floorCenter.sy, spotW, spotH, 0, 0, Math.PI * 2);
      ctx.fill();

      const shadowOutline = [
        [-252, -88], [-262, 0], [-252, 88],
        [-120, 106], [20, 104], [165, 108],
        [248, 92], [260, 0], [248, -92],
        [165, -108], [20, -104], [-120, -106]
      ];
      ctx.save();
      ctx.filter = 'blur(8px)';
      ctx.beginPath();
      shadowOutline.forEach(([sx, sz], idx) => {
        const pt = project3D(sx, -46, sz, yaw, pitch, scale, cx, cy);
        if (!pt) return;
        if (idx === 0) ctx.moveTo(pt.sx, pt.sy);
        else ctx.lineTo(pt.sx, pt.sy);
      });
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
      ctx.fill();
      ctx.restore();
    }

    // Draw Realistic 3D Gunmetal 10-Spoke Wheels + Glowing Silver/White Brake Discs (like the photo!)
    function drawRealistic3DWheel(wheel, yaw, pitch, scale, cx, cy) {
      const { x, y, z, r, width: tireW, isLeft } = wheel;
      const wheelSteps = 24;
      const zInner = z + (isLeft ? tireW * 0.5 : -tireW * 0.5);
      const zOuter = z + (isLeft ? -tireW * 0.5 : tireW * 0.5);

      const innerRing = [];
      const outerRing = [];
      const rimRing = [];
      const rotorRing = [];

      for (let i = 0; i <= wheelSteps; i++) {
        const a = (i / wheelSteps) * Math.PI * 2;
        const cosA = Math.cos(a);
        const sinA = Math.sin(a);
        innerRing.push(project3D(x + cosA * r, y + sinA * r, zInner, yaw, pitch, scale, cx, cy));
        outerRing.push(project3D(x + cosA * r, y + sinA * r, zOuter, yaw, pitch, scale, cx, cy));
        rimRing.push(project3D(x + cosA * (r * 0.76), y + sinA * (r * 0.76), zOuter, yaw, pitch, scale, cx, cy));
        rotorRing.push(project3D(x + cosA * (r * 0.56), y + sinA * (r * 0.56), zOuter + (isLeft ? 3 : -3), yaw, pitch, scale, cx, cy));
      }

      // 1. 3D Rubber Tire Tread Barrel Quads
      for (let i = 0; i < wheelSteps; i++) {
        const p0 = innerRing[i];
        const p1 = innerRing[i + 1];
        const p2 = outerRing[i + 1];
        const p3 = outerRing[i];
        if (!p0 || !p1 || !p2 || !p3) continue;

        const shade = 10 + Math.round((Math.sin((i / wheelSteps) * Math.PI * 2) + 1) * 10);
        ctx.beginPath();
        ctx.moveTo(p0.sx, p0.sy);
        ctx.lineTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.lineTo(p3.sx, p3.sy);
        ctx.closePath();
        ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade + 2})`;
        ctx.fill();
      }

      // 2. Outer Pirelli Tire Sidewall
      ctx.beginPath();
      outerRing.forEach((pt, idx) => {
        if (!pt) return;
        if (idx === 0) ctx.moveTo(pt.sx, pt.sy);
        else ctx.lineTo(pt.sx, pt.sy);
      });
      ctx.closePath();
      ctx.fillStyle = '#0c0d10';
      ctx.fill();

      // 3. Bright Glowing Silver/White Carbon-Ceramic Brake Rotor Disc (shining behind spokes like the photo!)
      ctx.beginPath();
      rotorRing.forEach((pt, idx) => {
        if (!pt) return;
        if (idx === 0) ctx.moveTo(pt.sx, pt.sy);
        else ctx.lineTo(pt.sx, pt.sy);
      });
      ctx.closePath();
      ctx.fillStyle = '#d8e2ec';
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 4. Metallic Gunmetal Rim Lip
      ctx.beginPath();
      rimRing.forEach((pt, idx) => {
        if (!pt) return;
        if (idx === 0) ctx.moveTo(pt.sx, pt.sy);
        else ctx.lineTo(pt.sx, pt.sy);
      });
      ctx.closePath();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // 5. Spinning 10-Spoke Super-Lightweight Forged Wheel Spokes
      const hubPt = project3D(x, y, zOuter + (isLeft ? 1.5 : -1.5), yaw, pitch, scale, cx, cy);
      if (hubPt) {
        for (let sp = 0; sp < 10; sp++) {
          const a = (sp / 10) * Math.PI * 2 + wheelSpinAngle;
          const rimPt = project3D(
            x + Math.cos(a) * (r * 0.75),
            y + Math.sin(a) * (r * 0.75),
            zOuter,
            yaw,
            pitch,
            scale,
            cx,
            cy
          );
          if (rimPt) {
            ctx.beginPath();
            ctx.moveTo(hubPt.sx, hubPt.sy);
            ctx.lineTo(rimPt.sx, rimPt.sy);
            ctx.strokeStyle = sp % 2 === 0 ? '#cbd5e1' : '#64748b';
            ctx.lineWidth = 1.65;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(hubPt.sx, hubPt.sy, 3.8, 0, Math.PI * 2);
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }
    }

    function renderStudioP1() {
      ctx.clearRect(0, 0, width, height);

      // Continuously rotate the 3D Volcano Orange McLaren P1 360 degrees
      autoSpinAngle += 0.0075;
      wheelSpinAngle -= 0.065;

      const desiredYaw = autoSpinAngle + mouseYawOffset + scrollYawOffset;
      currentYaw += (desiredYaw - currentYaw) * 0.08;
      currentPitch += (targetPitch - currentPitch) * 0.06;

      const cx = width * 0.5;
      const cy = height * 0.53;
      const baseScale = Math.min(width, height) / 650;

      // 1. Draw Studio Floor Spotlight & Soft Underbody Car Shadow
      drawStudioFloorAndShadow(currentYaw, currentPitch, baseScale, cx, cy);

      // 2. Project all Smooth Subdivided McLaren P1 3D Vertices
      const projected = vertices.map((v) =>
        project3D(v.x, v.y, v.z, currentYaw, currentPitch, baseScale, cx, cy)
      );

      // 3. Combine Smooth Body Triangles & 3D Wheels into a Unified Depth-Sorted Render Queue
      const renderQueue = [];

      triangles.forEach(({ a: i0, b: i1, c: i2, mat }) => {
        const p0 = projected[i0];
        const p1 = projected[i1];
        const p2 = projected[i2];
        if (!p0 || !p1 || !p2) return;
        const depthZ = (p0.z + p1.z + p2.z) / 3;
        renderQueue.push({
          type: 'tri',
          p0,
          p1,
          p2,
          mat,
          depthZ
        });
      });

      wheels3D.forEach((w) => {
        const wp = project3D(w.x, w.y, w.z, currentYaw, currentPitch, baseScale, cx, cy);
        if (wp) {
          renderQueue.push({
            type: 'wheel',
            wheel: w,
            depthZ: wp.z
          });
        }
      });

      renderQueue.sort((a, b) => b.depthZ - a.depthZ);

      // 4. Render Smooth-Shaded Volcano Orange Bodywork & 3D Wheels (Zero Wireframe Grid!)
      renderQueue.forEach((item) => {
        if (item.type === 'wheel') {
          drawRealistic3DWheel(item.wheel, currentYaw, currentPitch, baseScale, cx, cy);
          return;
        }

        const { p0, p1, p2, mat } = item;
        const color = computeP1StudioColor(p0, p1, p2, mat);

        ctx.beginPath();
        ctx.moveTo(p0.sx, p0.sy);
        ctx.lineTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.55;
        ctx.stroke();
      });

      // 5. Draw Ice-Blue Xenon Swoosh Headlights & Sinister Rear LED Taillight Blades
      p1SignatureLines.forEach(({ type, pts }) => {
        ctx.beginPath();
        let started = false;
        let centerPt = null;
        pts.forEach(([lx, ly, lz], idx) => {
          const pt = project3D(lx, ly, lz, currentYaw, currentPitch, baseScale, cx, cy);
          if (!pt) return;
          if (!started) {
            ctx.moveTo(pt.sx, pt.sy);
            started = true;
          } else {
            ctx.lineTo(pt.sx, pt.sy);
          }
          if (idx === 1) centerPt = pt;
        });

        ctx.save();
        if (type === 'headlight') {
          ctx.closePath();
          ctx.fillStyle = 'rgba(215, 242, 255, 0.92)';
          ctx.shadowColor = '#70d6ff';
          ctx.shadowBlur = 18;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.4;
          ctx.stroke();

          if (centerPt) {
            const hlGrad = ctx.createRadialGradient(
              centerPt.sx,
              centerPt.sy,
              1,
              centerPt.sx,
              centerPt.sy,
              18 * centerPt.persp
            );
            hlGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            hlGrad.addColorStop(0.4, 'rgba(130, 215, 255, 0.55)');
            hlGrad.addColorStop(1, 'rgba(80, 180, 255, 0)');
            ctx.fillStyle = hlGrad;
            ctx.beginPath();
            ctx.arc(centerPt.sx, centerPt.sy, 18 * centerPt.persp, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (type === 'taillight') {
          ctx.shadowColor = '#ff2200';
          ctx.shadowBlur = 14;
          ctx.strokeStyle = '#ff3300';
          ctx.lineWidth = 2.8;
          ctx.stroke();
        }
        ctx.restore();
      });

      requestAnimationFrame(renderStudioP1);
    }

    renderStudioP1();
  }

  /* --------------------------------------------------------------------------
     9. ANIMATED "95" FLAMING LIGHTNING CURSOR & PARTICLE TRAIL
     -------------------------------------------------------------------------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursorLayer = document.createElement('div');
    cursorLayer.className = 'cursor-95-layer';

    const follower = document.createElement('div');
    follower.className = 'cursor-95-follower';
    follower.innerHTML = `
      <div class="cursor-95-ring"></div>
      <div class="cursor-95-inner">
        <div class="cursor-95-aura"></div>
        <img src="cursor-95.png" alt="" class="cursor-95-sprite" />
      </div>
    `;

    cursorLayer.appendChild(follower);
    document.body.appendChild(cursorLayer);

    const innerEl = follower.querySelector('.cursor-95-inner');
    let mouseX = -100;
    let mouseY = -100;
    let prevX = -100;
    let prevY = -100;
    let tiltAngle = 0;
    let lastParticleTime = 0;

    function spawnCursorParticle(x, y, isBurst = false) {
      const p = document.createElement('span');
      p.className = 'cursor-95-particle';
      const size = isBurst ? 5 + Math.random() * 6 : 3.5 + Math.random() * 4.5;
      const colors = ['#FF4500', '#FF8C00', '#FFD700', '#FFF4B8', '#00E5FF'];
      const color = colors[Math.floor(Math.random() * (isBurst ? colors.length : 4))];

      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.background = color;
      p.style.boxShadow = `0 0 ${size * 2.2}px ${color}`;

      // Spawn near the flaming tail of the "95" lightning bolt cursor
      const startX = x + (isBurst ? 0 : 18 + (Math.random() - 0.5) * 10);
      const startY = y + (isBurst ? 0 : 20 + (Math.random() - 0.5) * 10);
      const angle = isBurst ? Math.random() * Math.PI * 2 : Math.random() * Math.PI * 2;
      const dist = isBurst ? 24 + Math.random() * 38 : 10 + Math.random() * 18;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - (isBurst ? 0 : 10);

      p.style.transform = `translate3d(${startX}px, ${startY}px, 0) scale(1)`;
      p.style.opacity = '0.95';
      cursorLayer.appendChild(p);

      const duration = isBurst ? 420 + Math.random() * 220 : 300 + Math.random() * 180;
      const anim = p.animate(
        [
          { transform: `translate3d(${startX}px, ${startY}px, 0) scale(1)`, opacity: 0.95 },
          { transform: `translate3d(${startX + dx}px, ${startY + dy}px, 0) scale(0.1)`, opacity: 0 }
        ],
        { duration, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      );
      anim.onfinish = () => p.remove();
    }

    window.addEventListener('mousemove', (e) => {
      document.documentElement.classList.add('has-animated-cursor');
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Position hotspot at the tip of the 95 lightning bolt (5, 7)
      follower.style.transform = `translate3d(${mouseX - 5}px, ${mouseY - 7}px, 0)`;

      // Dynamic velocity tilt
      const vx = mouseX - prevX;
      const vy = mouseY - prevY;
      const speed = Math.hypot(vx, vy);
      prevX = mouseX;
      prevY = mouseY;

      tiltAngle = Math.max(-18, Math.min(18, vx * 0.45));
      if (!follower.classList.contains('is-hovering') && !follower.classList.contains('is-clicking')) {
        innerEl.style.transform = `rotate(${tiltAngle.toFixed(1)}deg) scale(${Math.min(1.12, 1 + speed * 0.002).toFixed(2)})`;
      }

      // Spawn flame ember trail along movement
      const now = performance.now();
      if (speed > 2 && now - lastParticleTime > 22) {
        lastParticleTime = now;
        spawnCursorParticle(mouseX, mouseY, false);
      }
    });

    // Interactive Hover Lock-On State
    const interactiveSelector = 'a, button, .mode-btn, .project-card, .spec-box, .p1-frame-outer, input, textarea';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelector)) {
        follower.classList.add('is-hovering');
        innerEl.style.transform = '';
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelector)) {
        follower.classList.remove('is-hovering');
      }
    });

    // Click Nitro Burst & Shockwave
    window.addEventListener('mousedown', (e) => {
      follower.classList.add('is-clicking');
      innerEl.style.transform = '';

      const wave = document.createElement('div');
      wave.className = 'cursor-95-shockwave';
      wave.style.left = `${e.clientX}px`;
      wave.style.top = `${e.clientY}px`;
      cursorLayer.appendChild(wave);
      setTimeout(() => wave.remove(), 500);

      for (let i = 0; i < 10; i++) {
        spawnCursorParticle(e.clientX, e.clientY, true);
      }
    });

    window.addEventListener('mouseup', () => {
      follower.classList.remove('is-clicking');
    });
  }
});

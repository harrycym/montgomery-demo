(function() {
  'use strict';

  // ── CSS ──────────────────────────────────────────────────────────────
  var CSS = [
    '/* Avatar Widget */',
    '.aw-widget{display:flex;flex-direction:column;align-items:center;padding:32px 24px 28px;position:relative;border-top:1px solid var(--border,rgba(255,255,255,0.06));border-bottom:1px solid var(--border,rgba(255,255,255,0.06));background:linear-gradient(180deg,rgba(64,128,255,0.02) 0%,transparent 100%)}',
    '.aw-desc{font-family:var(--mono,"IBM Plex Mono",monospace);font-size:11px;color:var(--dim,rgba(255,255,255,0.35));text-align:center;max-width:280px;line-height:1.5;margin-bottom:18px;letter-spacing:0.02em}',
    '.aw-frame{position:relative;width:220px;height:220px;margin-bottom:16px}',
    '.aw-frame::before{content:"";position:absolute;inset:-5px;border-radius:16px;border:1px solid rgba(200,162,76,0.15);animation:awPulse 3.5s ease-in-out infinite}',
    '.aw-img-wrap{width:220px;height:220px;border-radius:14px;border:2px solid rgba(200,162,76,0.3);cursor:pointer;position:relative;overflow:hidden;background:linear-gradient(135deg,#0d1a3a 0%,#1a2a5e 40%,#2a3a7e 100%);display:flex;align-items:center;justify-content:center;animation:awImgBreathe 3.5s ease-in-out infinite;box-shadow:0 4px 40px rgba(64,128,255,0.1),0 0 80px rgba(64,128,255,0.04)}',
    '.aw-glow{position:absolute;inset:-8px;border-radius:20px;box-shadow:0 4px 40px rgba(64,128,255,0.1),0 0 80px rgba(64,128,255,0.04);animation:awBreathe 3.5s ease-in-out infinite;pointer-events:none}',
    '.aw-img-wrap img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:0;display:none}',
    '.aw-img-wrap img.show{display:block}',
    '.aw-placeholder{font-size:48px;opacity:0.15;color:var(--white,#f0eee8)}',
    '.aw-upload-hint{position:absolute;inset:0;background:rgba(2,8,24,0.65);backdrop-filter:blur(4px);display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:1;transition:opacity 0.3s;border-radius:14px;z-index:4}',
    '.aw-has-image .aw-upload-hint{opacity:0}',
    '.aw-has-image:hover .aw-upload-hint{opacity:1}',
    '.aw-upload-hint svg{width:28px;height:28px;stroke:var(--gold,#c8a24c);fill:none;margin-bottom:6px}',
    '.aw-upload-hint span{font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--gold,#c8a24c);font-family:var(--mono,"IBM Plex Mono",monospace)}',
    '.aw-watermark{position:absolute;top:10px;left:10px;display:none;align-items:center;gap:5px;background:rgba(0,0,0,0.45);backdrop-filter:blur(6px);padding:4px 8px;border-radius:6px;z-index:3}',
    '.aw-watermark.show{display:flex}',
    '.aw-wm-logo{width:14px;height:14px;border-radius:50%;background:rgba(200,162,76,0.25);border:1px solid rgba(200,162,76,0.4);display:flex;align-items:center;justify-content:center;font-family:var(--display,"Playfair Display",serif);font-size:8px;color:var(--gold,#c8a24c);font-style:italic}',
    '.aw-wm-text{font-family:var(--mono,"IBM Plex Mono",monospace);font-size:7px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(200,162,76,0.7)}',
    '.aw-tabs{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap;justify-content:center}',
    '.aw-tab{font-family:var(--mono,"IBM Plex Mono",monospace);font-size:10px;letter-spacing:0.06em;padding:5px 12px;border-radius:14px;border:1px solid var(--border,rgba(255,255,255,0.06));background:var(--surface,rgba(255,255,255,0.03));color:var(--dim,rgba(255,255,255,0.35));cursor:pointer;transition:all 0.3s cubic-bezier(0.16,1,0.3,1)}',
    '.aw-tab.active{color:var(--white,#f0eee8);border-color:rgba(80,130,255,0.25)}',
    '.aw-tab[data-style="cartoon"].active{background:rgba(64,128,255,0.12);border-color:rgba(64,128,255,0.25);color:#60a0ff}',
    '.aw-tab[data-style="ancient"].active{background:rgba(200,162,76,0.1);border-color:rgba(200,162,76,0.25);color:#c8a24c}',
    '.aw-tab[data-style="nft"].active{background:rgba(0,224,255,0.08);border-color:rgba(0,224,255,0.18);color:#00e0ff}',
    '.aw-tab[data-style="business"].active{background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.12);color:#f0eee8}',
    '.aw-actions{display:flex;gap:8px;align-items:center;margin-top:2px}',
    '.aw-btn{font-family:var(--mono,"IBM Plex Mono",monospace);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;padding:8px 20px;border-radius:20px;cursor:pointer;transition:all 0.3s;border:1px solid;display:flex;align-items:center;gap:5px}',
    '.aw-btn-generate{color:var(--gold,#c8a24c);background:rgba(200,162,76,0.08);border-color:rgba(200,162,76,0.2)}',
    '.aw-btn-generate:hover{background:rgba(200,162,76,0.15);border-color:rgba(200,162,76,0.35)}',
    '.aw-btn-generate.disabled{opacity:0.35;pointer-events:none}',
    '.aw-btn-save{color:var(--cyan,#00e0ff);background:rgba(0,224,255,0.06);border-color:rgba(0,224,255,0.15)}',
    '.aw-btn-save:hover{background:rgba(0,224,255,0.12);border-color:rgba(0,224,255,0.25)}',
    '.aw-btn-save.disabled{opacity:0.35;pointer-events:none}',
    '.aw-btn-save svg{width:13px;height:13px;stroke:currentColor;fill:none}',
    '.aw-loading{margin-top:10px;display:none;text-align:center}',
    '.aw-loading.show{display:block}',
    '.aw-loading-timer{font-family:var(--mono,"IBM Plex Mono",monospace);font-size:10px;color:var(--dim,rgba(255,255,255,0.35));margin-bottom:6px;letter-spacing:0.06em}',
    '.aw-loading-bar{width:140px;height:2px;background:var(--surface-2,rgba(255,255,255,0.06));border-radius:1px;overflow:hidden;margin:0 auto}',
    '.aw-loading-fill{width:40%;height:100%;background:linear-gradient(90deg,var(--blue,#4080ff),var(--cyan,#00e0ff));border-radius:1px;animation:awSlide 1.2s ease-in-out infinite}',
    '.aw-error{font-family:var(--mono,"IBM Plex Mono",monospace);font-size:10px;color:var(--red,#ff4040);margin-top:8px;display:none;text-align:center;max-width:260px}',
    '.aw-error.show{display:block}',
    '@keyframes awBreathe{0%,100%{box-shadow:0 4px 40px rgba(64,128,255,0.08),0 0 60px rgba(64,128,255,0.03)}50%{box-shadow:0 4px 50px rgba(64,128,255,0.2),0 0 90px rgba(64,128,255,0.1)}}',
    '@keyframes awPulse{0%,100%{opacity:0.15}50%{opacity:0.7}}',
    '@keyframes awSlide{0%{transform:translateX(-100%)}100%{transform:translateX(350%)}}',
    '@keyframes awImgBreathe{0%,100%{transform:scale(1)}50%{transform:scale(1.008)}}'
  ].join('\n');

  // ── HTML ─────────────────────────────────────────────────────────────
  var HTML = '<div class="aw-widget">' +
    '<div class="aw-desc" data-i18n="aw_desc">Upload a photo and transform it into a unique AI-generated avatar</div>' +
    '<div class="aw-frame">' +
      '<div class="aw-glow"></div>' +
      '<div class="aw-img-wrap" id="aw-img-wrap">' +
        '<div class="aw-watermark" id="aw-watermark">' +
          '<div class="aw-wm-logo">M</div>' +
          '<div class="aw-wm-text">Montgomery</div>' +
        '</div>' +
        '<span class="aw-placeholder">\u25A1</span>' +
        '<img id="aw-preview" alt="Avatar preview">' +
        '<div class="aw-upload-hint">' +
          '<svg viewBox="0 0 24 24" stroke-width="1.5"><path d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16"/></svg>' +
          '<span data-i18n="aw_upload">Upload Photo</span>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="aw-tabs" id="aw-tabs">' +
      '<div class="aw-tab active" data-style="cartoon" data-i18n="aw_cartoon">Cartoon</div>' +
      '<div class="aw-tab" data-style="ancient" data-i18n="aw_ancient">Ancient</div>' +
      '<div class="aw-tab" data-style="nft" data-i18n="aw_nft">NFT</div>' +
      '<div class="aw-tab" data-style="business" data-i18n="aw_business">Business</div>' +
    '</div>' +
    '<div class="aw-actions">' +
      '<div class="aw-btn aw-btn-generate disabled" id="aw-generate" data-i18n="aw_generate">Generate</div>' +
      '<div class="aw-btn aw-btn-save disabled" id="aw-save">' +
        '<svg viewBox="0 0 24 24" stroke-width="1.5"><path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"/></svg>' +
        '<span data-i18n="aw_save">Save</span>' +
      '</div>' +
    '</div>' +
    '<div class="aw-loading" id="aw-loading">' +
      '<div class="aw-loading-timer" id="aw-timer">Generating ~15-30s...</div>' +
      '<div class="aw-loading-bar"><div class="aw-loading-fill"></div></div>' +
    '</div>' +
    '<div class="aw-error" id="aw-error"></div>' +
    '<input type="file" id="aw-file" accept="image/jpeg,image/png,image/webp" style="display:none">' +
    '<canvas id="aw-canvas" style="display:none"></canvas>' +
  '</div>';

  // ── PROMPTS ──────────────────────────────────────────────────────────
  var PROMPTS = {
    cartoon: 'Transform this portrait photo into a 3D Pixar/Disney animation style character render. ' +
      'STYLE RULES: Smooth subsurface-scattering skin, slightly enlarged eyes (1.2x), rounded facial features, subtle exaggerated proportions. Maintain the subject\'s exact hairstyle, hair color, and distinguishing facial features (moles, freckles, face shape). ' +
      'LIGHTING: Soft 3-point studio lighting \u2014 key light at 45\u00b0 warm (3200K), fill light cool (5600K) at 20% intensity, rim light from behind at 40%. ' +
      'COMPOSITION: Head and shoulders, centered, slight 3/4 turn (15\u00b0 left). Camera at eye level. ' +
      'BACKGROUND: Solid soft gradient \u2014 #1a1a2e to #16213e (dark navy). No environmental elements. ' +
      'COLOR PALETTE: Saturated but not neon. Skin tones warm. Clothing colors match the original photo. ' +
      'OUTPUT: Square 1:1, clean edges, no border. CRITICAL: Do NOT add any text, watermarks, logos, signatures, labels, or branding anywhere in the image. The image must be completely free of any written characters or symbols.',

    ancient: 'Transform this portrait photo into a traditional Chinese classical painting (\u53e4\u98ce\u5de5\u7b14\u753b) style portrait. ' +
      'STYLE RULES: Gongbi (fine-brush) technique with ink wash accents. The subject wears a dark navy/deep blue hanfu (\u6c49\u670d) with gold embroidery details and a jade hair ornament. Maintain the subject\'s exact face shape, eye shape, and distinguishing features. ' +
      'LIGHTING: Flat, even lighting typical of classical Chinese portraiture \u2014 no harsh shadows, soft ambient illumination. ' +
      'COMPOSITION: Head and upper body, centered, facing slightly right. Seated or standing pose with hands folded or holding a scroll/fan. ' +
      'BACKGROUND: Aged rice paper texture (#f5f0e8) with subtle ink wash mountains in far distance (< 15% opacity). A single branch of plum blossom or bamboo in upper-right corner. ' +
      'COLOR PALETTE: Muted earth tones \u2014 ink black, warm grey, deep navy (#0a1628), antique gold (#c8a24c), jade green (#2d6a4f), rice paper cream. No bright or saturated colors. ' +
      'OUTPUT: Square 1:1, clean edges, no border. CRITICAL: Do NOT add any text, watermarks, logos, signatures, labels, or branding anywhere in the image. The image must be completely free of any written characters or symbols.',

    nft: 'Transform this portrait photo into a Bored Ape Yacht Club (BAYC) inspired NFT PFP avatar. ' +
      'STYLE RULES: Hand-drawn illustration style with visible brush texture and ink-like line work — NOT clean vector art. Slightly grungy, textured strokes similar to BAYC apes. Maintain the subject\'s face shape and key features but stylize them with exaggerated, ape-like proportions: slightly protruding jaw, heavy brow, expressive mouth. Fur-like texture on skin areas using short directional strokes. Add one randomized trait/accessory from this list: sailor hat, king\'s crown, gold hoop earring, laser eyes (red glow), cigarette, party horn, biker vest, rainbow bandana. ' +
      'LIGHTING: Flat, no realistic lighting — all depth conveyed through line weight variation and minimal cel-shading (2 levels max). ' +
      'COMPOSITION: Head and shoulders, perfectly centered, facing directly forward. Tight crop, symmetrical framing, like a profile picture collectible. ' +
      'BACKGROUND: Solid single flat color — randomly choose from BAYC-inspired tones: #f9d71c (army yellow), #e06c3a (burnt orange), #4b8dbf (steel blue), #6b4c9a (purple haze), #c8a24c (gold), #3a3a3a (dark grey). No gradients, completely flat. ' +
      'COLOR PALETTE: Earthy, muted tones mixed with punchy accents — army green, brown, tan, gold, denim blue, hot pink, neon green. Thick dark outlines. Gritty not polished. Max 10 colors. Inspired by the BAYC trait palette. ' +
      'OUTPUT: Square 1:1, clean edges, no border. CRITICAL: Do NOT add any text, watermarks, logos, signatures, labels, or branding anywhere in the image. The image must be completely free of any written characters or symbols.',

    business: 'Transform this portrait photo into a premium professional corporate headshot illustration. ' +
      'STYLE RULES: Semi-realistic digital painting, polished and clean. The subject wears a dark charcoal or navy tailored suit/blazer with a white or light blue dress shirt. Tie optional (match original if present). Maintain exact facial features, skin tone, and hairstyle \u2014 this must be immediately recognizable as the same person. ' +
      'LIGHTING: Professional studio portrait lighting \u2014 soft butterfly/Paramount lighting from directly above camera at 45\u00b0 elevation. Subtle fill from below. Gentle catchlights in eyes. Minimal shadows under chin. ' +
      'COMPOSITION: Head and shoulders, centered, straight-on or very slight 3/4 turn (max 10\u00b0). Eye line at upper third. ' +
      'BACKGROUND: Smooth gradient \u2014 dark navy (#0a1628) at edges to slightly lighter center (#162040). Subtle radial vignette. No props or environment. ' +
      'COLOR PALETTE: Restrained and professional \u2014 navy, charcoal, white, skin tones. No bright colors. The only accent color allowed is a subtle gold (#c8a24c) on cufflinks or tie pin. ' +
      'OUTPUT: Square 1:1, clean edges, no border. CRITICAL: Do NOT add any text, watermarks, logos, signatures, labels, or branding anywhere in the image. The image must be completely free of any written characters or symbols.'
  };

  // ── STATE ────────────────────────────────────────────────────────────
  var state = {
    logoUrl: '',
    currentStyle: 'cartoon',
    uploadedBase64: null,
    uploadedMimeType: null,
    generatedBase64: null,
    generatedMime: null,
    logoImg: null,
    logoLoaded: false,
    canvasReady: false,
    downloadDataUrl: null,
    timerInterval: null
  };

  // ── PUBLIC API ───────────────────────────────────────────────────────
  window.AvatarWidget = {
    init: function(opts) {
      if (!opts || !opts.target) { console.error('AvatarWidget: target is required'); return; }

      state.logoUrl = opts.logoUrl || '';

      // Inject CSS
      var style = document.createElement('style');
      style.textContent = CSS;
      document.head.appendChild(style);

      // Inject HTML
      var mount = document.querySelector(opts.target);
      if (!mount) { console.error('AvatarWidget: target not found: ' + opts.target); return; }
      mount.innerHTML = HTML;

      // Preload logo for watermark
      if (state.logoUrl) {
        state.logoImg = new Image();
        state.logoImg.onload = function() { state.logoLoaded = true; };
        state.logoImg.onerror = function() { state.logoLoaded = false; };
        state.logoImg.src = state.logoUrl;
      }

      bindEvents();
    }
  };

  // ── EVENT BINDING ────────────────────────────────────────────────────
  function bindEvents() {
    var imgWrap = document.getElementById('aw-img-wrap');
    var fileInput = document.getElementById('aw-file');
    var generateBtn = document.getElementById('aw-generate');
    var saveBtn = document.getElementById('aw-save');
    var tabsContainer = document.getElementById('aw-tabs');

    imgWrap.addEventListener('click', function() { fileInput.click(); });

    fileInput.addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (!file) return;
      handleUpload(file);
    });

    tabsContainer.addEventListener('click', function(e) {
      var tab = e.target.closest('.aw-tab');
      if (!tab) return;
      tabsContainer.querySelectorAll('.aw-tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      state.currentStyle = tab.dataset.style;
    });

    generateBtn.addEventListener('click', function() {
      if (this.classList.contains('disabled')) return;
      generateAvatar();
    });

    saveBtn.addEventListener('click', function() {
      if (this.classList.contains('disabled')) return;
      downloadAvatar();
    });
  }

  // ── UPLOAD ───────────────────────────────────────────────────────────
  function handleUpload(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = new Image();
      img.onload = function() {
        var canvas = document.getElementById('aw-canvas');
        var max = 1024;
        var w = img.width, h = img.height;
        if (w > max || h > max) {
          var ratio = Math.min(max / w, max / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        state.uploadedBase64 = canvas.toDataURL(file.type || 'image/jpeg').split(',')[1];
        state.uploadedMimeType = file.type || 'image/jpeg';

        // Show preview
        var preview = document.getElementById('aw-preview');
        preview.src = 'data:' + state.uploadedMimeType + ';base64,' + state.uploadedBase64;
        preview.classList.add('show');

        // Mark as having image, enable generate, reset generated state
        document.getElementById('aw-img-wrap').classList.add('aw-has-image');
        document.getElementById('aw-generate').classList.remove('disabled');
        state.generatedBase64 = null;
        document.getElementById('aw-save').classList.add('disabled');
        document.getElementById('aw-watermark').classList.remove('show');
        document.getElementById('aw-error').classList.remove('show');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ── GEMINI API ───────────────────────────────────────────────────────
  function generateAvatar() {
    if (!state.uploadedBase64) return;

    var loading = document.getElementById('aw-loading');
    var errorEl = document.getElementById('aw-error');
    var generateBtn = document.getElementById('aw-generate');

    loading.classList.add('show');
    errorEl.classList.remove('show');
    generateBtn.classList.add('disabled');

    // Start elapsed timer (i18n-aware, reads language live each tick)
    var timerEl = document.getElementById('aw-timer');
    var startTime = Date.now();
    function getTimerText(key, fallback) {
      var lang = window.currentLang || 'en';
      return (window.i18n && window.i18n[key] && window.i18n[key][lang]) ? window.i18n[key][lang] : fallback;
    }
    timerEl.textContent = getTimerText('aw_generating', 'Generating ~15-30s...');
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerInterval = setInterval(function() {
      var elapsed = Math.floor((Date.now() - startTime) / 1000);
      timerEl.textContent = getTimerText('aw_elapsed', '{n}s elapsed ~15-30s').replace('{n}', elapsed);
    }, 1000);

    var prompt = PROMPTS[state.currentStyle];
    var body = {
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: state.uploadedMimeType, data: state.uploadedBase64 } }
        ]
      }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: { aspectRatio: '1:1' }
      }
    };

    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    .then(function(res) {
      return res.text().then(function(text) {
        var data;
        try { data = JSON.parse(text); } catch (e) {
          throw new Error('Server error: ' + text.substring(0, 200));
        }
        if (!res.ok) {
          throw new Error(data.error && (typeof data.error === 'string' ? data.error : data.error.message) || 'API error ' + res.status);
        }
        return data;
      });
    })
    .then(function(data) {
      var parts = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
      if (!parts) throw new Error('No response from API');

      var imageData = null;
      var imageMime = 'image/png';
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].inlineData && parts[i].inlineData.data) {
          imageData = parts[i].inlineData.data;
          imageMime = parts[i].inlineData.mimeType || 'image/png';
          break;
        }
      }
      if (!imageData) throw new Error('No image in response');

      state.generatedBase64 = imageData;
      state.generatedMime = imageMime;
      state.downloadDataUrl = null;
      applyWatermarkAndShow();
      prepareDownloadCanvas();
    })
    .catch(function(err) {
      errorEl.textContent = err.message || 'Generation failed';
      errorEl.classList.add('show');
    })
    .then(function() {
      // finally
      if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
      loading.classList.remove('show');
      generateBtn.classList.remove('disabled');
    });
  }

  // ── WATERMARK (canvas) ──────────────────────────────────────────────
  function showGenerated(dataUrl) {
    var preview = document.getElementById('aw-preview');
    preview.src = dataUrl;
    preview.classList.add('show');
    document.getElementById('aw-watermark').classList.add('show');
    document.getElementById('aw-save').classList.remove('disabled');
  }

  function applyWatermarkAndShow() {
    var mime = state.generatedMime || 'image/png';
    var rawDataUrl = 'data:' + mime + ';base64,' + state.generatedBase64;

    // Step 1: show the generated image immediately
    showGenerated(rawDataUrl);

    // Step 2: try to apply watermark on canvas (async, best-effort)
    try {
      var img = new Image();
      img.onload = function() {
        try {
          var canvas = document.getElementById('aw-canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          // Draw logo watermark top-left
          var padding = Math.round(img.width * 0.03);
          if (state.logoLoaded && state.logoImg) {
            var logoSize = Math.round(img.width * 0.12);
            ctx.globalAlpha = 0.4;
            ctx.drawImage(state.logoImg, padding, padding, logoSize, logoSize);
            ctx.globalAlpha = 1.0;
          } else {
            // Text watermark fallback
            var bgH = Math.round(img.width * 0.05);
            var bgW = Math.round(img.width * 0.35);
            var r = bgH * 0.3;
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.moveTo(padding + r, padding);
            ctx.lineTo(padding + bgW - r, padding);
            ctx.arcTo(padding + bgW, padding, padding + bgW, padding + r, r);
            ctx.lineTo(padding + bgW, padding + bgH - r);
            ctx.arcTo(padding + bgW, padding + bgH, padding + bgW - r, padding + bgH, r);
            ctx.lineTo(padding + r, padding + bgH);
            ctx.arcTo(padding, padding + bgH, padding, padding + bgH - r, r);
            ctx.lineTo(padding, padding + r);
            ctx.arcTo(padding, padding, padding + r, padding, r);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#c8a24c';
            var fontSize = Math.round(img.width * 0.028);
            ctx.font = 'bold ' + fontSize + 'px sans-serif';
            ctx.textBaseline = 'middle';
            ctx.fillText('M  MONTGOMERY', padding + bgH * 0.35, padding + bgH * 0.52);
            ctx.globalAlpha = 1.0;
          }

          // Update preview with watermarked version
          var watermarked = canvas.toDataURL('image/png');
          showGenerated(watermarked);
          state.canvasReady = true;
        } catch (e) {
          // Canvas tainted or other error — raw image already showing
          state.canvasReady = false;
        }
      };
      img.onerror = function() { state.canvasReady = false; };
      img.src = rawDataUrl;
    } catch (e) {
      state.canvasReady = false;
    }
  }

  // ── DOWNLOAD ─────────────────────────────────────────────────────────
  // Pre-render watermarked canvas right after generation so download is instant
  function prepareDownloadCanvas() {
    if (!state.generatedBase64) return;
    var mime = state.generatedMime || 'image/png';
    var img = new Image();
    img.onload = function() {
      var c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      var ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Montgomery watermark — subtle bottom-right
      var w = img.width;
      var fontSize = Math.round(w * 0.022);
      var text = 'MONTGOMERY PARTNERS';
      ctx.font = '600 ' + fontSize + 'px -apple-system, "Helvetica Neue", Arial, sans-serif';
      var textW = ctx.measureText(text).width;
      var pad = Math.round(w * 0.03);
      var x = w - textW - pad;
      var y = img.height - pad;

      // Shadow for readability on any background
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#000000';
      ctx.fillText(text, x + 1, y + 1);

      // Main text
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = '#ffffff';
      ctx.textBaseline = 'bottom';
      ctx.fillText(text, x, y);
      ctx.globalAlpha = 1.0;

      // Store as data URL for instant download
      state.downloadDataUrl = c.toDataURL('image/png');
    };
    img.src = 'data:' + mime + ';base64,' + state.generatedBase64;
  }

  function downloadAvatar() {
    if (!state.downloadDataUrl && !state.generatedBase64) return;

    var dataUrl = state.downloadDataUrl || ('data:' + (state.generatedMime || 'image/png') + ';base64,' + state.generatedBase64);
    var filename = 'montgomery-' + state.currentStyle + '-avatar.png';

    // Convert data URL to blob
    var byteStr = atob(dataUrl.split(',')[1]);
    var mimeStr = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    var arr = new Uint8Array(byteStr.length);
    for (var i = 0; i < byteStr.length; i++) arr[i] = byteStr.charCodeAt(i);
    var blob = new Blob([arr], { type: mimeStr });
    var file = new File([blob], filename, { type: mimeStr });

    // iOS Safari: use Web Share API → native share sheet → Save to Photos
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file] }).catch(function() {});
      return;
    }

    // Desktop / Android: normal download
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

})();

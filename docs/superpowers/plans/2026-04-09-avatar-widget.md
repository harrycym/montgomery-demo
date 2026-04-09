# Avatar Generator Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a self-contained avatar generator widget that lets users upload a photo, generate AI-stylized versions (Cartoon, Ancient, NFT, Business) via the Gemini API, overlay a Montgomery logo watermark client-side, and download the result.

**Architecture:** Single `avatar-widget.js` file containing all HTML, CSS, and JS. Exposes `AvatarWidget.init({ target, apiKey, logoUrl })` that injects a complete widget into any mount point. Uses the Gemini REST API directly from the browser (no SDK dependency). Canvas API handles image resize, watermark overlay, and download.

**Tech Stack:** Vanilla JavaScript (ES5), HTML5 Canvas, Gemini REST API (`gemini-3.1-flash-image-preview`), CSS custom properties

**Spec:** `docs/superpowers/specs/2026-04-09-avatar-widget-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `avatar-widget.js` | Create | Self-contained widget: all CSS, HTML template, upload logic, API calls, canvas watermark, download |
| `index.html` | Modify (lines 737-739) | Add `<div id="avatar-mount">` + `<script>` tags to integrate the widget |

---

### Task 1: Widget Shell — CSS + HTML Template + Init API

**Files:**
- Create: `avatar-widget.js`

- [ ] **Step 1: Create `avatar-widget.js` with the IIFE wrapper and `init()` function**

```javascript
(function() {
  'use strict';

  // ── CSS ──
  var CSS = '\
/* Avatar Widget */\
.aw-widget{\
  display:flex;flex-direction:column;align-items:center;\
  padding:32px 24px 28px;position:relative;\
  border-top:1px solid var(--border, rgba(255,255,255,0.06));\
  border-bottom:1px solid var(--border, rgba(255,255,255,0.06));\
  background:linear-gradient(180deg, rgba(64,128,255,0.02) 0%, transparent 100%);\
}\
.aw-frame{\
  position:relative;width:220px;height:220px;margin-bottom:16px;\
}\
.aw-frame::before{\
  content:\\'\\';position:absolute;inset:-5px;\
  border-radius:16px;border:1px solid rgba(200,162,76,0.15);\
  animation:awPulse 3.5s ease-in-out infinite;\
}\
.aw-img-wrap{\
  width:220px;height:220px;border-radius:14px;\
  border:2px solid rgba(200,162,76,0.3);\
  animation:awBreathe 3.5s ease-in-out infinite;\
  cursor:pointer;position:relative;overflow:hidden;\
  background:linear-gradient(135deg, #0d1a3a 0%, #1a2a5e 40%, #2a3a7e 100%);\
  box-shadow:0 4px 40px rgba(64,128,255,0.1),0 0 80px rgba(64,128,255,0.04);\
  display:flex;align-items:center;justify-content:center;\
}\
.aw-img-wrap img{\
  width:100%;height:100%;object-fit:cover;border-radius:12px;display:none;\
}\
.aw-img-wrap img.show{display:block}\
.aw-placeholder{\
  font-size:48px;opacity:0.15;\
  color:var(--white, #f0eee8);\
}\
.aw-upload-hint{\
  position:absolute;inset:0;\
  background:rgba(2,8,24,0.65);backdrop-filter:blur(4px);\
  display:flex;flex-direction:column;align-items:center;justify-content:center;\
  opacity:0;transition:opacity 0.3s;border-radius:14px;z-index:4;\
}\
.aw-img-wrap:hover .aw-upload-hint{opacity:1}\
.aw-upload-hint svg{width:28px;height:28px;stroke:var(--gold,#c8a24c);fill:none;margin-bottom:6px}\
.aw-upload-hint span{\
  font-size:10px;letter-spacing:0.15em;text-transform:uppercase;\
  color:var(--gold,#c8a24c);\
  font-family:var(--mono,\\'IBM Plex Mono\\',monospace);\
}\
.aw-watermark{\
  position:absolute;top:10px;left:10px;\
  display:flex;align-items:center;gap:5px;\
  background:rgba(0,0,0,0.45);backdrop-filter:blur(6px);\
  padding:4px 8px;border-radius:6px;z-index:3;display:none;\
}\
.aw-watermark.show{display:flex}\
.aw-wm-logo{\
  width:14px;height:14px;border-radius:50%;\
  background:rgba(200,162,76,0.25);border:1px solid rgba(200,162,76,0.4);\
  display:flex;align-items:center;justify-content:center;\
  font-family:var(--display,\\'Playfair Display\\',serif);font-size:8px;\
  color:var(--gold,#c8a24c);font-style:italic;\
}\
.aw-wm-text{\
  font-family:var(--mono,\\'IBM Plex Mono\\',monospace);font-size:7px;\
  letter-spacing:0.12em;text-transform:uppercase;\
  color:rgba(200,162,76,0.7);\
}\
.aw-tabs{\
  display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap;justify-content:center;\
}\
.aw-tab{\
  font-family:var(--mono,\\'IBM Plex Mono\\',monospace);font-size:10px;\
  letter-spacing:0.06em;padding:5px 12px;border-radius:14px;\
  border:1px solid var(--border,rgba(255,255,255,0.06));\
  background:var(--surface,rgba(255,255,255,0.03));\
  color:var(--dim,rgba(255,255,255,0.35));\
  cursor:pointer;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);\
}\
.aw-tab.active{color:var(--white,#f0eee8);border-color:rgba(80,130,255,0.25)}\
.aw-tab[data-style="cartoon"].active{background:rgba(64,128,255,0.12);border-color:rgba(64,128,255,0.25);color:#60a0ff}\
.aw-tab[data-style="ancient"].active{background:rgba(200,162,76,0.1);border-color:rgba(200,162,76,0.25);color:#c8a24c}\
.aw-tab[data-style="nft"].active{background:rgba(0,224,255,0.08);border-color:rgba(0,224,255,0.18);color:#00e0ff}\
.aw-tab[data-style="business"].active{background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.12);color:#f0eee8}\
.aw-actions{display:flex;gap:8px;align-items:center;margin-top:2px}\
.aw-btn{\
  font-family:var(--mono,\\'IBM Plex Mono\\',monospace);font-size:10px;\
  letter-spacing:0.12em;text-transform:uppercase;\
  padding:8px 20px;border-radius:20px;cursor:pointer;transition:all 0.3s;\
  border:1px solid;display:flex;align-items:center;gap:5px;\
}\
.aw-btn-generate{\
  color:var(--gold,#c8a24c);background:rgba(200,162,76,0.08);\
  border-color:rgba(200,162,76,0.2);\
}\
.aw-btn-generate:hover{background:rgba(200,162,76,0.15);border-color:rgba(200,162,76,0.35)}\
.aw-btn-generate.disabled{opacity:0.35;pointer-events:none}\
.aw-btn-save{\
  color:var(--cyan,#00e0ff);background:rgba(0,224,255,0.06);\
  border-color:rgba(0,224,255,0.15);\
}\
.aw-btn-save:hover{background:rgba(0,224,255,0.12);border-color:rgba(0,224,255,0.25)}\
.aw-btn-save.disabled{opacity:0.35;pointer-events:none}\
.aw-btn-save svg{width:13px;height:13px;stroke:currentColor;fill:none}\
.aw-loading{\
  margin-top:10px;display:none;\
}\
.aw-loading.show{display:block}\
.aw-loading-bar{\
  width:140px;height:2px;\
  background:var(--surface-2,rgba(255,255,255,0.06));\
  border-radius:1px;overflow:hidden;\
}\
.aw-loading-fill{\
  width:40%;height:100%;\
  background:linear-gradient(90deg,var(--blue,#4080ff),var(--cyan,#00e0ff));\
  border-radius:1px;animation:awSlide 1.2s ease-in-out infinite;\
}\
.aw-error{\
  font-family:var(--mono,\\'IBM Plex Mono\\',monospace);font-size:10px;\
  color:var(--red,#ff4040);margin-top:8px;display:none;text-align:center;\
  max-width:260px;\
}\
.aw-error.show{display:block}\
@keyframes awBreathe{0%,100%{transform:scale(1)}50%{transform:scale(1.008)}}\
@keyframes awPulse{0%,100%{opacity:0.3}50%{opacity:0.7}}\
@keyframes awSlide{0%{transform:translateX(-100%)}100%{transform:translateX(350%)}}\
';

  // ── HTML ──
  var HTML = '\
<div class="aw-widget">\
  <div class="aw-frame">\
    <div class="aw-img-wrap" id="aw-img-wrap">\
      <div class="aw-watermark" id="aw-watermark">\
        <div class="aw-wm-logo">M</div>\
        <div class="aw-wm-text">Montgomery</div>\
      </div>\
      <span class="aw-placeholder">&#9633;</span>\
      <img id="aw-preview" alt="Avatar preview">\
      <div class="aw-upload-hint">\
        <svg viewBox="0 0 24 24" stroke-width="1.5"><path d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16"/></svg>\
        <span>Upload Photo</span>\
      </div>\
    </div>\
  </div>\
  <div class="aw-tabs" id="aw-tabs">\
    <div class="aw-tab active" data-style="cartoon">Cartoon</div>\
    <div class="aw-tab" data-style="ancient">Ancient</div>\
    <div class="aw-tab" data-style="nft">NFT</div>\
    <div class="aw-tab" data-style="business">Business</div>\
  </div>\
  <div class="aw-actions">\
    <div class="aw-btn aw-btn-generate disabled" id="aw-generate">Generate</div>\
    <div class="aw-btn aw-btn-save disabled" id="aw-save">\
      <svg viewBox="0 0 24 24" stroke-width="1.5"><path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"/></svg>\
      Save\
    </div>\
  </div>\
  <div class="aw-loading" id="aw-loading">\
    <div class="aw-loading-bar"><div class="aw-loading-fill"></div></div>\
  </div>\
  <div class="aw-error" id="aw-error"></div>\
  <input type="file" id="aw-file" accept="image/jpeg,image/png,image/webp" style="display:none">\
  <canvas id="aw-canvas" style="display:none"></canvas>\
</div>\
';

  // ── PROMPTS ──
  var PROMPTS = {
    cartoon: 'Transform this portrait photo into a 3D Pixar/Disney animation style character render. STYLE RULES: Smooth subsurface-scattering skin, slightly enlarged eyes (1.2x), rounded facial features, subtle exaggerated proportions. Maintain the subject\'s exact hairstyle, hair color, and distinguishing facial features (moles, freckles, face shape). LIGHTING: Soft 3-point studio lighting — key light at 45° warm (3200K), fill light cool (5600K) at 20% intensity, rim light from behind at 40%. COMPOSITION: Head and shoulders, centered, slight 3/4 turn (15° left). Camera at eye level. BACKGROUND: Solid soft gradient — #1a1a2e to #16213e (dark navy). No environmental elements. COLOR PALETTE: Saturated but not neon. Skin tones warm. Clothing colors match the original photo. OUTPUT: Square 1:1, clean edges, no border, no text.',

    ancient: 'Transform this portrait photo into a traditional Chinese classical painting (古风工笔画) style portrait. STYLE RULES: Gongbi (fine-brush) technique with ink wash accents. The subject wears a dark navy/deep blue hanfu (汉服) with gold embroidery details and a jade hair ornament. Maintain the subject\'s exact face shape, eye shape, and distinguishing features. LIGHTING: Flat, even lighting typical of classical Chinese portraiture — no harsh shadows, soft ambient illumination. COMPOSITION: Head and upper body, centered, facing slightly right. Seated or standing pose with hands folded or holding a scroll/fan. BACKGROUND: Aged rice paper texture (#f5f0e8) with subtle ink wash mountains in far distance (< 15% opacity). A single branch of plum blossom or bamboo in upper-right corner. COLOR PALETTE: Muted earth tones — ink black, warm grey, deep navy (#0a1628), antique gold (#c8a24c), jade green (#2d6a4f), rice paper cream. No bright or saturated colors. OUTPUT: Square 1:1, clean edges, no border, no text.',

    nft: 'Transform this portrait photo into an NFT collectible avatar in the style of high-end generative PFP art collections. STYLE RULES: Flat vector illustration, thick clean outlines (2-3px black), cel-shaded with exactly 3 shading levels per color region. Slightly stylized proportions — maintain the subject\'s face shape and key features but simplify to geometric forms. Add one randomized accessory: gold chain, pilot sunglasses, crown, or halo. LIGHTING: Flat, no realistic lighting — implied direction from upper-left via shade placement only. COMPOSITION: Head and shoulders, perfectly centered, facing directly forward. Symmetrical framing. BACKGROUND: Solid single color — randomly choose from: #4080ff (blue), #ff6b6b (coral), #ffd93d (yellow), #6bcb77 (green). Completely flat, no gradients. COLOR PALETTE: Bold, saturated, limited palette (max 8 colors). High contrast. Black outlines. No pastels. OUTPUT: Square 1:1, clean edges, no border, no text.',

    business: 'Transform this portrait photo into a premium professional corporate headshot illustration. STYLE RULES: Semi-realistic digital painting, polished and clean. The subject wears a dark charcoal or navy tailored suit/blazer with a white or light blue dress shirt. Tie optional (match original if present). Maintain exact facial features, skin tone, and hairstyle — this must be immediately recognizable as the same person. LIGHTING: Professional studio portrait lighting — soft butterfly/Paramount lighting from directly above camera at 45° elevation. Subtle fill from below. Gentle catchlights in eyes. Minimal shadows under chin. COMPOSITION: Head and shoulders, centered, straight-on or very slight 3/4 turn (max 10°). Eye line at upper third. BACKGROUND: Smooth gradient — dark navy (#0a1628) at edges to slightly lighter center (#162040). Subtle radial vignette. No props or environment. COLOR PALETTE: Restrained and professional — navy, charcoal, white, skin tones. No bright colors. The only accent color allowed is a subtle gold (#c8a24c) on cufflinks or tie pin. OUTPUT: Square 1:1, clean edges, no border, no text.'
  };

  // ── STATE ──
  var state = {
    apiKey: '',
    logoUrl: '',
    currentStyle: 'cartoon',
    uploadedBase64: null,       // original photo as base64
    uploadedMimeType: null,
    generatedBase64: null,      // AI result as base64
    logoImg: null               // preloaded logo Image element
  };

  // ── INIT ──
  window.AvatarWidget = {
    init: function(opts) {
      if (!opts || !opts.target) { console.error('AvatarWidget: target is required'); return; }
      if (!opts.apiKey) { console.error('AvatarWidget: apiKey is required'); return; }

      state.apiKey = opts.apiKey;
      state.logoUrl = opts.logoUrl || '';

      // Inject CSS
      var style = document.createElement('style');
      style.textContent = CSS;
      document.head.appendChild(style);

      // Inject HTML
      var mount = document.querySelector(opts.target);
      if (!mount) { console.error('AvatarWidget: target not found: ' + opts.target); return; }
      mount.innerHTML = HTML;

      // Preload logo
      if (state.logoUrl) {
        state.logoImg = new Image();
        state.logoImg.crossOrigin = 'anonymous';
        state.logoImg.src = state.logoUrl;
      }

      bindEvents();
    }
  };

  // ── EVENT BINDING ──
  function bindEvents() {
    var imgWrap = document.getElementById('aw-img-wrap');
    var fileInput = document.getElementById('aw-file');
    var generateBtn = document.getElementById('aw-generate');
    var saveBtn = document.getElementById('aw-save');
    var tabsContainer = document.getElementById('aw-tabs');

    // Upload click
    imgWrap.addEventListener('click', function() { fileInput.click(); });

    // File selected
    fileInput.addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (!file) return;
      handleUpload(file);
    });

    // Style tabs
    tabsContainer.addEventListener('click', function(e) {
      var tab = e.target.closest('.aw-tab');
      if (!tab) return;
      tabsContainer.querySelectorAll('.aw-tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      state.currentStyle = tab.dataset.style;
    });

    // Generate
    generateBtn.addEventListener('click', function() {
      if (this.classList.contains('disabled')) return;
      generateAvatar();
    });

    // Save
    saveBtn.addEventListener('click', function() {
      if (this.classList.contains('disabled')) return;
      downloadAvatar();
    });
  }

  // ── UPLOAD HANDLER ──
  function handleUpload(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      // Resize to max 1024x1024
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

        // Enable generate
        document.getElementById('aw-generate').classList.remove('disabled');

        // Reset generated state
        state.generatedBase64 = null;
        document.getElementById('aw-save').classList.add('disabled');
        document.getElementById('aw-watermark').classList.remove('show');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ── GEMINI API CALL ──
  function generateAvatar() {
    if (!state.uploadedBase64) return;

    var loading = document.getElementById('aw-loading');
    var errorEl = document.getElementById('aw-error');
    var generateBtn = document.getElementById('aw-generate');

    loading.classList.add('show');
    errorEl.classList.remove('show');
    generateBtn.classList.add('disabled');

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

    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': state.apiKey
      },
      body: JSON.stringify(body)
    })
    .then(function(res) {
      if (!res.ok) return res.json().then(function(err) { throw new Error(err.error && err.error.message || 'API error ' + res.status); });
      return res.json();
    })
    .then(function(data) {
      var parts = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
      if (!parts) throw new Error('No response from API');

      var imageData = null;
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].inlineData && parts[i].inlineData.data) {
          imageData = parts[i].inlineData.data;
          break;
        }
      }
      if (!imageData) throw new Error('No image in response');

      state.generatedBase64 = imageData;
      applyWatermarkAndShow();
    })
    .catch(function(err) {
      errorEl.textContent = err.message || 'Generation failed';
      errorEl.classList.add('show');
    })
    .finally(function() {
      loading.classList.remove('show');
      generateBtn.classList.remove('disabled');
    });
  }

  // ── WATERMARK VIA CANVAS ──
  function applyWatermarkAndShow() {
    var img = new Image();
    img.onload = function() {
      var canvas = document.getElementById('aw-canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext('2d');

      // Draw generated image
      ctx.drawImage(img, 0, 0);

      // Draw logo watermark top-left
      if (state.logoImg && state.logoImg.complete && state.logoImg.naturalWidth > 0) {
        var logoSize = Math.round(img.width * 0.12);
        var padding = Math.round(img.width * 0.03);
        ctx.globalAlpha = 0.4;
        ctx.drawImage(state.logoImg, padding, padding, logoSize, logoSize);
        ctx.globalAlpha = 1.0;
      }

      // Update preview with watermarked version
      var watermarkedDataUrl = canvas.toDataURL('image/png');
      var preview = document.getElementById('aw-preview');
      preview.src = watermarkedDataUrl;
      preview.classList.add('show');

      // Show watermark badge + enable save
      document.getElementById('aw-watermark').classList.add('show');
      document.getElementById('aw-save').classList.remove('disabled');
    };
    img.src = 'data:image/png;base64,' + state.generatedBase64;
  }

  // ── DOWNLOAD ──
  function downloadAvatar() {
    var canvas = document.getElementById('aw-canvas');
    canvas.toBlob(function(blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'montgomery-' + state.currentStyle + '-avatar.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

})();
```

- [ ] **Step 2: Verify the file was created**

Run: `ls -la avatar-widget.js`
Expected: File exists, ~10KB

- [ ] **Step 3: Commit**

```bash
git add avatar-widget.js
git commit -m "feat: add avatar-widget.js — self-contained avatar generator widget"
```

---

### Task 2: Integrate Widget into index.html

**Files:**
- Modify: `index.html` (after line 737, before line 739)

- [ ] **Step 1: Add mount point and script tags to `index.html`**

Insert after `</section>` (line 737, closing the hero section) and before `<!-- ═══ KINETIC MARQUEE ═══ -->` (line 739):

```html
<!-- ═══ AVATAR GENERATOR ═══ -->
<div id="avatar-mount"></div>

<script src="avatar-widget.js"></script>
<script>
  AvatarWidget.init({
    target: '#avatar-mount',
    apiKey: 'YOUR_GEMINI_API_KEY',
    logoUrl: 'logo-footer.png'
  });
</script>
```

**Note:** Replace `YOUR_GEMINI_API_KEY` with an actual Gemini API key for testing.

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: integrate avatar widget below hero section"
```

---

### Task 3: End-to-End Verification

- [ ] **Step 1: Open `index.html` in a browser and verify the widget renders**

Expected:
- Widget appears below the hero section, above the marquee
- Square frame (220x220) with breathing pulse animation
- 4 style tabs: Cartoon (active, blue), Ancient, NFT, Business
- Generate button (disabled/dimmed) and Save button (disabled/dimmed)
- Hover over square shows "Upload Photo" overlay

- [ ] **Step 2: Test photo upload**

Click the square → file picker opens → select a JPG/PNG photo.

Expected:
- Photo appears in the square frame
- Generate button becomes active (no longer dimmed)
- Save button still disabled

- [ ] **Step 3: Test style tab switching**

Click each tab: Cartoon, Ancient, NFT, Business.

Expected:
- Active tab changes color (blue, gold, cyan, white respectively)
- Only one tab active at a time

- [ ] **Step 4: Test generation (requires valid Gemini API key)**

Select a style tab → click Generate.

Expected:
- Loading bar appears and animates
- After 5-15 seconds, generated image replaces the preview
- Montgomery watermark badge appears in top-left of image
- Save button becomes active
- If API key is invalid: error message appears below the widget

- [ ] **Step 5: Test download**

Click Save after a successful generation.

Expected:
- Browser downloads `montgomery-{style}-avatar.png`
- Downloaded image has the Montgomery logo watermark in the top-left corner at ~40% opacity

- [ ] **Step 6: Test mobile responsiveness**

Open browser DevTools → toggle device toolbar → select iPhone 12 (390px width).

Expected:
- Widget is centered and fits within viewport
- Tabs wrap if needed
- All buttons remain tappable

- [ ] **Step 7: Final commit (if any fixes were needed)**

```bash
git add avatar-widget.js index.html
git commit -m "fix: polish avatar widget after e2e testing"
```

# Avatar Generator Widget — Design Spec

## Context

Montgomery Partners dashboard needs an avatar generator feature where users upload a photo and generate stylized versions (cartoon, 古风, NFT, business). The widget lives below the hero section, produces square images with a Montgomery logo watermark, and allows download. It must be a separate file that can integrate into any site.

## Architecture

Single self-contained file: `avatar-widget.js`

Exposes a global `AvatarWidget.init()` function that injects all HTML, CSS, and JS into a target element. No build tools, no framework dependencies — matches the existing vanilla JS project.

```js
AvatarWidget.init({
  target: '#avatar-mount',   // CSS selector for mount point
  apiKey: 'GEMINI_API_KEY',  // Google Gemini API key
  logoUrl: 'logo-footer.png' // path to Montgomery logo for watermark
});
```

## Components

### 1. Upload

- Click the square image area to open a file picker (`<input type="file" accept="image/*">`)
- Accepted formats: JPG, PNG, WebP
- Preview the uploaded photo immediately in the square frame
- Client-side resize to max 1024x1024 before sending to API (reduce payload size)

### 2. Style Presets

Four style tabs, each with a locked prompt template:

All UI labels are in English. Prompts are detailed and locked to enforce visual consistency across generations.

**Cartoon**
```
Transform this portrait photo into a 3D Pixar/Disney animation style character render.
STYLE RULES: Smooth subsurface-scattering skin, slightly enlarged eyes (1.2x), rounded facial features, subtle exaggerated proportions. Maintain the subject's exact hairstyle, hair color, and distinguishing facial features (moles, freckles, face shape).
LIGHTING: Soft 3-point studio lighting — key light at 45° warm (3200K), fill light cool (5600K) at 20% intensity, rim light from behind at 40%.
COMPOSITION: Head and shoulders, centered, slight 3/4 turn (15° left). Camera at eye level.
BACKGROUND: Solid soft gradient — #1a1a2e to #16213e (dark navy). No environmental elements.
COLOR PALETTE: Saturated but not neon. Skin tones warm. Clothing colors match the original photo.
OUTPUT: Square 1:1, clean edges, no border, no text.
```

**Ancient (古风)**
```
Transform this portrait photo into a traditional Chinese classical painting (古风工笔画) style portrait.
STYLE RULES: Gongbi (fine-brush) technique with ink wash accents. The subject wears a dark navy/deep blue hanfu (汉服) with gold embroidery details and a jade hair ornament. Maintain the subject's exact face shape, eye shape, and distinguishing features.
LIGHTING: Flat, even lighting typical of classical Chinese portraiture — no harsh shadows, soft ambient illumination.
COMPOSITION: Head and upper body, centered, facing slightly right. Seated or standing pose with hands folded or holding a scroll/fan.
BACKGROUND: Aged rice paper texture (#f5f0e8) with subtle ink wash mountains in far distance (< 15% opacity). A single branch of plum blossom or bamboo in upper-right corner.
COLOR PALETTE: Muted earth tones — ink black, warm grey, deep navy (#0a1628), antique gold (#c8a24c), jade green (#2d6a4f), rice paper cream. No bright or saturated colors.
OUTPUT: Square 1:1, clean edges, no border, no text.
```

**NFT**
```
Transform this portrait photo into an NFT collectible avatar in the style of high-end generative PFP art collections.
STYLE RULES: Flat vector illustration, thick clean outlines (2-3px black), cel-shaded with exactly 3 shading levels per color region. Slightly stylized proportions — maintain the subject's face shape and key features but simplify to geometric forms. Add one randomized accessory: gold chain, pilot sunglasses, crown, or halo.
LIGHTING: Flat, no realistic lighting — implied direction from upper-left via shade placement only.
COMPOSITION: Head and shoulders, perfectly centered, facing directly forward. Symmetrical framing.
BACKGROUND: Solid single color — randomly choose from: #4080ff (blue), #ff6b6b (coral), #ffd93d (yellow), #6bcb77 (green). Completely flat, no gradients.
COLOR PALETTE: Bold, saturated, limited palette (max 8 colors). High contrast. Black outlines. No pastels.
OUTPUT: Square 1:1, clean edges, no border, no text.
```

**Business (商务)**
```
Transform this portrait photo into a premium professional corporate headshot illustration.
STYLE RULES: Semi-realistic digital painting, polished and clean. The subject wears a dark charcoal or navy tailored suit/blazer with a white or light blue dress shirt. Tie optional (match original if present). Maintain exact facial features, skin tone, and hairstyle — this must be immediately recognizable as the same person.
LIGHTING: Professional studio portrait lighting — soft butterfly/Paramount lighting from directly above camera at 45° elevation. Subtle fill from below. Gentle catchlights in eyes. Minimal shadows under chin.
COMPOSITION: Head and shoulders, centered, straight-on or very slight 3/4 turn (max 10°). Eye line at upper third.
BACKGROUND: Smooth gradient — dark navy (#0a1628) at edges to slightly lighter center (#162040). Subtle radial vignette. No props or environment.
COLOR PALETTE: Restrained and professional — navy, charcoal, white, skin tones. No bright colors. The only accent color allowed is a subtle gold (#c8a24c) on cufflinks or tie pin.
OUTPUT: Square 1:1, clean edges, no border, no text.
```

### 3. Generation (Gemini API)

- Call the Gemini API (Imagen model or Gemini with image generation) with:
  - The uploaded photo as input
  - The style-specific prompt
- Show a loading bar animation during generation
- Display the result in the square frame
- On error, show a brief error message below the image and keep the previous state

### 4. Watermark (Client-side Canvas)

After receiving the generated image:
1. Draw the generated image onto a hidden `<canvas>`
2. Draw the Montgomery logo (from `logoUrl` config) in the top-left corner at ~12% of image width, with ~40% opacity
3. The watermarked canvas becomes the display image and the download source

This happens entirely client-side — the API never sees the watermark.

### 5. Download

- "Save" button next to "Generate"
- Triggers `canvas.toBlob()` → `URL.createObjectURL()` → `<a download>`
- Filename: `montgomery-{style}-avatar.png`
- Downloads the watermarked version

### 6. Animation

- Gentle breathing/pulse: `transform: scale(1) → scale(1.008)` on a 3.5s ease-in-out loop
- Outer border frame pulses opacity in sync
- Animation applied via CSS, no JS needed

## Visual Design

- **Square frame**: 220x220px (scales with container), 14px border-radius
- **Border**: 2px solid gold at 30% opacity, with a pulsing outer border at 15% opacity
- **Watermark**: Montgomery "M" logo + "MONTGOMERY" text, top-left, frosted dark background pill
- **Style tabs**: Pill-shaped, monospace font, each style has its own accent color (blue/gold/cyan/white)
- **Buttons**: "Generate" in gold accent, "Save" in cyan accent, pill-shaped
- **Loading**: 2px bar with sliding gradient fill (blue → cyan)
- **Colors**: Uses the dashboard's CSS custom properties (`--gold`, `--blue`, `--cyan`, etc.)

## Integration

In `index.html`, add a mount point below the hero:

```html
<!-- after </section> (hero) -->
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

The widget reads CSS custom properties from the page (`:root` vars) to match the host site's theme. Falls back to hardcoded Montgomery defaults if vars aren't present.

## File Structure

```
Montgomery Demo/
├── index.html          (existing — add mount point + script tag)
├── avatar-widget.js    (new — self-contained widget)
├── logo-footer.png     (existing — used for watermark)
```

## Verification

1. Open `index.html` in browser
2. Scroll past hero — avatar widget should be visible with breathing animation
3. Click the square to upload a photo — preview should appear
4. Select a style tab and click Generate — loading bar should animate, then result appears with watermark
5. Click Save — should download a PNG with the Montgomery logo watermark baked in
6. Try each style tab to verify different prompts produce different results
7. Check mobile (< 768px) — widget should be responsive

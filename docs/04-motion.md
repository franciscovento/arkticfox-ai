# Motion

Slow, cinematic, premium. Nothing bouncy.

| Moment | Spec |
|---|---|
| Reveal | Fade + rise 24px, 900ms, `ease-fox` (`cubic-bezier(0.22, 1, 0.36, 1)`). |
| Hover | 250ms, `ease-fox`. |
| Snow | Very subtle. Dark sections only. Paused off-screen. Disabled for reduced motion. |
| Hero video | Muted loop, no audio, poster, MP4 + WebM. 1080p desktop and a separate 9:16 mobile file. Lazy-load every video except the hero. |

Tokens live in `src/styles/tokens.css` (`--dur-hover`, `--dur-reveal`, `--dur-slow`, `--ease-fox`) and `src/motion/tokens.ts` (`dur.hover = 0.25`, `dur.reveal = 0.9`, `dur.slow = 1.4`, `ease.fox = [0.22, 1, 0.36, 1]`, `distance.rise = 24`).

## What moves

- Sector marquee, CSS only, pauses on hover and reduced motion.
- Nav turns to frosted glass on scroll.
- Before/after drag slider.
- Masonry filter transitions.
- Accordion and lightbox.

## Tool split

1. CSS first (`src/styles/motion.css`, `Reveal`, `Marquee`, `SnowCanvas`).
2. `motion` for React island interactions (slider, lightbox, filters).
3. GSAP + ScrollTrigger only for scroll choreography. Register them in `src/motion/gsap.ts`. Every scroll scene early-returns when `prefersReducedMotion()` is true.
4. Lenis is installed and opt-in. It is not started in Step 1. When it is, import it only from the motion layer and disable it for reduced motion.

## Performance

- Animate `transform` and `opacity` only.
- Pause work that is off-screen.
- Respect `prefers-reduced-motion` globally (`src/styles/motion.css`).
- Do not put a motion library on the hero's critical path.
- Reveals stay visible without JavaScript. The `js` class on `<html>` opts into the hidden starting state.

## Hero video loop (Veo)

The fox starts camouflaged, so the first frame is almost an empty snowfield. The clip ends on that empty field after the fox runs off. A 0.5–1s crossfade hides the join.

1. Generate a still of the empty snowfield first. It is the last frame and the poster.
2. Generate the video. If Veo can lock the last frame, use that still.
3. Keep the left third clear for the headline. The fox stays in the right third.

Desktop prompt (16:9):

```
Cinematic wide shot of a vast arctic snowfield at blue hour, soft pastel sky
with faint coral and pink tones on the horizon, gentle snowfall. Locked-off
camera, no camera movement. In the right third of the frame an arctic fox
lies perfectly camouflaged in the snow, its white fur indistinguishable from
the drifts, only barely visible. After a few seconds the fox slowly opens its
eyes and lifts its head, snow falling from its fur. It rises, pauses to look
toward the camera for a beat, then sprints away across the snow and
disappears over a snowy ridge on the right, leaving a trail of paw prints and
a small cloud of powder. The final seconds show the empty snowfield with snow
settling, matching the opening frame. Photorealistic, shot on ARRI Alexa,
35mm anamorphic lens, shallow depth of field, natural soft light, subtle film
grain, premium commercial look. The left third of the frame stays calm and
uncluttered. No text, no logos, no people, no music.
```

Mobile (9:16): same prompt, but "In the right third of the frame" becomes "In the lower center of the frame", and "The left third of the frame stays calm" becomes "The upper half of the frame stays calm and uncluttered".

If the take is wrong, add one of: "the fox is small in the frame", "fox is fully camouflaged at the start, hard to spot", or "single fox, anatomically correct legs, natural running gait".

Export: MP4 (H.264) and WebM, 1920×1080, no audio, ideally under 4–6 MB. Mobile 1080×1920, lighter. Poster in JPG or WebP. Files go in `public/media/`.

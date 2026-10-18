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
- Home dive. The hero is pinned for about 440vh on small screens and 680vh from 768px up. Scroll pushes the plate slightly toward the horizon, lays a veil over it, and draws snowflakes that grow as they approach. The headline leaves. A single line arrives at the end. Lenis smooths the wheel on fine pointers only; touch uses native scroll. Off for reduced motion.
- Nav turns to frosted glass on scroll.
- Before/after drag slider.
- Masonry filter transitions.
- Accordion and lightbox.
- Home ↔ `/work` is a full page load. `ClientRouter` was removed after the swap left Lenis, ScrollTrigger and the native dialog overflow stuck.

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

## Hero video loop

The fox is a close, stylized character, large enough to read on a phone. It peeks over one snow drift the way the logo peeks over a line (`public/media/logo-02.png`), steps toward the camera, then ducks back until the drift is empty again. The first and last frames match so the loop joins.

The source brief asked for a tiny photoreal fox in a vast snowfield. That hides a white fox. This closer mascot replaces that shot. See ADR-010.

1. Generate the empty still first. It is the poster and, if the tool allows, the last frame.
2. Attach `public/media/logo-02.png` as the character reference. Ask the tool to match the ear shape and the simple face, as a soft 3D character. Do not ask it to draw the word "ARKTIC FOX".
3. Keep the left third clear for the headline. The fox stays center-right.

Empty still (16:9):

```
Close cinematic view of a single smooth snow drift filling the lower half of the frame, like a clean horizontal line. Soft blue-hour sky above, a faint coral and pink glow on the horizon. A few snowflakes drift close to the lens. No mountains, no wide landscape, no fox, no people, no text. The left third stays empty. Premium, simple, quiet.
```

Video (16:9). Camera locked. The fox's head, when fully up, is about one third of the frame height:

```
Locked-off camera, no camera move, no zoom. A single smooth snow drift fills the lower half of the frame. Soft blue-hour sky, faint coral and pink light on the horizon, snowflakes close to the lens.

A stylized 3D arctic fox, cute and premium, large in frame, smooth white fur with a warm coral rim light so it separates from the snow. Simple face and tall pointed ears, like a brand mascot. It starts fully hidden behind the drift. Two ears rise slowly over the snow. Then the head comes up, eyes open, and it looks toward the camera. It places both front paws on the drift and leans a little closer. It pauses. Then it sinks back down: paws, head, then ears, until only the empty drift remains, matching the first frame.

The fox stays in the center-right. The left third stays empty. No text, no letters, no logo, no people, no music. Not a wildlife documentary. Not a vast landscape.
```

Mobile (9:16): same action, but the drift sits in the lower third and the fox rises into the lower center. The upper half stays empty for the headline.

If the fox is still too small or too real, add: `the fox is large, close to the camera, stylized 3D mascot, head fills a third of the frame`. If it never hides, add: `fully hidden at the first frame and the last frame, only the snow drift visible`.

Export: MP4 (H.264) and WebM, 1920×1080, no audio, ideally under 4–6 MB. Mobile 1080×1920, lighter. Poster in JPG or WebP. Files go in `public/media/`.

## Current home cut

The entry pins one screen. `public/media/hero-loop.mp4` plays muted on a loop behind the type. It is the same film as the `/v2` frame sequence, so the loop and the scroll cut can be compared. Scroll does not scrub this copy. A light ink wash sits on the film so the type and the snow read. The hero rises away, then the three service cards slide in from the right, one after another, and stay. Scrolling back reverses the type. Snow is drawn on top of the film and falls from the top of the frame. `data-snow-direction="dive"` on the home canvas restores the head-on field. Reduced motion unpins the stage, stacks the beats, pauses the video on its first frame, and turns the snow off.

## 3D fox prototype

`/hero-3d` and `/es/hero-3d` are a parked cut (`noindex`). `?bg=3d` is the drawn woods. `?bg=video` puts `public/media/snow-path-foggy-1.mp4` behind a transparent fox. The page is static, so the query is read in the browser. A small toggle shows in dev, and on a production build only with `?debug`. They do not replace `/` or `/v2`.

`public/media/fox.glb` clips: `Idle` (1.33s, standing, tail swing), `Idle Alert` (1.6s, standing look), `Sit` (1.33s, seated, tail swing, head held), `Walk` (1s, in place). Walk does not move the root. Idle and Idle Alert stay unused because blending them would stand the fox up. The path is a straight line and the fox holds the right of the frame. Scroll is a switch, not a scrub: while the scroll is recent, or a fast scroll has queued distance (capped), the world and the camera advance at `TRAVEL_MPS` and Walk plays in place. Scroll down faces forward; scroll up faces back. Once the queue is spent and the scroll has been quiet for 400ms, the body turns toward the camera and crossfades to Sit (duration from `dur.reveal`). Sit plays as exported, tail included. No code writes on top of a bone. The Head track is two identical keys, so the head stays with the body. The camera is a straight travelling on `dur.hover`, left of and behind the fox, so the left of the frame stays open for the headline. The field is a pastel cartoon wood: a light-blue to lavender sky, a warm horizon, soft fog, a straight path left of the fox, and rounded pines plus snow hills instanced on the left. Those slots wrap on a fixed span as the camera cruises, and they hold when the scroll stops. There is no green token, so the pines mix ice and pink. With `?bg=video` the film clock is travelled meters: `playbackRate` stays at 1 while the fox cruises and the element pauses when the fox sits. Reduced motion holds the poster frame. One coral rim light matches the hero brief; the only brand gradient on the page is the quote button.

Reduced motion: the stage is one screen, the fox stays seated looking at the camera with the clip paused, the woods stay still, the film stays on its first frame, and flakes are off. Three.js stays in `src/components/islands/`.

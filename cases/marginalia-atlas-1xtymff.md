# The Marginalia Atlas: interactive sketchbook

[![The Marginalia Atlas: interactive sketchbook](https://cdn.beatapi.io/prompt-gallery/qwen4/marginalia-atlas-1xtymff/poster-36841ea796f4.jpg)](https://beatapi.io/prompts/qwen4/marginalia-atlas-1xtymff?utm_source=github&utm_medium=gallery&utm_campaign=awesome-qwen4-videos)

**[Watch this case on BeatAPI →](https://beatapi.io/prompts/qwen4/marginalia-atlas-1xtymff?utm_source=github&utm_medium=gallery&utm_campaign=awesome-qwen4-videos)**

- Model: Qwen4-Max-Preview (creator-reported)
- Creator: [Dear_Lock_5280](https://www.reddit.com/r/Qwen_AI/comments/1xtymff/qwen_4max_preview_vs_gpt_sol_61_max_webdev_test/)
- Workflow: Not specified by the creator
- Source checked: 2026-11-16
- Prompt: Published by the creator

## Creator-published prompt

```text
Act as an elite creative director, award-winning frontend engineer, interaction designer, and creative technologist. Build an extraordinary, production-quality website that feels like an interactive piece of digital art rather than a traditional website. Aim for Awwwards Site of the Day / Site of the Year quality.

### 1. Art direction
Create a distinctive visual universe combining:
- An artist's sketchbook, hand-drawn notebook, and experimental digital canvas.
- Editorial typography, museum-quality layouts, handmade illustrations, doodles, pencil sketches, scribbles, ink strokes, paper textures, marginal annotations, stamps, and sticky notes.
- A living artistic painting that evolves as visitors explore.
- Beautiful, unconventional compositions with asymmetrical grids, overlapping layers, and intentional whitespace.
- A cohesive visual identity that feels handcrafted, premium, playful, cinematic, and original.

Avoid generic SaaS layouts, predictable cards, repetitive sections, default gradients, and basic fade-in animations.

### 2. Cinematic scroll-driven storytelling
Scrolling must feel like traveling through a continuous artwork, not moving down a stack of sections.

Implement a seamless zoom-in → reveal → zoom-out → pan → zoom-in journey:
- Begin with a massive illustrated canvas or artistic painting containing multiple worlds, drawings, and hidden details.
- As the user scrolls, smoothly zoom into one small object inside the painting.
- That object expands into an entirely new interactive section.
- As scrolling continues, pull the camera backward, revealing that the entire section is part of another illustration.
- Pan or rotate across the larger canvas and zoom into the next visual element.
- Repeat with varied compositions and transitions, creating a continuous, nested-world experience.
- Use depth, parallax, camera transforms, perspective changes, masking, morphing, and seamless scene transitions.
- Reverse transitions naturally when scrolling upward.

Animations must be synchronized to scroll progress, responsive to scrolling velocity, and polished enough to feel cinematic.

### 3. Interactive notebook and realistic paper physics
Build an interactive sketchbook experience with:
- Notebook pages that flip, fold, curl, and cast realistic shadows.
- Live paper-tearing interactions: visitors can grab a perforated edge and physically drag to tear off a page or note.
- Real-time tear progression, deformation, irregular ripped edges, and believable paper movement.
- Loose paper scraps that fall, float, or react to cursor movement.
- Handwritten annotations that animate as though an invisible artist is drawing them.
- Doodles that come alive on hover, sketches that transform into interactive components, and sticky notes that can be dragged and rearranged.
- Realistic page transitions, texture layering, and subtle paper sounds with optional audio controls.

Use SVG paths, masks, clipping, physics simulations, and GPU-accelerated animations where appropriate. Make the tearing genuinely interactive, not a prerecorded visual effect.

### 4. Interactive flow-diagram module
Integrate an advanced interactive flowchart or mind-map experience using React Flow (`@xyflow/react`) or an equivalent system.

Include draggable nodes, animated connections, smooth zoom/pan, expandable sections, dynamic node creation, editable relationships, custom-drawn nodes, and live updates.

Make the flow diagram visually compatible with the sketchbook theme: hand-drawn arrows, animated ink connections, organic node shapes, and flowing particles. It must be functional rather than decorative.

### 5. Signature interactions and creative experiments
Introduce several memorable experiences:
- Morphing SVG illustrations and animated line art.
- Cursor-reactive elements, magnetic buttons, custom pointer effects, and hover distortions.
- Text that draws itself, rearranges, or reveals hidden illustrations.
- Interactive 2D/3D objects embedded within illustrations.
- Scroll-controlled horizontal galleries, pinned scenes, and experimental transitions.
- Interactive canvases where visitors can draw or manipulate elements.
- Physics-based objects, paper scraps, ink particles, and interactive typography.
- Micro-interactions that communicate meaning rather than adding random visual noise.
- Clever easter eggs and delightful hidden details.

Design at least three truly original signature moments that make the experience memorable.

### 6. Recommended technology
Choose the best architecture for the experience, using modern production-ready tools where appropriate:

- Next.js, React, TypeScript.
- GSAP and ScrollTrigger for cinematic scroll timelines, pinning, scrubbing, and zoom transitions.
- Lenis for smooth, controlled scrolling.
- Motion for React for component animations and layout transitions.
- Three.js / React Three Fiber / WebGL where actual 3D depth improves the experience.
- React Flow for interactive node-based diagrams.
- SVG, Canvas, CSS masks, clip-path, and shaders for drawing, paper effects, and experimental visuals.
- Matter.js or appropriate physics tools for physical interactions.

Use animation libraries selectively. Prioritize coherent art direction, performance, and excellent interaction design over unnecessary dependencies.

### 7. Use award-winning GitHub design skills
Research and apply relevant Awwwards-inspired frontend agent skills, including `juliobsz/skills` (/awwwards), `Ga14ctic/awwwards-skill`, and high-quality creative frontend and motion-design references.

Follow a professional creative-development process: concept exploration, visual identity, composition, interaction architecture, implementation, polish, browser testing, and refinement.

Do not copy an existing award-winning website. Create an original visual concept with comparable craftsmanship.

### 8. Performance and accessibility
- Smooth animations targeting 60 FPS on capable devices.
- Responsive experiences across desktop, tablet, and mobile.
- Graceful degradation for devices without powerful GPUs.
- Respect reduced-motion preferences.
- Lazy-load heavy scenes and assets.
- Use semantic HTML, accessible controls, and keyboard navigation.
- Maintain correct scroll behavior without jitter, broken pinned sections, or layout shifts.
- Ensure every visible interactive control actually works.

### 9. Execution requirements
First establish a distinctive creative concept and cohesive design system. Then implement the complete website, including real assets, interactions, component states, and animations.

Do not stop after a mockup, wireframe, static landing page, or initial hero section.

Build the actual application, run it, test the scroll journey and interactions in a browser, capture screenshots, identify weak visual areas, and refine until it feels like a cohesive, exceptional interactive artwork.

**Ultimate objective:** The visitor should feel as if they are exploring a magical, living sketchbook and traveling inside an evolving painting, with seamless zoom transitions that turn illustrations into entire functional web experiences. Every interaction should feel intentional, artistic, technically impressive, and unforgettable.
```

[Prompt source](https://www.reddit.com/r/Qwen_AI/comments/1xtymff/qwen_4max_preview_vs_gpt_sol_61_max_webdev_test/)

The recording is a creator example, not an independent BeatAPI reproduction. Media and prompts retain their original rights; no additional media license is asserted.

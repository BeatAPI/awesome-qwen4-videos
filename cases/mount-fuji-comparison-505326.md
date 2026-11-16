# Mount Fuji: Qwen vs Opus

[![Mount Fuji: Qwen vs Opus](https://cdn.beatapi.io/prompt-gallery/qwen4/mount-fuji-comparison-505326/poster-915368da06d4.jpg)](https://beatapi.io/prompts/qwen4/mount-fuji-comparison-505326?utm_source=github&utm_medium=gallery&utm_campaign=awesome-qwen4-videos)

**[Watch this case on BeatAPI →](https://beatapi.io/prompts/qwen4/mount-fuji-comparison-505326?utm_source=github&utm_medium=gallery&utm_campaign=awesome-qwen4-videos)**

- Model: Qwen4-Max (creator-reported)
- Creator: [exploraX_](https://x.com/exploraX_/status/2122292875660505326)
- Workflow: Not specified by the creator
- Source checked: 2026-11-16
- Prompt: Published by the creator

## Creator-published prompt

```text
Build a photoreal, real-time Mount Fuji as a static, no-build-step three.js r169 page (ES modules + import map, three.js vendored locally) served by a tiny http://serve.py on port 9013 (no-cache headers, threaded, listen backlog 256 because the page loads ~40 modules at once). Every asset is generated in code: no downloaded models, image files, HDRIs or AI textures. Textures are painted on 2D canvases at load or computed in shaders. Heavy precomputation runs in Web Workers behind a minimal loading bar and is cached in IndexedDB so the second load opens in about a second.

The goal: someone who knows Fuji recognises the exact mountain, not a generic volcano. Real geography, real scale, real sun. Real place names are fine; no rail operator, airline or brand names or logos.

1. World frame
Metres, y up, origin at the summit's ground position, sea level y = 0, +x east, -z north.
80 x 80 km world (Fuji Five Lakes, Misaka range, Suruga Bay all inside). Far plane 120 km.
Logarithmic depth buffer. Every custom ShaderMaterial includes the logdepthbuf chunks. For the terrain, write log depth in the vertex stage instead (gl_Position.z = (log2(max(1e-6, 1.0 + w)) * logDepthBufFC - 1.0) * w) so early-Z still culls hidden ridges; three's per-fragment log depth disables it and costs 15-47 % of frame time.
Earth curvature in every vertex shader: y -= |dxz|^2 * uCurv.
Real sun and moon: NOAA solar position for 35.36 N, 138.73 E from a JST date and time.
2. The mountain
Float32 heightfields in a worker: 4096 x 4096 over 80 km plus 2048 x 2048 over the central 16 x 16 km cone, blended with smoothstep(80, 500, distance to cone edge). Mip chains for both. The same data feeds the GPU (float textures) and a JS sampler that matches the GPU bilinear exactly (used for raycasts, camera clamping and object placement).
Concave-up radial profile, relative to a ~850 m base: coneRel(r_km) = 2615.14 * exp(-(r / 6.3762)^1.231) + 591.92 * exp(-r / 1.0659), giving ~3,776 m at the rim, ~3,000 m at 2 km, ~2,300 m at 4 km, ~1,500 m at 8 km, ~1,000 m at 14 km. 8 % stretch on the NW-SE axis; the north apron stays higher than the south.
Ouchi-in crater: ~700 m across, ~230 m deep, eight rim peaks, Kengamine highest on the SW rim. From afar the top must read flat and slightly notched, never rounded.
Hoei crater on the SE flank (~1.3 km, rim ~2,700 m, open downslope) with the Hoei-zan hump below it: a bulge on the right skyline from the south, on the left from Gotemba, hidden from Lake Kawaguchi.
Osawa-kuzure on the WSW flank down to ~2,200 m, up to 500 m wide and 150 m deep, jagged red-brown headwall.
Radial gullies from ridged noise in polar coordinates at periodic angular levels (30 / 60 / 120 / 240 per turn, increasing with radius), then a 300,000-droplet hydraulic erosion pass with deposition; smooth lava aprons below ~2,000 m. ~60 flank cones mostly on the NW-SE axis, lava ridges heading north.
Surroundings as capsule chains with real water levels: Kawaguchi (830 m, bent, narrow waist with a bridge), Yamanaka (980 m), Sai, Shoji, Motosu; Aokigahara forest; Fujiyoshida; the Misaka, Tenshi and Tanzawa ranges; Mount Ashitaka; Hakone; Suruga Bay coast and the Fuji River. A land-cover map (forest, fields, town, tea) computed in the same worker.
Far skyline beyond the world: a ring mesh 58-98 km out with the Southern Alps (W), Yatsugatake (NW), Chichibu (N), Tanzawa (E) and Izu (SE), open sea to the SW, seasonal snow. Past the 80 km edge the terrain shader fades to a low plain so nothing looks cut off.
3. Terrain rendering
Camera-centred geometry clipmap: 10 rings of 384 x 384 quads, 2 m cells doubling per ring, CDLOD-style morphing, inner-ring discard with a 2-cell overlap so cracks never open. 128-quad rings are too coarse: at 18 km they turn the notched summit into a hump.
When the camera is more than ~8.8 km from the summit, add a fixed 1024 x 1024 "hero" mesh (±7,600 m, 15 m spacing, with a skirt) for the cone so the silhouette is exact; sink the rings 6 m just outside it so the seam never shows.
Normals from central differences, fbm micro-displacement and detail normals near the camera. Clamp the camera above the ground everywhere.
Materials blended by height, slope, curvature and noise: scoria with rust bands, grey ash fans, treeline band, conifer and broadleaf forest (Aokigahara darkest), fields, towns (with night window lights), red-brown rock on steep walls. Skip the snow, forest and detail work for fragments that cannot see them.
Seasonal snow: winter cover to 1,500-2,000 m; late-spring streaks driven by curvature (gullies keep snow, ridges lose it); snow-free summer; autumn dusting on the top 300-500 m with autumn colours below. Subsurface tint, sparkle, sharper normals.
4. Light, sky and atmosphere
Hillaire-style atmosphere: transmittance LUT 256 x 64, multiple-scattering LUT 32 x 32, sky-view LUT 256 x 128 with absolute azimuth and two lights (sun and moon). Rayleigh, Mie, ozone and a low valley haze.
Ambient: SH9 projected from the sky-view LUT every time the sun moves.
Aerial perspective integrated per fragment through the same medium with adaptive steps (1 near, up to 8 far), so it works in mirror passes and on every built-in material.
Patch built-in three.js materials via onBeforeCompile for curvature, aerial perspective, terrain sun visibility and cloud shadow, so houses, trees, the train and the pagoda sit in the same light.
Terrain self-shadowing from a GPU sun-visibility map (2048 x 2048, a horizon march over the height textures with Earth curvature and a distance-growing penumbra), rebuilt in ~2 ms whenever the sun moves. It covers all 80 km and draws the mountain's own long shadow.
Object shadows: one shadow cascade following the camera (2048 at medium, 4096 at high); the terrain shader samples the same map.
Exposure computed from sun / moon elevation (deterministic, no adaptation history) and folded into light intensities so night keeps precision in half-float buffers. ACES filmic with toneMappingExposure = 0.6 to cancel three's /0.6.
Sky dome: sun disk with limb darkening, twilight, Earth shadow, Belt of Venus, sparse stars, a faint Milky Way, the moon, city glow.
5. Clouds
Raymarched from a 128^3 Perlin-Worley texture built in a worker from precomputed lattices (~1 s).
Density presets: cumulus; unkai sea of clouds at ~1,800 m; the kasa-gumo cap cloud as a hat-shaped dome with sharp tops, soft undersides, powder and silver lining plus two lens layers; an optional lenticular downwind; summit spindrift plumes.
Live mode: half resolution, 32 view steps, 3 light steps, temporal reprojection. Capture mode: full resolution, 84 view steps, 5 light steps, no history. Adaptive steps with empty-space skipping. A top-down cloud shadow map.
6. Water
Hand-written planar mirror per lake height (oblique near-plane clip, HalfFloat target with depth texture, scale 0.42 at medium and 0.75 at high or capture, MSAA 4 / 2), active only for lakes on screen. Hide petals, mist, birds and near trees in mirror passes.
Wind slider from mirror-still to breezy; Schlick fresnel, dark green-blue body, shoreline darkening, wet band.
Suruga Bay as a 240 x 110 km sea plane with real waves, sky reflection and sun glitter.
Two drifting mist sheets on Kawaguchi at dawn.
7. Vegetation and life
Instanced code-built trees: stacked noisy cones for conifers, smooth jittered icosahedron clusters for broadleaf and maples, cherries with falling petals. LOD tiers: full meshes within ~270 m, simplified to ~1 km, impostors from an atlas rendered at load to ~3.4 km, terrain colour beyond. Wind sway driven by scene time.
Black kites circling over the lakes; swan pedal boats and a sightseeing boat on Kawaguchi.
8. Human details
Chureito five-storey pagoda: stone base, five roofs with upturned corners, white walls, vermilion posts and brackets, railings, bronze finial with nine rings, a long stone stairway, cherry trees, a clear glade around it.
Fujiyoshida: ~7,000 instanced houses, a main street, roads, utility poles with sagging wires, a large vermilion torii aligned with the mountain, the Kawaguchi bridge, the 5th-station toll road and lake roads.
Yoshida trail zigzagging from 2,300 m with ~14 stone-walled huts set beside the switchbacks, a rim path, a shrine and torii on the rim, the summit station on Kengamine; glowing huts and a chain of moving headlamps at night.
A long white unbranded high-speed train with a blue stripe (16 cars) on a viaduct across the coastal plain, a girder bridge over the gravel bed of the Fuji River, and tea fields as curved hedge rows (instanced, capped ~110,000).
9. Post and performance
EffectComposer on a HalfFloat 4x MSAA target, very subtle per-shot bloom, a fade pass for dip-to-black cuts. No chromatic aberration, lens dirt or heavy vignette.
?q=low|med|high: low drops mirrors, MSAA and shadows and halves forest radii; high raises tree radii, mirror resolution and the shadow map. Target 60 fps at 1080p on an M-series Mac; the mirror and sea-of-clouds shots are the expensive ones.
10. Shots (~9 s each, slow eased moves, quick dip-to-black cuts)
Sakasa Fuji, Lake Kawaguchi: the upside-down mountain at dawn, autumn maples, mist. 18 Nov 06:40.
Chureito pagoda above Fujiyoshida, cherry blossoms, striped late-spring snow, descending. 12 Apr 08:20.
Red Fuji from the east, first light on the snow-free cone, kites. 28 Aug 05:24.
Kasa-gumo cap cloud from the WSW, Osawa-kuzure, spindrift, winter afternoon. 22 Jan 15:25.
Ouchi-in summit crater, drone over the rim, sea of clouds. 6 Aug 07:05.
Night climb: headlamps zigzagging up the Yoshida trail, huts, stars, Milky Way, town lights, fading to goraiko. 10 Aug 03:30-04:18.
High-speed train on the coastal plain, tea fields, the Hoei hump on the right skyline. 15 Jan 12:10.
Diamond Fuji from Lake Yamanaka, winter: solve the camera by back-projecting the summit along the real sun vector (sun elevation 0.5-18 degrees; at Yamanaka it lands near 10 degrees), kites.
Plus a free camera: drag to orbit, scroll to zoom, WASD fly, Q / E down / up, Shift for speed, never below ground.
11. HUD and URL
Minimal HUD: title "富士山 Mount Fuji 3,776 m", shot chips (keys 1-8), play / pause (space), date and time sliders (JST), season, cloud preset (clear, cumulus, cap cloud, sea of clouds), lake wind, fps; H hides it.
URL: ?shot=N&hold&hud=0&t=0&k=0.5&season=spring&time=05:40&q=low|med|high&capture&nocache&pr=1.
12. Tooling
window.__fuji.renderAt(t, shot, k, overrides) renders a deterministic frame: every animation (water, clouds, trees, birds, boats, train, headlamps, petals) runs on scene time, never the wall clock.
tools/record.py (Playwright headless Chromium with Metal ANGLE, 127.0.0.1 URLs, poll readiness with evaluate instead of wait_for_function): an EDIT list of the 8 shots totalling 54 s with 0.3 s dips, writing a silent 1080p60 H.264 X clip (video/mount-fuji.mp4, ~16 Mb/s) plus a CRF 11 master.

tools/shoot.py: stills to captures/, including named reference views (Kawaguchi, Fuji city, Gotemba).
13. Realism checklist
Kawaguchi silhouette (symmetric concave slopes, flat notched top, no Hoei hump); Hoei on the right from the south; Osawa-kuzure from the west; eroded, branched gullies; late-spring streaks; aerial perspective (hazy blue-grey base, crisp summit); shadows including the mountain's own; real sun positions and an aligned Diamond Fuji; correct reflections; no cracks, popping, shimmer or banding; life in every shot; clean console; frame-exact clip.
14. Process
PLAN.md first. Build the heightfield alone and check hillshades in node, then the clipmap, then sky and aerial perspective, then silhouette checks from Kawaguchi, Fuji city and Gotemba until the profile, notched top and Hoei hump read correctly. Then snow, clouds, lakes, vegetation, human details, shots, tooling and the clip, with a preview and screenshot after each stage. Ship README.md, PROMPT.md and an MIT LICENSE. Keep the git repo private until told otherwise.
```

[Prompt source](https://x.com/exploraX_/status/2122293042925162538)

The recording is a creator example, not an independent BeatAPI reproduction. Media and prompts retain their original rights; no additional media license is asserted.

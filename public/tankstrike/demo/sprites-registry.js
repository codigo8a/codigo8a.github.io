// ─── Demo SPRITES registry (T8, R1) ─────────────────────────────────
//
// `web/static/js/sprites.js` builds its image URLs from the client's
// hardcoded absolute sprite base, which resolves against the host root. That
// is correct for the live client and wrong under an itch.io iframe subpath,
// where every sprite 404s and the renderer silently falls back to vector
// tanks. That module is read-only here, so the demo supplies its own.
//
// The packaging script (`build.py`) installs THIS file as the package's
// `static/js/sprites.js`. `renderer.js` and `animation.js` keep their
// `import { SPRITES } from './sprites.js'` unchanged and read the exact map
// the demo's own relative loader fills.
//
// It is dependency-free on purpose: the packager relocates it to the
// `static/js/` directory, so it must not import anything by a path that
// assumes its source location.

export const SPRITES = {
    hulls: {}, // {color: [img, img, ...]}  4 colors x 8 hulls
    guns: {}, // {color: [img, img, ...]}  4 colors x 8 guns
    explosion: [], // 9 frames for death animation
    laser: null, // effects/Laser.png — vertical bar, tileable along a beam
    laserWall: null, // walls/laser_wall.png (compat = right)
    laserWallLeft: null, // walls/laser_wall_left.png
    laserWallRight: null, // walls/laser_wall_right.png
    laserWallTop: null, // walls/laser_wall_top.png
    laserWallBottom: null, // walls/laser_wall_bottom.png
    beam: null, // effects/Laser_beam.png
    beamH: null, // effects/Laser_beam_h.png
    beamV: null, // effects/Laser_beam_v.png
    flash: [], // effects/Flash_A_01..05
    tracks: {}, // {design: [imgA, imgB]} 4 designs x 2 animation frames
    route: null, // sprites/route/route.png — conveyor belt
    routeCurve: null // sprites/route/route-curva.png — curved conveyor
};

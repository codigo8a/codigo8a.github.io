// ─── Demo-local sprite loader (T8, R1) ──────────────────────────────
//
// A faithful, relative-base port of
// `web/static/js/sprites.js::loadSprites`. The client hardcodes its sprite
// base, which is correct for the live page and wrong under an itch.io iframe
// subpath. This loader takes the base as a parameter and joins the same
// relative names onto it, so it works from any subpath.
//
// It fills the SAME `SPRITES` object `renderer.js` and `animation.js` read.
// In the packaged build that object comes from the demo registry that the
// packaging script installs as `static/js/sprites.js`; in the source tree it
// is the client's own module and the base points at a directory only the
// package provides, so the source tree keeps the documented vector fallback.
//
// `main.js` passes `new URL('./sprites/', import.meta.url)`, which resolves
// to `demo/sprites/` in the package regardless of the subpath it is served
// from. No absolute path, no CDN, no network.

import { SPRITES } from '../static/js/sprites.js';
import { state } from '../static/js/state.js';
import { SPRITE_COLORS } from '../static/js/constants.js';

/**
 * @param {URL|string|undefined} baseUrl
 * @returns {URL}
 */
function resolveBase(baseUrl) {
    if (baseUrl instanceof URL) return baseUrl;
    return new URL(String(baseUrl || './sprites/'), document.baseURI);
}

/**
 * Loads every sprite the client draws and resolves once they have all
 * settled. A failed image counts as settled, exactly like the client's
 * loader, so a partial package cannot hang the page.
 *
 * @param {URL|string|undefined} baseUrl directory the sprite tree lives in
 * @returns {Promise<void>}
 */
export function loadSprites(baseUrl) {
    const base = resolveBase(baseUrl);
    return new Promise((resolve) => {
        let total = 0;
        let loaded = 0;

        function checkDone() {
            loaded++;
            if (loaded >= total) {
                state.spritesLoaded = true;
                resolve();
            }
        }

        function fetchSprite(relPath) {
            total++;
            const img = new Image();
            img.onload = checkDone;
            img.onerror = checkDone;
            img.src = new URL(relPath, base).href;
            return img;
        }

        // Hulls (4 colors x 8 designs)
        for (const color of SPRITE_COLORS) {
            SPRITES.hulls[color] = [];
            for (let i = 1; i <= 8; i++) {
                SPRITES.hulls[color].push(
                    fetchSprite(`hulls/${color}/Hull_${String(i).padStart(2, '0')}.png`)
                );
            }
        }

        // Guns (4 colors x 8 designs)
        for (const color of SPRITE_COLORS) {
            SPRITES.guns[color] = [];
            for (let i = 1; i <= 8; i++) {
                SPRITES.guns[color].push(
                    fetchSprite(`guns/${color}/Gun_${String(i).padStart(2, '0')}.png`)
                );
            }
        }

        // Explosion sequence (9 frames)
        for (let i = 0; i < 9; i++) {
            SPRITES.explosion.push(
                fetchSprite(
                    `explosion/Sprite_Effects_Explosion_${String(i).padStart(3, '0')}.png`
                )
            );
        }

        SPRITES.laser = fetchSprite('effects/Laser.png');
        SPRITES.laserWall = fetchSprite('walls/laser_wall.png');
        SPRITES.laserWallLeft = fetchSprite('walls/laser_wall_left.png');
        SPRITES.laserWallRight = fetchSprite('walls/laser_wall_right.png');
        SPRITES.laserWallTop = fetchSprite('walls/laser_wall_top.png');
        SPRITES.laserWallBottom = fetchSprite('walls/laser_wall_bottom.png');
        SPRITES.beam = fetchSprite('effects/Laser_beam.png');
        SPRITES.beamH = fetchSprite('effects/Laser_beam_h.png');
        SPRITES.beamV = fetchSprite('effects/Laser_beam_v.png');

        // Flash spikes (5 frames)
        for (let i = 1; i <= 5; i++) {
            SPRITES.flash.push(fetchSprite(`effects/Flash_A_0${i}.png`));
        }

        // Animated tracks (4 designs x 2 frames)
        for (let design = 1; design <= 4; design++) {
            SPRITES.tracks[design] = [
                fetchSprite(`tracks/Track_${design}_A.png`),
                fetchSprite(`tracks/Track_${design}_B.png`)
            ];
        }

        SPRITES.route = fetchSprite('route/route.png');
        SPRITES.routeCurve = fetchSprite('route/route-curva.png');

        // Safety: resolve immediately if there is nothing to load.
        if (total === 0) {
            state.spritesLoaded = true;
            resolve();
        }
    });
}

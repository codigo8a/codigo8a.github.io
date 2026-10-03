/**
 * Shared Explorer chrome helpers.
 *
 * Every visual rule for these elements lives in the global stylesheet
 * (`src/index.css`: `.os-explorer`, `.toolbars`, `.toolbar`, `#standard-buttons`,
 * `#address-bar`, `.toolbar-button`, `.toolbar-compound-button-wrapper`), so
 * the helpers here only build DOM: no inline geometry, no per-app CSS.
 *
 * `MyComputer` and `FileExplorerApp` still keep private copies of this logic.
 * Pointing them at this module is a separate follow-up; until then they must not
 * be edited, because their copies are the only definition their windows have.
 */

/**
 * Sprite indices into `/images/icons/browse-ui-icons.png`.
 *
 * The sheet is a 1260×20 strip of 63 icons, each 20×20 px, so an icon is placed
 * with `background-position: -(index * 20)px 0`.
 */
export const SPRITE = Object.freeze({
  back: 0,
  forward: 1,
  refresh: 3,
  up: 4,
  newFile: 6,
  edit: 9,
  delete: 26,
  open: 28,
  save: 29,
  viewLargeIcons: 39,
  viewSmallIcons: 40,
  viewList: 41,
  viewDetails: 58,
});

/** Shared SVG for dropdown arrow (▶ rotated 90° — identical to 98.js). */
export const DROPDOWN_ARROW_SVG =
  '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="fill:currentColor;display:inline-block;vertical-align:middle"><path style="transform:rotate(90deg);transform-origin:center" d="m5 6 4 4-4 4z"></path></svg>';

/** Creates a sprite-based icon div (20×20 px at the right sprite position). */
export function createSpriteIcon(spriteIndex: number): HTMLDivElement {
  const div = document.createElement('div');
  div.className = 'icon';
  div.style.backgroundPosition = `-${spriteIndex * 20}px 0px`;
  return div;
}

/** Creates a toolbar button element with the authentic 98.js sprite icon. */
export function createToolbarButton(
  label: string,
  spriteIndex: number,
  disabled: boolean = false,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'toolbar-button lightweight';
  btn.type = 'button';
  if (disabled) btn.disabled = true;
  btn.appendChild(createSpriteIcon(spriteIndex));
  const labelSpan = document.createElement('span');
  labelSpan.className = 'label-text';
  labelSpan.textContent = label;
  btn.appendChild(labelSpan);
  return btn;
}

/**
 * Creates a compound toolbar button (main + dropdown), matching 98.js.
 *
 * The caller gets the wrapper, so both halves have to be addressed through it
 * (`syncEnabled` disables the pair together).
 */
export function createCompoundButton(
  label: string,
  spriteIndex: number,
  mainAction: () => void,
  dropdownAction: (event: Event) => void,
  disabled: boolean = false,
): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'toolbar-compound-button-wrapper';

  const mainBtn = createToolbarButton(label, spriteIndex, disabled);
  mainBtn.addEventListener('click', mainAction);
  wrapper.appendChild(mainBtn);

  const dropBtn = document.createElement('button');
  dropBtn.type = 'button';
  dropBtn.className = 'toolbar-dropdown-button lightweight';
  if (disabled) dropBtn.disabled = true;
  dropBtn.innerHTML = DROPDOWN_ARROW_SVG;
  dropBtn.addEventListener('click', dropdownAction);
  wrapper.appendChild(dropBtn);

  return wrapper;
}

/** Creates a vertical toolbar separator. */
export function createSeparator(): HTMLHRElement {
  const hr = document.createElement('hr');
  hr.setAttribute('aria-orientation', 'vertical');
  return hr;
}

/**
 * Adds the disabled-inset SVG filter to the document body.
 *
 * The filter id is what `.os-explorer .toolbar-button:disabled .icon` resolves
 * through `url("#disabled-inset-filter")`, so the guard is keyed on the filter
 * and not on the wrapper: sibling Explorer apps define the same filter under
 * their own wrapper ids, and a second copy would be a duplicate id in the page.
 */
export function ensureDisabledFilter(): void {
  if (document.getElementById('disabled-inset-filter')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'drive-explorer-disabled-filter';
  svg.setAttribute('style', 'position: absolute; pointer-events: none; bottom: 100%;');
  svg.innerHTML = `
    <defs>
      <filter id="disabled-inset-filter" x="0" y="0" width="1px" height="1px">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -2 -2 -2 4 0"
          result="dark-parts-isolated"
        />
        <feFlood result="shadow-color" flood-color="var(--ButtonShadow)"/>
        <feFlood result="hilight-color" flood-color="var(--ButtonHilight)"/>
        <feOffset in="dark-parts-isolated" dx="1" dy="1" result="offset"/>
        <feComposite in="hilight-color" in2="offset" operator="in" result="hilight-colored-offset"/>
        <feComposite in="shadow-color" in2="dark-parts-isolated" operator="in" result="shadow-colored"/>
        <feMerge>
          <feMergeNode in="hilight-colored-offset"/>
          <feMergeNode in="shadow-colored"/>
        </feMerge>
      </filter>
    </defs>
  `;
  document.body.appendChild(svg);
}
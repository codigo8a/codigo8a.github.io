/**
 * osWindowRegistry — shared registry for os-gui native windows.
 *
 * Bridges the gap between os-gui windows (created outside React) and
 * React's DesktopContext/TaskBar. Each os-gui launch function registers
 * its $win here so the TaskBar can render a button for it.
 *
 * Events dispatched:
 *   'os-windows-changed' — React listens to this to update state
 */

export interface OsWindowEntry {
  id: string;
  appId: string;
  title: string;
  icon: string;
  isMinimized: boolean;
}

interface InternalEntry extends OsWindowEntry {
  $win: any;
}

// ── Internal registry ──

const registry = new Map<string, InternalEntry>();

// ── Helpers ──

function dispatchChange(): void {
  window.dispatchEvent(new CustomEvent('os-windows-changed'));
}

/** Remove os-gui minimize artifacts so the window is ready for normal use. */
function cleanupMinimizeState($win: any): void {
  $win.removeClass('minimized-without-taskbar was-maximized');
  if ($win.$minimize) {
    $win.$minimize.removeClass('window-action-restore');
    $win.$minimize.addClass('window-action-minimize');
  }
}

/** Update the minimize button to show "restore" icon. */
function setMinimizeButtonToRestore($win: any): void {
  if ($win.$minimize) {
    $win.$minimize.removeClass('window-action-minimize');
    $win.$minimize.addClass('window-action-restore');
  }
}

// ── Public API ──

/**
 * Register an os-gui window so it appears in the taskbar.
 * Automatically hooks minimize and close so the registry + React stay in sync.
 *
 * Returns the unique window ID.
 */
export function registerOsWindow(
  $win: any,
  appId: string,
  title: string,
  icon: string,
): string {
  const id = `${appId}-os-${Date.now()}`;

  registry.set(id, { id, appId, title, icon, isMinimized: false, $win });
  dispatchChange();

  // ── Hook minimize: toggle hide/show instead of os-gui's "shrink to bottom" ──
  $win.minimize = () => {
    const entry = registry.get(id);
    if (!$win.is(':visible')) {
      // Already hidden → restore
      cleanupMinimizeState($win);
      $win.show();
      $win.focus();
      if (entry) {
        entry.isMinimized = false;
        dispatchChange();
      }
    } else {
      // Visible → hide
      $win.hide();
      $win.blur();
      setMinimizeButtonToRestore($win);
      if (entry) {
        entry.isMinimized = true;
        dispatchChange();
      }
    }
  };

  // ── Hook close to unregister ──
  $win.onClosed(() => {
    registry.delete(id);
    dispatchChange();
  });

  return id;
}

/**
 * Focus/restore an os-gui window by ID.
 * Called when the user clicks the corresponding taskbar button.
 */
export function focusOsWindow(id: string): void {
  const entry = registry.get(id);
  if (!entry) return;

  const $win = entry.$win;
  if ($win.closed) {
    registry.delete(id);
    dispatchChange();
    return;
  }

  // Clean any os-gui minimize state and show the window
  cleanupMinimizeState($win);
  $win.show();
  $win.focus();

  entry.isMinimized = false;
  dispatchChange();
}

/**
 * Return a snapshot of all registered os-gui windows.
 */
export function getOsWindows(): OsWindowEntry[] {
  return Array.from(registry.values());
}

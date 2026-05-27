Date: 27/05/2026
# Project Features

This project is a Windows 95/98 style desktop environment built with React. Below are the main features available to the user:

## 🚀 Loading Screen
- **Retro Boot Experience**: Authentic Windows 98 loading screen with animated hourglass
- **Animated Hourglass**: Classic sand animation that rotates and fills
- **Progress Indicator**: Segmented progress bar with percentage display
- **Authentic Styling**: Windows 98 teal background with gray dialog box
- **Smooth Transition**: Fades out gracefully when loading completes

## 🖥️ Desktop and Window Management
- **Multitasking**: Open multiple applications simultaneously in independent windows.
- **Window Management**: Each window can be:
  - **Dragged**: Move across the desktop from the title bar.
  - **Minimized**: Hide the window while keeping the application open in the Taskbar.
  - **Maximized/Restored**: Expand the window to full screen or return to its original size.
  - **Closed**: End the application.
  - **Focused**: Clicking a window or its taskbar icon brings it to the front (Z-Index).
- **Window Persistence**: Windows remember their position and size when closed and reopened.
- **Window Animations**: Smooth transitions when opening, closing, minimizing, and restoring windows.

## 🎨 Desktop Customization
- **Wallpapers**: 6 authentic Windows 98 style wallpapers available:
  - Teal (classic Windows 98)
  - Brick
  - Green Marble
  - Ocean
  - Gray Grid
  - Purple Stone
- **Wallpaper Selector**: Visual grid with thumbnails in Settings.

## 🤖 Clippy - Virtual Assistant
- **Interactive Help**: Paper clip assistant with **23 useful tips** about the portfolio.
- **Random Order**: Tips appear in random order (except the welcome tip), so you see different information each time.
- **Floating Animation**: Gentle up and down movement with eye blinking every 4 seconds.
- **Speech Bubble**: Classic Windows 98 yellow dialog bubble with "Next Tip" and "Close" buttons.
- **Taskbar Integration**: Simple paper clip icon appears on Taskbar when closed - click to reopen.
- **Mobile Support**: Fully functional on mobile devices with adjusted sizing.
- **Disable Option**: Can be turned off in Settings, and re-enabled at any time.

## 🚀 Start Menu and Taskbar
- **Start Menu**: Quick access to all installed applications (`Programs`, `Documents`, `Settings`, `Browser`).
- **Taskbar**: View open applications, allowing you to switch between them quickly.
- **System Clock**: Real-time display of the current time in the bottom right corner.

## 📂 Document Explorer (Documents)
- **Folder Navigation**: View the file structure organized by categories (`YouTube`, `Systems`, `Pages`, `Internet`).
- **Icon Grid View**: Documents displayed as icons in a grid layout, styled like Windows 98 "My Documents".
- **Direct Access**: Open any document directly with a double-click.

## 📄 File Viewer (File Viewer)
- **Markdown Rendering**: View documents with rich formatting, including images, lists, links, and code blocks.
- **View Tabs**:
  - **Preview**: See the rendered document.
  - **Source**: See the original raw content (Markdown).
- **Image Support**: Images are loaded dynamically from the project's public folder.

## 🔍 Document Search (Search)
- **Real-time Search**: Search for files by name or by content within the documents.
- **Interactive Results**: Shows the location and type of match, allowing you to open the file directly from the results.

## ⚙️ Settings (Settings)
- **Tabbed Interface**: Organized in two tabs:
  - **General Tab**: Language selection (English/Spanish) and Clippy toggle.
  - **Desktop Tab**: Wallpaper selection with visual thumbnails.
- **Radio Button Controls**: Settings use authentic Windows 98 radio buttons for selection.
- **Internationalization (i18n)**: App texts, buttons, and menus update dynamically when changing the language.

## 🌐 Browser
- **Retro Web Browser**: Web browser styled like classic browsers from the 90s.
- **Navigation Controls**: Back, Forward, Reload, and Home buttons.
- **Address Bar**: Enter any URL to navigate.
- **Smart Loading**: Sites that allow iframes load inside the app; blocked sites show an error with option to open in new tab.
- **Loading Indicator**: Progress bar shown while pages load.
- **Status Bar**: Displays connection status and security information.
- **New Tab Fallback**: When a site cannot be embedded, click "Open in New Tab" to view it in your default browser.

## 🎵 Winamp
- **Classic Music Player**: Fully functional Winamp simulation using Webamp.
- **Official Icon**: Uses the authentic Winamp lambda/flame SVG logo from Wikimedia Commons.
- **Desktop Integration**: Launches from desktop icon or Start Menu (Programs).
- **Classic Interface**: Includes main window, equalizer, and playlist windows.
- **Audio Support**: Play MP3s and other audio formats directly in the browser.

## 🔗 URL Routing
- **Deep Linking**: The system can open specific files directly from the URL (e.g., `/youtube/ollama-en-linux`).
- **URL Synchronization**: When closing or minimizing a window opened by URL, the browser address is automatically cleared back to the root (`/`).

## 👋 Welcome Screen (Welcome)
- **Tips of the Day**: Interactive screen with useful tips on how to use the system.
- **Startup Settings**: Option to decide whether to see the screen when loading the project.

## 💾 Persistence
All user preferences are automatically saved to localStorage:
- Selected language (ES/EN)
- Selected wallpaper
- Clippy enabled/disabled state
- Window positions and sizes for each application (remembered when reopened)

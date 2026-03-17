Date: 17/03/2026
# Project Features

This project is a Windows 95/98 style desktop environment built with React. Below are the main features available to the user:

## 🖥️ Desktop and Window Management
- **Multitasking**: Open multiple applications simultaneously in independent windows.
- **Window Management**: Each window can be:
  - **Dragged**: Move across the desktop from the title bar.
  - **Minimized**: Hide the window while keeping the application open in the Taskbar.
  - **Maximized/Restored**: Expand the window to full screen or return to its original size.
  - **Closed**: End the application.
  - **Focused**: Clicking a window or its taskbar icon brings it to the front (Z-Index).

## 🚀 Start Menu and Taskbar
- **Start Menu**: Quick access to all installed applications (`Programs`, `Documents`, `Settings`).
- **Taskbar**: View open applications, allowing you to switch between them quickly.
- **System Clock**: Real-time display of the current time in the bottom right corner.

## 📂 Document Explorer (Documents)
- **Folder Navigation**: View the file structure organized by categories (`YouTube`, `Systems`, `Pages`, `Internet`).
- **View Modes**: 
  - **Table View**: Detailed list of files with name, location, and last modification date (sorted by most recent).
  - **Tree View**: Classic hierarchical folder navigation.
- **Direct Access**: Open any document directly with a click.

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
- **Language Change**: Allows switching the entire interface between **English** and **Spanish**.
- **Internationalization (i18n)**: App texts, buttons, and menus update dynamically when changing the language.

## 🔗 URL Routing
- **Deep Linking**: The system can open specific files directly from the URL (e.g., `/youtube/ollama-en-linux`).
- **URL Synchronization**: When closing or minimizing a window opened by URL, the browser address is automatically cleared back to the root (`/`).

## 👋 Welcome Screen (Welcome)
- **Tips of the Day**: Interactive screen with useful tips on how to use the system.
- **Startup Settings**: Option to decide whether to see the screen when loading the project.

# 📱 Solo System – RPG Progression Mobile App

> A mobile-first RPG-style progression system inspired by *Solo Leveling*, built with React, Vite, and Capacitor.

---

## 📖 Overview

**Solo System** is a gamified self-development and productivity mobile application inspired by the concept of “leveling up” from *Solo Leveling*.
Users can track progress, complete challenges, gain experience, and improve real-life skills through an RPG-style interface.

The app is built using **React + Vite** and converted into a native Android application using **Capacitor**.

---

## ✨ Features

* ⚔️ RPG-style leveling system
* 📈 Progress & stats tracking
* 🎯 Task / challenge-based growth
* 📱 Android mobile support via Capacitor
* 🎨 Modern UI with Tailwind CSS
* 🧠 State management using Zustand
* 🎬 Smooth animations using Framer Motion
* 🔔 Local notifications & haptics support
* 🔊 Native audio support

---

## 🛠️ Tech Stack

### Frontend

* **React 19**
* **Vite 7**
* **Tailwind CSS**
* **Framer Motion**

### Mobile

* **Capacitor 8**
* Android SDK

### State Management

* **Zustand**

### Tooling

* ESLint
* Vite Dev Server
* npm

---

## 📁 Project Structure

```
Solo-System-main/
│
├── solo-system/
│   ├── android/          # Android native project
│   ├── public/           # Public assets
│   ├── src/
│   │   ├── assets/        # Images, icons, sounds
│   │   ├── components/    # Reusable UI components
│   │   ├── store/         # Zustand state stores
│   │   ├── utils/         # Helper functions
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   │
│   ├── capacitor.config.json
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Prerequisites

Make sure you have installed:

* Node.js (v18+ recommended)
* npm
* Android Studio (for mobile build)
* Java JDK

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/solo-system.git
cd Solo-System-main/solo-system
```

---

### 3️⃣ Install Dependencies

```bash
npm install
```

---

### 4️⃣ Run in Development Mode (Web)

```bash
npm run dev
```

Then open:

```
http://localhost:5173
```

---

## 📱 Mobile (Android) Setup

### 1️⃣ Build the Web App

```bash
npm run build
```

---

### 2️⃣ Sync with Capacitor

```bash
npx cap sync
```

---

### 3️⃣ Open Android Studio

```bash
npx cap open android
```

Then build and run from Android Studio.

---

## 📦 Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build production files   |
| `npm run preview` | Preview build            |
| `npm run lint`    | Run ESLint               |

---

## 🧩 State Management (Zustand)

Global app state is managed using **Zustand**.

Location:

```
src/store/
```

This is used for:

* User stats
* Level progression
* Game state
* Preferences

Example usage:

```js
import useStore from "../store/useStore";

const level = useStore(state => state.level);
```

---

## 🎨 Styling

Styling is handled using:

* Tailwind CSS
* Custom CSS

Main files:

```
src/index.css
src/App.css
```

Tailwind is configured through Vite.

---

## 🔌 Capacitor Plugins Used

| Plugin                            | Purpose            |
| --------------------------------- | ------------------ |
| @capacitor/app                    | App lifecycle      |
| @capacitor/haptics                | Vibration feedback |
| @capacitor/preferences            | Local storage      |
| @capacitor/local-notifications    | Notifications      |
| @capacitor-community/native-audio | Sound effects      |

---

## 🧪 Linting

To check code quality:

```bash
npm run lint
```

Uses ESLint with React rules.

---

## 📈 Future Improvements

Planned enhancements:

* 🔐 Authentication system
* ☁️ Cloud sync
* 🏆 Achievement system
* 📊 Advanced analytics
* 🌙 Dark / light themes
* 👥 Social leaderboard
* 📱 iOS support

---

## 🐞 Known Issues

* iOS build not configured yet
* Offline sync not implemented
* Limited persistence

(Contributions welcome!)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to your fork
5. Create a Pull Request

---

## 👨‍💻 Author

**Prajwal Hiremath**

Solo System is a passion project inspired by anime-style self-improvement systems.

---

## 💬 Support

If you have questions, ideas, or suggestions:

* Open an issue
* Contact the author
* Submit a pull request

---

## ⭐ Show Your Support

If you like this project, please give it a ⭐ on GitHub!



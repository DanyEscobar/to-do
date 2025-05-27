# 📱 To-Do App

Aplicación móvil desarrollada con **Ionic + Angular + Capacitor**.

## 🚀 Demo

- 📦 **APK descargable:**  
  [Descargar APK](https://drive.google.com/file/d/1kqlzw0cc5DI0qWvIapbjGI6apAwkahnq/view?usp=drive_link)

- 🎥 **Video de demostración:**  
  [Ver video demo](https://drive.google.com/file/d/1m57h53FjZ3JgnX20t9rwzHcVxvLDPady/view?usp=drive_link)

- ☁️ **Capturas de Firebase:**  
  [Captura 1](https://prnt.sc/xfZanNuRU5v_)  
  [Captura 2](https://prnt.sc/wM75ZcteWM-5)

- ☁️ **Netlify:**  
  [Netlify](https://to-do-app-0125.netlify.app/home) 


## ✅ Características iniciales
- [x] Crear tareas
- [x] Editar tareas
- [x] Eliminar tareas
- [x] Categorías
- [x] Filtrar por categoría
- [x] Guardar en almacenamiento local (`@capacitor/preferences`)
- [x] Remote Config con Firebase

---

## 1. 🚀 Iniciar proyecto Ionic
```bash
npm install
ionic serve
```

## 2. 📱 Configuración Híbrida (Android/iOS)

### Requisitos previos
- Node.js
- Ionic CLI (`npm install -g @ionic/cli`)
- Capacitor (`npm install @capacitor/core`)
- Android Studio (para Android)
- Xcode (solo en macOS, para iOS)

---

### Agregar plataformas
```bash
ionic cap add android
ionic cap add ios
```

### Compilar en Android
```bash
ionic build
ionic cap copy android
ionic cap open android
```
Desde Android Studio puedes compilar y ejecutar en emulador o dispositivo físico.

### Compilar en iOS (macOS)
```bash
ionic build
ionic cap copy ios
ionic cap open ios
```
Desde Xcode puedes compilar y probar.

### Sincronizar cambios
Cada vez que cambies código web, usa:
```bash
ionic build
ionic cap sync
```

### Producción
```bash
ionic build --prod
ionic cap copy
```

### 3. 🌐 Configuración Firebase

### firebase-config.ts
```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyA7d0pxDeXIVvs0WTMjdr8cKzto5apD1Pw",
    authDomain: "to-do-c865d.firebaseapp.com",
    projectId: "to-do-c865d",
    storageBucket: "to-do-c865d.firebasestorage.app",
    messagingSenderId: "761443499482",
    appId: "1:761443499482:web:3a273d358875f1e6b394e3",
    measurementId: "G-LD5XY988ED"
  }
};
```

### 📄 `android/settings.gradle` recomendado
```gradle
include ':app'
include ':capacitor-cordova-android-plugins'

project(':capacitor-cordova-android-plugins').projectDir = new File('./capacitor-cordova-android-plugins')

apply from: './capacitor.settings.gradle'

---



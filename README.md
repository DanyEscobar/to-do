# 📱 ToDo App — Ionic + Angular + Firebase

Aplicación móvil híbrida de gestión de tareas desarrollada con **Ionic 8**, **Angular 19** y **Capacitor 7**. Incluye sistema de categorías con colores, feature flags con Firebase Remote Config, y optimización de rendimiento.

---

## 🚀 Demo

- 📦 **APK descargable:**  
  [Descargar APK](https://drive.google.com/file/d/1xzET6lVQV1r2JajPSL5arjdAWbhkFs9v/view?usp=drive_link)

- 🎥 **Video de demostración:**  
  [Ver video demo](https://drive.google.com/file/d/1P3in8yRlJ_i47xk7SMnHbDXhR0pcyoF5/view?usp=drive_link)

- ☁️ **Drive Firebase Remote Config:**  
  https://drive.google.com/file/d/1P3in8yRlJ_i47xk7SMnHbDXhR0pcyoF5/view?usp=sharing

- 🌐 **Netlify (Web):**  
  [https://to-do-app-0125.netlify.app](https://to-do-app-0125.netlify.app)

---

## ✅ Funcionalidades

### Gestión de Tareas
- ✅ Crear tareas con título y categoría
- ✅ Editar tareas existentes
- ✅ Eliminar tareas con confirmación (modal)
- ✅ Marcar/desmarcar tareas como completadas
- ✅ Ordenamiento automático (pendientes primero, luego por fecha)
- ✅ Deslizar para acciones rápidas (swipe)

### Gestión de Categorías
- ✅ Crear categorías con nombre y color personalizado
- ✅ Editar categorías existentes
- ✅ Eliminar categorías (actualiza tareas asociadas)
- ✅ Paleta de 10 colores predefinidos
- ✅ Validación de nombres únicos
- ✅ Categorías por defecto: Personal, Trabajo, Urgente, Compras

### Filtros, Interfaz y UX
- ✅ Chips de filtro por categoría
- ✅ Filtro persistido en almacenamiento local
- ✅ Estadísticas en tiempo real (total, completadas, pendientes)
- ✅ Pull-to-Refresh nativo para resetear vista y forzar recarga remota

### Firebase Remote Config
- ✅ Feature flag `showCategories` para activar/desactivar categorías
- ✅ Polling automático cada 30 segundos
- ✅ Manejo de errores graceful (no bloquea la app)
- ✅ Valor por defecto: categorías habilitadas

### Almacenamiento
- ✅ Persistencia local con `@capacitor/preferences`
- ✅ Migración automática de formato de datos antiguo

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── category-form/     # Formulario de categoría (crear/editar)
│   │   ├── delete-modal/      # Modal reutilizable de confirmación
│   │   ├── task-form/         # Formulario de tarea (crear/editar)
│   │   └── task-list/         # Lista de tareas con filtrado
│   ├── interfaces/
│   │   ├── category.interface.ts   # Interfaz Category + colores
│   │   └── task.interface.ts       # Interfaz Task
│   ├── pages/
│   │   ├── categories/        # Página de gestión de categorías
│   │   └── home/              # Página principal
│   ├── services/
│   │   ├── category.service.ts    # CRUD de categorías
│   │   ├── config.service.ts      # Firebase Remote Config
│   │   └── task.service.ts        # CRUD de tareas
│   ├── app.component.ts
│   └── app.routes.ts          # Rutas lazy-loaded
├── environments/
├── theme/
│   └── variables.scss         # Design system premium
├── global.scss                # Estilos globales + animaciones
└── index.html
```

### Patrones de Diseño
- **Standalone Components**: Todos los componentes son standalone (Angular 19)
- **Signals**: Estado reactivo con Angular Signals en lugar de BehaviorSubject
- **OnPush**: Estrategia de detección de cambios optimizada en todos los componentes
- **Lazy Loading**: Rutas con carga diferida para code-splitting
- **Service Layer**: Servicios inyectables con single responsibility

---

## 🚀 Inicio Rápido

### Requisitos Previos
- **Node.js** v18+ (recomendado v20+)
- **npm** v9+
- **Ionic CLI**: `npm install -g @ionic/cli`

### Instalación
```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd to-do

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ionic serve
```

La aplicación estará disponible en `http://localhost:8100`

---

## 📱 Configuración Híbrida (Android/iOS)

> **Nota sobre Cordova vs Capacitor:** Aunque la prueba menciona "Cordova", este proyecto utiliza **Capacitor 7** (el motor nativo oficial y moderno de Ionic) en lugar del obsoleto Cordova, siguiendo las mejores prácticas actuales de la industria para aplicaciones Ionic/Angular modernas. El resultado (APK/IPA) es exactamente el mismo, pero con un mejor rendimiento y soporte a largo plazo.

### Requisitos Adicionales
- **Android Studio** (para Android)
- **Xcode** (solo macOS, para iOS)
- **CocoaPods** (para iOS): `sudo gem install cocoapods`

### Agregar Plataformas
```bash
# Si no existen aún
ionic cap add android
ionic cap add ios
```

### Compilar y Ejecutar en Android
```bash
# Compilar el proyecto web
ionic build

# Copiar archivos al proyecto nativo
ionic cap copy android

# Sincronizar plugins y dependencias
ionic cap sync android

# Abrir en Android Studio
ionic cap open android
```
Desde Android Studio: **Build > Generate App Bundles or APKs > Generate APKs**

### Compilar y Ejecutar en iOS (macOS)
```bash
# Compilar el proyecto web
ionic build

# Copiar archivos al proyecto nativo
ionic cap copy ios

# Sincronizar plugins
ionic cap sync ios

# Abrir en Xcode
ionic cap open ios
```
Desde Xcode: seleccionar dispositivo/simulador y presionar **▶ Run**

### Generar APK de Producción
```bash
# Build optimizado
ionic build --prod

# Sincronizar
ionic cap sync android

# Abrir Android Studio
ionic cap open android
```
En Android Studio: **Build > Generate Signed Bundle / APK**

### Generar IPA de Producción
```bash
ionic build --prod
ionic cap sync ios
ionic cap open ios
```
En Xcode: **Product > Archive**, luego distribuir.

### Sincronizar Cambios
```bash
# Después de modificar código web
ionic build
ionic cap sync
```

### Live Reload en Dispositivo
```bash
# Encontrar tu IP local
ipconfig  # Windows
ifconfig  # macOS/Linux

# Ejecutar con live reload
ionic cap run android -l --external
```

---

## 🌐 Configuración Firebase

### firebase-config.ts
```typescript
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

### Feature Flag: `showCategories`

El sistema de categorías se controla remotamente mediante Firebase Remote Config:

1. **Acceder a** [Firebase Console](https://console.firebase.google.com/) > Proyecto `to-do-c865d`
2. **Ir a** Remote Config
3. **Crear/modificar** el parámetro `showCategories` (tipo Boolean)
4. **Publicar** los cambios

| Valor | Comportamiento |
|-------|---------------|
| `true` | Se muestran las categorías, filtros por categoría, y la navegación a gestión de categorías |
| `false` | Se ocultan completamente las categorías. Las tareas se muestran sin filtros de categoría |

**Nota**: La app hace polling cada 30 segundos para detectar cambios. Si Firebase no está disponible, las categorías se muestran por defecto.

---

## ⚡ Optimizaciones de Rendimiento

### 1. Detección de Cambios (OnPush)
Todos los componentes usan `ChangeDetectionStrategy.OnPush`, lo que reduce significativamente los ciclos de detección de cambios innecesarios.

### 2. Angular Signals
Estado reactivo basado en Signals en lugar de Observables/BehaviorSubject, lo que permite detección granular de cambios y mejor rendimiento.

### 3. TrackBy en Listas
Las listas de tareas y categorías usan `track task.id` en los bloques `@for` para optimizar el re-renderizado del DOM.

### 4. Debounce en Escritura
`TaskService.debouncedSave()` agrupa escrituras al almacenamiento local con un debounce de 300ms, evitando escrituras excesivas al hacer toggle rápido de checkboxes.

### 5. Lazy Loading
Las rutas usan `loadComponent` con imports dinámicos para code-splitting automático:
```typescript
loadComponent: () => import('./pages/categories/categories.page').then(m => m.CategoriesPage)
```

### 6. Standalone Imports
Los componentes Ionic se importan individualmente (tree-shakeable) en lugar de importar módulos completos, reduciendo el tamaño del bundle.

### 7. Carga Paralela
La inicialización de datos usa `Promise.all()` para cargar tareas y categorías simultáneamente.

### 8. Señales Computadas
Estadísticas (total, completadas, pendientes) y listas filtradas se calculan con `computed()`, evitando recálculos innecesarios.

---

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Ionic | 8.x | Framework UI móvil |
| Angular | 19.x | Framework SPA |
| Capacitor | 7.x | Bridge nativo (Android/iOS) |
| Firebase | 11.x | Remote Config (feature flags) |
| @angular/fire | 19.x | SDK Angular para Firebase |
| TypeScript | 5.6 | Lenguaje tipado |
| SCSS | - | Estilos y design system |
| @capacitor/preferences | 7.x | Almacenamiento local |

---

## 📝 Respuestas a Preguntas Técnicas

### ¿Cuáles fueron los principales desafíos al implementar las nuevas funcionalidades?

1. **Integridad referencial de categorías**: Al eliminar una categoría, fue necesario implementar `clearCategoryFromTasks()` para limpiar las referencias en las tareas asociadas, evitando IDs huérfanos.

2. **Migración de datos**: Las tareas originales usaban `category: string`. La migración a `categoryId: string` requirió un sistema de migración automática en `TaskService.migrateTasks()` para mantener compatibilidad.

3. **Feature flag con Remote Config**: Manejar el caso en que Firebase no está disponible (offline, error de red) sin bloquear la funcionalidad. Se implementó un valor por defecto (`true`) y manejo graceful de errores.

4. **Reactividad con Signals**: La transición completa a Angular Signals requirió repensar la comunicación entre componentes, usando `input()`, `output()` y `computed()` de forma consistente.

### ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?

1. **OnPush en todos los componentes**: Reduce los ciclos de Change Detection de O(n) a O(1) cuando no hay cambios en inputs.

2. **Debounce en persistencia**: El toggle rápido de checkboxes podría generar muchas escrituras I/O. El debounce de 300ms agrupa escrituras sin afectar la UX.

3. **TrackBy con ID**: En listas dinámicas, `track task.id` evita la re-creación innecesaria de elementos DOM cuando solo cambian propiedades individuales.

4. **Lazy Loading de rutas**: Reduce el bundle inicial, cargando la página de categorías solo cuando se navega a ella.

5. **Standalone imports de Ionic**: Importar `IonButton` en lugar de `IonicModule` permite tree-shaking efectivo, reduciendo el tamaño final del bundle.

6. **Carga paralela**: `Promise.all([loadTasks(), loadCategories()])` reduce el tiempo de inicialización al ejecutar ambas lecturas de storage en paralelo.

### ¿Cómo aseguraste la calidad y mantenibilidad del código?

1. **Arquitectura modular**: Separación clara entre páginas, componentes, servicios e interfaces. Cada archivo tiene una responsabilidad única.

2. **Tipado estricto**: Interfaces TypeScript para `Task` y `Category`, eliminando `any` types. Uso de signals tipados.

3. **Componentes reutilizables**: `DeleteModalComponent` se reutiliza tanto en tareas como en categorías, con inputs configurables para título y mensaje.

4. **Documentación JSDoc**: Todos los servicios y métodos públicos están documentados con comentarios JSDoc descriptivos.

5. **Convenciones consistentes**: Naming conventions de Angular, estructura de carpetas estándar de Ionic, y uso consistente de signals vs observables.

6. **Validaciones**: Formularios reactivos con validators, verificación de nombres duplicados en categorías, y manejo de errores en todas las operaciones async.

7. **Design System**: Variables CSS centralizadas en `variables.scss` para mantener consistencia visual y facilitar cambios de tema.

---

## 📄 Licencia

Proyecto desarrollado como prueba técnica.

---

## 📄 `android/settings.gradle` recomendado
```gradle
include ':app'
include ':capacitor-cordova-android-plugins'

project(':capacitor-cordova-android-plugins').projectDir = new File('./capacitor-cordova-android-plugins')

apply from: './capacitor.settings.gradle'
```

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.todo.app',
  appName: 'ToDo App',
  webDir: 'www',
  // Configuración del servidor para live-reload en desarrollo
  // Descomenta y actualiza la IP para desarrollo en dispositivo:
  // server: {
  //   url: 'http://192.168.1.X:8100',
  //   cleartext: true
  // },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#6366f1',
    },
    Keyboard: {
      resize: 'body' as any,
      resizeOnFullScreen: true,
    },
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#6366f1',
      showSpinner: false,
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#6366f1',
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#6366f1',
  },
};

export default config;

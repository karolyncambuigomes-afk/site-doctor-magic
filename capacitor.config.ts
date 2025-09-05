import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.663c1bac9cc54a23a7293955267df9ca',
  appName: 'site-doctor-magic',
  webDir: 'dist',
  server: {
    url: "https://663c1bac-9cc5-4a23-a729-3955267df9ca.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: true,
      spinnerColor: "#000000"
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#ffffff"
    }
  }
};

export default config;
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ngenda.shopper',
  appName: 'Ngenda Shopper',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'release-key.keystore',
      keystoreAlias: 'ngenda-key-alias',
      keystorePassword: 'your-keystore-password',
      keystoreKeyPassword: 'your-key-password',
    }
  }
};

export default config;
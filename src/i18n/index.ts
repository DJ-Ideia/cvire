import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from './en-US.json';
import ptBR from './pt-BR.json';

i18n.use(initReactI18next).init({
  resources: {
    'en-US': { translation: enUS },
    'pt-BR': { translation: ptBR },
  },
  lng: 'en-US', // Default to English
  fallbackLng: 'en-US',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

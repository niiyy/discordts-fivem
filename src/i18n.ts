import config from './config/config.json'
import fr from './locales/fr.json'
import en from './locales/en.json'
import i18n from 'i18next'

const resources = {
  fr,
  en,
}

i18n.init({
  lng: config.GENERAL.LANGUAGE,
  fallbackLng: 'en',
  debug: false,
  resources,
})

export default i18n

import store from '../store'
import ru from '../locales/ru.json'
import en from '../locales/en.json'

const locales = {
  'ru-RU' : ru,
  'en-US' : en
}

export default function localizeFilter (key) {
  const lang = localStorage.getItem('lang')
  const locale = lang || 'ru-RU'
  return locales[locale][key] || `[Localize error]: key ${key} not found`
}

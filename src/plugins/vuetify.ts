import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#921616',
          surface: '#111111',
          background: '#0d0d0d',
        },
      },
    },
  },
  icons: { defaultSet: 'mdi' },
})

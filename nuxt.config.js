module.exports = {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Печать почтовых бланков',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Почтовые утилиты'
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#0062c0'
  },


  router: {
    linkActiveClass: 'active',
    middleware: 'clearPrintContainer'
  },

  css: [
    '@/node_modules/font-awesome/css/font-awesome.min.css',
    '@/assets/scss/main.scss',
  ],

  modules: [
    ['bootstrap-vue/nuxt', {
      css: false
    }]
  ],


  plugins: [
    { src: '~/plugins/vendor', ssr: false },
    { src: '~/plugins/sprites', ssr: false },
    { src: '~/plugins/startup', ssr: false }
  ],
  /*
   ** Build configuration
   */
  build: {

    vendor: [
        'babel-polyfill', 'eventsource-polyfill', '~/node_modules/pdfmake/build/pdfmake.min.js', '~/plugins/vfs_fonts.js'
    ],

    babel: {
      presets: [['vue-app', { useBuiltIns: true }]]
    },
    /*
     ** Run ESLint on save
     */
    extend(config, {
      isDev,
      isClient
    }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

export default {
  mode: "universal",
  srcDir: "app",
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      {
        charset: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico"
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#fff"
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "@/plugins/firebase",
    "@/plugins/vee-validate",
    "@/plugins/uniqStr"
  ],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxt/typescript-build", "nuxt-typed-vuex"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/modules/tree/master/packages/bulma
    "@nuxtjs/bulma"
  ],
  /*
   ** Build configuration
   */
  build: {
    transpile: [/typed-vuex/],
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(_config: any, _ctx: any) {}
  }
};

module.exports = {
  locales: {
    // The key is the path for the locale to be nested under.
    // As a special case, the default locale can use '/' as its path.
    '/': {
      lang: 'en-US', // this will be set as the lang attribute on <html>
      title: 'Ercole',
      description: 'Proactive Software Asset Management',
      text: '##You can find the service around Ercole on Sorint\'s Ercole services page).', link: 'https://www.sorint.it/ercole' 
    },
  },
  themeConfig: {
    locales: {
      '/': {
        // text for the language dropdown
        selectText: 'Languages',
        // label for this locale in the language dropdown
        label: 'English',
        // text for the edit-on-github link
        algolia: {},
        sidebar: [
          ['/introduction', 'Introduction'],
          ['/guide-2.x', 'Getting Started Ercole 2.x'],
          ['/guide-1.x', 'Getting Started Ercole 1.x'],
          ['/architecture', 'Architecture']
        ]
      },
    },
    logo: '/ercole.svg',
    sidebarDepth: 2,
    displayAllHeaders: true,
    repo: 'ercole-io/ercole',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: 'introduction' },
      { text: 'Download', link: 'https://repository.ercole.io' },
      { text: 'Demo', link: 'https://demo.ercole.io' },
      { text: 'Professional support', link: 'https://www.sorint.it/ercole' },
      { text: 'Gitter', link: 'https://gitter.im/ercole-io/community' },
    ]
  },
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        'ga': 'UA-146622093-1'
      }
    ],
    [
      '@markspec/vuepress-plugin-footnote'
    ],
    ['vuepress-plugin-google-tag-manager',
    {
      'gtm': 'GTM-PQXX8NC'
    }
  ] 
  ]
}
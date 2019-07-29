module.exports = {
  locales: {
    // The key is the path for the locale to be nested under.
    // As a special case, the default locale can use '/' as its path.
    '/': {
      lang: 'en-US', // this will be set as the lang attribute on <html>
      title: 'Ercole',
      description: 'Proactive Asset Software Management'
    },
    '/it/': {
      lang: 'it-IT',
      title: 'Ercole',
      description: 'Proactive Asset Software Management'
    }
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
          ['/guide', 'Getting Started'],
          ['/architecture', 'Architecture']
        ]
      },
      '/it/': {
        selectText: 'Lingua',
        label: 'Italiano',
        algolia: {},
        sidebar: [
          ['/it/introduction', 'Introduzione'],
          ['/it/guide', 'Getting Started'],
          ['/it/architecture', 'Architettura']
        ]
      }
    },
    logo: '/ercole.svg',
    sidebarDepth: 2,
    displayAllHeaders: true
  }
}
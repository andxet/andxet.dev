const contentful = require('contentful');
const manifestConfig = require('./manifest-config');
require('dotenv').config();

const { ACCESS_TOKEN, SPACE_ID, ANALYTICS_ID, COOKIEHUB, IUBENDA_SITE_ID, COOKIE_POLICY_ID } = process.env;

const client = contentful.createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN,
});

const getAboutEntry = entry => entry.sys.contentType.sys.id === 'about';

const plugins = [
  'gatsby-plugin-react-helmet',
  {
    resolve: 'gatsby-plugin-web-font-loader',
    options: {
      google: {
        families: ['Cabin', 'Open Sans'],
      },
    },
  },
  {
    resolve: 'gatsby-plugin-manifest',
    options: manifestConfig,
  },
  'gatsby-plugin-styled-components',
  {
    resolve: 'gatsby-source-contentful',
    options: {
      spaceId: SPACE_ID,
      accessToken: ACCESS_TOKEN,
    },
  },
  'gatsby-transformer-remark',
  'gatsby-plugin-offline',
];

module.exports = client.getEntries().then(entries => {
  const { mediumUser } = entries.items.find(getAboutEntry).fields;

  plugins.push({
    resolve: 'gatsby-source-medium',
    options: {
      username: mediumUser || '@medium',
    },
  });

  if (ANALYTICS_ID) {
    plugins.push({
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: ANALYTICS_ID,
        anonymize: true,
      },
    });
  }

  if (ANALYTICS_ID && COOKIEHUB && false) {
    console.log('Activating cookiehub');
    plugins.push({
      resolve: 'gatsby-plugin-cookiehub',
      options: {
        trackingId: ANALYTICS_ID,
        anonymize: true,

        // your cookiehub widget ID
        cookihubId: COOKIEHUB,
        // your google analytics tracking id
        trackingId: ANALYTICS_ID,
        // Puts tracking script in the head instead of the body
        head: false,
        // enable ip anonymization
        anonymize: true,
      },
    });
  }

  if (IUBENDA_SITE_ID && COOKIE_POLICY_ID) {    
    plugins.push({
    resolve: 'gatsby-plugin-iubenda-cookie-footer',
    options: {
        iubendaOptions: {
          "lang":"en",
          "siteId":IUBENDA_SITE_ID,
          "cookiePolicyId":COOKIE_POLICY_ID, 
          "banner":{ "acceptButtonDisplay":true,"customizeButtonDisplay":true,"position":"float-top-center","acceptButtonColor":"#0073CE","acceptButtonCaptionColor":"white","customizeButtonColor":"#DADADA","customizeButtonCaptionColor":"#4D4D4D","textColor":"black","backgroundColor":"white" },
        },
      },
    });
  }

  return {
    siteMetadata: {
      isMediumUserDefined: !!mediumUser,
    },
    plugins,
  };
});

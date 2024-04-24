import type { GatsbyConfig } from 'gatsby';
import colors from './src/colors.json';
import { PRIVACY_POLICY_LINK } from './src/utils/constants';

const plugins: GatsbyConfig['plugins'] = [
  'gatsby-plugin-fontawesome-css',
  'gatsby-plugin-react-helmet',
  'gatsby-plugin-typescript',
  'gatsby-plugin-styled-components',
  'gatsby-transformer-remark',
  'gatsby-plugin-image',
  {
    resolve: 'gatsby-plugin-manifest',
    options: {
      name: 'andxet.dev',
      short_name: 'andxet.dev',
      start_url: '/',
      background_color: colors.background,
      theme_color_in_head: false,
      display: 'minimal-ui',
      icon: 'icon.png',
    },
  },
  {
    resolve: 'gatsby-source-contentful',
    options: {
      accessToken: process.env.ACCESS_TOKEN,
      spaceId: process.env.SPACE_ID,
    },
  },
  {
    resolve: `gatsby-omni-font-loader`,
    options: {
      enableListener: true,
      preconnect: [`https://fonts.googleapis.com`, `https://fonts.gstatic.com`],
      web: [
        {
          name: `Cabin`,
          file: `https://fonts.googleapis.com/css2?family=Cabin:wght@400;600&display=swap`,
        },
      ],
    },
  },
];

if (process.env.ANALYTICS_ID) {
  plugins.push({
    resolve: 'gatsby-plugin-google-analytics',
    options: { trackingId: process.env.ANALYTICS_ID },
  });
}

if (process.env.IUBENDA_SITE_ID && process.env.COOKIE_POLICY_ID && PRIVACY_POLICY_LINK) {  
    console.log("Activating iubenda cookie footer")  
    plugins.push({
      resolve: 'gatsby-plugin-iubenda-cookie-footer',
      options: {
          iubendaOptions: {
            "lang":"en",
            "siteId":process.env.IUBENDA_SITE_ID,
            "cookiePolicyId":process.env.COOKIE_POLICY_ID,
            "cookiePolicyUrl":PRIVACY_POLICY_LINK, 
            "banner":{ 
              "acceptButtonDisplay":true,
              "customizeButtonDisplay":true,
              "consentOnScroll":false,
              "position":"float-top-center",
              "acceptButtonColor":"#0073CE",
              "acceptButtonCaptionColor":"white",
              "customizeButtonColor":"#DADADA",
              "customizeButtonCaptionColor":"#4D4D4D",
              "textColor":"black",
              "backgroundColor":"white" },
          },
        },
    });
  }


const config: GatsbyConfig = {
  siteMetadata: {
    deterministic: false,
  },
  plugins,
};

export default config;

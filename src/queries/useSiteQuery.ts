import { graphql, useStaticQuery } from 'gatsby';
import { Landing, SocialLink } from '../types';

type QueryResponse = {
  aboutMd: {
    frontmatter: {
      name: string;
      roles: string[];
      socialLinks: SocialLink[];
    };
  };
  site: {
    siteMetadata: {
      deterministic: boolean;
      logo: string;
    };
  };
};

export const useSiteQuery = (): Landing & { deterministic: boolean; logo: string } => {
  const { aboutMd, site } = useStaticQuery<QueryResponse>(graphql`
    query SiteQuery {
      aboutMd: markdownRemark(fileAbsolutePath: { regex: "/content/about/" }) {
        frontmatter {
          name
          roles
          socialLinks {
            url
            name
            icon
          }
        }
      }
      site {
        siteMetadata {
          deterministic
          logo
        }
      }
    }
  `);

  return { ...aboutMd.frontmatter, ...site.siteMetadata };
};

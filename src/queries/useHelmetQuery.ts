import { graphql, useStaticQuery } from 'gatsby';
import { Favicon } from '../types';

type QueryResponse = {
  aboutMd: {
    frontmatter: {
      name: string;
      description: string;
      profile: string;
    };
  };
};

export const useHelmetQuery = (): { name: string; description: string; profile: { favicon16: Favicon; favicon32: Favicon; bigIcon: Favicon; appleIcon: Favicon } } => {
  const { aboutMd } = useStaticQuery<QueryResponse>(graphql`
    query HelmetQuery {
      aboutMd: markdownRemark(fileAbsolutePath: { regex: "/content/about/" }) {
        frontmatter {
          name
          description
          profile
        }
      }
    }
  `);

  const { name, description, profile } = aboutMd.frontmatter;
  return {
    name,
    description,
    profile: {
      favicon16: { src: profile },
      favicon32: { src: profile },
      bigIcon: { src: profile },
      appleIcon: { src: profile },
    },
  };
};

import { graphql, useStaticQuery } from 'gatsby';
import { AboutMe } from '../types';

type QueryResponse = {
  aboutMd: {
    rawMarkdownBody: string;
    frontmatter: {
      name: string;
      profile: string;
    };
  };
};

export const useAboutMeQuery = (): AboutMe => {
  const { aboutMd } = useStaticQuery<QueryResponse>(graphql`
    query AboutMeQuery {
      aboutMd: markdownRemark(fileAbsolutePath: { regex: "/content/about/" }) {
        rawMarkdownBody
        frontmatter {
          name
          profile
        }
      }
    }
  `);

  return {
    markdown: aboutMd.rawMarkdownBody,
    profile: {
      alt: aboutMd.frontmatter.name,
      src: aboutMd.frontmatter.profile,
    },
  };
};

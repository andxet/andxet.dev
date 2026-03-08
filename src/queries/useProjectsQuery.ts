import { graphql, useStaticQuery } from 'gatsby';
import { Project } from '../types';

type QueryResponse = {
  allMarkdownRemark: {
    nodes: {
      frontmatter: {
        name: string;
        type: string;
        date: string;
        projectUrl: string;
        repositoryUrl: string;
        logo: string;
        published: boolean;
      };
      excerpt: string;
    }[];
  };
};

export const useProjectsQuery = (): Project[] => {
  const { allMarkdownRemark } = useStaticQuery<QueryResponse>(graphql`
    query ProjectsQuery {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/projects/" }, frontmatter: { published: { eq: true } } }
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          frontmatter {
            name
            type
            date(formatString: "YYYY")
            projectUrl
            repositoryUrl
            logo
            published
          }
          excerpt(pruneLength: 200)
        }
      }
    }
  `);

  return allMarkdownRemark.nodes.map(({ frontmatter, excerpt }) => ({
    name: frontmatter.name,
    type: frontmatter.type,
    publishedDate: frontmatter.date,
    homepage: frontmatter.projectUrl,
    repository: frontmatter.repositoryUrl,
    description: excerpt,
    logo: {
      alt: frontmatter.name,
      src: frontmatter.logo,
    },
  }));
};

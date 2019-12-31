import * as React from 'react';
import { Link } from 'gatsby';
import { BlogPagination, Posts } from '../components';
import { graphql } from 'gatsby';
import Layout from '../layouts';

const Blog = ({ data, location: { pathname }, pageContext }) => {
  const posts = (data && data.posts && data.posts.edges) || [];
  const pageCount =
    (posts.length && Math.ceil(data.posts.totalCount / 10)) || 0;

  const title = pageContext.tag ? '#' + pageContext.tag : pageContext.month;

  return (
    <main>
      {title && <h2>{title}</h2>}
      {!title && (
        <BlogPagination Link={Link} pathname={pathname} pageCount={pageCount} />
      )}
      <Posts posts={posts.map(post => post.node)} />
      {!title && (
        <BlogPagination Link={Link} pathname={pathname} pageCount={pageCount} />
      )}
    </main>
  );
};

export default props => (
  <Layout {...props}>
    <Blog {...props} />
  </Layout>
);

export const pageQuery = graphql`
  query PageBlog {
    site: site {
      siteMetadata {
        title
      }
    }

    # Get tags
    tags: allMarkdownRemark {
      ...tagsFragment
    }

    # Get calendar
    calendar: allMarkdownRemark {
      ...calendarFragment
    }

    # Get posts
    posts: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___updatedDate, frontmatter___title] }
      filter: {
        frontmatter: { draft: { ne: true } }
        fileAbsolutePath: { regex: "/blog/" }
      }
      limit: 10
    ) {
      ...blogFeedFragment
    }
  }
`;

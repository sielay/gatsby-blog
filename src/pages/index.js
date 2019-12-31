import * as React from 'react';
import { graphql, Link } from 'gatsby';
import { Posts } from '../components/Posts';
import Layout from '../layouts';
import { Calendar, Tags } from '../components';

const IndexPage = ({ data: { posts, tags, calendar } }) => {

  return (
    <main>
      <Posts posts={posts.edges.map(post => post.node)} />
      <Link
        as={`button`}
        to={'/blog'}
      >
        Read more
    </Link>
      <Tags tags={(tags && tags.group) || []} tag={null} />
      <Calendar entries={(calendar && calendar.group) || []} />
    </main>
  );
};

export default props => (
  <Layout {...props}>
    <IndexPage {...props} />
  </Layout>
);

export const pageQuery = graphql`
  query PageIndexBlog {
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
      limit: 5
    ) {
      ...blogFeedFragment
    }

  }
`;

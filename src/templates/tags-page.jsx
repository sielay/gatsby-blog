import Blog from '../pages/blog'
import { graphql } from 'gatsby'
import '../components/Posts';

export default Blog

export const pageQuery = graphql`
  query TemplateTagPage($tag: String) {
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
        frontmatter: { draft: { ne: true }, tags: { in: [$tag] } }
        fileAbsolutePath: { regex: "/blog/" }
      }
    ) {
      ...blogFeedFragment
    }
  }
`

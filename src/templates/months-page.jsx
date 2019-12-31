import Blog from '../pages/blog'
import { graphql } from 'gatsby'

export default Blog

export const pageQuery = graphql`
  query TemplateMonthPage($month: String) {

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
        frontmatter: { draft: { ne: true }, yearWithMonth: { eq: $month } }
        fileAbsolutePath: { regex: "/blog/" }
      }
    ) {
      ...blogFeedFragment
    }
  }
`

import * as React from 'react';
import { Link } from 'gatsby';
import rehypeReact from 'rehype-react';
import InstagramEmbed from 'react-instagram-embed';
import YouTube from 'react-youtube-embed';
import { Posts } from '../components';
import { graphql } from 'gatsby';
import Layout from '../layouts';

class Iframe extends React.Component {
    shouldComponentUpdate() {
        return false;
    }
    render() {
        return (
            <iframe
                title={this.props.title || this.props.src || this.props.url}
                src={this.props.src || this.props.url}
                style={{
                    width: '100%',
                    border: 'none',
                    minHeight: (this.props.height || '100') + 'px'
                }}
            />
        );
    }
}



const components = {
    iframe: Iframe,
    'instagram-embed': (props) => (
        <div class="insta">{
            props.url && props.url.split(',').map((url, k) => <InstagramEmbed key={k} url={`https://www.instagram.com/p/${url}/`} maxWidth={320} hideCaption={true}></InstagramEmbed>)}
        </div>
    ),
    'youtube-embed': YouTube
};

const componentNames = Object.keys(components);

const renderAstFunction = new rehypeReact({
    createElement: React.createElement,
    components
}).Compiler;

const renderAst = node => {
    node.children = node.children.map(n => {
        if (
            n.tagName === 'p' &&
            n.children
                .map(m => m.tagName)
                .filter(m => componentNames.indexOf(m) !== -1).length > 0
        ) {
            return n.children[0];
        } else {
            return n;
        }
    });
    return renderAstFunction(node);
};

const Tags = ({ tags }) =>
    tags.map(tag => (
        <Link
            to={`/blog/tags/${tag}/`}
            title={tag}
            key={tag}

        >
            {tag}
        </Link>
    ))
    ;

const BlogPost = ({
    data: {
        recents,
        posts,
        post: { frontmatter, htmlAst, timeToRead, fields }
    }
}) => {
    const myIndex = (posts ? posts.edges : []).findIndex(
        ({
            node: {
                fields: { slug }
            }
        }) => slug === fields.slug
    );

    const previousAndNext =
        myIndex !== -1
            ? [posts.edges[myIndex - 1], posts.edges[myIndex + 1]]
                .filter(Boolean)
                .map(({ node }) => node)
            : [];

    const { title, updatedDate } = frontmatter;

    return (
        <React.Fragment>
            <main>
                <article>
                    <h1>{title}</h1>
                    <p className="small">
                        {updatedDate} - {timeToRead} min read
          </p>

                    {renderAst(htmlAst)}

                    <div>
                        <Tags tags={frontmatter.tags} />
                    </div>
                </article>
            </main>
            <aside>
                <div>
                    <h3>Previous &amp; Next</h3>
                    <Posts posts={previousAndNext} />
                </div>

                <h3>Recent</h3>
                <Posts posts={(recents ? recents.edges : []).map(({ node }) => node)} />

            </aside>
        </React.Fragment>
    );
};

export default props => (
    <Layout {...props}>
        <BlogPost {...props} />
    </Layout>
);

export const pageQuery = graphql`
  query TemplateBlogPost($slug: String!) {
    # Get tags
    tags: allMarkdownRemark {
      ...tagsFragment
    }

    # Get calendar
    calendar: allMarkdownRemark {
      ...calendarFragment
    }

    site: site {
      siteMetadata {
        title
      }
    }

    posts: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___updatedDate] }
      filter: { fileAbsolutePath: { regex: "/blog/" } }
    ) {
      ...blogFeedFragment
    }

    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
      excerpt
      timeToRead
      fields {
        slug
      }
      frontmatter {
        tags
        author {
          id
          bio
          twitter
          avatar {
            children {
              ... on ImageSharp {
                fixed(width: 80, height: 80, quality: 100) {
                  ...GatsbyImageSharpFixed_withWebp
                }
              }
            }
          }
        }
        title
        source
        sourceType
        updatedDate(formatString: "MMM D, YYYY")
        image {
          children {
            ... on ImageSharp {
              fixed(width: 900, height: 300, quality: 100, cropFocus: CENTER) {
                ...GatsbyImageSharpFixed_withWebp
              }
            }
          }
        }
      }
    }
    recents: allMarkdownRemark(
      filter: {
        fields: { slug: { ne: $slug } }
        frontmatter: { draft: { ne: true } }
        fileAbsolutePath: { regex: "/blog/" }
      }
      sort: { order: DESC, fields: [frontmatter___updatedDate] }
      limit: 4
    ) {
      ...blogFeedFragment
    }
  }
`;

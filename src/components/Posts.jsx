import * as React from 'react';
import { Link } from 'gatsby';
import { get, kebabCase } from 'lodash';

const Post = ({
  cover: { src, srcSet },
  post: {
    frontmatter: { title, updatedDate, tags, createdDate },
    timeToRead,
    fields: { slug },
    excerpt
  }
}) => (
    <div key={slug}>
      <div>
        <h3>
          <Link to={slug}>{title}</Link>
        </h3>
        <div>
          {tags
            ? tags.map(tag => (
              <Link key={tag} to={'/blog/tags/' + kebabCase(tag)} size={'mini'}>
                {tag}
              </Link>
            ))
            : null}
          {timeToRead} min read - {updatedDate !== createdDate ? `${createdDate}, updated ${updatedDate}` : updatedDate}
        </div>
        <p>
          {excerpt} <Link to={slug}>read more…</Link>
        </p>
        {src ? <img
          src={src}
          srcSet={srcSet}
          alt={title}
        /> : null}
      </div>
    </div>
  );
export const Posts = ({ posts }) => (
  <div
  >
    {posts.map((post, key) => {
      const cover = get(post.frontmatter, 'image.children.0.fixed', {});
      return <Post post={post} key={key} cover={cover} />;
    })}
  </div>
);

export const query = graphql`
  fragment blogFeedFragment on MarkdownRemarkConnection {
    totalCount
    edges {
      node {
        excerpt
        timeToRead
        fields {
          slug
        }
        frontmatter {
          title
          updatedDate(formatString: "DD MMMM, YYYY")
          createdDate(formatString: "DD MMMM, YYYY")
          image {
            children {
              ... on ImageSharp {
                fixed(width: 100, height: 100) {
                  ...GatsbyImageSharpFixed_withWebp
                }
              }
            }
          }
          author {
            id
            avatar {
              children {
                ... on ImageSharp {
                  fixed(width: 35, height: 35) {
                    ...GatsbyImageSharpFixed_withWebp
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

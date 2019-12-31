import * as React from 'react';
import { kebabCase } from 'lodash';
import { Link, graphql } from 'gatsby';

const Tag = ({ tag, total, current }) => {
    const isActive = tag.fieldValue === current;
    const tagLink = isActive
        ? '/blog'
        : `/blog/tags/${kebabCase(tag.fieldValue)}/`;
    return (
        <Link
            to={tagLink}
            key={tag.fieldValue}
        >
            {tag.fieldValue} ({total})
        </Link>
    );
};

export const Tags = ({ tags, tag }) => {
    const total = tags.reduce((previous, next) => previous + next.totalCount, 0);
    const tagsList = [...tags.sort(() => Math.random() - 0.5)];
    return (
        <div>
            <h3>Tags</h3>
            <div>
                {tagsList.map((next, index) => (
                    <Tag current={tag} tag={next} key={index} total={total} />
                ))}
            </div>
        </div>
    );
};

export const pageQuery = graphql`
  fragment tagsFragment on MarkdownRemarkConnection {
    group(field: frontmatter___tags) {
      fieldValue
      totalCount
    }
  }
`;

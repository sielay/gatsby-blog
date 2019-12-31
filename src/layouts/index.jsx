import React from 'react';
import Helmet from 'react-helmet';
import CookieConsent from 'react-cookie-consent';

const Layout = ({ children, data }) => {

    const description = data.post ? data.post.frontmatter.title : data.site.siteMetadata.title;
    const keywords = data.post ? data.post.frontmatter.tags : '';

    return (
        <div>
            <Helmet
                title={data.site.siteMetadata.title}
                meta={[
                    { name: 'description', content: description },
                    { name: 'keywords', content: keywords }
                ]}
            />
            {children}
            <CookieConsent
                buttonText="Sure man!!"
                style={{ background: '#2B373B', position: 'fixed', botton: '0px' }}
                buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
                expires={150}
            >
                This website uses cookies for Google Analytics, so I know if anyone
                reads it at all. No ads are served, yet.
                </CookieConsent>
        </div>
    );
};

export default Layout;

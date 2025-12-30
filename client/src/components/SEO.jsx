import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({
    title,
    description = "TEKKO - Chuyên cung cấp dụng cụ cơ khí chính xác, mũi phay, mũi khoan, chip tiện từ các thương hiệu hàng đầu như Kyocera, Guhring, Winstar.",
    ogImage = "/logo.png",
    ogType = 'website',
    schema = null
}) => {
    const location = useLocation();
    const siteName = "TEKKO - Dụng cụ cơ khí chính xác";

    useEffect(() => {
        // Update Title
        const fullTitle = title ? `${title} | ${siteName}` : siteName;
        document.title = fullTitle;

        // Helper to update meta tags
        const updateMeta = (nameOrProperty, content) => {
            if (!content) return;

            let el = document.querySelector(`meta[name="${nameOrProperty}"]`) ||
                document.querySelector(`meta[property="${nameOrProperty}"]`);

            if (!el) {
                el = document.createElement('meta');
                if (nameOrProperty.startsWith('og:') || nameOrProperty.startsWith('fb:')) {
                    el.setAttribute('property', nameOrProperty);
                } else {
                    el.setAttribute('name', nameOrProperty);
                }
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        // Standard Meta Tags
        updateMeta('description', description);
        updateMeta('keywords', "dụng cụ cơ khí, mũi phay, mũi khoan, chip tiện, kyocera, guhring, winstar, tekko vietnam");

        // OpenGraph / Facebook
        updateMeta('og:site_name', siteName);
        updateMeta('og:title', fullTitle);
        updateMeta('og:description', description);
        updateMeta('og:image', ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`);
        updateMeta('og:type', ogType);
        updateMeta('og:url', window.location.href);

        // Twitter
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:title', fullTitle);
        updateMeta('twitter:description', description);
        updateMeta('twitter:image', ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`);

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', window.location.href);

        // JSON-LD Schema
        if (schema) {
            let script = document.getElementById('search-schema');
            if (!script) {
                script = document.createElement('script');
                script.id = 'search-schema';
                script.type = 'application/ld+json';
                document.head.appendChild(script);
            }
            script.text = JSON.stringify(schema);
        } else {
            const script = document.getElementById('search-schema');
            if (script) script.remove();
        }

    }, [title, description, ogImage, ogType, location, schema]);

    return null; // This component doesn't render anything
};

export default SEO;

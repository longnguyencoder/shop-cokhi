// Centralized Site Configuration
// Update this file to change settings across the entire website

export const SITE_CONFIG = {
    // Contact Information
    contact: {
        phone: '0903 867 467',
        phoneRaw: '0903867467', // For tel: links
        hotline: 'HOTLINE: 0903 867 467',
        email: 'contact@shopcokhi.vn',
        address: 'Địa chỉ cửa hàng của bạn',
    },

    // Business Information
    business: {
        name: 'SHOP CƠ KHÍ',
        tagline: 'PROFESSIONAL TOOLS',
        description: 'Chuyên cung cấp dụng cụ cơ khí chính hãng',
    },

    // API Configuration
    api: {
        baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    },

    // Feature Flags
    features: {
        onlinePayment: false, // Set to true to enable online payment
        callToOrder: true,    // Call to order instead of cart checkout
    },
};

export default SITE_CONFIG;

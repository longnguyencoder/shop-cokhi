// Centralized Site Configuration
// Update this file to change settings across the entire website

export const SITE_CONFIG = {
    // Contact Information
    contact: {
        phone: '093 799 0519',
        phoneRaw: '0937990519', // For tel: links
        hotline: '093 799 0519',
        email: 'tekkovietnam@hotmail.com',
        address: '113 Đường số 6, Phường Bình Tân, Thành phố Hồ Chí Minh, Việt Nam.',
        mst: '0317633925',
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

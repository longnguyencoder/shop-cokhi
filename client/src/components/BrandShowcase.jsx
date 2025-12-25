import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

const BrandShowcase = () => {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await api.get('/brands/');
                setBrands(res.data);
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };
        fetchBrands();
    }, []);

    if (brands.length === 0) return null;

    // Double the brands for seamless marquee
    const marqueeBrands = [...brands, ...brands];

    return (
        <div className="py-12 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4 mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-[#1B2631] uppercase tracking-tight text-center flex items-center justify-center gap-3">
                    <span className="h-1 w-12 bg-[#EDB917]"></span>
                    THƯƠNG HIỆU ĐỐI TÁC
                    <span className="h-1 w-12 bg-[#EDB917]"></span>
                </h2>
            </div>

            <div className="relative flex whitespace-nowrap">
                <motion.div
                    className="flex gap-8 items-center"
                    animate={{ x: [0, "-50%"] }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {marqueeBrands.map((brand, idx) => (
                        <Link
                            key={`${brand.id}-${idx}`}
                            to={`/?brand_id=${brand.id}`}
                            className="bg-white px-8 py-6 rounded-xl border border-gray-100 hover:border-[#EDB917] hover:shadow-premium transition-all group flex items-center justify-center min-w-[180px] h-[100px] flex-shrink-0"
                        >
                            {brand.logo_url ? (
                                <img
                                    src={brand.logo_url.startsWith('http') ? brand.logo_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${brand.logo_url}`}
                                    alt={brand.name}
                                    className="max-h-12 max-w-full object-contain transition-transform group-hover:scale-110"
                                />
                            ) : (
                                <span className="text-sm font-black text-gray-400 group-hover:text-primary transition-colors uppercase italic">
                                    {brand.name}
                                </span>
                            )}
                        </Link>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default BrandShowcase;

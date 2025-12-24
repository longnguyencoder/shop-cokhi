import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

    return (
        <div className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-black text-[#1B2631] uppercase tracking-tight text-center mb-8 flex items-center justify-center gap-3">
                    <span className="h-1 w-12 bg-[#EDB917]"></span>
                    THƯƠNG HIỆU NỔI BẬT
                    <span className="h-1 w-12 bg-[#EDB917]"></span>
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {brands.map((brand) => (
                        <Link
                            key={brand.id}
                            to={`/?brand_id=${brand.id}`}
                            className="bg-white p-6 rounded-lg border border-gray-100 hover:border-[#EDB917] hover:shadow-xl transition-all group flex items-center justify-center min-h-[120px]"
                        >
                            {brand.logo_url ? (
                                <img
                                    src={brand.logo_url}
                                    alt={brand.name}
                                    className="max-h-16 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all"
                                />
                            ) : (
                                <span className="text-lg font-black text-gray-400 group-hover:text-[#EDB917] transition-colors uppercase">
                                    {brand.name}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrandShowcase;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import api from '../api/axios';

const CategoryGrid = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories/');
                setCategories(res.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    if (categories.length === 0) return null;

    return (
        <div className="py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-black text-[#1B2631] uppercase tracking-tight mb-8 flex items-center gap-3">
                    <span className="h-1 w-12 bg-[#EDB917]"></span>
                    DANH MỤC SẢN PHẨM
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/?category_id=${category.id}`}
                            className="group bg-white border-2 border-gray-100 hover:border-[#EDB917] rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all"
                        >
                            <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                                {category.image_url ? (
                                    <img
                                        src={category.image_url.startsWith('http') ? category.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${category.image_url}`}
                                        alt={category.name}
                                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <Package className="h-20 w-20 text-gray-200 group-hover:text-[#EDB917]/20 group-hover:scale-110 transition-all duration-500" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2631]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <span className="text-[10px] text-white font-black uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-300">Xem sản phẩm</span>
                                </div>
                            </div>
                            <div className="p-4 bg-white">
                                <h3 className="font-black text-[#1B2631] group-hover:text-[#EDB917] transition-colors uppercase text-sm flex items-center justify-between">
                                    {category.name}
                                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </h3>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                                    {category.product_count || 0} sản phẩm
                                </div>
                                {category.description && (
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                        {category.description}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryGrid;

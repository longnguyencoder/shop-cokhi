import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import api from '../api/axios';

const DynamicMegaMenu = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeMenu, setActiveMenu] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    api.get('/categories/'),
                    api.get('/products/?limit=100')
                ]);
                setCategories(catRes.data);
                setProducts(prodRes.data);
            } catch (error) {
                console.error('Error fetching menu data:', error);
            }
        };
        fetchData();
    }, []);

    // Get top-level categories (no parent)
    const topCategories = categories.filter(cat => !cat.parent_id);

    // Get children of a category
    const getChildren = (parentId) => {
        return categories.filter(cat => cat.parent_id === parentId);
    };

    // Get products in a category
    const getProductsInCategory = (categoryId) => {
        return products.filter(p => p.category_id === categoryId).slice(0, 5);
    };

    return (
        <nav className="bg-[#1B2631] border-b border-white/10">
            <div className="container mx-auto px-4">
                <ul className="flex items-center gap-1">
                    {/* View All Products Link */}
                    <li>
                        <Link
                            to="/products"
                            className="flex items-center gap-2 px-4 py-3 text-white hover:bg-[#EDB917] hover:text-[#1B2631] transition-all font-black uppercase text-xs tracking-wider"
                        >
                            📦 Xem tất cả
                        </Link>
                    </li>

                    {/* Promotions Link */}
                    <li>
                        <Link
                            to="/promotions"
                            className="flex items-center gap-2 px-4 py-3 text-white hover:bg-[#E31837] hover:text-white bg-[#E31837]/20 transition-all font-black uppercase text-xs tracking-wider animate-pulse"
                        >
                            🔥 Khuyến mãi
                        </Link>
                    </li>

                    {topCategories.map((category) => {
                        const children = getChildren(category.id);
                        const hasChildren = children.length > 0;

                        return (
                            <li
                                key={category.id}
                                className="relative group"
                                onMouseEnter={() => setActiveMenu(category.id)}
                                onMouseLeave={() => setActiveMenu(null)}
                            >
                                <Link
                                    to={`/?category_id=${category.id}`}
                                    className="flex items-center gap-2 px-4 py-3 text-white hover:bg-[#EDB917] hover:text-[#1B2631] transition-all font-black uppercase text-xs tracking-wider"
                                >
                                    {category.name}
                                    {hasChildren && <ChevronDown className="h-4 w-4" />}
                                </Link>

                                {/* Mega Menu Dropdown */}
                                {hasChildren && activeMenu === category.id && (
                                    <div className="absolute top-full left-0 bg-white shadow-2xl border border-gray-100 min-w-[800px] z-50 rounded-b-lg">
                                        <div className="grid grid-cols-4 gap-6 p-6">
                                            {children.map((child) => {
                                                const childProducts = getProductsInCategory(child.id);

                                                return (
                                                    <div key={child.id} className="space-y-3">
                                                        <Link
                                                            to={`/?category_id=${child.id}`}
                                                            className="block font-black text-[#1B2631] uppercase text-sm hover:text-[#EDB917] transition-colors border-b-2 border-[#EDB917] pb-2"
                                                        >
                                                            {child.name}
                                                        </Link>

                                                        {childProducts.length > 0 && (
                                                            <ul className="space-y-1.5">
                                                                {childProducts.map((product) => (
                                                                    <li key={product.id}>
                                                                        <Link
                                                                            to={`/product/${product.slug}`}
                                                                            className="text-xs text-gray-600 hover:text-[#EDB917] hover:translate-x-1 transition-all block font-bold"
                                                                        >
                                                                            • {product.name}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
};

export default DynamicMegaMenu;

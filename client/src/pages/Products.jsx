import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronDown, Package, ShoppingCart } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/Skeleton';
import SEO from '../components/SEO';

const Products = ({ onAddToCart }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);

    // Filter state
    const [filters, setFilters] = useState({
        search: searchParams.get('q') || '',
        category_id: searchParams.get('category_id') || '',
        brand_id: searchParams.get('brand_id') || '',
        min_price: searchParams.get('min_price') || '',
        max_price: searchParams.get('max_price') || '',
        in_stock: searchParams.get('in_stock') === 'true',
        sort: searchParams.get('sort') || 'name_asc',
        page: parseInt(searchParams.get('page')) || 1
    });

    const ITEMS_PER_PAGE = 12;

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, brandRes] = await Promise.all([
                    api.get('/categories/'),
                    api.get('/brands/')
                ]);
                setCategories(catRes.data);
                setBrands(brandRes.data);
            } catch (error) {
                console.error('Error fetching filter data:', error);
            }
        };
        fetchData();
    }, []);

    // Fetch products when filters change
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (filters.search) params.append('q', filters.search);
                if (filters.category_id) params.append('category_id', filters.category_id);
                if (filters.brand_id) params.append('brand_id', filters.brand_id);
                // Fetch all matching products for client-side sorting/filtering/pagination
                params.append('limit', 1000);

                const res = await api.get(`/products/?${params.toString()}`);
                let productsData = res.data;

                // Client-side filtering for price range and stock
                if (filters.min_price) {
                    productsData = productsData.filter(p => p.price >= parseFloat(filters.min_price));
                }
                if (filters.max_price) {
                    productsData = productsData.filter(p => p.price <= parseFloat(filters.max_price));
                }
                if (filters.in_stock) {
                    productsData = productsData.filter(p => p.in_stock);
                }

                // Client-side sorting
                const sortedProducts = [...productsData].sort((a, b) => {
                    switch (filters.sort) {
                        case 'price_asc':
                            return a.price - b.price;
                        case 'price_desc':
                            return b.price - a.price;
                        case 'name_asc':
                            return a.name.localeCompare(b.name);
                        case 'name_desc':
                            return b.name.localeCompare(a.name);
                        default:
                            return 0;
                    }
                });

                setTotalProducts(sortedProducts.length);

                // Client-side pagination slice
                const startIndex = (filters.page - 1) * ITEMS_PER_PAGE;
                const paginatedProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

                setProducts(paginatedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        // Update URL params
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== '' && value !== false) {
                params.set(key, value.toString());
            }
        });
        setSearchParams(params);
    }, [filters]);

    const updateFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: key === 'page' ? value : 1
        }));
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            category_id: '',
            brand_id: '',
            min_price: '',
            max_price: '',
            in_stock: false,
            sort: 'name_asc',
            page: 1
        });
    };

    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

    const currentCategoryName = filters.category_id
        ? categories.find(c => c.id === parseInt(filters.category_id))?.name
        : 'Tất cả sản phẩm';

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <SEO
                title={currentCategoryName}
                description={`Khám phá danh sách ${currentCategoryName} chính hãng tại TEKKO. Dụng cụ cơ khí chính xác chất lượng cao, giải pháp tối ưu cho gia công cơ khí.`}
            />
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-[#1B2631] uppercase tracking-tight mb-2">
                        {filters.category_id ? `Danh mục: ${currentCategoryName}` : 'Tất cả sản phẩm'}
                    </h1>
                    <p className="text-gray-600 font-bold">
                        Hiển thị {totalProducts} sản phẩm chất lượng cao
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Sidebar */}
                    <aside className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-4">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-black text-[#1B2631] uppercase flex items-center gap-2">
                                    <SlidersHorizontal className="h-5 w-5 text-[#EDB917]" />
                                    Bộ lọc
                                </h2>
                                <button
                                    onClick={resetFilters}
                                    className="text-xs text-[#E31837] hover:underline font-bold uppercase"
                                >
                                    Xóa lọc
                                </button>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <label className="block text-xs font-black text-gray-700 uppercase mb-2">
                                    🔍 Tìm kiếm
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tên sản phẩm, SKU..."
                                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-100 rounded-lg focus:border-[#EDB917] outline-none transition-all font-bold text-sm"
                                        value={filters.search}
                                        onChange={(e) => updateFilter('search', e.target.value)}
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <label className="block text-xs font-black text-gray-700 uppercase mb-2">
                                    📁 Danh mục
                                </label>
                                <select
                                    className="w-full p-2 border-2 border-gray-100 rounded-lg focus:border-[#EDB917] outline-none transition-all font-bold text-sm"
                                    value={filters.category_id}
                                    onChange={(e) => updateFilter('category_id', e.target.value)}
                                >
                                    <option value="">Tất cả danh mục</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Brand Filter */}
                            <div className="mb-6">
                                <label className="block text-xs font-black text-gray-700 uppercase mb-2">
                                    🏭 Thương hiệu
                                </label>
                                <select
                                    className="w-full p-2 border-2 border-gray-100 rounded-lg focus:border-[#EDB917] outline-none transition-all font-bold text-sm"
                                    value={filters.brand_id}
                                    onChange={(e) => updateFilter('brand_id', e.target.value)}
                                >
                                    <option value="">Tất cả thương hiệu</option>
                                    {brands.map(brand => (
                                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-xs font-black text-gray-700 uppercase mb-2">
                                    💰 Khoảng giá
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        placeholder="Từ"
                                        className="w-full p-2 border-2 border-gray-100 rounded-lg focus:border-[#EDB917] outline-none transition-all font-bold text-sm"
                                        value={filters.min_price}
                                        onChange={(e) => updateFilter('min_price', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Đến"
                                        className="w-full p-2 border-2 border-gray-100 rounded-lg focus:border-[#EDB917] outline-none transition-all font-bold text-sm"
                                        value={filters.max_price}
                                        onChange={(e) => updateFilter('max_price', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* In Stock */}
                            <div className="mb-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-[#EDB917] border-gray-300 rounded focus:ring-[#EDB917]"
                                        checked={filters.in_stock}
                                        onChange={(e) => updateFilter('in_stock', e.target.checked)}
                                    />
                                    <span className="text-sm font-bold text-gray-700">Chỉ hàng còn trong kho</span>
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        {/* Sort Bar */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6 flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-600">
                                Hiển thị {products.length} sản phẩm
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-600">Sắp xếp:</span>
                                <select
                                    className="p-2 border-2 border-gray-100 rounded-lg focus:border-[#EDB917] outline-none transition-all font-bold text-sm"
                                    value={filters.sort}
                                    onChange={(e) => updateFilter('sort', e.target.value)}
                                >
                                    <option value="name_asc">Tên A-Z</option>
                                    <option value="name_desc">Tên Z-A</option>
                                    <option value="price_asc">Giá thấp → cao</option>
                                    <option value="price_desc">Giá cao → thấp</option>
                                </select>
                            </div>
                        </div>

                        {/* Loading */}
                        {loading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        )}

                        {/* Products Grid */}
                        {!loading && products.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={onAddToCart}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && products.length === 0 && (
                            <div className="text-center py-20">
                                <Package className="h-20 w-20 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-xl font-black text-gray-400 mb-2">Không tìm thấy sản phẩm</h3>
                                <p className="text-gray-500 font-bold mb-6">Thử điều chỉnh bộ lọc hoặc tìm kiếm khác</p>
                                <button
                                    onClick={resetFilters}
                                    className="bg-[#EDB917] hover:bg-[#d4a615] text-[#1B2631] px-6 py-3 rounded-lg font-black uppercase text-sm transition-all"
                                >
                                    Xóa tất cả bộ lọc
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <div className="mt-8 flex justify-center gap-2">
                                <button
                                    onClick={() => updateFilter('page', Math.max(1, filters.page - 1))}
                                    disabled={filters.page === 1}
                                    className="px-4 py-2 border-2 border-gray-200 rounded-lg font-bold text-sm hover:border-[#EDB917] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    « Trước
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => updateFilter('page', i + 1)}
                                        className={`px-4 py-2 border-2 rounded-lg font-bold text-sm transition-all ${filters.page === i + 1
                                            ? 'bg-[#EDB917] border-[#EDB917] text-[#1B2631]'
                                            : 'border-gray-200 hover:border-[#EDB917]'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => updateFilter('page', Math.min(totalPages, filters.page + 1))}
                                    disabled={filters.page === totalPages}
                                    className="px-4 py-2 border-2 border-gray-200 rounded-lg font-bold text-sm hover:border-[#EDB917] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Sau »
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

import ErrorBoundary from '../components/ErrorBoundary';

const ProductsWithBoundary = (props) => (
    <ErrorBoundary>
        <Products {...props} />
    </ErrorBoundary>
);

export default ProductsWithBoundary;

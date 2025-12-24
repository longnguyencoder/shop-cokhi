import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import HeroSlider from '../components/HeroSlider';
import BrandShowcase from '../components/BrandShowcase';
import CategoryGrid from '../components/CategoryGrid';
import ProductCarousel from '../components/ProductCarousel';

const Home = ({ onAddToCart }) => {
    const [searchParams] = useSearchParams();
    const [newProducts, setNewProducts] = useState([]);
    const [saleProducts, setSaleProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Check if we're in search/filter mode
    const searchTerm = searchParams.get('q');
    const categoryId = searchParams.get('category_id');
    const brandId = searchParams.get('brand_id');
    const isFiltering = searchTerm || categoryId || brandId;

    useEffect(() => {
        const fetchHomeData = async () => {
            setLoading(true);
            try {
                // Fetch new products (limit 8)
                const newRes = await api.get('/products/', {
                    params: { limit: 8 }
                });
                setNewProducts(newRes.data);

                // Fetch sale products (limit 8)
                const saleRes = await api.get('/products/', {
                    params: { on_sale: true, limit: 8 }
                });
                setSaleProducts(saleRes.data);
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!isFiltering) {
            fetchHomeData();
        }
    }, [isFiltering]);

    // If filtering, show filtered products (keep old behavior)
    if (isFiltering) {
        return <FilteredProductsView searchParams={searchParams} onAddToCart={onAddToCart} />;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Slider */}
            <HeroSlider />

            {/* Brand Showcase */}
            <BrandShowcase />

            {/* Category Grid */}
            <div className="container mx-auto px-4">
                <CategoryGrid />
            </div>

            {/* New Products Carousel */}
            <div className="container mx-auto px-4">
                <ProductCarousel
                    title="Sản phẩm mới nhất"
                    products={newProducts}
                    viewAllLink="/products"
                />
            </div>

            {/* Sale Products Carousel */}
            {saleProducts.length > 0 && (
                <div className="container mx-auto px-4">
                    <ProductCarousel
                        title="Sản phẩm khuyến mãi"
                        products={saleProducts}
                        viewAllLink="/products?on_sale=true"
                    />
                </div>
            )}

            {/* Call to Action Section */}
            <div className="bg-gradient-to-r from-[#1B2631] to-[#2c3e50] py-16 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase">
                        Cần tư vấn sản phẩm?
                    </h2>
                    <p className="text-xl text-[#EDB917] mb-8 font-bold">
                        Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn 24/7
                    </p>
                    <a
                        href="tel:0903867467"
                        className="inline-block bg-[#EDB917] hover:bg-[#d4a615] text-[#1B2631] px-8 py-4 rounded-lg font-black uppercase tracking-wider text-sm transition-all transform hover:scale-105 shadow-xl"
                    >
                        Gọi ngay: 0903 867 467
                    </a>
                </div>
            </div>
        </div>
    );
};

// Filtered Products View Component (old behavior)
const FilteredProductsView = ({ searchParams, onAddToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const searchTerm = searchParams.get('q');
    const categoryId = searchParams.get('category_id');
    const brandId = searchParams.get('brand_id');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {};
                if (searchTerm) params.q = searchTerm;
                if (categoryId) params.category_id = categoryId;
                if (brandId) params.brand_id = brandId;

                const res = await api.get('/products/', { params });
                setProducts(res.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchTerm, categoryId, brandId]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-black text-[#1B2631] mb-6 uppercase">
                {searchTerm && `Kết quả tìm kiếm: "${searchTerm}"`}
                {categoryId && !searchTerm && 'Sản phẩm theo danh mục'}
                {brandId && !searchTerm && !categoryId && 'Sản phẩm theo thương hiệu'}
            </h2>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#EDB917] border-t-transparent"></div>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">Không tìm thấy sản phẩm nào</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                    ))}
                </div>
            )}
        </div>
    );
};

// Product Card Component
const ProductCard = ({ product, onAddToCart }) => {
    const { Package, ShoppingCart, Search: SearchIcon } = require('lucide-react');
    const { Link } = require('react-router-dom');

    return (
        <div className="bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex flex-col relative translate-y-0 hover:-translate-y-2">
            <Link to={`/product/${product.slug}`} className="absolute inset-0 z-10"></Link>
            <div className="absolute top-0 right-0 bg-[#EDB917] text-[#1B2631] text-[11px] font-black px-4 py-2 rounded-bl-xl shadow z-20 uppercase tracking-tighter skew-x-[-10deg] pointer-events-none">
                {product.on_sale ? 'SALE' : 'NEW'}
            </div>

            <div className="h-48 sm:h-56 md:h-64 bg-gray-50 relative overflow-hidden flex items-center justify-center border-b border-gray-50">
                {product.image_url ? (
                    <img
                        src={product.image_url.startsWith('http') ? product.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${product.image_url}`}
                        alt={product.name}
                        className="h-full w-full object-contain p-4 sm:p-6 md:p-8 group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <Package className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 text-gray-200 group-hover:scale-125 group-hover:text-[#EDB917]/10 transition-all duration-700 ease-out" />
                )}
                <div className="absolute top-4 left-4 z-20 pointer-events-none">
                    <span className="bg-[#E31837] text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest rounded-sm">
                        {product.in_stock ? 'Mới về' : 'Hết hàng'}
                    </span>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col relative bg-white">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">{product.sku}</span>
                    <span className="text-[10px] text-[#EDB917] font-black uppercase tracking-widest">In Stock</span>
                </div>
                <h3 className="font-black text-[#1B2631] group-hover:text-[#EDB917] transition-colors mb-4 line-clamp-2 min-h-[3rem] leading-tight uppercase text-sm tracking-tight italic">
                    {product.name}
                </h3>
                <div className="mt-auto">
                    <div className="text-2xl font-black text-[#E31837] mb-6 pt-4 border-t border-gray-50">
                        {product.price > 0 ? `${product.price.toLocaleString()} VNĐ` : 'LIÊN HỆ'}
                    </div>
                    <div className="flex gap-2 relative z-20">
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(product); }}
                            className="flex-1 bg-[#EDB917] hover:bg-[#d4a615] text-[#1B2631] py-3 rounded-sm font-black text-[11px] transition-all flex items-center justify-center gap-2 transform active:scale-90 shadow-md uppercase tracking-tighter"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            LIÊN HỆ MUA
                        </button>
                        <Link
                            to={`/product/${product.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-12 bg-[#1B2631] hover:bg-[#2c3e50] text-white rounded-sm flex items-center justify-center transition-all transform active:scale-90 shadow-md"
                        >
                            <SearchIcon className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

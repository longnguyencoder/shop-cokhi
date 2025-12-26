import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, ShoppingCart, Package } from 'lucide-react';
import api from '../api/axios';
import SITE_CONFIG from '../config/site';
import HeroSlider from '../components/HeroSlider';
import BrandShowcase from '../components/BrandShowcase';
import CategoryGrid from '../components/CategoryGrid';
import ProductCarousel from '../components/ProductCarousel';
import ProductCard from '../components/ProductCard';

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

            {/* Stats Section */}
            <div className="relative -mt-12 z-20 container mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-premium p-8 md:p-12 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 border border-white/20">
                    <div className="text-center group">
                        <div className="text-4xl md:text-5xl font-black text-navy mb-2 group-hover:text-primary transition-colors">15+</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Năm Kinh Nghiệm</div>
                    </div>
                    <div className="text-center group border-l border-gray-100">
                        <div className="text-4xl md:text-5xl font-black text-navy mb-2 group-hover:text-primary transition-colors">5000+</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sản Phẩm Chính Hãng</div>
                    </div>
                    <div className="text-center group border-l border-gray-100 lg:border-l lg:border-gray-100">
                        <div className="text-4xl md:text-5xl font-black text-navy mb-2 group-hover:text-primary transition-colors">24/7</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Hỗ Trợ Kỹ Thuật</div>
                    </div>
                    <div className="text-center group border-l border-gray-100">
                        <div className="text-4xl md:text-5xl font-black text-navy mb-2 group-hover:text-primary transition-colors">63</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Tỉnh Thành Giao Hàng</div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="py-24 bg-gray-50/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-4">Cam Kết Thương Hiệu</h3>
                        <h2 className="text-4xl font-black text-navy uppercase italic tracking-tighter">Tại Sao Nên Chọn TEKKO VIỆT NAM?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-premium transition-all border border-gray-100 group">
                            <div className="w-16 h-16 bg-navy text-primary rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <Package className="h-8 w-8" />
                            </div>
                            <h4 className="text-xl font-black text-navy mb-4 uppercase italic">Sản Phẩm Chính Hãng</h4>
                            <p className="text-gray-500 font-medium leading-relaxed">Chúng tôi cam kết cung cấp 100% dụng cụ từ các thương hiệu hàng đầu thế giới như Kyocera, Guhring, Winstar.</p>
                        </div>
                        <div className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-premium transition-all border border-gray-100 group">
                            <div className="w-16 h-16 bg-primary text-navy rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <SearchIcon className="h-8 w-8" />
                            </div>
                            <h4 className="text-xl font-black text-navy mb-4 uppercase italic">Tư Vấn Kỹ Thuật Chuẩn</h4>
                            <p className="text-gray-500 font-medium leading-relaxed">Đội ngũ chuyên gia giàu kinh nghiệm sẵn sàng hỗ trợ giải pháp gia công tối ưu nhất cho nhà xưởng của bạn.</p>
                        </div>
                        <div className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-premium transition-all border border-gray-100 group">
                            <div className="w-16 h-16 bg-navy text-primary rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <ShoppingCart className="h-8 w-8" />
                            </div>
                            <h4 className="text-xl font-black text-navy mb-4 uppercase italic">Giao Hàng Siêu Tốc</h4>
                            <p className="text-gray-500 font-medium leading-relaxed">Hệ thống kho bãi hiện đại giúp việc vận chuyển diễn ra nhanh chóng, đảm bảo tiến độ sản xuất của khách hàng.</p>
                        </div>
                    </div>
                </div>
            </div>

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
                    onAddToCart={onAddToCart}
                />
            </div>

            {/* Sale Products Carousel */}
            {saleProducts.length > 0 && (
                <div className="container mx-auto px-4">
                    <ProductCarousel
                        title="Sản phẩm khuyến mãi"
                        products={saleProducts}
                        viewAllLink="/promotions"
                        onAddToCart={onAddToCart}
                    />
                </div>
            )}

            {/* Call to Action Section */}
            <div className="bg-gradient-to-r from-[#1B2631] to-[#2c3e50] py-16 md:py-20 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4 uppercase italic tracking-tighter">
                        Cần tư vấn giải pháp gia công?
                    </h2>
                    <p className="text-sm md:text-lg text-[#EDB917] mb-8 font-bold uppercase tracking-widest">
                        Đội ngũ chuyên gia TEKKO sẵn sàng hỗ trợ bạn 24/7
                    </p>
                    <a
                        href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                        className="inline-flex items-center gap-3 bg-[#EDB917] hover:bg-[#d4a615] text-[#1B2631] px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[11px] md:text-xs transition-all transform hover:scale-105 shadow-glow"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Gọi ngay: {SITE_CONFIG.contact.phone}
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

export default Home;

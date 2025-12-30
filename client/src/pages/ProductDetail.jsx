import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Phone, MessageCircle, Check, ShieldCheck, Truck, RotateCcw, Factory, ShoppingCart, Search, Minus, Plus } from 'lucide-react';
import api from '../api/axios';
import Lightbox from '../components/Lightbox';
import SITE_CONFIG from '../config/site';

import ProductCarousel from '../components/ProductCarousel';
import SEO from '../components/SEO';

const ProductDetail = ({ onAddToCart }) => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, mouseX: 0, mouseY: 0 });
    const [isZooming, setIsZooming] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/products/${slug}`);
                setProduct(res.data);

                // Fetch related products
                if (res.data.category_id) {
                    const relatedRes = await api.get('/products/', {
                        params: {
                            category_id: res.data.category_id,
                            limit: 10
                        }
                    });
                    // Filter out current product
                    if (Array.isArray(relatedRes.data)) {
                        setRelatedProducts(relatedRes.data.filter(p => p.id !== res.data.id));
                    } else {
                        setRelatedProducts([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    // Construct Schema
    const imageUrl = (product && product.image_url && typeof product.image_url === 'string')
        ? (product.image_url.startsWith('http') ? product.image_url : `${SITE_CONFIG.api.baseUrl}${product.image_url}`)
        : '';

    const schema = product ? {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Product",
                "name": product.name,
                "image": imageUrl ? [imageUrl] : [],
                "description": product.description || `Mua ${product.name} chính hãng tại Tekko.`,
                "sku": product.sku,
                "mpn": product.sku,
                "brand": {
                    "@type": "Brand",
                    "name": product.brand?.name || "Generic"
                },
                "offers": {
                    "@type": "Offer",
                    "url": window.location.href,
                    "priceCurrency": "VND",
                    "price": product.sale_price || product.price,
                    "availability": product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                    "itemCondition": "https://schema.org/NewCondition",
                    "seller": {
                        "@type": "Organization",
                        "name": SITE_CONFIG.business.name
                    }
                }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Trang chủ",
                        "item": window.location.origin
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Sản phẩm",
                        "item": `${window.location.origin}/products`
                    },
                    ...(product.category ? [{
                        "@type": "ListItem",
                        "position": 3,
                        "name": product.category.name,
                        "item": `${window.location.origin}/products?category_id=${product.category.id}`
                    }] : [])
                ]
            }
        ]
    } : null;

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();

        // Percentages for background-position
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;

        // Relative pixels for lens position
        const mouseX = e.pageX - left - window.scrollX;
        const mouseY = e.pageY - top - window.scrollY;

        setZoomPos({ x, y, mouseX, mouseY });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20">
                <div className="flex flex-col md:flex-row gap-12 animate-pulse">
                    <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-6">
                        <div className="h-8 bg-gray-200 w-3/4"></div>
                        <div className="h-4 bg-gray-200 w-1/4"></div>
                        <div className="h-20 bg-gray-200"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-black text-navy mb-4 uppercase">Không tìm thấy sản phẩm</h2>
                <Link to="/" className="text-primary font-bold hover:underline">Quay lại trang chủ</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <SEO
                title={product.name}
                description={product.description || `Mua ${product.name} chính hãng tại TEKKO. Dụng cụ cơ khí chính xác chất lượng cao, nhập khẩu 100%.`}
                ogImage={imageUrl}
                schema={schema}
            />
            {/* Breadcrumb */}
            <nav className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 flex gap-2 items-center">
                <Link to="/" className="hover:text-primary">Trang chủ</Link>
                <span>/</span>
                <Link to="/products" className="hover:text-primary">Sản phẩm</Link>
                {product.category && (
                    <>
                        <span>/</span>
                        <Link to={`/products?category_id=${product.category.id}`} className="hover:text-primary">
                            {product.category.name}
                        </Link>
                    </>
                )}
                <span>/</span>
                <span className="text-navy">{product.name}</span>
            </nav>

            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Image */}
                    <div
                        className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] relative cursor-crosshair group"
                        onClick={() => product.image_url && setLightboxOpen(true)}
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsZooming(true)}
                        onMouseLeave={() => setIsZooming(false)}
                    >
                        {product.image_url ? (
                            <>
                                <img
                                    src={(product.image_url && typeof product.image_url === 'string' && product.image_url.startsWith('http')) ? product.image_url : `${SITE_CONFIG.api.baseUrl}${product.image_url}`}
                                    alt={product.name}
                                    className="max-h-full w-full object-contain p-4 sm:p-6 md:p-8"
                                />

                                {isZooming && (
                                    <>
                                        {/* Lens (Magnifying Glass area) - Professional transparent grey style */}
                                        <div
                                            className="absolute border border-gray-300 bg-white/40 pointer-events-none z-20 shadow-lg overflow-hidden"
                                            style={{
                                                width: '180px',
                                                height: '180px',
                                                left: `${Math.max(0, Math.min(zoomPos.mouseX - 90, (zoomPos.mouseX / (zoomPos.x / 100 || 1)) - 180))}px`, // Attempt to stay inside
                                                top: `${zoomPos.mouseY - 90}px`,
                                            }}
                                        />

                                        {/* Zoom Window - Side-by-Side portal style (Overlaying details) */}
                                        <div
                                            className="absolute top-0 left-0 md:left-[105%] w-full h-full bg-white border-2 border-gray-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] z-[100] rounded-xl hidden md:block overflow-hidden pointer-events-none"
                                            style={{
                                                backgroundImage: `url(${(product.image_url && typeof product.image_url === 'string' && product.image_url.startsWith('http')) ? product.image_url : `${SITE_CONFIG.api.baseUrl}${product.image_url}`})`,
                                                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                                backgroundSize: '450%', // High zoom for detail
                                                backgroundRepeat: 'no-repeat'
                                            }}
                                        >
                                            <div className="absolute top-4 left-4 bg-navy text-primary text-[10px] font-black px-3 py-1 rounded shadow-lg uppercase tracking-widest border border-white/20">
                                                SOi CHI TIẾT
                                            </div>
                                        </div>

                                        {/* Mobile Zoom Overlay (Full coverage) */}
                                        <div className="md:hidden absolute inset-0 bg-white z-[100] overflow-hidden pointer-events-none"
                                            style={{
                                                backgroundImage: `url(${(product.image_url && typeof product.image_url === 'string' && product.image_url.startsWith('http')) ? product.image_url : `${SITE_CONFIG.api.baseUrl}${product.image_url}`})`,
                                                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                                backgroundSize: '350%',
                                                backgroundRepeat: 'no-repeat'
                                            }}
                                        />
                                    </>
                                )}

                                {!isZooming && (
                                    <div className="absolute inset-0 bg-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <span className="bg-[#1B2631]/90 text-white border border-white/10 px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl flex items-center gap-2 transform group-hover:scale-110 transition-transform">
                                            <Search className="h-4 w-4 text-[#EDB917]" />
                                            Rê chuột để soi chi tiết
                                        </span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Package className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 text-gray-200" />
                        )}
                        <div className="absolute top-4 left-4 z-10">
                            {product.in_stock ? (
                                <span className="bg-green-100/90 backdrop-blur-sm text-green-700 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-sm border border-green-200">
                                    <Check className="h-3 w-3" /> HÀNG CÓ SẴN
                                </span>
                            ) : (
                                <span className="bg-red-100/90 backdrop-blur-sm text-red-700 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm border border-red-200">TẠM HẾT HÀNG</span>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-navy text-primary text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest shadow-sm">SKU: {product.sku}</span>
                                <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">| {product.category?.name}</span>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-black text-navy uppercase leading-tight tracking-tighter mb-6 italic group">
                                <span className="bg-gradient-to-r from-navy to-navy-light bg-[length:0%_2px] bg-left-bottom bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500">
                                    {product.name}
                                </span>
                            </h1>
                            <div className="prose prose-sm prose-slate max-w-none">
                                <p className="text-gray-500 font-medium leading-relaxed italic">
                                    {product.short_description || "Dụng cụ cơ khí chính xác chất lượng cao, nhập khẩu trực tiếp từ các thương hiệu hàng đầu thế giới, đảm bảo độ bền và hiệu suất tối ưu cho mọi quy trình sản xuất."}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 shadow-xl relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Giá bán niêm yết</p>
                                    <div className="text-4xl md:text-5xl font-black text-accent tracking-tighter leading-none">
                                        {product.price ? `${product.price.toLocaleString()} ` : 'LIÊN HỆ '}
                                        <span className="text-lg uppercase text-gray-400">₫</span>
                                    </div>
                                </div>
                                <div className="flex items-center bg-white border-2 border-gray-100 rounded-xl overflow-hidden shadow-sm h-14">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 hover:bg-gray-50 transition-colors text-navy flex items-center h-full"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-14 text-center font-black text-lg focus:outline-none bg-transparent"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 hover:bg-gray-50 transition-colors text-navy flex items-center h-full"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                                <button
                                    onClick={() => onAddToCart({ ...product, quantity })}
                                    className="w-full bg-navy hover:bg-navy-light text-white h-16 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 border border-white/10 group/cart"
                                >
                                    <ShoppingCart className="h-5 w-5 text-primary group-hover/cart:animate-bounce" />
                                    THÊM VÀO GIỎ HÀNG
                                </button>
                                <a
                                    href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                                    className="w-full bg-primary hover:bg-primary-dark text-navy h-16 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 group/call"
                                >
                                    <Phone className="h-5 w-5 group-hover/call:animate-shake" />
                                    TƯ VẤN: {SITE_CONFIG.contact.phone}
                                </a>
                            </div>

                            <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
                                <a
                                    href={`https://zalo.me/${SITE_CONFIG.contact.phoneRaw}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[10px] font-black text-[#0068FF] hover:underline uppercase tracking-tight"
                                >
                                    <MessageCircle className="h-4 w-4" /> Chat Zalo ngay
                                </a>
                                <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight italic">
                                    Hỗ trợ kỹ thuật chuyên sâu 24/7
                                </p>
                            </div>
                        </div>

                        {/* Description Section */}
                        {product.description && (
                            <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#1B2631] mb-4 flex items-center gap-2">
                                    <Package className="h-4 w-4 text-[#EDB917]" />
                                    Mô tả sản phẩm
                                </h3>
                                <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="flex flex-col items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl group hover:border-primary transition-all shadow-sm">
                                <ShieldCheck className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-navy text-center">Bảo hành<br />chính hãng</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl group hover:border-primary transition-all shadow-sm">
                                <Truck className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-navy text-center">Giao hàng<br />toàn quốc</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl group hover:border-primary transition-all shadow-sm">
                                <RotateCcw className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-navy text-center">7 ngày<br />đổi trả</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl group hover:border-primary transition-all shadow-sm">
                                <Factory className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-navy text-center">Giải pháp<br />tối ưu</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specs & More */}
                <div className="mt-20 border-t border-gray-100 pt-12">
                    <div className="flex gap-8 border-b border-gray-100 mb-8">
                        <button className="pb-4 border-b-4 border-primary text-navy font-black uppercase tracking-widest text-xs">Thông số kỹ thuật</button>
                        <button className="pb-4 text-gray-400 font-black uppercase tracking-widest text-xs hover:text-navy transition-colors">Tài liệu kỹ thuật</button>
                    </div>

                    <div className="max-w-3xl">
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-gray-100">
                                <tr className="group">
                                    <td className="py-4 font-black uppercase tracking-widest text-[10px] text-gray-400 w-1/3">Thương hiệu</td>
                                    <td className="py-4 font-bold text-navy italic">{product.brand?.name}</td>
                                </tr>

                                {/* New Technical Specifications */}
                                {product.diameter && (
                                    <tr className="group">
                                        <td className="py-4 font-black uppercase tracking-widest text-[10px] text-gray-400 w-1/3">Đường kính</td>
                                        <td className="py-4 font-bold text-navy italic">{product.diameter} mm</td>
                                    </tr>
                                )}
                                {product.length && (
                                    <tr className="group">
                                        <td className="py-4 font-black uppercase tracking-widest text-[10px] text-gray-400 w-1/3">Chiều dài</td>
                                        <td className="py-4 font-bold text-navy italic">{product.length} mm</td>
                                    </tr>
                                )}
                                {product.material && (
                                    <tr className="group">
                                        <td className="py-4 font-black uppercase tracking-widest text-[10px] text-gray-400 w-1/3">Vật liệu</td>
                                        <td className="py-4 font-bold text-navy italic">{product.material}</td>
                                    </tr>
                                )}
                                {product.flutes && (
                                    <tr className="group">
                                        <td className="py-4 font-black uppercase tracking-widest text-[10px] text-gray-400 w-1/3">Số răng</td>
                                        <td className="py-4 font-bold text-navy italic">{product.flutes}</td>
                                    </tr>
                                )}
                                {product.hardness && (
                                    <tr className="group">
                                        <td className="py-4 font-black uppercase tracking-widest text-[10px] text-gray-400 w-1/3">Độ cứng</td>
                                        <td className="py-4 font-bold text-navy italic">{product.hardness} HRC</td>
                                    </tr>
                                )}
                                {product.coating && (
                                    <tr className="group">
                                        <td className="py-4 font-black uppercase tracking-widest text-[10px] text-gray-400 w-1/3">Lớp phủ</td>
                                        <td className="py-4 font-bold text-navy italic">{product.coating}</td>
                                    </tr>
                                )}

                                {Array.isArray(product.specs) && product.specs.map(spec => (
                                    <tr key={spec.id} className="group">
                                        <td className="py-4 font-black uppercase tracking-widest text-[10px] text-gray-400 w-1/3">{spec.key}</td>
                                        <td className="py-4 font-bold text-navy italic">{spec.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 pt-12 border-t-2 border-dashed border-gray-100">
                        <ProductCarousel
                            title="Sản phẩm liên quan"
                            products={relatedProducts}
                            onAddToCart={onAddToCart}
                        />
                    </div>
                )}

            </div>
            {/* Lightbox */}
            <Lightbox
                isOpen={lightboxOpen}
                imageUrl={(product.image_url && typeof product.image_url === 'string' && product.image_url.startsWith('http')) ? product.image_url : `${SITE_CONFIG.api.baseUrl}${product.image_url}`}
                alt={product.name}
                onClose={() => setLightboxOpen(false)}
            />
        </div>
    );
};

import ErrorBoundary from '../components/ErrorBoundary';

const ProductDetailWithBoundary = (props) => (
    <ErrorBoundary>
        <ProductDetail {...props} />
    </ErrorBoundary>
);

export default ProductDetailWithBoundary;

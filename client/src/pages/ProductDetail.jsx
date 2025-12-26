import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Phone, MessageCircle, Check, ShieldCheck, Truck, RotateCcw, Factory, ShoppingCart } from 'lucide-react';
import api from '../api/axios';
import Lightbox from '../components/Lightbox';
import SITE_CONFIG from '../config/site';

import ProductCarousel from '../components/ProductCarousel';

const ProductDetail = ({ onAddToCart }) => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    console.log("ProductDetail Rendering. Slug:", slug, "Loading:", loading, "Product:", product);

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

    // Product Schema Markup
    useEffect(() => {
        if (!product) return;

        const imageUrl = (product.image_url && typeof product.image_url === 'string')
            ? (product.image_url.startsWith('http') ? product.image_url : `${SITE_CONFIG.api.baseUrl}${product.image_url}`)
            : '';

        const schema = {
            "@context": "https://schema.org/",
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
        };

        const script = document.createElement('script');
        script.type = "application/ld+json";
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [product]);

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
            {/* Breadcrumb */}
            <nav className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 flex gap-2 items-center">
                <Link to="/" className="hover:text-primary">Trang chủ</Link>
                <span>/</span>
                <span className="text-navy">{product.name}</span>
            </nav>

            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Image */}
                    <div
                        className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] relative overflow-hidden cursor-zoom-in group"
                        onClick={() => product.image_url && setLightboxOpen(true)}
                    >
                        {product.image_url ? (
                            <>
                                <img
                                    src={(product.image_url && typeof product.image_url === 'string' && product.image_url.startsWith('http')) ? product.image_url : `${SITE_CONFIG.api.baseUrl}${product.image_url}`}
                                    alt={product.name}
                                    className="max-h-full w-full object-contain p-4 sm:p-6 md:p-8 group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                                    <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-[#1B2631] px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all">
                                        Click để phóng to
                                    </span>
                                </div>
                            </>
                        ) : (
                            <Package className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 text-gray-200" />
                        )}
                        <div className="absolute top-4 left-4 z-10">
                            {product.in_stock ? (
                                <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                                    <Check className="h-3 w-3" /> Hàng có sẵn
                                </span>
                            ) : (
                                <span className="bg-red-100 text-red-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">Hết hàng</span>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-navy text-primary text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest">SKU: {product.sku}</span>
                                <span className="text-gray-400 font-bold text-xs uppercase italic">| {product.category?.name}</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-navy uppercase leading-tight tracking-tighter mb-6 underline decoration-primary decoration-4 underline-offset-8 italic">
                                {product.name}
                            </h1>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                {product.description || "Dụng cụ cơ khí chính xác chất lượng cao, nhập khẩu trực tiếp từ các thương hiệu hàng đầu thế giới."}
                            </p>
                        </div>

                        <div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-[#EDB917]/10 to-[#EDB917]/5 rounded-lg border-2 border-[#EDB917]">
                            <div className="text-3xl md:text-4xl font-black text-[#E31837]">
                                {product.price ? `${product.price.toLocaleString()} VNĐ` : 'LIÊN HỆ BÁO GIÁ'}
                            </div>

                            <div className="space-y-3">
                                <a
                                    href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                                    className="w-full bg-[#EDB917] hover:bg-[#d4a615] text-[#1B2631] h-14 rounded-lg font-black uppercase tracking-tighter shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <Phone className="h-5 w-5" />
                                    GỌI NGAY: {SITE_CONFIG.contact.phone}
                                </a>
                                <a
                                    href={`https://zalo.me/${SITE_CONFIG.contact.phoneRaw}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-[#0068FF] hover:bg-[#0052CC] text-white h-14 rounded-lg font-black uppercase tracking-tighter shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    CHAT ZALO: {SITE_CONFIG.contact.phone}
                                </a>
                                <button
                                    onClick={() => onAddToCart({ ...product, quantity })}
                                    className="w-full bg-navy hover:bg-navy-light text-white h-14 rounded-lg font-black uppercase tracking-tighter shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 border border-white/10"
                                >
                                    <ShoppingCart className="h-5 w-5 text-primary" />
                                    THÊM VÀO GIỎ HÀNG
                                </button>
                            </div>

                            <p className="text-xs text-gray-500 font-medium text-center italic">
                                Liên hệ với chúng tôi để được tư vấn và đặt hàng
                            </p>
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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 border border-gray-100 rounded group hover:border-primary transition-colors">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-navy">Bảo hành chính hãng</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 border border-gray-100 rounded group hover:border-primary transition-colors">
                                <Truck className="h-6 w-6 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-navy">Giao hàng tận nơi</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 border border-gray-100 rounded group hover:border-primary transition-colors">
                                <RotateCcw className="h-6 w-6 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-navy">Đổi trả trong 7 ngày</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 border border-gray-100 rounded group hover:border-primary transition-colors">
                                <Factory className="h-6 w-6 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-navy">Hỗ trợ kỹ thuật 24/7</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specs & More */}
                <div className="mt-20 border-t border-gray-100 pt-12">
                    <div className="flex gap-8 border-b border-gray-100 mb-8">
                        <button className="pb-4 border-b-4 border-primary text-navy font-black uppercase tracking-widest text-xs">Thông số kỹ thuật</button>
                        <button className="pb-4 text-gray-400 font-black uppercase tracking-widest text-xs hover:text-navy transition-colors">Tài liệu Downloads</button>
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

import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Facebook, Youtube, Linkedin, Mail, Phone, MapPin, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import SITE_CONFIG from '../config/site';

const Footer = ({ categories = [] }) => {
    return (
        <footer className="relative bg-[#0A0F14] text-white pt-24 pb-12 overflow-hidden border-t border-white/5 mt-auto">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent/10 blur-[100px] rounded-full"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Trust Banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 pb-16 border-b border-white/5">
                    <div className="flex items-center gap-5 group">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-primary/20 group-hover:border-primary transition-all duration-500">
                            <ShieldCheck className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <h5 className="font-black text-sm uppercase tracking-widest text-white mb-1">Chất lượng hàng đầu</h5>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Sản phẩm chính hãng 100%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 group">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-primary/20 group-hover:border-primary transition-all duration-500">
                            <Truck className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <h5 className="font-black text-sm uppercase tracking-widest text-white mb-1">Giao hàng siêu tốc</h5>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Toàn quốc trong vòng 24h-48h</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 group">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-primary/20 group-hover:border-primary transition-all duration-500">
                            <RotateCcw className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <h5 className="font-black text-sm uppercase tracking-widest text-white mb-1">Hỗ trợ kỹ thuật</h5>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Đội ngũ chuyên gia 24/7</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <div>
                            <Link to="/" className="flex items-center space-x-3 group mb-6">
                                <div className="bg-primary p-2.5 rounded-xl shadow-glow transition-transform group-hover:scale-110">
                                    <Package className="h-7 w-7 text-navy" />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-2xl font-black tracking-tighter uppercase italic text-white group-hover:text-primary transition-colors">TEKKO</span>
                                    <span className="text-[8px] text-gray-500 font-bold tracking-[0.4em] uppercase">Engineering Solutions</span>
                                </div>
                            </Link>
                            <p className="text-gray-400 text-sm leading-relaxed font-medium italic mb-2">
                                CÔNG TY TNHH TEKKO VIỆT NAM
                            </p>
                            <div className="flex items-start gap-3 text-gray-500 text-[11px] font-bold leading-relaxed mb-6">
                                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <span>{SITE_CONFIG.contact.address}</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, link: '#', color: 'hover:bg-[#1877F2]' },
                                { Icon: Youtube, link: '#', color: 'hover:bg-[#FF0000]' },
                                { Icon: Linkedin, link: '#', color: 'hover:bg-[#0A66C2]' }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.link}
                                    className={`w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-glow group ${social.color}`}
                                >
                                    <social.Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-black text-white mb-10 uppercase tracking-[0.2em] text-xs flex items-center gap-4 relative">
                            <span className="h-1 w-8 bg-primary rounded-full"></span>
                            Danh Mục Sản Phẩm
                        </h4>
                        <ul className="grid grid-cols-1 gap-5">
                            {categories.filter(c => !c.parent_id).slice(0, 6).map(cat => (
                                <li key={cat.id}>
                                    <Link to={`/products?category_id=${cat.id}`} className="text-gray-500 hover:text-primary transition-all text-xs font-black uppercase tracking-widest flex items-center gap-3 group">
                                        <div className="w-1.5 h-1.5 bg-gray-800 rounded-full group-hover:bg-primary group-hover:scale-150 transition-all"></div>
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-black text-white mb-10 uppercase tracking-[0.2em] text-xs flex items-center gap-4 relative">
                            <span className="h-1 w-8 bg-primary rounded-full"></span>
                            Dịch Vụ & Hỗ Trợ
                        </h4>
                        <ul className="grid grid-cols-1 gap-5">
                            {[
                                'Trung tâm hỗ trợ',
                                'Chính sách bảo hành',
                                'Vận chuyển & Giao nhận',
                                'Hướng dẫn kỹ thuật',
                                'Hợp tác đại lý'
                            ].map((item, i) => (
                                <li key={i}>
                                    <Link to="#" className="text-gray-500 hover:text-primary transition-all text-xs font-black uppercase tracking-widest flex items-center gap-3 group">
                                        <ChevronRight className="h-3 w-3 text-gray-800 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Card */}
                    <div className="relative">
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>

                            <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-[0.3em] mb-4">Liên Hệ Trực Tiếp</h4>
                            <a
                                href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                                className="text-2xl font-black text-primary hover:text-white transition-colors block tracking-tighter mb-8 animate-pulse"
                            >
                                {SITE_CONFIG.contact.phone}
                            </a>

                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex items-center gap-3 group/link">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover/link:border-primary/50 transition-colors">
                                        <Mail className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase transition-colors group-hover/link:text-white">
                                        {SITE_CONFIG.contact.email}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                        <Phone className="h-3.5 w-3.5 text-navy" />
                                    </div>
                                    <span className="text-[10px] text-white font-black tracking-widest uppercase">
                                        MST: {SITE_CONFIG.contact.mst}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <div className="text-[9px] text-gray-700 font-black tracking-[0.5em] uppercase">
                            © 2025 TEKKO VIỆT NAM - PRECISION ENGINEERING
                        </div>
                        <div className="text-[8px] text-gray-800 font-bold uppercase tracking-[0.2em]">
                            DESIGN BY GOOGLE DEEPMIND TEAM - ADVANCED AGENTIC CODING
                        </div>
                    </div>

                    <div className="flex gap-10">
                        {['Quyền riêng tư', 'Điều khoản', 'Bản quyền'].map((item, i) => (
                            <span key={i} className="text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-primary cursor-pointer transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-primary hover:after:w-full after:transition-all">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

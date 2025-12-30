import React from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import api from '../../api/axios';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
        <div className={`p-4 rounded-full ${color} bg-opacity-10`}>
            <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{title}</p>
            <h3 className="text-2xl font-black text-navy">{value}</h3>
        </div>
    </div>
);

const AdminStats = () => {
    const [stats, setStats] = React.useState({
        chart_data: [],
        summary: { total_revenue: 0, new_orders: 0, total_customers: 0, growth: 0 }
    });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/stats/dashboard', { params: { days: 7 } });
                setStats(res.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const { chart_data, summary } = stats;
    const maxRevenue = Math.max(...chart_data.map(d => d.revenue), 1);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-navy uppercase tracking-tighter">Tổng quan thực tế</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Doanh thu (7 ngày)"
                    value={`${summary.total_revenue.toLocaleString()} đ`}
                    icon={DollarSign}
                    color="text-green-600"
                />
                <StatCard
                    title="Đơn hàng mới"
                    value={summary.new_orders}
                    icon={ShoppingBag}
                    color="text-blue-600"
                />
                <StatCard
                    title="Khách hàng"
                    value={summary.total_customers}
                    icon={Users}
                    color="text-purple-600"
                />
                <StatCard
                    title="Tăng trưởng"
                    value={`${summary.growth > 0 ? '+' : ''}${summary.growth}%`}
                    icon={TrendingUp}
                    color={summary.growth >= 0 ? "text-green-600" : "text-red-500"}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-black text-navy mb-8 uppercase tracking-widest pl-2 border-l-4 border-primary">Biểu đồ biến động tuần qua</h3>

                {loading ? (
                    <div className="h-64 flex items-center justify-center text-gray-400 font-bold animate-pulse">Đang tải dữ liệu...</div>
                ) : chart_data.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-gray-400 font-bold">Chưa có dữ liệu thống kê</div>
                ) : (
                    <div className="h-64 flex items-end justify-between gap-2 sm:gap-4">
                        {chart_data.map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center group">
                                <div className="relative w-full flex items-end justify-center">
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-navy text-white text-[10px] font-black py-1 px-2 rounded -translate-x-1/2 left-1/2 whitespace-nowrap z-10 pointer-events-none shadow-xl">
                                        {item.revenue.toLocaleString()} đ
                                    </div>

                                    {/* Bar */}
                                    <div
                                        className="w-full max-w-[40px] bg-primary hover:bg-navy transition-all duration-500 rounded-t-sm relative group-hover:shadow-lg cursor-pointer"
                                        style={{ height: `${(item.revenue / maxRevenue) * 200}px`, minHeight: '4px' }}
                                    ></div>
                                </div>
                                <div className="mt-3 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">{item.date}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h4 className="text-sm font-black text-navy uppercase tracking-widest mb-4">Sản phẩm bán chạy</h4>
                    <p className="text-sm text-gray-400 italic">Chưa có dữ liệu.</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h4 className="text-sm font-black text-navy uppercase tracking-widest mb-4">Khách hàng tiềm năng</h4>
                    <p className="text-sm text-gray-400 italic">Chưa có dữ liệu.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;

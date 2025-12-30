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

const AdminDashboard = () => {
    const [revenueData, setRevenueData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch last 7 days revenue
                const res = await api.get('/stats/revenue', { params: { days: 7 } });
                setRevenueData(res.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1); // Avoid div by 0

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-navy uppercase tracking-tighter">Tổng quan</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Doanh thu (7 ngày)"
                    value={`${totalRevenue.toLocaleString()} đ`}
                    icon={DollarSign}
                    color="text-green-600"
                />
                <StatCard title="Đơn hàng mới" value="12" icon={ShoppingBag} color="text-blue-600" />
                <StatCard title="Khách hàng" value="89" icon={Users} color="text-purple-600" />
                <StatCard title="Tăng trưởng" value="+15%" icon={TrendingUp} color="text-yellow-600" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-black text-navy mb-8 uppercase tracking-widest pl-2 border-l-4 border-primary">Biểu đồ doanh thu tuần qua</h3>

                {loading ? (
                    <div className="h-64 flex items-center justify-center text-gray-400 font-bold animate-pulse">Đang tải dữ liệu...</div>
                ) : revenueData.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-gray-400 font-bold">Chưa có dữ liệu</div>
                ) : (
                    <div className="h-64 flex items-end justify-between gap-2 sm:gap-4">
                        {revenueData.map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center group">
                                <div className="relative w-full flex items-end justify-center">
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-navy text-white text-[10px] font-black py-1 px-2 rounded -translate-x-1/2 left-1/2 whitespace-nowrap z-10 pointer-events-none">
                                        {item.revenue.toLocaleString()} đ
                                    </div>

                                    {/* Bar */}
                                    <div
                                        className="w-full max-w-[40px] bg-primary hover:bg-navy transition-all duration-500 rounded-t-sm relative group-hover:shadow-lg"
                                        style={{ height: `${(item.revenue / maxRevenue) * 200}px`, minHeight: '4px' }}
                                    ></div>
                                </div>
                                <div className="mt-3 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">{item.date}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

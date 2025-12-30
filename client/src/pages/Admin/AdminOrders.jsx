import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import config from '../../config';
import { Package, Truck, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { io } from 'socket.io-client';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();

        // Connect to Socket.IO server
        // Connect to Socket.IO server
        const socket = io(config.apiUrl, {
            // Default path is /socket.io, which matches our new server setup (root wrap)
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('new_order', (data) => {
            console.log('New order received:', data);
            // Option A: Re-fetch all orders
            fetchOrders();
            // Option B: Append to state (if valid format). Re-fetching is safer for sync.
            // Show notification
            alert(`Có đơn hàng mới! Khách: ${data.customer_name} - ${data.total_amount.toLocaleString()}đ`);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/admin/orders');
            setOrders(res.data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.put(`/admin/orders/${orderId}/status?status=${newStatus}`);
            fetchOrders(); // Refresh list associated
            alert("Cập nhật trạng thái thành công!");
        } catch (error) {
            alert("Lỗi khi cập nhật trạng thái");
        }
    };

    const getStatusBadge = (status) => {
        const statuses = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Chờ xử lý' },
            processing: { color: 'bg-blue-100 text-blue-800', icon: Package, label: 'Đang chuẩn bị' },
            shipped: { color: 'bg-purple-100 text-purple-800', icon: Truck, label: 'Đang giao' },
            delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Đã giao' },
            cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Đã hủy' },
        };
        const config = statuses[status] || statuses.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${config.color}`}>
                <Icon size={12} /> {config.label}
            </span>
        );
    };

    if (loading) return <div className="p-8 text-center font-bold text-gray-500">Đang tải dữ liệu...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-navy uppercase tracking-tighter">Quản lý Đơn hàng</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-black uppercase text-xs text-gray-500 tracking-wider">Mã đơn</th>
                                <th className="px-6 py-4 font-black uppercase text-xs text-gray-500 tracking-wider">Khách hàng</th>
                                <th className="px-6 py-4 font-black uppercase text-xs text-gray-500 tracking-wider">Tổng tiền</th>
                                <th className="px-6 py-4 font-black uppercase text-xs text-gray-500 tracking-wider">Ngày đặt</th>
                                <th className="px-6 py-4 font-black uppercase text-xs text-gray-500 tracking-wider">Trạng thái</th>
                                <th className="px-6 py-4 font-black uppercase text-xs text-gray-500 tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-navy">#{order.id}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-navy">{order.customer_name}</p>
                                        <p className="text-xs text-gray-400">{order.customer_phone}</p>
                                    </td>
                                    <td className="px-6 py-4 font-black text-primary">
                                        {order.total_amount.toLocaleString()} ₫
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative group">
                                            <select
                                                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                value={order.status}
                                            >
                                                <option value="pending">Chờ xử lý</option>
                                                <option value="processing">Đang chuẩn bị</option>
                                                <option value="shipped">Đang giao</option>
                                                <option value="delivered">Đã giao</option>
                                                <option value="cancelled">Hủy đơn</option>
                                            </select>
                                            <button className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase hover:underline">
                                                Cập nhật trạng thái
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-bold">
                                        Chưa có đơn hàng nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;

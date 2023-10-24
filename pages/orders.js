import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";


export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            // Make an API request to update the status on the server
            const response = await axios.put(`/api/orders/${orderId}`, { status: newStatus });
            console.log('API Response:', response);

            // Update the status in the component's state
            const updatedOrders = orders.map(order => {
                if (order._id === orderId) {
                    return { ...order, status: newStatus };
                }
                return order;
            });
            setOrders(updatedOrders);
        } catch (error) {
            console.error('Error updating order status:', error);
            // Handle the error, e.g., show an error message to the user
        }
    };


    useEffect(() => {
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
        });
    }, []);
    return (
        <Layout>
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Recipient</th>
                        <th>Products</th>
                        <th>Paid</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr key={order._id}>
                            <td>{(new Date(order.createdAt)).toLocaleString()}
                            </td>
                            <td>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </td>
                            <td>
                                {order.name} {order.email}<br />
                                {order.city} {order.postalCode} {order.country}<br />
                                {order.streetAddress}
                            </td>
                            <td>
                                {order.line_items.map(l => (
                                    <>
                                        {l.price_data?.product_data.name} x
                  {l.quantity}<br />
                                    </>
                                ))}
                            </td>
                            <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                                {order.paid ? 'YES' : 'NO'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}
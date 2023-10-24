import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
    await mongooseConnect();

    if (req.method === 'GET') {
        // Fetch and return orders
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } else if (req.method === 'PUT') {
        // Handle status update
        const { id } = req.query; // Extract the order ID from the URL
        const { status } = req.body;

        try {
            // Update the order status in the database
            const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });

            if (updatedOrder) {
                res.status(200).json(updatedOrder);
            } else {
                res.status(404).json({ error: 'Order not found' });
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
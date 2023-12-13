import { executeQuery } from '../../[connection]/db';

export const POST = async (req, res) => {
    try {
        const data = await req.json();
        const { orderId } = data;
        const order = await executeQuery(`
        update vr_Orders set is_returned = 1 where or_id =  '${orderId}'
        `);
        return Response.json({status: 200, order: order});
    } catch (error) {
        return Response.json({status: 500, error: error});
    }
}

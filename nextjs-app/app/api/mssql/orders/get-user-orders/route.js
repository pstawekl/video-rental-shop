import { executeQuery } from '../../[connection]/db';

export const POST = async (req, res) => {
    try {
        const data = await req.json();
        const { userId } = data;
        const orders = await executeQuery(`
        SELECT [or_id]
            ,[or_vt_id]
            ,[vt_name]
            ,[or_start_date]
            ,[or_return_date]
            ,[or_user_id]
            ,[is_returned]
        FROM [videorentalshop].[dbo].[vr_Orders] ord
        left join vr_VideoTapes vt on vt.vt_id = ord.or_vt_id
        WHERE or_user_id = '${userId}'
        `);
        return Response.json({status: 200, orders: orders});
    } catch (error) {
        return Response.json({status: 500, error: error});
    }
}

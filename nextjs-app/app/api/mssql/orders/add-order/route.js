import { executeQuery } from '../../[connection]/db';

export const POST = async (req, res) => {
    try {
        const data = await req.json();
        const { vtId, userId, orderDate, returnDate } = data;
        const vt = await executeQuery(`
        INSERT INTO [dbo].[vr_Orders]
           ([or_vt_id]
           ,[or_start_date]
           ,[or_return_date]
           ,[is_returned]
           ,[or_user_id])
     VALUES
           (${vtId}
           ,'${orderDate}'
           ,'${returnDate}'
           ,0
           ,'${userId}')
            `);
        return Response.json({ status: 200, videoTape: vt });
    } catch (error) {
        return Response.json({ status: 500, error: error });
    }
}
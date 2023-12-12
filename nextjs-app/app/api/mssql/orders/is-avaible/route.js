import { executeQuery } from '../../[connection]/db';

export const POST = async (req, res) => {
    try {
        const data = await req.json();
        const { vtId } = data;
        const count = await executeQuery(`
            select count(*) 
            from vr_Orders 
            where is_returned = 0 
            and or_vt_id = ${vtId}
            `);
        const isAvaible = count[0][''] === 0;
        console.log(isAvaible);
        return Response.json({ status: 200, isAvaible: isAvaible });
    } catch (error) {
        return Response.json({ status: 500, error: error });
    }
}
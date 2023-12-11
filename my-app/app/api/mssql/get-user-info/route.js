import { executeQuery } from '../../mssql/[connection]/db';

export const POST = async (req, res) => {
    try {
        const data = await req.json();
        const { user } = data;
        const userInfo = await executeQuery(`
              SELECT * FROM vr_Users WHERE auth0_id = '${user.sub}';
            `);
        return Response.json({ status: 200, userInfo: userInfo[0] });
    } catch (error) {
        console.error('Błąd podczas komunikacji z bazą danych', error);
        return Response.json({ status: 500, error: error });
    }
}

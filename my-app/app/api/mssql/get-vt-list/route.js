import { executeQuery } from '../../mssql/[connection]/db';

export const GET = async (req, res) => {
    try {
        const vtList = await executeQuery(`
            SELECT * FROM vr_VideoTapes vt
            left join vr_VideoGenres gn on  gn.gn_id = vt.vt_genre_id
            `);
        return Response.json({ status: 200, vtList: [vtList[0]] });
    } catch (error) {
        console.error('Błąd podczas komunikacji z bazą danych', error);
        return Response.json({ status: 500, error: error });
    }
}
import { executeQuery } from '../../[connection]/db';

export const GET = async (req, res) => {
    try {
        const vtList = await executeQuery(`
        SELECT 
        vt_id,
        vt_name,
        vt_year,
        vt_director,
        vt_format,
        vt_length,
        vt_description,
        vt_age_limits,
        vt_genre_id,
        gn_name
        FROM vr_VideoTapes vt
        left join vr_VideoGenres gn on  gn.gn_id = vt.vt_genre_id
            `);
        return Response.json({ status: 200, vtList: [vtList] });
    } catch (error) {
        console.error('Błąd podczas komunikacji z bazą danych', error);
        return Response.json({ status: 500, error: error });
    }
}
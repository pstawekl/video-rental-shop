import { executeQuery } from '../../[connection]/db';

export const POST = async (req, res) => {
    try {
        const data = await req.json();
        const { formData } = data;
        await executeQuery(`
        INSERT INTO [dbo].[vr_VideoTapes]
        ([vt_name]
        ,[vt_genre_id]
        ,[vt_age_limits]
        ,[vt_description]
        ,[vt_image]
        ,[vt_year]
        ,[vt_director]
        ,[vt_format]
        ,[vt_length])
        VALUES
        ('${formData.name}'
        ,${formData.genre_id}
        ,'${formData.age_limits}'
        ,'${formData.description}'
        ,'${formData.image}'
        ,${formData.year}
        ,'${formData.director}'
        ,'${formData.format}'
        ,'${formData.length}')
            `);
        return Response.json({ status: 200 });
    } catch (error) {
        console.error('Błąd podczas komunikacji z bazą danych', error);
        return Response.json({ status: 500, error: error });
    }
}
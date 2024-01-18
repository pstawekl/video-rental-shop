import { executeQuery } from '../../[connection]/db';
import { StringUtils } from '../../../[utils]/stringUtils';

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
        ('${StringUtils.ReplaceBlackChars(formData.name)}'
        ,${formData.genre_id}
        ,'${StringUtils.ReplaceBlackChars(formData.age_limits)}'
        ,'${StringUtils.ReplaceBlackChars(formData.description)}'
        ,'${formData.image}'
        ,${formData.year}
        ,'${StringUtils.ReplaceBlackChars(formData.director)}'
        ,'${StringUtils.ReplaceBlackChars(formData.format)}'
        ,'${StringUtils.ReplaceBlackChars(formData.length)}')
            `);
        return Response.json({ status: 200 });
    } catch (error) {
        console.error('Błąd podczas komunikacji z bazą danych', error);
        return Response.json({ status: 500, error: error });
    }
}
import { executeQuery } from '../../[connection]/db';
import { StringUtils } from "../../../[utils]/stringUtils";

export const POST = async (req, res) => {
    try {
        const data = await req.json();
        const { formData } = data;
        await executeQuery(`
              UPDATE vr_VideoTapes SET 
              vt_name = '${StringUtils.ReplaceBlackChars(formData.vt_name)}', vt_genre_id = ${formData.vt_genre_id}, 
              vt_age_limits = '${StringUtils.ReplaceBlackChars(formData.vt_age_limits)}', vt_description = '${StringUtils.ReplaceBlackChars(formData.vt_description)}', 
              vt_year = ${formData.vt_year}, vt_director = '${StringUtils.ReplaceBlackChars(formData.vt_director)}', 
              vt_format = '${StringUtils.ReplaceBlackChars(formData.vt_format)}', vt_length = '${StringUtils.ReplaceBlackChars(formData.vt_length)}'
              WHERE vt_id = ${formData.vt_id};
            `);
        return Response.json({ status: 200 });
    } catch (error) {
        console.error('Błąd podczas komunikacji z bazą danych', error);
        return Response.json({ status: 500, error: error });
    }
};
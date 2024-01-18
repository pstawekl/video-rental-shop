import { handleAuth, getSession, handleCallback } from '@auth0/nextjs-auth0';
import { executeQuery } from '../../mssql/[connection]/db';
import { StringUtils } from '../../[utils]/StringUtils';

export const POST = async (req, res) => {
    try {
        const data = await req.json();
        const { formData, user } = data;
        await executeQuery(`
              UPDATE vr_Users SET user_nickname = '${StringUtils.ReplaceBlackChars(user.nickname)}', user_email = '${StringUtils.ReplaceBlackChars(user.name)}', updated_at = GETDATE(),
              user_country = '${StringUtils.ReplaceBlackChars(formData.user_country)}', user_city = '${StringUtils.ReplaceBlackChars(formData.user_city)}', 
              user_street = '${StringUtils.ReplaceBlackChars(formData.user_street)}', user_house_number = '${formData.user_house_number}',
              user_postcode = '${StringUtils.ReplaceBlackChars(formData.user_postcode)}', user_phone = '${StringUtils.ReplaceBlackChars(formData.user_phone)}', 
              user_phone_country = '${formData.user_phone_country}'
              WHERE auth0_id = '${user.sub}';
            `);
        return Response.json({ status: 200 });
    } catch (error) {
        console.error('Błąd podczas komunikacji z bazą danych', error);
        return Response.json({ status: 500, error: error });
    }
}

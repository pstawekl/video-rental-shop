import { handleAuth, getSession, handleCallback } from '@auth0/nextjs-auth0';
import { executeQuery } from '../../mssql/[connection]/db';

export const POST = async (req, res) => {
    try {
        const data = await req.json();
        const { formData, user } = data;
        await executeQuery(`
              UPDATE vr_Users SET user_nickname = '${user.nickname}', user_email = '${user.name}', updated_at = GETDATE(),
              user_country = '${formData.user_country}', user_city = '${formData.user_city}', user_street = '${formData.user_street}', user_house_number = '${formData.user_house_number}',
              user_postcode = '${formData.user_postcode}', user_phone = '${formData.user_phone}', user_phone_country = '${formData.user_phone_country}'
              WHERE auth0_id = '${user.sub}';
            `);
        return Response.json({ status: 200 });
    } catch (error) {
        console.error('Błąd podczas komunikacji z bazą danych', error);
        return Response.json({ status: 500, error: error });
    }
}

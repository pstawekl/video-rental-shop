import { handleAuth, getSession, handleCallback } from '@auth0/nextjs-auth0';
import { executeQuery } from '../../mssql/[connection]/db';

export const GET = handleAuth({
    callback: async (req, res) => {
        try {
            return await handleCallback(req, res, { afterCallback })
        } catch (error) {
            console.error("Wystąpił błąd podczas logowania", error);
            res.status(500);
        }
    }
});

const afterCallback = async (req, session, state) => {
    if (!session || !session.user) {
        throw new Error('Nie można uzyskać informacji o sesji użytkownika');
    }

    const user = session.user;
    const user_id = user.sub;

    try {
        const recordset = await executeQuery(`
        SELECT * FROM vr_Users WHERE auth0_id = '${user_id}';
      `);


        if (recordset.length === 0) {
            await executeQuery(`
          INSERT INTO vr_Users (auth0_id, user_nickname, user_email, user_role_id, created_at)
          VALUES ('${user_id}', '${user.nickname}', '${user.name}', 2, GETDATE());
        `);
        } else {
            await executeQuery(`
          UPDATE vr_Users SET user_nickname = '${user.nickname}', user_email = '${user.name}', updated_at = GETDATE()
          WHERE auth0_id = '${user_id}';
        `);
        }
        return session;
    } catch (error) {
        console.error('Błąd podczas komunikacji z bazą danych', error);
    }
}

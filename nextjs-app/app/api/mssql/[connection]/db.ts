import sql, { ConnectionPool } from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    trustServerCertificate: true,
  }
};

export async function connectDB() {
  try {
    let pool: ConnectionPool;
    if (!pool) {
      pool = await sql.connect(config);
    }
    return pool;
  } catch (error) {
    console.error('Błąd połączenia z bazą danych:', error);
  }
}

export async function executeQuery(query: string): Promise<any[]> {
  try {
    const db = await connectDB();
    const result = await db.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Błąd zapytania do bazy danych:', error);
  }
}

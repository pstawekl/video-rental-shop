import sql, { ConnectionPool } from 'mssql';

const config = {
  user: 'sa',
  password: 'el4505to',
  server: 'localhost\\SQLEXPRESS',
  database: 'videorentalshop',
  port: 1433,
  options: {
    instancename: 'SQLEXPRESS',
    trustedconnection: true,
    trustServerCertificate: true
  },
};

let pool: ConnectionPool | undefined;

export async function connectDB() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
    }
    console.log('Połączono z bazą danych');
    return pool;
  } catch (error) {
    console.error('Błąd połączenia z bazą danych:', error);
    throw new Error('Błąd połączenia z bazą danych', error);
  }
}

export default async function executeQuery(query: string): Promise<any[]> {
  try {
    const db = await connectDB();
    const result = await db.query(query);
    console.log('Wykonano zapytanie do bazy danych');
    return result.recordset;
  } catch (error) {
    console.error('Błąd zapytania do bazy danych:', error);
    throw new Error('Błąd zapytania do bazy danych');
  }
}

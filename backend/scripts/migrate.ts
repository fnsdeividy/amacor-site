import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const MIGRATIONS_DIR = path.resolve(__dirname, '..', 'migrations');

async function runMigrations(): Promise<void> {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  });

  const client = await pool.connect();

  try {
    // Lê todos os arquivos .sql do diretório de migrations, ordenados por nome
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('[migrate] Nenhum arquivo de migration encontrado.');
      return;
    }

    console.log(`[migrate] Encontradas ${files.length} migration(s) para executar.`);

    // Executa todas as migrations dentro de uma transação
    await client.query('BEGIN');

    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      console.log(`[migrate] Aplicando: ${file}...`);
      await client.query(sql);
      console.log(`[migrate] ✓ ${file} aplicada com sucesso.`);
    }

    await client.query('COMMIT');
    console.log(`\n[migrate] Todas as ${files.length} migration(s) foram aplicadas com sucesso.`);
  } catch (error: unknown) {
    await client.query('ROLLBACK');

    const message = error instanceof Error ? error.message : String(error);
    console.error(`\n[migrate] ✗ Erro ao executar migrations: ${message}`);

    if (error instanceof Error && error.stack) {
      console.error(`[migrate] Stack: ${error.stack}`);
    }

    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();

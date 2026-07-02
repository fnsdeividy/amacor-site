import * as path from 'path';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const ADMIN_EMAIL = 'admin@amacor.com.br';
const ADMIN_SENHA = 'Admin@2024';
const ADMIN_NOME = 'Administrador Amacor';
const ADMIN_PERFIL = 'admin';

async function seedAdmin(): Promise<void> {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('render.com') ? { rejectUnauthorized: false } : undefined,
    max: 5,
    connectionTimeoutMillis: 5000,
  });

  const client = await pool.connect();

  try {
    // Verifica se já existe
    const existing = await client.query(
      'SELECT id FROM admin_users WHERE email = $1',
      [ADMIN_EMAIL]
    );

    if (existing.rows.length > 0) {
      console.log(`[seed] Admin "${ADMIN_EMAIL}" já existe. Pulando.`);
      return;
    }

    // Gera hash da senha com bcrypt (cost 12)
    const senhaHash = await bcrypt.hash(ADMIN_SENHA, 12);

    await client.query(
      `INSERT INTO admin_users (nome, email, senha_hash, perfil, status)
       VALUES ($1, $2, $3, $4, 'ativo')`,
      [ADMIN_NOME, ADMIN_EMAIL, senhaHash, ADMIN_PERFIL]
    );

    console.log(`[seed] ✓ Admin criado com sucesso!`);
    console.log(`[seed]   Email: ${ADMIN_EMAIL}`);
    console.log(`[seed]   Senha: ${ADMIN_SENHA}`);
    console.log(`[seed]   Perfil: ${ADMIN_PERFIL}`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[seed] ✗ Erro ao criar admin: ${message}`);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedAdmin();

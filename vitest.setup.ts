// Cargar .env.local para tests que necesitan Supabase real
import { config } from 'dotenv';
config({ path: '.env.local' });
import '@testing-library/jest-dom/vitest';

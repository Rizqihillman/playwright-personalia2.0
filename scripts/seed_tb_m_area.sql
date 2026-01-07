-- scripts/seed_tb_m_area.sql
-- Seeder: buat tabel tb_m_area jika belum ada lalu insert 50 baris data random
-- Asumsi schema (sesuaikan jika berbeda):
-- id uuid PRIMARY KEY default gen_random_uuid()
-- kode_area varchar UNIQUE
-- nama_area varchar
-- deskripsi text
-- is_active boolean
-- sort_order integer
-- created_at timestamptz
-- updated_at timestamptz

-- Pastikan extension uuid generator tersedia
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Buat tabel jika belum ada (ubah tipe/kolom sesuai schema asli jika perlu)
CREATE TABLE IF NOT EXISTS tb_m_area (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kode_area varchar(50) NOT NULL UNIQUE,
  nama_area varchar(255) NOT NULL,
  deskripsi text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert 50 rows random. Jika dijalankan berulang, ON CONFLICT DO NOTHING mencegah duplikat berdasarkan kode_area
INSERT INTO tb_m_area (id, kode_area, nama_area, deskripsi, is_active, sort_order, created_at, updated_at)
SELECT
  gen_random_uuid() AS id,
  ('AREA' || lpad(s::text, 3, '0')) AS kode_area,
  ('Area ' || s) AS nama_area,
  -- deskripsi acak (12 char hex) + teks contoh
  (substring(md5(random()::text) FROM 1 FOR 12) || ' - contoh deskripsi') AS deskripsi,
  (random() > 0.2) AS is_active,
  (1 + floor(random()*100))::int AS sort_order,
  (now() - (floor(random()*365) || ' days')::interval) AS created_at,
  -- updated_at >= created_at
  (now() - (floor(random()*365) || ' days')::interval + (floor(random()*30) || ' days')::interval) AS updated_at
FROM generate_series(1,50) s
ON CONFLICT (kode_area) DO NOTHING;

-- Ringkasan hasil: jumlah rows yang bertambah bisa di-check dengan
-- SELECT count(*) FROM tb_m_area;

-- Catatan:
-- 1) Jika tabel asli punya kolom lain (parent_id, area_type, kode_provinsi, dsb.), tambahkan kolom yang sesuai
-- 2) Jika id bukan UUID di DB Anda, ubah definisi id atau hilangkan bagian id pada INSERT
-- 3) Untuk nama yang lebih "nyata", kita bisa mengganti nama_area dengan kombinasi dari daftar nama (kota/kelurahan/etc.)
-- 4) Jalankan file ini menggunakan psql atau tool DB Anda (instruksi contoh di bawah)

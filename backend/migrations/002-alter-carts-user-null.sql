-- Permitir que user_id sea nulo en la tabla carts
ALTER TABLE IF EXISTS carts
ALTER COLUMN user_id DROP NOT NULL;

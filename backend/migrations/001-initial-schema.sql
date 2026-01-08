-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'provider', 'admin')),
  language VARCHAR(10) NOT NULL DEFAULT 'es' CHECK (language IN ('es', 'ru')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Tabla de platos
CREATE TABLE IF NOT EXISTS dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_es VARCHAR(200) NOT NULL,
  name_ru VARCHAR(200) NOT NULL,
  description_es TEXT,
  description_ru TEXT,
  base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
  image_url VARCHAR(500),
  category VARCHAR(50) NOT NULL CHECK (category IN ('appetizer', 'main_course', 'dessert', 'beverage')),
  preparation_time INTEGER NOT NULL CHECK (preparation_time > 0), -- minutos
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ingredientes
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_es VARCHAR(100) NOT NULL,
  name_ru VARCHAR(100) NOT NULL,
  description_es TEXT,
  description_ru TEXT,
  price_extra DECIMAL(10,2) DEFAULT 0 CHECK (price_extra >= 0),
  is_available BOOLEAN DEFAULT true,
  category VARCHAR(50) NOT NULL CHECK (category IN ('protein', 'vegetable', 'sauce', 'spice', 'cheese', 'other')),
  allergen_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla intermedia plato-ingrediente
CREATE TABLE IF NOT EXISTS dish_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  is_removable BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(dish_id, ingredient_id)
);

-- Índices para mejorar performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_dishes_category ON dishes(category);
CREATE INDEX idx_dishes_is_active ON dishes(is_active);
CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_ingredients_is_available ON ingredients(is_available);
CREATE INDEX idx_dish_ingredients_dish_id ON dish_ingredients(dish_id);
CREATE INDEX idx_dish_ingredients_ingredient_id ON dish_ingredients(ingredient_id);

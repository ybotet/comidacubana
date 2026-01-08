-- Insertar usuario admin por defecto (contraseña: Admin123!)
INSERT INTO users (email, password_hash, first_name, last_name, role, language)
VALUES (
  'admin@restaurante.com',
  '$2b$12$LQv3c1yqBWVHx7NqQbLZpeN8k8W6tYfJd8M7nV6sR4tH9pWqLmNzO', -- bcrypt hash de 'Admin123!'
  'Administrador',
  'Sistema',
  'admin',
  'es'
) ON CONFLICT (email) DO NOTHING;

-- Insertar ingredientes básicos
INSERT INTO ingredients (name_es, name_ru, category, price_extra) VALUES
-- Proteínas
('Pollo', 'Курица', 'protein', 2.50),
('Carne de res', 'Говядина', 'protein', 3.50),
('Cerdo', 'Свинина', 'protein', 3.00),
('Pescado', 'Рыба', 'protein', 4.00),
('Tofu', 'Тофу', 'protein', 2.00),

-- Vegetales
('Lechuga', 'Салат', 'vegetable', 0.50),
('Tomate', 'Помидор', 'vegetable', 0.75),
('Cebolla', 'Лук', 'vegetable', 0.50),
('Pimiento', 'Перец', 'vegetable', 0.75),
('Champiñones', 'Грибы', 'vegetable', 1.00),

-- Salsas
('Salsa de tomate', 'Томатный соус', 'sauce', 0.50),
('Salsa blanca', 'Белый соус', 'sauce', 0.75),
('Salsa picante', 'Острый соус', 'sauce', 0.50),
('Mayonesa', 'Майонез', 'sauce', 0.50),
('Mostaza', 'Горчица', 'sauce', 0.50),

-- Quesos
('Queso mozzarella', 'Сыр моцарелла', 'cheese', 1.50),
('Queso cheddar', 'Сыр чеддер', 'cheese', 1.75),
('Queso parmesano', 'Сыр пармезан', 'cheese', 2.00),

-- Especias
('Orégano', 'Орегано', 'spice', 0.25),
('Pimienta', 'Перец', 'spice', 0.25),
('Sal', 'Соль', 'spice', 0.25),
('Ajo en polvo', 'Чесночный порошок', 'spice', 0.30);

-- Insertar platos de ejemplo
INSERT INTO dishes (name_es, name_ru, description_es, description_ru, base_price, category, preparation_time) VALUES
('Ensalada César', 'Цезарь салат', 'Ensalada fresca con pollo a la parrilla, lechuga romana y aderezo césar', 'Свежий салат с курицей гриль, салатом романо и соусом цезарь', 8.99, 'appetizer', 15),
('Hamburguesa Clásica', 'Классический бургер', 'Hamburguesa de res con queso, lechuga, tomate y salsa especial', 'Говяжья котлета с сыром, салатом, помидорами и специальным соусом', 12.50, 'main_course', 20),
('Pasta Carbonara', 'Паста Карбонара', 'Pasta con salsa cremosa, panceta y queso parmesano', 'Паста с сливочным соусом, беконом и сыром пармезан', 14.99, 'main_course', 25),
('Tiramisú', 'Тирамису', 'Postre italiano con capas de bizcocho y crema de mascarpone', 'Итальянский десерт с бисквитом и кремом из маскарпоне', 6.50, 'dessert', 10),
('Limonada Fresca', 'Свежий лимонад', 'Limonada natural con hierbabuena', 'Натуральный лимонад с мятой', 3.50, 'beverage', 5);

-- Asignar ingredientes a platos (Ensalada César)
INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity, is_removable) 
SELECT d.id, i.id, 1, false
FROM dishes d, ingredients i 
WHERE d.name_es = 'Ensalada César' 
AND i.name_es IN ('Pollo', 'Lechuga', 'Queso parmesano');

-- Asignar ingredientes a platos (Hamburguesa Clásica)
INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity, is_removable) 
SELECT d.id, i.id, 1, true  -- is_removable = true para ingredientes que se pueden quitar
FROM dishes d, ingredients i 
WHERE d.name_es = 'Hamburguesa Clásica' 
AND i.name_es IN ('Carne de res', 'Queso cheddar', 'Lechuga', 'Tomate', 'Cebolla', 'Salsa de tomate');

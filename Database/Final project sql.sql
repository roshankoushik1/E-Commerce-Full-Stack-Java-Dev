create database backend;
use backend;
show tables;
select * from products;
select * from categories;
select * from brands;
select * from sizes;
select * from hero;
select * from explores;
select * from category;
select * from all_product;
select * from all_product_sizes;
select * from hero;
select * from checkout;
truncate table checkout;
select * from orders;
select * from userss;
select * from cart_items;
select * from wishlist_items;
select * from offer;
select * from bills;


INSERT INTO products

(name, price, original_price, image, category, brand, sizes, colors, is_new, in_stock, rating, reviews, description)

VALUES

('Mens Otis Sport Polo', 19.00, 29.00, 'assets.new2', 'Men', 'Nike',

'S,M,L,XL,XXL', 'White,Blue,Black,Red',

true, true, 4.7, 143, 'Premium sport polo shirt designed for active lifestyle.');

INSERT INTO products

(name, price, original_price, image, category, brand, sizes, colors, is_new, in_stock, rating, reviews, description)

VALUES

('Man in Green Zip Pocket', 19.00, 29.00, 'assets.new2', 'Men', 'Nike',

'S,M,L,XL,XXL', 'White,Blue,Black,Red',

true, true, 4.7, 143, 'Premium sport polo shirt designed for active lifestyle. Features moisture-wicking technology and comfortable athletic fit.');
 
INSERT INTO products

(name, price, original_price, image, category, brand, sizes, colors, is_new, in_stock, rating, reviews, description)

VALUES

('Woman Brown Outher', 29.00, 39.00, 'assets.new3', 'Women', 'Zara',

'XS,S,M,L,XL', 'Brown,Black,Beige,Tan',

false, true, 4.4, 78, 'Elegant women''s outer wear perfect for any season. Combines style and comfort with premium fabric and sophisticated design.');
 
INSERT INTO products

(name, price, original_price, image, category, brand, sizes, colors, is_new, in_stock, rating, reviews, description)

VALUES

('Leather Sneakers', 49.40, 69.00, 'assets.new4', 'Shoes', 'Adidas',

'7,8,9,10,11,12', 'White,Black,Brown,Navy',

false, true, 4.6, 187, 'Premium leather sneakers with superior comfort and durability. Perfect for daily wear with classic design and modern comfort technology.');
 
 update products set image="assets.new1" where id=1;
 
 INSERT INTO explores
(name, price, original_price, image, category, brand, sizes, colors, is_new, in_stock, rating, reviews, description)
VALUES
('Premium Cotton Jacket', 85.00, 99.00, 'assets.explore1', 'Men', 'H&M',
'S,M,L,XL', 'Blue,Black,White,Gray',
false, true, 4.5, 89, 'Premium quality cotton jacket perfect for casual and semi-formal occasions. Features a comfortable fit and durable construction.');
 
INSERT INTO explores
(name, price, original_price, image, category, brand, sizes, colors, is_new, in_stock, rating, reviews, description)
VALUES
('Designer Hand Bag', 129.00, 159.00, 'assets.explore2', 'Women', 'Vinca',
'One Size', 'Brown,Black,Tan',
true, true, 4.8, 156, 'Elegant designer handbag crafted from premium leather. Spacious interior with multiple compartments for organization.');
 
INSERT INTO explores
(name, price, original_price, image, category, brand, sizes, colors, is_new, in_stock, rating, reviews, description)
VALUES
('Casual Wear Set', 45.00, 65.00, 'assets.explore3', 'Women', 'Zara',
'XS,S,M,L,XL', 'Pink,White,Blue,Gray',
false, true, 4.3, 74, 'Comfortable casual wear set perfect for everyday activities. Made from soft, breathable fabric for all-day comfort.');
 
INSERT INTO explores
(name, price, original_price, image, category, brand, sizes, colors, is_new, in_stock, rating, reviews, description)
VALUES
('Premium Footwear', 89.00, 119.00, 'assets.explore4', 'Shoes', 'Nike',
'7,8,9,10,11,12', 'Black,White,Gray,Blue',
false, true, 4.6, 203, 'High-quality premium footwear designed for comfort and style. Features advanced cushioning and durable construction.');

INSERT INTO category(id,image,name) VALUES (1, 'assets.women','Women');
INSERT INTO category(id,image,name) VALUES (2, 'assets.men','Men');
INSERT INTO category(id,image,name) VALUES (3, 'assets.kids','Kids');




INSERT INTO all_product(in_stock,is_new,original_price,price,rating,id,brand,category,image,name) VALUES (true,true,109.00,89.00,4.5,1,'women-pants','Women','assets.col1','Women Pants Classic 1');
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 119.00, 99.00, 4.5, 2, 'women-pants', 'Women', 'assets.col2', 'Women Pants Classic 2');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 99.00, 79.00, 4.5, 3, 'women-pants', 'Women', 'assets.col3', 'Women Pants Classic 3');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 129.00, 109.00, 4.5, 4, 'women-pants', 'Women', 'assets.col4', 'Women Pants Classic 4');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 115.00, 95.00, 4.5, 5, 'women-pants', 'Women', 'assets.col5', 'Women Pants Classic 5');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, true, 149.00, 129.00, 4.5, 6, 'women-sweatshirts', 'Women', 'assets.col6', 'Women Sweatshirt Cozy 1');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 139.00, 119.00, 4.5, 7, 'women-sweatshirts', 'Women', 'assets.col7', 'Women Sweatshirt Cozy 2');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 159.00, 139.00, 4.5, 8, 'women-sweatshirts', 'Women', 'assets.col8', 'Women Sweatshirt Cozy 3');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 119.00, 99.00, 4.5, 9, 'women-sweatshirts', 'Women', 'assets.col9', 'Women Sweatshirt Cozy 4');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 169.00, 149.00, 4.5, 10, 'women-sweatshirts', 'Women', 'assets.col10', 'Women Sweatshirt Cozy 5');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, true, 79.00, 59.00, 4.5, 11, 'women-tops', 'Women', 'assets.col11', 'Women Top Trendy 1');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 89.00, 69.00, 4.5, 12, 'women-tops', 'Women', 'assets.col12', 'Women Top Trendy 2');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 99.00, 79.00, 4.5, 13, 'women-tops', 'Women', 'assets.col13', 'Women Top Trendy 3');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 109.00, 89.00, 4.5, 14, 'women-tops', 'Women', 'assets.col14', 'Women Top Trendy 4');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 119.00, 99.00, 4.5, 15, 'women-tops', 'Women', 'assets.col15', 'Women Top Trendy 5');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, true, 169.00, 149.00, 4.5, 16, 'men-hoodies', 'Men', 'assets.col16', 'Men Hoodie Comfy 1');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 179.00, 159.00, 4.5, 17, 'men-hoodies', 'Men', 'assets.col17', 'Men Hoodie Comfy 2');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 189.00, 169.00, 4.5, 18, 'men-hoodies', 'Men', 'assets.col18', 'Men Hoodie Comfy 3');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 159.00, 139.00, 4.5, 19, 'men-hoodies', 'Men', 'assets.col19', 'Men Hoodie Comfy 4');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 199.00, 179.00, 4.5, 20, 'men-hoodies', 'Men', 'assets.col20', 'Men Hoodie Comfy 5');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, true, 139.00, 119.00, 4.5, 21, 'men-pants', 'Men', 'assets.col21', 'Men Pants Flex 1');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 129.00, 109.00, 4.5, 22, 'men-pants', 'Men', 'assets.col22', 'Men Pants Flex 2');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 119.00, 99.00, 4.5, 23, 'men-pants', 'Men', 'assets.col23', 'Men Pants Flex 3');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 149.00, 129.00, 4.5, 24, 'men-pants', 'Men', 'assets.col24', 'Men Pants Flex 4');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, true, 119.00, 99.00, 4.5, 25, 'men-shirts', 'Men', 'assets.col25', 'Men Shirt Smart 1');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 109.00, 89.00, 4.5, 26, 'men-shirts', 'Men', 'assets.col26', 'Men Shirt Smart 2');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 129.00, 109.00, 4.5, 27, 'men-shirts', 'Men', 'assets.col27', 'Men Shirt Smart 3');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 139.00, 119.00, 4.5, 28, 'men-shirts', 'Men', 'assets.col28', 'Men Shirt Smart 4');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 149.00, 129.00, 4.5, 29, 'men-shirts', 'Men', 'assets.col29', 'Men Shirt Smart 5');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, true, 64.00, 49.00, 4.5, 30, 'kids-shirts', 'Kids', 'assets.col30', 'Kids Shirt Play 1');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 54.00, 39.00, 4.5, 31, 'kids-shirts', 'Kids', 'assets.col31', 'Kids Shirt Play 2');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 74.00, 59.00, 4.5, 32, 'kids-shirts', 'Kids', 'assets.col32', 'Kids Shirt Play 3');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 60.00, 45.00, 4.5, 33, 'kids-shirts', 'Kids', 'assets.col33', 'Kids Shirt Play 4');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 70.00, 55.00, 4.5, 34, 'kids-shirts', 'Kids', 'assets.col34', 'Kids Shirt Play 5');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, true, 54.00, 44.00, 4.5, 35, 'kids-pants', 'Kids', 'assets.col35', 'Kids Pants Active 1');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 58.00, 48.00, 4.5, 36, 'kids-pants', 'Kids', 'assets.col36', 'Kids Pants Active 2');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 62.00, 52.00, 4.5, 37, 'kids-pants', 'Kids', 'assets.col37', 'Kids Pants Active 3');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 56.00, 46.00, 4.5, 38, 'kids-pants', 'Kids', 'assets.col38', 'Kids Pants Active 4');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 60.00, 50.00, 4.5, 39, 'kids-pants', 'Kids', 'assets.col39', 'Kids Pants Active 5');
 
INSERT INTO all_product_sizes(all_product_id,sizes) VALUES (39,'XS');
INSERT INTO all_product_sizes(all_product_id,sizes) VALUES (39,'S');
INSERT INTO all_product_sizes(all_product_id,sizes) VALUES (39,'M');
 
INSERT INTO all_product_sizes(all_product_id,sizes) VALUES (29,'L');
INSERT INTO all_product_sizes(all_product_id,sizes) VALUES (29,'XL');
 
INSERT INTO all_product_sizes(all_product_id,sizes) VALUES (20,'XXL');
 
INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 60.00, 50.00, 4.5, 40, 'kids-pants', 'Kids', 'assets.explore2', 'Kids Pants Active 5');



INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (1, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (1, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (1, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (1, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (1, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (3, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (3, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (3, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (3, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (3, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (4, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (4, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (4, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (4, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (4, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (5, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (5, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (5, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (5, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (5, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (6, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (6, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (6, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (6, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (7, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (7, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (7, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (7, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (8, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (8, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (8, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (8, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (9, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (9, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (9, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (9, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (10, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (10, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (10, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (10, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (11, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (11, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (11, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (11, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (12, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (12, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (12, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (12, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (13, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (13, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (13, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (13, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (14, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (14, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (14, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (14, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (15, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (15, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (15, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (15, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (16, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (16, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (16, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (16, 'XXL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (17, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (17, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (17, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (17, 'XXL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (18, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (18, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (18, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (18, 'XXL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (19, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (19, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (19, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (19, 'XXL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (20, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (20, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (20, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (20, 'XXL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (21, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (21, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (21, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (22, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (22, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (22, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (23, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (23, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (23, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (24, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (24, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (24, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (25, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (25, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (25, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (26, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (26, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (26, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (27, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (27, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (27, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (28, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (28, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (28, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (29, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (29, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (29, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (30, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (30, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (30, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (31, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (31, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (31, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (32, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (32, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (32, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (33, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (33, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (33, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (34, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (34, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (34, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (35, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (35, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (35, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (36, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (36, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (36, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (37, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (37, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (37, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (38, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (38, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (38, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (2, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (2, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (2, 'M');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (2, 'L');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (2, 'XL');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (39, 'XS');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (39, 'S');
INSERT INTO all_product_sizes(all_product_id, sizes) VALUES (39, 'M');


INSERT INTO hero(id, image_url) VALUES (1, 'assets.hero1');

INSERT INTO hero(id, image_url) VALUES (2, 'assets.hero2');

INSERT INTO hero(id, image_url) VALUES (3, 'assets.hero3');

INSERT INTO hero(id, image_url) VALUES (4, 'assets.hero4');

INSERT INTO hero(id, image_url) VALUES (5, 'assets.hero5');
 


INSERT INTO offer (code, off_percentage, min_order_price) VALUES ('OFF10', 10, 100);
INSERT INTO offer (code, off_percentage, min_order_price) VALUES ('OFF20', 20, 50);
INSERT INTO offer (code, off_percentage, min_order_price) VALUES ('FESTIVE30', 30, 150);
INSERT INTO offer (code, off_percentage, min_order_price) VALUES ('NEW50', 50, 200);

select * from all_product;

INSERT INTO all_product(in_stock, is_new, original_price, price, rating, id, brand, category, image, name)
VALUES (true, false, 56.00, 46.00, 4.5, 45, 'kids-pants', 'Men', 'assets.col38', 'Men dharshan');
 
 INSERT INTO categories (name) VALUES 
('Small Men');

select * from sizes;
 
INSERT INTO brands (name) VALUES
('women-pants'),
('women-sweatshirts'),
('women-tops'),
('men-hoodies'),
('men-pants'),
('men-shirts'),
('kids-shirts'),
('kids-pants');
 
 
INSERT INTO sizes (size) VALUES
('XS'), ('S'), ('M'), ('L'), ('XL'), ('XXL'),
('7'), ('8'), ('9'), ('10'), ('11'), ('12');
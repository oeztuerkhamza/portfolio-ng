-- Divan: Karte auf Englisch, Französisch, Türkisch, Arabisch und Russisch (Deutsch ist die Hauptsprache).
-- Ersetzt die Übersetzungen vollständig; Englisch und Türkisch bekommen dabei auch die Rubrik-Hinweise.
update public.menus
set data = jsonb_set(data, '{translations}', jsonb_build_object(
  'en', $tr$# Starters
Günlük Çorba | 5,90 | Fresh soup of the day
Havuç Tarator | 4,90 | Yoghurt quark with garlic and carrots, rounded off with Turkish spices
Haydari | 5,20 | Yoghurt quark with garlic and mint, refined with Turkish spices
Ispanak Tarator | 5,70 | Yoghurt quark with garlic and spinach, seasoned with Turkish spices
Cacık | 6,10 | Fresh yoghurt with cucumber, mint and garlic
Patlıcan Kızartma | 6,90 | Fried aubergines with garlic yoghurt sauce
Kabak Kızartma | 6,90 | Fried courgettes with garlic yoghurt sauce
Sarımsaklı Ekmek | 6,90 | Mild garlic bread
Peynirli Sigara Böreği | 7,10 | Crispy pastry rolls filled with cheese
Kıymalı Sigara Böreği | 7,10 | Crispy pastry rolls filled with minced meat and onions
Ispanaklı Sigara Böreği | 7,10 | Crispy pastry rolls filled with spinach and onions
Zeytinyağlı Sarma | 6,50 | Vine leaves stuffed with rice, on yoghurt sauce
Karışık Meze (small) | 8,90 | Cold meze plate with sheep’s cheese, olives, pickled peppers and tomatoes
Karışık Meze (large, for two) | 15,90 | Large mixed meze platter for two
Acika | 5,90 | Spicy sheep’s cheese spread with oriental spices
Humus | 5,90 | Chickpea cream

# Salads
Küçük Salata | 5,90 | Small salad: green salad with cucumber, carrots, cabbage, cheese and yoghurt cream dressing
Büyük Salata | 9,90 | Large salad: green salad with cucumber, carrots, cabbage, cheese and yoghurt cream dressing
Çoban Salatası | 10,50 | Tomatoes, cucumber, onions, parsley and cheese with vinaigrette
Patlıcan Salatası | 7,50 | Fine aubergine salad with peppers, tomatoes and garlic
Mevsim Salatası | 9,50 | Colourful seasonal salad
Ton Balıklı Salata | 10,90 | Tuna salad with tomatoes, olives, sweetcorn, cucumber, leaves and homemade yoghurt dressing
Hindi Salatası | 11,90 | Mixed salad with strips of turkey breast and homemade yoghurt dressing
Köy Salatası | 9,50 | Colourful village-style salad with olive oil

# Oriental specialities
Patlıcan Ezme | 12,90 | Fried aubergines with garlic yoghurt sauce, finished with butter and garnished with tomatoes
Anadolu Peynir | 16,90 | Tomato ragout with sheep’s cheese baked in a clay pot, with a side salad
Karnıyarık | 18,50 | Oven-baked aubergines filled with spiced minced meat, tomato sauce and butter rice
Kabak Oturtma | 18,50 | Baked courgette boats with spiced minced meat, tomato sauce and rice
Ali Nazik | 18,10 | Seared minced meat on a baked aubergine, pepper and tomato ragout with garlic yoghurt sauce
Hünkâr Beğendi | 19,90 | Tender braised lamb on aubergine purée with tomato slices and parsley, with fresh flatbread

# From the charcoal grill
Pilavlı Köfte | 16,90 | Grilled meatballs with rice and garlic yoghurt sauce
Salatalı Köfte | 16,90 | Grilled meatballs with village salad and garlic yoghurt sauce
Peynirli Sarımsaklı Köfte | 17,90 | Meatballs filled with sheep’s cheese and garlic with rice and garlic yoghurt sauce
Pilavlı Pirzola | 21,90 | Lamb chops with rice and garlic yoghurt sauce
Salatalı Pirzola | 21,90 | Lamb chops with village salad and garlic yoghurt sauce
Tavuk Izgara | 19,90 | Boneless half chicken with chips and a side salad
Kuzu Şiş | 22,90 | Lamb skewer with rice and garlic yoghurt sauce
Hindi Şiş | 21,90 | Turkey skewer with rice and garlic yoghurt sauce
Adana Şiş | 19,90 | Spiced minced meat skewer with rice or chips and garlic yoghurt sauce
Karışık Et Tabağı | 27,90 | Mixed grill with lamb skewer, lamb chops, döner, meatballs and turkey skewer, with rice, garlic yoghurt sauce and a side salad
Karışık Et Tabağı for two | 54,90 | The mixed grill for two

# Döner kebab
İskender Special | 17,90 | Döner on fresh sesame bread with tomatoes, garlic yoghurt and tomato sauce
Pilavlı Döner | 14,50 | Döner with Turkish-style rice and garlic yoghurt sauce
Salatalı Döner | 14,50 | Döner with village salad and garlic yoghurt sauce
Pommesli Döner | 14,50 | Döner with chips and garlic yoghurt sauce

# Baked in the stone oven | Served in a clay dish with fresh flatbread
Musakka | 15,40 | Spiced minced meat over potatoes, aubergines, courgettes, tomatoes, garlic and onions
Sebzeli Kiremit | 14,40 | Vegetable bake with potatoes, aubergines, courgettes, cauliflower, peppers, onions, tomatoes and garlic
Melemen | 14,40 | Baked stew of tomatoes, peppers, onions, parsley and garlic with a fried egg
Sebzeli Hindi Kiremit | 16,90 | Tender turkey strips with vegetables in tomato sauce
Sebzeli Kuzu Kiremit | 18,50 | Tender lamb with vegetables in tomato sauce

# Pan dishes | Served with rice
Hindi Tava Kavurma | 17,50 | Turkey with fresh peppers, onions and mushrooms in tomato sauce
Kuzu Tava Kavurma | 19,90 | Lamb with fresh peppers, onions and mushrooms in tomato sauce
Pilavlı Kızartma | 14,90 | Aubergines, courgettes and carrots in tomato sauce

# Saç sizzling pan
Saç Mercimek | 13,50 | Lentils, fresh peppers, potatoes, onions and tomato sauce
Saç Fasulye | 14,80 | White beans, pasta, fresh peppers, onions, Turkish garlic sausage and tomato sauce
Saç Sebzeli | 13,50 | Vegetables with pasta and tomato sauce
Saç Döner | 17,90 | Döner with fresh tomatoes, peppers, potatoes and tomato sauce
Saç Hindi Special | 19,90 | Diced turkey with fresh tomatoes, peppers, potatoes and tomato sauce
Saç Kuzu Special | 22,90 | Diced lamb with fresh tomatoes, peppers, potatoes and tomato sauce

# Pide
Domatesli Peynirli Pide | 14,90 | Tomato sauce, parsley and cheese
Karışık Pide | 14,90 | Aubergines, courgettes, carrots, mushrooms, Turkish garlic sausage, tomato sauce and cheese
Mantarlı Pide | 14,50 | Mushrooms, tomato sauce and cheese
Kızartmalı Pide | 14,50 | Aubergines, courgettes, carrots, mushrooms, peppers, tomato sauce and cheese
Ispanaklı Pide | 13,90 | Spinach, fried egg, tomato sauce and cheese
Mantarlı Sucuklu Pide | 15,50 | Mushrooms, Turkish garlic sausage, tomato sauce and cheese
Kıymalı Mantarlı Pide | 15,50 | Minced beef, mushrooms, onions, parsley, tomato sauce and cheese
Dönerli Pide | 15,90 | Döner, tomato sauce and cheese

# Lahmacun & pizza | Original pizza, 33 cm
Lahmacun | 10,50 | Turkish flatbread with spiced minced meat and a side salad
Margherita | 10,90 | Tomato sauce and cheese
Ton Balıklı Pizza | 13,90 | Tuna, onions, tomato sauce and cheese
Sucuklu Pizza | 13,90 | Turkish garlic sausage, tomato sauce and cheese
Ispanaklı Pizza | 13,90 | Spinach, tomato sauce and cheese
Mantarlı Pizza | 13,90 | Mushrooms, tomato sauce and cheese
Salami Pizza | 13,90 | Salami, tomato sauce and cheese
Sebzeli Pizza | 13,90 | Aubergines, courgettes, tomato sauce and cheese
Turşulu Pizza | 13,90 | Pickled peppers, tomato sauce and cheese
Pizza Divan Special | 14,90 | Minced meat, mushrooms, spinach, tomato sauce and cheese
Dönerli Pizza | 13,90 | Döner, tomato sauce and cheese

# Börek | Filled pastries
Peynirli Börek | 12,90 | With cheese and parsley
Ispanaklı Börek | 13,50 | With cheese and spinach
Türlü Börek | 15,90 | With cheese, aubergines, courgettes, carrots and tomato sauce
Sucuklu Börek | 18,90 | With cheese and Turkish garlic sausage
Kıymalı Börek | 14,50 | With cheese and minced beef
Kıymalı Ispanaklı Börek | 16,50 | With cheese, minced beef and spinach
Divan Börek | 17,90 | With cheese, Turkish garlic sausage, spinach, minced beef, courgettes, aubergines and garlic
Dönerli Börek | 17,90 | With cheese, döner and tomato sauce

# Poğaça | Filled puff pastries
Peynirli Poğaça | 11,60 | With cheese and parsley
Ispanaklı Poğaça | 12,50 | With cheese and spinach
Türlü Poğaça | 13,50 | With aubergines, courgettes, carrots, tomato sauce and cheese
Kıymalı Poğaça | 13,50 | With minced beef and tomato sauce
Kıymalı Ispanaklı Poğaça | 14,50 | With minced beef, spinach, cheese and tomato sauce
Sucuklu Poğaça | 14,10 | With Turkish garlic sausage and cheese
Dönerli Poğaça | 15,10 | With döner, cheese and tomato sauce

# Pasta
Makarna | 11,70 | Pasta with tomato sauce and cheese
Mantarlı Makarna | 12,90 | Pasta with mushroom, tomato and cream sauce and cheese
Ispanaklı Makarna | 12,90 | Pasta with spinach, onions and cheese in tomato cream sauce
Sebzeli Makarna | 11,90 | Pasta with vegetable, tomato and cream sauce and cheese
Yoğurtlu Sucuklu Makarna | 13,50 | Pasta with tomato sauce, Turkish garlic sausage, yoghurt sauce and cheese
Kıymalı Makarna | 12,50 | Pasta with a sauce of minced meat, peppers, onions and tomatoes
Hindili Makarna | 14,50 | Pasta with turkey and cheese in tomato cream sauce
Kuşbaşılı Makarna | 16,90 | Pasta with finely diced lamb, peppers, onions and tomatoes

# Sides
Chips | 3,80 | Homemade
Pilav | 2,90 | Turkish-style rice
Garlic yoghurt sauce | 2,50
Yoghurt cream dressing | 2,50 | Salad dressing

# For our little guests
Kids’ makarna | 5,50
Kids’ pide | 5,50
Kids’ börek | 6,50
Kids’ döner | 7,10

# Desserts
Künefe | 7,90 | Shredded pastry with melted cheese in syrup, topped with pistachios
Baklava | 7,20 | Sweet layered pastry filled with hazelnuts, served with ice cream
Sütlaç | 6,90 | Turkish rice pudding
Ballı Yoğurt | 6,80 | Yoghurt with honey and hazelnuts
Turkish halva | 5,90 | Turkish halva with lemon

# Hot drinks
Turkish coffee | 3,90
Turkish black tea | 3,10
Turkish apple tea | 3,10
Fresh mint tea | 3,90 | With fresh mint
Camomile tea | 3,10
Rosehip tea | 3,10
Green tea | 3,10
Espresso | 2,10
Espresso Macchiato | 2,70
Coffee | 2,80
Cappuccino | 3,90
Café au lait | 3,90
Latte Macchiato | 4,10
Hot chocolate | 4,20

# Soft drinks
Ayran | 3,30 | Homemade
Coca-Cola | 3,30
Coca-Cola Light | 3,30
Fanta | 3,30
Sprite | 3,30
Mezzo Mix | 3,30
Bitter Lemon | 3,20
Iced tea | 3,30
Bionade red | 3,40
Karamalz | 3,40 | Non-alcoholic malt drink
Apple juice spritzer | 3,30
Orange juice spritzer | 3,30
Still water | 2,60
Table water | 2,60

# Juices & nectars | 0.3 l each
Orange juice | 3,40
Apple juice | 3,40
Grape juice | 3,40
Multivitamin juice | 3,40
Banana nectar | 3,40
Blackcurrant nectar | 3,40
Cherry nectar | 3,40
Passion fruit nectar | 3,40
Mango nectar | 3,40

# Beer
Efes Pilsen | 4,20 | 0.33 l bottle
Radeberger Pilsner 0.3 l | 3,80 | On tap
Radeberger Pilsner 0.4 l | 4,30 | On tap
Shandy 0.3 l | 3,80 | On tap, beer with lemonade
Shandy 0.4 l | 4,30 | On tap, beer with lemonade
Wheat beer | 4,30 | 0.5 l bottle
Wheat beer, alcohol-free | 4,30 | 0.5 l bottle
Dark wheat beer | 4,30 | 0.5 l bottle
Crystal wheat beer | 4,30 | 0.5 l bottle
Wheat beer with banana | 4,50 | 0.5 l
Wheat beer with cherry | 4,50 | 0.5 l
Wheat beer with cola | 4,50 | 0.5 l
Alcohol-free beer | 4,20 | 0.33 l bottle

# Turkish wines | Glass 0.25 l · bottle 0.75 l
Villa Doluca white, dry · glass | 6,80 | 0.25 l
Villa Doluca white, dry · bottle | 18,80 | 0.75 l
Villa Doluca red, dry · glass | 6,80 | 0.25 l
Villa Doluca red, dry · bottle | 18,80 | 0.75 l
Yakut red, dry · glass | 6,40 | 0.25 l
Yakut red, dry · bottle | 17,90 | 0.75 l
Antik red, dry · glass | 8,90 | 0.25 l
Antik red, dry · bottle | 20,90 | 0.75 l
Lal rosé, dry · glass | 6,90 | 0.25 l
Lal rosé, dry · bottle | 18,90 | 0.75 l
Small glass of wine | 3,90 | 0.125 l

# Quality wines from Baden | 0.25 l each
Pinot gris | 6,20 | White
Gutedel (Chasselas) | 6,20 | White
Müller-Thurgau | 5,50 | White, dry
Weißherbst | 5,50 | Rosé, medium dry
Pinot noir | 5,50 | Red, dry
Wine spritzer | 4,80 | Wine spritzer, red or white, sweet or dry
Small glass of Baden wine | 3,90 | 0.125 l, no spritzer

# Aperitifs & spirits
Aperol Spritz | 7,50
Hugo | 6,50
Piccolo | 6,20 | Sparkling wine, 0.2 l
Campari Orange | 5,80 | 4 cl
Martini Bianco | 5,80 | 5 cl
Bacardi | 5,80 | 4 cl
Baileys | 5,80 | 4 cl
Asbach | 5,90 | 4 cl
Whisky | 7,70 | 4 cl
Fernet-Branca | 3,10 | 2 cl
Ramazzotti | 3,10 | 2 cl

# Rakı & schnapps
Rakı 2 cl | 3,70
Rakı 4 cl | 7,10
Rakı 0.25 l | 30,00
Fruit brandy | 3,10 | 2 cl
Kirsch | 3,10 | 2 cl
Williams pear brandy | 3,70 | 2 cl$tr$::text,
  'tr', $tr$# Başlangıçlar
Günlük Çorba | 5,90 | Taze günün çorbası
Havuç Tarator | 4,90 | Sarımsaklı ve havuçlu süzme yoğurt, Türk baharatlarıyla
Haydari | 5,20 | Sarımsaklı ve naneli süzme yoğurt, Türk baharatlarıyla
Ispanak Tarator | 5,70 | Sarımsaklı ve ıspanaklı süzme yoğurt, Türk baharatlarıyla
Cacık | 6,10 | Salatalık, nane ve sarımsaklı taze yoğurt
Patlıcan Kızartma | 6,90 | Sarımsaklı yoğurt soslu patlıcan kızartması
Kabak Kızartma | 6,90 | Sarımsaklı yoğurt soslu kabak kızartması
Sarımsaklı Ekmek | 6,90 | Hafif sarımsaklı ekmek
Peynirli Sigara Böreği | 7,10 | Peynirli sigara böreği
Kıymalı Sigara Böreği | 7,10 | Kıyma ve soğanlı sigara böreği
Ispanaklı Sigara Böreği | 7,10 | Ispanak ve soğanlı sigara böreği
Zeytinyağlı Sarma | 6,50 | Yoğurt sos üzerinde pirinçli yaprak sarma
Karışık Meze (küçük) | 8,90 | Beyaz peynir, zeytin, turşu biber ve domatesli soğuk meze tabağı
Karışık Meze (büyük, iki kişilik) | 15,90 | İki kişilik büyük karışık meze tabağı
Acika | 5,90 | Doğu baharatlı acılı beyaz peynir ezmesi
Humus | 5,90 | Nohut ezmesi

# Salatalar
Küçük Salata | 5,90 | Küçük salata: salatalık, havuç, lahana ve peynirli yeşil salata, yoğurtlu kremalı sos
Büyük Salata | 9,90 | Büyük salata: salatalık, havuç, lahana ve peynirli yeşil salata, yoğurtlu kremalı sos
Çoban Salatası | 10,50 | Domates, salatalık, soğan, maydanoz ve peynir, sirkeli zeytinyağı sos
Patlıcan Salatası | 7,50 | Biber, domates ve sarımsaklı patlıcan salatası
Mevsim Salatası | 9,50 | Mevsim salatası
Ton Balıklı Salata | 10,90 | Domates, zeytin, mısır, salatalık ve yeşilliklerle ton balıklı salata, ev yapımı yoğurt sos
Hindi Salatası | 11,90 | Hindi göğsü dilimli karışık salata, ev yapımı yoğurt sos
Köy Salatası | 9,50 | Zeytinyağlı köy salatası

# Doğu lezzetleri
Patlıcan Ezme | 12,90 | Sarımsaklı yoğurtlu patlıcan, tereyağı ve domatesle
Anadolu Peynir | 16,90 | Güveçte beyaz peynirli domates yahnisi, salata ile
Karnıyarık | 18,50 | Fırında kıymalı karnıyarık, domates sos ve tereyağlı pilav
Kabak Oturtma | 18,50 | Kıymalı fırın kabak, domates sos ve pilav
Ali Nazik | 18,10 | Közlenmiş patlıcan, biber ve domates üzerinde kavrulmuş kıyma, sarımsaklı yoğurt
Hünkâr Beğendi | 19,90 | Patlıcan beğendi üzerinde kuzu eti, domates ve maydanozla, taze pide ekmeği ile

# Ocakbaşı ızgaralar
Pilavlı Köfte | 16,90 | Izgara köfte, pilav ve sarımsaklı yoğurt sos ile
Salatalı Köfte | 16,90 | Izgara köfte, köy salatası ve sarımsaklı yoğurt sos ile
Peynirli Sarımsaklı Köfte | 17,90 | Beyaz peynir ve sarımsak dolgulu köfte, pilav ve sarımsaklı yoğurt sos ile
Pilavlı Pirzola | 21,90 | Kuzu pirzola, pilav ve sarımsaklı yoğurt sos ile
Salatalı Pirzola | 21,90 | Kuzu pirzola, köy salatası ve sarımsaklı yoğurt sos ile
Tavuk Izgara | 19,90 | Kemiksiz yarım tavuk, patates kızartması ve salata ile
Kuzu Şiş | 22,90 | Kuzu şiş, pilav ve sarımsaklı yoğurt sos ile
Hindi Şiş | 21,90 | Hindi şiş, pilav ve sarımsaklı yoğurt sos ile
Adana Şiş | 19,90 | Adana kebap, pilav veya patates kızartması ve sarımsaklı yoğurt sos ile
Karışık Et Tabağı | 27,90 | Kuzu şiş, pirzola, döner, köfte ve hindi şiş; pilav, sarımsaklı yoğurt ve salata ile
Karışık Et Tabağı (iki kişilik) | 54,90 | İki kişilik karışık ızgara tabağı

# Döner
İskender Özel | 17,90 | Taze susamlı ekmek üzerinde döner, domates, sarımsaklı yoğurt ve domates sos
Pilavlı Döner | 14,50 | Pilav üstü döner, sarımsaklı yoğurt sos ile
Salatalı Döner | 14,50 | Köy salatalı döner, sarımsaklı yoğurt sos ile
Patatesli Döner | 14,50 | Patates kızartmalı döner, sarımsaklı yoğurt sos ile

# Taş fırından güveçler | Toprak kapta, taze pide ekmeği ile
Musakka | 15,40 | Patates, patlıcan, kabak, domates, sarımsak ve soğan üzerinde baharatlı kıyma
Sebzeli Kiremit | 14,40 | Patates, patlıcan, kabak, karnabahar, biber, soğan, domates ve sarımsaklı sebze güveç
Melemen | 14,40 | Domates, biber, soğan, maydanoz ve sarımsaklı fırın menemen, yumurtalı
Sebzeli Hindi Kiremit | 16,90 | Domates soslu sebzeli hindi güveç
Sebzeli Kuzu Kiremit | 18,50 | Domates soslu sebzeli kuzu güveç

# Tava yemekleri | Pilav ile servis edilir
Hindi Tava Kavurma | 17,50 | Domates soslu biber, soğan ve mantarlı hindi kavurma
Kuzu Tava Kavurma | 19,90 | Domates soslu biber, soğan ve mantarlı kuzu kavurma
Pilavlı Kızartma | 14,90 | Domates soslu patlıcan, kabak ve havuç

# Saç tava
Saç Mercimek | 13,50 | Mercimek, taze biber, patates, soğan ve domates sos
Saç Fasulye | 14,80 | Kuru fasulye, makarna, taze biber, soğan, sucuk ve domates sos
Saç Sebzeli | 13,50 | Makarnalı sebze, domates sos
Saç Döner | 17,90 | Taze domates, biber, patates ve domates soslu döner
Saç Hindi Özel | 19,90 | Taze domates, biber, patates ve domates soslu kuşbaşı hindi
Saç Kuzu Özel | 22,90 | Taze domates, biber, patates ve domates soslu kuşbaşı kuzu

# Pide
Domatesli Peynirli Pide | 14,90 | Domates sos, maydanoz ve kaşar
Karışık Pide | 14,90 | Patlıcan, kabak, havuç, mantar, sucuk, domates sos ve kaşar
Mantarlı Pide | 14,50 | Mantar, domates sos ve kaşar
Kızartmalı Pide | 14,50 | Patlıcan, kabak, havuç, mantar, biber, domates sos ve kaşar
Ispanaklı Pide | 13,90 | Ispanak, yumurta, domates sos ve kaşar
Mantarlı Sucuklu Pide | 15,50 | Mantar, sucuk, domates sos ve kaşar
Kıymalı Mantarlı Pide | 15,50 | Dana kıyma, mantar, soğan, maydanoz, domates sos ve kaşar
Dönerli Pide | 15,90 | Döner, domates sos ve kaşar

# Lahmacun ve pizza | Orijinal pizza, 33 cm
Lahmacun | 10,50 | Kıymalı lahmacun, yeşillik ile
Margherita | 10,90 | Domates sos ve kaşar
Ton Balıklı Pizza | 13,90 | Ton balığı, soğan, domates sos ve kaşar
Sucuklu Pizza | 13,90 | Sucuk, domates sos ve kaşar
Ispanaklı Pizza | 13,90 | Ispanak, domates sos ve kaşar
Mantarlı Pizza | 13,90 | Mantar, domates sos ve kaşar
Salami Pizza | 13,90 | Salam, domates sos ve kaşar
Sebzeli Pizza | 13,90 | Patlıcan, kabak, domates sos ve kaşar
Turşulu Pizza | 13,90 | Turşu biber, domates sos ve kaşar
Pizza Divan Özel | 14,90 | Kıyma, mantar, ıspanak, domates sos ve kaşar
Dönerli Pizza | 13,90 | Döner, domates sos ve kaşar

# Börek | İç dolgulu börekler
Peynirli Börek | 12,90 | Peynir ve maydanozlu
Ispanaklı Börek | 13,50 | Peynir ve ıspanaklı
Türlü Börek | 15,90 | Peynir, patlıcan, kabak, havuç ve domates soslu
Sucuklu Börek | 18,90 | Peynir ve sucuklu
Kıymalı Börek | 14,50 | Peynir ve dana kıymalı
Kıymalı Ispanaklı Börek | 16,50 | Peynir, dana kıyma ve ıspanaklı
Divan Börek | 17,90 | Peynir, sucuk, ıspanak, dana kıyma, kabak, patlıcan ve sarımsaklı
Dönerli Börek | 17,90 | Peynir, döner ve domates soslu

# Poğaça | İç dolgulu milföy
Peynirli Poğaça | 11,60 | Peynir ve maydanozlu
Ispanaklı Poğaça | 12,50 | Peynir ve ıspanaklı
Türlü Poğaça | 13,50 | Patlıcan, kabak, havuç, domates sos ve peynirli
Kıymalı Poğaça | 13,50 | Dana kıyma ve domates soslu
Kıymalı Ispanaklı Poğaça | 14,50 | Dana kıyma, ıspanak, peynir ve domates soslu
Sucuklu Poğaça | 14,10 | Sucuk ve peynirli
Dönerli Poğaça | 15,10 | Döner, peynir ve domates soslu

# Makarnalar
Makarna | 11,70 | Domates soslu peynirli makarna
Mantarlı Makarna | 12,90 | Mantarlı domatesli krema soslu peynirli makarna
Ispanaklı Makarna | 12,90 | Domatesli krema soslu ıspanak, soğan ve peynirli makarna
Sebzeli Makarna | 11,90 | Sebzeli domatesli krema soslu peynirli makarna
Yoğurtlu Sucuklu Makarna | 13,50 | Domates soslu sucuklu makarna, yoğurt ve peynirle
Kıymalı Makarna | 12,50 | Kıyma, biber, soğan ve domates soslu makarna
Hindili Makarna | 14,50 | Domatesli krema soslu hindili peynirli makarna
Kuşbaşılı Makarna | 16,90 | Kuşbaşı kuzu eti, biber, soğan ve domatesli makarna

# Yan ürünler
Patates kızartması | 3,80 | Ev yapımı
Pilav | 2,90 | Pirinç pilavı
Sarımsaklı yoğurt sos | 2,50
Yoğurtlu kremalı salata sosu | 2,50 | Salata sosu

# Küçük misafirlerimiz için
Çocuk makarnası | 5,50
Çocuk pidesi | 5,50
Çocuk böreği | 6,50
Çocuk döneri | 7,10

# Tatlılar
Künefe | 7,90 | Şerbetli, eriyen peynirli ve antep fıstıklı künefe
Baklava | 7,20 | Fındıklı baklava, dondurma ile
Sütlaç | 6,90 | Fırın sütlaç
Ballı Yoğurt | 6,80 | Bal ve fındıklı yoğurt
Helva | 5,90 | Limonlu helva

# Sıcak içecekler
Türk kahvesi | 3,90
Çay | 3,10
Elma çayı | 3,10
Taze nane çayı | 3,90 | Taze naneli
Papatya çayı | 3,10
Kuşburnu çayı | 3,10
Yeşil çay | 3,10
Espresso | 2,10
Espresso Macchiato | 2,70
Filtre kahve | 2,80
Cappuccino | 3,90
Sütlü kahve | 3,90
Latte Macchiato | 4,10
Sıcak çikolata | 4,20

# Alkolsüz içecekler
Ayran | 3,30 | Ev yapımı
Coca-Cola | 3,30
Coca-Cola Light | 3,30
Fanta | 3,30
Sprite | 3,30
Mezzo Mix | 3,30
Bitter Lemon | 3,20
Soğuk çay | 3,30
Bionade kırmızı | 3,40
Karamalz | 3,40 | Alkolsüz malt içeceği
Sodalı elma suyu | 3,30
Sodalı portakal suyu | 3,30
Su | 2,60
Maden suyu | 2,60

# Meyve suları | Her biri 30 cl
Portakal suyu | 3,40
Elma suyu | 3,40
Üzüm suyu | 3,40
Karışık meyve suyu | 3,40
Muz nektarı | 3,40
Frenk üzümü nektarı | 3,40
Vişne nektarı | 3,40
Çarkıfelek nektarı | 3,40
Mango nektarı | 3,40

# Bira
Efes Pilsen | 4,20 | 33 cl şişe
Radeberger Pilsner 30 cl | 3,80 | Fıçı
Radeberger Pilsner 40 cl | 4,30 | Fıçı
Radler 30 cl | 3,80 | Fıçı, limonatalı bira
Radler 40 cl | 4,30 | Fıçı, limonatalı bira
Buğday birası | 4,30 | 50 cl şişe
Alkolsüz buğday birası | 4,30 | 50 cl şişe
Koyu buğday birası | 4,30 | 50 cl şişe
Kristal buğday birası | 4,30 | 50 cl şişe
Muzlu buğday birası | 4,50 | 50 cl
Vişneli buğday birası | 4,50 | 50 cl
Kolalı buğday birası | 4,50 | 50 cl
Alkolsüz bira | 4,20 | 33 cl şişe

# Türk şarapları | Kadeh 25 cl · şişe 75 cl
Villa Doluca beyaz, sek · kadeh | 6,80 | 25 cl
Villa Doluca beyaz, sek · şişe | 18,80 | 75 cl
Villa Doluca kırmızı, sek · kadeh | 6,80 | 25 cl
Villa Doluca kırmızı, sek · şişe | 18,80 | 75 cl
Yakut kırmızı, sek · kadeh | 6,40 | 25 cl
Yakut kırmızı, sek · şişe | 17,90 | 75 cl
Antik kırmızı, sek · kadeh | 8,90 | 25 cl
Antik kırmızı, sek · şişe | 20,90 | 75 cl
Lal roze, sek · kadeh | 6,90 | 25 cl
Lal roze, sek · şişe | 18,90 | 75 cl
Küçük kadeh şarap | 3,90 | 12,5 cl

# Baden kalite şarapları | Her biri 25 cl
Grauburgunder (beyaz) | 6,20 | Beyaz
Gutedel (beyaz) | 6,20 | Beyaz
Müller-Thurgau | 5,50 | Beyaz, sek
Weißherbst | 5,50 | Roze, dömisek
Spätburgunder (kırmızı) | 5,50 | Kırmızı, sek
Sodalı şarap | 4,80 | Sodalı şarap, kırmızı veya beyaz, tatlı veya ekşi
Küçük kadeh Baden şarabı | 3,90 | 12,5 cl, sodasız

# Aperatifler ve sert içkiler
Aperol Spritz | 7,50
Hugo | 6,50
Piccolo | 6,20 | Köpüklü şarap, 20 cl
Campari Orange | 5,80 | 4 cl
Martini Bianco | 5,80 | 5 cl
Bacardi | 5,80 | 4 cl
Baileys | 5,80 | 4 cl
Asbach | 5,90 | 4 cl
Viski | 7,70 | 4 cl
Fernet-Branca | 3,10 | 2 cl
Ramazzotti | 3,10 | 2 cl

# Rakı ve likörler
Rakı 2 cl | 3,70
Rakı 4 cl | 7,10
Rakı 25 cl | 30,00
Meyve brendisi | 3,10 | 2 cl
Kiraz brendisi | 3,10 | 2 cl
Armut brendisi | 3,70 | 2 cl$tr$::text,
  'fr', $tr$# Entrées
Günlük Çorba | 5,90 | Soupe du jour
Havuç Tarator | 4,90 | Fromage blanc au yaourt, ail et carottes, aux épices turques
Haydari | 5,20 | Fromage blanc au yaourt, ail et menthe, aux épices turques
Ispanak Tarator | 5,70 | Fromage blanc au yaourt, ail et épinards, aux épices turques
Cacık | 6,10 | Yaourt frais au concombre, à la menthe et à l’ail
Patlıcan Kızartma | 6,90 | Aubergines frites, sauce au yaourt à l’ail
Kabak Kızartma | 6,90 | Courgettes frites, sauce au yaourt à l’ail
Sarımsaklı Ekmek | 6,90 | Pain à l’ail doux
Peynirli Sigara Böreği | 7,10 | Rouleaux de pâte croustillants au fromage
Kıymalı Sigara Böreği | 7,10 | Rouleaux de pâte croustillants à la viande hachée et aux oignons
Ispanaklı Sigara Böreği | 7,10 | Rouleaux de pâte croustillants aux épinards et aux oignons
Zeytinyağlı Sarma | 6,50 | Feuilles de vigne farcies au riz, sur sauce au yaourt
Karışık Meze (petit) | 8,90 | Assiette froide de mezzés : fromage de brebis, olives, piments marinés et tomates
Karışık Meze (grand, pour deux) | 15,90 | Grande assiette de mezzés pour deux personnes
Acika | 5,90 | Tartinade épicée de fromage de brebis aux épices orientales
Houmous | 5,90 | Crème de pois chiches

# Salades
Küçük Salata | 5,90 | Petite salade : salade verte, concombre, carottes, chou, fromage et sauce yaourt-crème
Büyük Salata | 9,90 | Grande salade : salade verte, concombre, carottes, chou, fromage et sauce yaourt-crème
Çoban Salatası | 10,50 | Tomates, concombre, oignons, persil et fromage, vinaigrette
Patlıcan Salatası | 7,50 | Fine salade d’aubergines aux poivrons, tomates et ail
Mevsim Salatası | 9,50 | Salade colorée de saison
Ton Balıklı Salata | 10,90 | Salade de thon : tomates, olives, maïs, concombre, salade verte et sauce yaourt maison
Hindi Salatası | 11,90 | Salade mixte aux lamelles de blanc de dinde, sauce yaourt maison
Köy Salatası | 9,50 | Salade colorée façon village à l’huile d’olive

# Spécialités orientales
Patlıcan Ezme | 12,90 | Aubergines frites, sauce au yaourt à l’ail, beurre et tomates
Anadolu Peynir | 16,90 | Ragoût de tomates au fromage de brebis cuit en pot de terre, avec une salade
Karnıyarık | 18,50 | Aubergines au four farcies de viande hachée épicée, sauce tomate et riz au beurre
Kabak Oturtma | 18,50 | Barquettes de courgettes au four farcies de viande hachée, sauce tomate et riz
Ali Nazik | 18,10 | Viande hachée poêlée sur ragoût d’aubergines, poivrons et tomates, sauce au yaourt à l’ail
Hünkâr Beğendi | 19,90 | Agneau mijoté sur purée d’aubergines, tomates et persil, avec pain plat frais

# Grillades au charbon de bois
Pilavlı Köfte | 16,90 | Boulettes de viande avec riz et sauce au yaourt à l’ail
Salatalı Köfte | 16,90 | Boulettes de viande, salade villageoise et sauce au yaourt à l’ail
Peynirli Sarımsaklı Köfte | 17,90 | Boulettes farcies au fromage de brebis et à l’ail, avec riz et sauce au yaourt à l’ail
Pilavlı Pirzola | 21,90 | Côtelettes d’agneau avec riz et sauce au yaourt à l’ail
Salatalı Pirzola | 21,90 | Côtelettes d’agneau, salade villageoise et sauce au yaourt à l’ail
Tavuk Izgara | 19,90 | Demi-poulet désossé, frites et salade
Kuzu Şiş | 22,90 | Brochette d’agneau avec riz et sauce au yaourt à l’ail
Hindi Şiş | 21,90 | Brochette de dinde avec riz et sauce au yaourt à l’ail
Adana Şiş | 19,90 | Brochette de viande hachée épicée, riz ou frites et sauce au yaourt à l’ail
Karışık Et Tabağı | 27,90 | Grillades mixtes : brochette d’agneau, côtelettes, döner, boulettes et brochette de dinde, riz, sauce au yaourt à l’ail et salade
Karışık Et Tabağı pour deux | 54,90 | Les grillades mixtes pour deux personnes

# Döner kebab
İskender spécial | 17,90 | Döner sur pain frais au sésame, tomates, sauce au yaourt à l’ail et sauce tomate
Pilavlı Döner | 14,50 | Döner avec riz à la turque et sauce au yaourt à l’ail
Salatalı Döner | 14,50 | Döner avec salade villageoise et sauce au yaourt à l’ail
Pommesli Döner | 14,50 | Döner avec frites et sauce au yaourt à l’ail

# Gratins au four à pierre | Servi en plat de terre cuite, avec pain plat frais
Musakka | 15,40 | Viande hachée épicée sur pommes de terre, aubergines, courgettes, tomates, ail et oignons
Sebzeli Kiremit | 14,40 | Gratin de légumes : pommes de terre, aubergines, courgettes, chou-fleur, poivrons, oignons, tomates et ail
Melemen | 14,40 | Mijoté gratiné de tomates, poivrons, oignons, persil et ail, avec un œuf au plat
Sebzeli Hindi Kiremit | 16,90 | Lamelles de dinde tendres aux légumes, sauce tomate
Sebzeli Kuzu Kiremit | 18,50 | Agneau tendre aux légumes, sauce tomate

# Plats à la poêle | Servi avec du riz
Hindi Tava Kavurma | 17,50 | Dinde aux poivrons frais, oignons et champignons, sauce tomate
Kuzu Tava Kavurma | 19,90 | Agneau aux poivrons frais, oignons et champignons, sauce tomate
Pilavlı Kızartma | 14,90 | Aubergines, courgettes et carottes, sauce tomate

# Saç, la poêle grésillante
Saç Mercimek | 13,50 | Lentilles, poivrons frais, pommes de terre, oignons et sauce tomate
Saç Fasulye | 14,80 | Haricots blancs, pâtes, poivrons frais, oignons, saucisse turque à l’ail et sauce tomate
Saç Sebzeli | 13,50 | Légumes aux pâtes, sauce tomate
Saç Döner | 17,90 | Döner aux tomates fraîches, poivrons, pommes de terre et sauce tomate
Saç Hindi spécial | 19,90 | Dés de dinde aux tomates fraîches, poivrons, pommes de terre et sauce tomate
Saç Kuzu spécial | 22,90 | Dés d’agneau aux tomates fraîches, poivrons, pommes de terre et sauce tomate

# Pide
Domatesli Peynirli Pide | 14,90 | Sauce tomate, persil et fromage
Karışık Pide | 14,90 | Aubergines, courgettes, carottes, champignons, saucisse turque à l’ail, sauce tomate et fromage
Mantarlı Pide | 14,50 | Champignons, sauce tomate et fromage
Kızartmalı Pide | 14,50 | Aubergines, courgettes, carottes, champignons, poivrons, sauce tomate et fromage
Ispanaklı Pide | 13,90 | Épinards, œuf au plat, sauce tomate et fromage
Mantarlı Sucuklu Pide | 15,50 | Champignons, saucisse turque à l’ail, sauce tomate et fromage
Kıymalı Mantarlı Pide | 15,50 | Bœuf haché, champignons, oignons, persil, sauce tomate et fromage
Dönerli Pide | 15,90 | Döner, sauce tomate et fromage

# Lahmacun et pizza | Pizza originale, 33 cm
Lahmacun | 10,50 | Pizza turque à la viande hachée épicée, avec salade
Margherita | 10,90 | Sauce tomate et fromage
Pizza au thon | 13,90 | Thon, oignons, sauce tomate et fromage
Pizza au sucuk | 13,90 | Saucisse turque à l’ail, sauce tomate et fromage
Pizza aux épinards | 13,90 | Épinards, sauce tomate et fromage
Pizza aux champignons | 13,90 | Champignons, sauce tomate et fromage
Pizza salami | 13,90 | Salami, sauce tomate et fromage
Pizza aux légumes | 13,90 | Aubergines, courgettes, sauce tomate et fromage
Pizza aux piments | 13,90 | Piments marinés, sauce tomate et fromage
Pizza Divan spéciale | 14,90 | Viande hachée, champignons, épinards, sauce tomate et fromage
Pizza au döner | 13,90 | Döner, sauce tomate et fromage

# Börek | Feuilletés farcis
Peynirli Börek | 12,90 | Au fromage et au persil
Ispanaklı Börek | 13,50 | Au fromage et aux épinards
Türlü Börek | 15,90 | Au fromage, aubergines, courgettes, carottes et sauce tomate
Sucuklu Börek | 18,90 | Au fromage et à la saucisse turque à l’ail
Kıymalı Börek | 14,50 | Au fromage et au bœuf haché
Kıymalı Ispanaklı Börek | 16,50 | Au fromage, bœuf haché et épinards
Divan Börek | 17,90 | Au fromage, saucisse turque, épinards, bœuf haché, courgettes, aubergines et ail
Dönerli Börek | 17,90 | Au fromage, döner et sauce tomate

# Poğaça | Chaussons feuilletés farcis
Peynirli Poğaça | 11,60 | Au fromage et au persil
Ispanaklı Poğaça | 12,50 | Au fromage et aux épinards
Türlü Poğaça | 13,50 | Aux aubergines, courgettes, carottes, sauce tomate et fromage
Kıymalı Poğaça | 13,50 | Au bœuf haché et sauce tomate
Kıymalı Ispanaklı Poğaça | 14,50 | Au bœuf haché, épinards, fromage et sauce tomate
Sucuklu Poğaça | 14,10 | À la saucisse turque à l’ail et au fromage
Dönerli Poğaça | 15,10 | Au döner, fromage et sauce tomate

# Pâtes
Makarna | 11,70 | Pâtes à la sauce tomate et au fromage
Mantarlı Makarna | 12,90 | Pâtes, sauce crème-tomate aux champignons et fromage
Ispanaklı Makarna | 12,90 | Pâtes aux épinards, oignons et fromage, sauce crème-tomate
Sebzeli Makarna | 11,90 | Pâtes, sauce crème-tomate aux légumes et fromage
Yoğurtlu Sucuklu Makarna | 13,50 | Pâtes à la sauce tomate, saucisse turque à l’ail, sauce yaourt et fromage
Kıymalı Makarna | 12,50 | Pâtes, sauce à la viande hachée, poivrons, oignons et tomates
Hindili Makarna | 14,50 | Pâtes à la dinde et au fromage, sauce crème-tomate
Kuşbaşılı Makarna | 16,90 | Pâtes aux petits dés d’agneau, poivrons, oignons et tomates

# Accompagnements
Frites | 3,80 | Maison
Pilav | 2,90 | Riz à la turque
Sauce au yaourt à l’ail | 2,50
Sauce yaourt-crème | 2,50 | Sauce pour salade

# Pour nos petits invités
Makarna enfant | 5,50
Pide enfant | 5,50
Börek enfant | 6,50
Döner enfant | 7,10

# Desserts
Künefe | 7,90 | Cheveux d’ange au fromage fondu, sirop et pistaches
Baklava | 7,20 | Pâte feuilletée sucrée aux noisettes, avec glace
Sütlaç | 6,90 | Riz au lait à la turque
Ballı Yoğurt | 6,80 | Yaourt au miel et aux noisettes
Halva turque | 5,90 | Halva au citron

# Boissons chaudes
Café turc | 3,90
Thé noir turc | 3,10
Thé turc à la pomme | 3,10
Thé à la menthe fraîche | 3,90 | À la menthe fraîche
Infusion de camomille | 3,10
Infusion d’églantier | 3,10
Thé vert | 3,10
Espresso | 2,10
Espresso macchiato | 2,70
Café | 2,80
Cappuccino | 3,90
Café au lait | 3,90
Latte macchiato | 4,10
Chocolat chaud | 4,20

# Boissons sans alcool
Ayran | 3,30 | Fait maison
Coca-Cola | 3,30
Coca-Cola Light | 3,30
Fanta | 3,30
Sprite | 3,30
Mezzo Mix | 3,30
Bitter Lemon | 3,20
Thé glacé | 3,30
Bionade rouge | 3,40
Karamalz | 3,40 | Boisson au malt sans alcool
Jus de pomme pétillant | 3,30
Jus d’orange pétillant | 3,30
Eau plate | 2,60
Eau de table | 2,60

# Jus et nectars | 0,3 l chacun
Jus d’orange | 3,40
Jus de pomme | 3,40
Jus de raisin | 3,40
Jus multivitaminé | 3,40
Nectar de banane | 3,40
Nectar de cassis | 3,40
Nectar de cerise | 3,40
Nectar de fruit de la passion | 3,40
Nectar de mangue | 3,40

# Bières
Efes Pilsen | 4,20 | Bouteille 0,33 l
Radeberger Pilsner 0,3 l | 3,80 | À la pression
Radeberger Pilsner 0,4 l | 4,30 | À la pression
Panaché 0,3 l | 3,80 | À la pression, bière et limonade
Panaché 0,4 l | 4,30 | À la pression, bière et limonade
Bière blanche | 4,30 | Bouteille 0,5 l
Bière blanche sans alcool | 4,30 | Bouteille 0,5 l
Bière blanche brune | 4,30 | Bouteille 0,5 l
Bière blanche filtrée | 4,30 | Bouteille 0,5 l
Bière blanche à la banane | 4,50 | 0,5 l
Bière blanche à la cerise | 4,50 | 0,5 l
Bière blanche au cola | 4,50 | 0,5 l
Bière sans alcool | 4,20 | Bouteille 0,33 l

# Vins turcs | Verre 0,25 l · bouteille 0,75 l
Villa Doluca blanc, sec · verre | 6,80 | 0,25 l
Villa Doluca blanc, sec · bouteille | 18,80 | 0,75 l
Villa Doluca rouge, sec · verre | 6,80 | 0,25 l
Villa Doluca rouge, sec · bouteille | 18,80 | 0,75 l
Yakut rouge, sec · verre | 6,40 | 0,25 l
Yakut rouge, sec · bouteille | 17,90 | 0,75 l
Antik rouge, sec · verre | 8,90 | 0,25 l
Antik rouge, sec · bouteille | 20,90 | 0,75 l
Lal rosé, sec · verre | 6,90 | 0,25 l
Lal rosé, sec · bouteille | 18,90 | 0,75 l
Petit verre de vin | 3,90 | 0,125 l

# Vins de qualité du pays de Bade | 0,25 l chacun
Pinot gris | 6,20 | Blanc
Gutedel (chasselas) | 6,20 | Blanc
Müller-Thurgau | 5,50 | Blanc, sec
Weißherbst | 5,50 | Rosé, demi-sec
Pinot noir | 5,50 | Rouge, sec
Vin coupé à l’eau gazeuse | 4,80 | Rouge ou blanc, doux ou sec
Petit verre de vin de Bade | 3,90 | 0,125 l, sans eau gazeuse

# Apéritifs et spiritueux
Aperol Spritz | 7,50
Hugo | 6,50
Piccolo | 6,20 | Vin mousseux, 0,2 l
Campari orange | 5,80 | 4 cl
Martini Bianco | 5,80 | 5 cl
Bacardi | 5,80 | 4 cl
Baileys | 5,80 | 4 cl
Asbach | 5,90 | 4 cl
Whisky | 7,70 | 4 cl
Fernet-Branca | 3,10 | 2 cl
Ramazzotti | 3,10 | 2 cl

# Rakı et eaux-de-vie
Rakı 2 cl | 3,70
Rakı 4 cl | 7,10
Rakı 0,25 l | 30,00
Eau-de-vie de fruits | 3,10 | 2 cl
Kirsch | 3,10 | 2 cl
Williams (eau-de-vie de poire) | 3,70 | 2 cl$tr$::text,
  'ar', $tr$# المقبلات
شوربة اليوم | 5,90 | شوربة طازجة يومية
تراتور بالجزر | 4,90 | لبنة بالثوم والجزر مع توابل تركية
حيدري | 5,20 | لبنة بالثوم والنعناع مع توابل تركية
تراتور بالسبانخ | 5,70 | لبنة بالثوم والسبانخ مع توابل تركية
جاجيك | 6,10 | لبن طازج بالخيار والنعناع والثوم
باذنجان مقلي | 6,90 | باذنجان مقلي مع صلصة لبن بالثوم
كوسا مقلية | 6,90 | كوسا مقلية مع صلصة لبن بالثوم
خبز بالثوم | 6,90 | خبز بالثوم خفيف
سيغارة بوريك بالجبن | 7,10 | لفائف عجين مقرمشة محشوة بالجبن
سيغارة بوريك باللحم | 7,10 | لفائف عجين مقرمشة محشوة باللحم المفروم والبصل
سيغارة بوريك بالسبانخ | 7,10 | لفائف عجين مقرمشة محشوة بالسبانخ والبصل
ورق عنب بزيت الزيتون | 6,50 | ورق عنب محشو بالأرز على صلصة اللبن
مازة مشكلة (صغيرة) | 8,90 | طبق مقبلات باردة: جبن غنم وزيتون وفلفل مخلل وطماطم
مازة مشكلة (كبيرة لشخصين) | 15,90 | طبق مقبلات مشكلة كبير لشخصين
أجيكا | 5,90 | دهنة حارة من جبن الغنم بتوابل شرقية
حمص | 5,90 | كريمة الحمص

# السلطات
سلطة صغيرة | 5,90 | سلطة خضراء صغيرة مع خيار وجزر وملفوف وجبن وصلصة اللبن والقشطة
سلطة كبيرة | 9,90 | سلطة خضراء كبيرة مع خيار وجزر وملفوف وجبن وصلصة اللبن والقشطة
سلطة الراعي | 10,50 | طماطم وخيار وبصل وبقدونس وجبن مع صلصة الخل والزيت
سلطة الباذنجان | 7,50 | سلطة باذنجان ناعمة مع الفلفل والطماطم والثوم
سلطة الموسم | 9,50 | طبق سلطة ملونة موسمية
سلطة التونة | 10,90 | تونة مع طماطم وزيتون وذرة وخيار وخس وصلصة لبن منزلية
سلطة الديك الرومي | 11,90 | سلطة مشكلة مع شرائح صدر الديك الرومي وصلصة لبن منزلية
سلطة القرية | 9,50 | سلطة ملونة على الطريقة الريفية بزيت الزيتون

# أطباق شرقية
باذنجان باللبن | 12,90 | باذنجان مقلي مع صلصة لبن بالثوم وزبدة وطماطم
جبن الأناضول | 16,90 | يخنة طماطم بجبن الغنم في قدر فخاري مع طبق سلطة
كارنيارك | 18,50 | باذنجان بالفرن محشو باللحم المفروم المتبل مع صلصة الطماطم وأرز بالزبدة
كوسا بالفرن | 18,50 | كوسا بالفرن محشوة باللحم المفروم مع صلصة الطماطم والأرز
علي نازك | 18,10 | لحم مفروم محمر على يخنة الباذنجان والفلفل والطماطم مع لبن بالثوم
هنكار بيندي | 19,90 | لحم غنم مطهو على بيوريه الباذنجان مع الطماطم والبقدونس وخبز طازج

# مشاوي على الفحم
كفتة مع أرز | 16,90 | كرات لحم مشوية مع أرز وصلصة لبن بالثوم
كفتة مع سلطة | 16,90 | كرات لحم مشوية مع سلطة القرية وصلصة لبن بالثوم
كفتة بالجبن والثوم | 17,90 | كرات لحم محشوة بجبن الغنم والثوم مع أرز وصلصة لبن بالثوم
ريش غنم مع أرز | 21,90 | ريش غنم مشوية مع أرز وصلصة لبن بالثوم
ريش غنم مع سلطة | 21,90 | ريش غنم مشوية مع سلطة القرية وصلصة لبن بالثوم
دجاج مشوي | 19,90 | نصف دجاجة مشوية بدون عظم مع بطاطا مقلية وسلطة
شيش لحم غنم | 22,90 | سيخ لحم غنم مع أرز وصلصة لبن بالثوم
شيش ديك رومي | 21,90 | سيخ ديك رومي مع أرز وصلصة لبن بالثوم
كباب أضنة | 19,90 | سيخ لحم مفروم متبل مع أرز أو بطاطا مقلية وصلصة لبن بالثوم
مشاوي مشكلة | 27,90 | شيش غنم وريش ودونر وكفتة وشيش ديك رومي مع أرز ولبن بالثوم وسلطة
مشاوي مشكلة لشخصين | 54,90 | طبق المشاوي المشكلة لشخصين

# دونر كباب
إسكندر كباب | 17,90 | دونر على خبز طازج بالسمسم مع طماطم ولبن بالثوم وصلصة طماطم
دونر مع أرز | 14,50 | دونر مع أرز على الطريقة التركية وصلصة لبن بالثوم
دونر مع سلطة | 14,50 | دونر مع سلطة القرية وصلصة لبن بالثوم
دونر مع بطاطا | 14,50 | دونر مع بطاطا مقلية وصلصة لبن بالثوم

# أطباق الفرن الحجري | تقدم في طبق فخاري مع خبز طازج
مسقعة | 15,40 | لحم مفروم متبل على البطاطا والباذنجان والكوسا والطماطم والثوم والبصل
كيرميت بالخضار | 14,40 | خضار بالفرن: بطاطا وباذنجان وكوسا وقرنبيط وفلفل وبصل وطماطم وثوم
منمن | 14,40 | يخنة بالفرن من الطماطم والفلفل والبصل والبقدونس والثوم مع بيضة مقلية
كيرميت ديك رومي بالخضار | 16,90 | شرائح ديك رومي طرية مع الخضار بصلصة الطماطم
كيرميت لحم غنم بالخضار | 18,50 | قطع لحم غنم طرية مع الخضار بصلصة الطماطم

# أطباق المقلاة | تقدم مع الأرز
تافا ديك رومي | 17,50 | ديك رومي مع فلفل طازج وبصل وفطر بصلصة الطماطم
تافا لحم غنم | 19,90 | لحم غنم مع فلفل طازج وبصل وفطر بصلصة الطماطم
خضار مقلية مع أرز | 14,90 | باذنجان وكوسا وجزر بصلصة الطماطم

# صاج
صاج بالعدس | 13,50 | عدس وفلفل طازج وبطاطا وبصل وصلصة طماطم
صاج بالفاصولياء | 14,80 | فاصولياء بيضاء ومعكرونة وفلفل طازج وبصل وسجق تركي وصلصة طماطم
صاج بالخضار | 13,50 | خضار مع معكرونة بصلصة الطماطم
صاج دونر | 17,90 | دونر مع طماطم طازجة وفلفل وبطاطا وصلصة طماطم
صاج ديك رومي خاص | 19,90 | مكعبات ديك رومي مع طماطم طازجة وفلفل وبطاطا وصلصة طماطم
صاج لحم غنم خاص | 22,90 | مكعبات لحم غنم مع طماطم طازجة وفلفل وبطاطا وصلصة طماطم

# بيدا
بيدا بالجبن والطماطم | 14,90 | صلصة طماطم وبقدونس وجبن
بيدا مشكلة | 14,90 | باذنجان وكوسا وجزر وفطر وسجق تركي وصلصة طماطم وجبن
بيدا بالفطر | 14,50 | فطر وصلصة طماطم وجبن
بيدا بالخضار المقلية | 14,50 | باذنجان وكوسا وجزر وفطر وفلفل وصلصة طماطم وجبن
بيدا بالسبانخ | 13,90 | سبانخ وبيضة وصلصة طماطم وجبن
بيدا بالفطر والسجق | 15,50 | فطر وسجق تركي وصلصة طماطم وجبن
بيدا باللحم والفطر | 15,50 | لحم بقر مفروم وفطر وبصل وبقدونس وصلصة طماطم وجبن
بيدا بالدونر | 15,90 | دونر وصلصة طماطم وجبن

# لحم بعجين وبيتزا | بيتزا أصلية، 33 سم
لحم بعجين (لاهماجون) | 10,50 | رقائق عجين باللحم المفروم المتبل مع سلطة
بيتزا مارغريتا | 10,90 | صلصة طماطم وجبن
بيتزا بالتونة | 13,90 | تونة وبصل وصلصة طماطم وجبن
بيتزا بالسجق | 13,90 | سجق تركي وصلصة طماطم وجبن
بيتزا بالسبانخ | 13,90 | سبانخ وصلصة طماطم وجبن
بيتزا بالفطر | 13,90 | فطر وصلصة طماطم وجبن
بيتزا سلامي | 13,90 | سلامي وصلصة طماطم وجبن
بيتزا بالخضار | 13,90 | باذنجان وكوسا وصلصة طماطم وجبن
بيتزا بالفلفل المخلل | 13,90 | فلفل مخلل وصلصة طماطم وجبن
بيتزا ديوان الخاصة | 14,90 | لحم مفروم وفطر وسبانخ وصلصة طماطم وجبن
بيتزا بالدونر | 13,90 | دونر وصلصة طماطم وجبن

# بوريك | فطائر محشوة
بوريك بالجبن | 12,90 | بالجبن والبقدونس
بوريك بالسبانخ | 13,50 | بالجبن والسبانخ
بوريك بالخضار | 15,90 | بالجبن والباذنجان والكوسا والجزر وصلصة الطماطم
بوريك بالسجق | 18,90 | بالجبن والسجق التركي
بوريك باللحم | 14,50 | بالجبن ولحم البقر المفروم
بوريك باللحم والسبانخ | 16,50 | بالجبن ولحم البقر المفروم والسبانخ
بوريك ديوان | 17,90 | بالجبن والسجق والسبانخ واللحم المفروم والكوسا والباذنجان والثوم
بوريك بالدونر | 17,90 | بالجبن والدونر وصلصة الطماطم

# بوغاتشا | فطائر بالعجين المورق محشوة
بوغاتشا بالجبن | 11,60 | بالجبن والبقدونس
بوغاتشا بالسبانخ | 12,50 | بالجبن والسبانخ
بوغاتشا بالخضار | 13,50 | بالباذنجان والكوسا والجزر وصلصة الطماطم والجبن
بوغاتشا باللحم | 13,50 | بلحم البقر المفروم وصلصة الطماطم
بوغاتشا باللحم والسبانخ | 14,50 | بلحم البقر المفروم والسبانخ والجبن وصلصة الطماطم
بوغاتشا بالسجق | 14,10 | بالسجق التركي والجبن
بوغاتشا بالدونر | 15,10 | بالدونر والجبن وصلصة الطماطم

# المعكرونة
معكرونة | 11,70 | معكرونة بصلصة الطماطم والجبن
معكرونة بالفطر | 12,90 | معكرونة بصلصة الفطر والطماطم والقشطة مع الجبن
معكرونة بالسبانخ | 12,90 | معكرونة بالسبانخ والبصل والجبن بصلصة الطماطم والقشطة
معكرونة بالخضار | 11,90 | معكرونة بصلصة الخضار والطماطم والقشطة مع الجبن
معكرونة بالسجق واللبن | 13,50 | معكرونة بصلصة الطماطم والسجق التركي واللبن والجبن
معكرونة باللحم المفروم | 12,50 | معكرونة بصلصة اللحم المفروم والفلفل والبصل والطماطم
معكرونة بالديك الرومي | 14,50 | معكرونة بالديك الرومي والجبن بصلصة الطماطم والقشطة
معكرونة بلحم الغنم | 16,90 | معكرونة بمكعبات لحم الغنم الصغيرة والفلفل والبصل والطماطم

# الأطباق الجانبية
بطاطا مقلية | 3,80 | محضرة في المطعم
أرز تركي | 2,90 | أرز على الطريقة التركية
صلصة اللبن بالثوم | 2,50
صلصة اللبن والقشطة | 2,50 | صلصة للسلطة

# لضيوفنا الصغار
معكرونة للأطفال | 5,50
بيدا للأطفال | 5,50
بوريك للأطفال | 6,50
دونر للأطفال | 7,10

# الحلويات
كنافة | 7,90 | كنافة بالجبن الذائب والقطر والفستق الحلبي
بقلاوة | 7,20 | بقلاوة بالبندق مع الآيس كريم
سوتلاش (أرز بالحليب) | 6,90 | أرز بالحليب على الطريقة التركية
لبن بالعسل | 6,80 | لبن بالعسل والبندق
حلاوة تركية | 5,90 | حلاوة بالليمون

# المشروبات الساخنة
قهوة تركية | 3,90
شاي تركي | 3,10
شاي التفاح التركي | 3,10
شاي بالنعناع الطازج | 3,90 | بالنعناع الطازج
شاي البابونج | 3,10
شاي ثمر الورد | 3,10
شاي أخضر | 3,10
إسبريسو | 2,10
إسبريسو ماكياتو | 2,70
قهوة | 2,80
كابتشينو | 3,90
قهوة بالحليب | 3,90
لاتيه ماكياتو | 4,10
شوكولاتة ساخنة | 4,20

# المشروبات الغازية والباردة
عيران | 3,30 | محضر في المطعم
كوكا كولا | 3,30
كوكا كولا لايت | 3,30
فانتا | 3,30
سبرايت | 3,30
ميتزو ميكس | 3,30
بيتر ليمون | 3,20
شاي مثلج | 3,30
بيوناده الحمراء | 3,40
كارامالتس | 3,40 | مشروب شعير بدون كحول
عصير تفاح بالصودا | 3,30
عصير برتقال بالصودا | 3,30
ماء | 2,60
ماء معدني | 2,60

# العصائر | 0.3 لتر للكأس
عصير برتقال | 3,40
عصير تفاح | 3,40
عصير عنب | 3,40
عصير فواكه مشكلة | 3,40
نكتار الموز | 3,40
نكتار الكشمش الأسود | 3,40
نكتار الكرز | 3,40
نكتار الباشن فروت | 3,40
نكتار المانجو | 3,40

# البيرة
إفس بيلسن | 4,20 | زجاجة 0.33 لتر
رادبيرغر بيلسنر 0.3 لتر | 3,80 | من البرميل
رادبيرغر بيلسنر 0.4 لتر | 4,30 | من البرميل
رادلر 0.3 لتر | 3,80 | من البرميل، بيرة مع ليموناضة
رادلر 0.4 لتر | 4,30 | من البرميل، بيرة مع ليموناضة
بيرة القمح | 4,30 | زجاجة 0.5 لتر
بيرة القمح بدون كحول | 4,30 | زجاجة 0.5 لتر
بيرة القمح الداكنة | 4,30 | زجاجة 0.5 لتر
بيرة القمح الصافية | 4,30 | زجاجة 0.5 لتر
بيرة القمح بالموز | 4,50 | 0.5 لتر
بيرة القمح بالكرز | 4,50 | 0.5 لتر
بيرة القمح بالكولا | 4,50 | 0.5 لتر
بيرة بدون كحول | 4,20 | زجاجة 0.33 لتر

# النبيذ التركي | كأس 0.25 لتر · زجاجة 0.75 لتر
فيلا دولوجا أبيض جاف · كأس | 6,80 | 0.25 لتر
فيلا دولوجا أبيض جاف · زجاجة | 18,80 | 0.75 لتر
فيلا دولوجا أحمر جاف · كأس | 6,80 | 0.25 لتر
فيلا دولوجا أحمر جاف · زجاجة | 18,80 | 0.75 لتر
ياقوت أحمر جاف · كأس | 6,40 | 0.25 لتر
ياقوت أحمر جاف · زجاجة | 17,90 | 0.75 لتر
أنتيك أحمر جاف · كأس | 8,90 | 0.25 لتر
أنتيك أحمر جاف · زجاجة | 20,90 | 0.75 لتر
لال روزيه جاف · كأس | 6,90 | 0.25 لتر
لال روزيه جاف · زجاجة | 18,90 | 0.75 لتر
كأس نبيذ صغير | 3,90 | 0.125 لتر

# نبيذ بادن الفاخر | 0.25 لتر للكأس
غراوبورغوندر | 6,20 | أبيض
غوتيدل | 6,20 | أبيض
مولر تورغاو | 5,50 | أبيض جاف
فايسهيربست | 5,50 | روزيه نصف جاف
شبيتبورغوندر | 5,50 | أحمر جاف
نبيذ بالصودا | 4,80 | أحمر أو أبيض، حلو أو جاف
كأس صغير من نبيذ بادن | 3,90 | 0.125 لتر، بدون صودا

# المشروبات الروحية
أبيرول سبريتز | 7,50
هوغو | 6,50
بيكولو | 6,20 | نبيذ فوار 0.2 لتر
كامباري بالبرتقال | 5,80 | 4 سل
مارتيني بيانكو | 5,80 | 5 سل
باكاردي | 5,80 | 4 سل
بيليز | 5,80 | 4 سل
أسباخ | 5,90 | 4 سل
ويسكي | 7,70 | 4 سل
فرنيه برانكا | 3,10 | 2 سل
رامازوتي | 3,10 | 2 سل

# العرق التركي والمشروبات المقطرة
عرق تركي 2 سل | 3,70
عرق تركي 4 سل | 7,10
عرق تركي 0.25 لتر | 30,00
براندي الفاكهة | 3,10 | 2 سل
براندي الكرز | 3,10 | 2 سل
براندي الكمثرى | 3,70 | 2 سل$tr$::text,
  'ru', $tr$# Закуски
Суп дня | 5,90 | Свежий суп дня
Хавуч таратор | 4,90 | Йогуртовый крем с чесноком и морковью, с турецкими специями
Хайдари | 5,20 | Йогуртовый крем с чесноком и мятой, с турецкими специями
Ыспанак таратор | 5,70 | Йогуртовый крем с чесноком и шпинатом, с турецкими специями
Джаджык | 6,10 | Свежий йогурт с огурцом, мятой и чесноком
Жареные баклажаны | 6,90 | Жареные баклажаны с чесночно-йогуртовым соусом
Жареные кабачки | 6,90 | Жареные кабачки с чесночно-йогуртовым соусом
Чесночный хлеб | 6,90 | Мягкий чесночный хлеб
Сигара бёрек с сыром | 7,10 | Хрустящие рулетики из теста с сыром
Сигара бёрек с фаршем | 7,10 | Хрустящие рулетики из теста с фаршем и луком
Сигара бёрек со шпинатом | 7,10 | Хрустящие рулетики из теста со шпинатом и луком
Долма из виноградных листьев | 6,50 | Виноградные листья с рисом на йогуртовом соусе
Ассорти мезе (малое) | 8,90 | Холодная закуска: овечий сыр, оливки, маринованный перец и помидоры
Ассорти мезе (большое, на двоих) | 15,90 | Большое ассорти закусок на двоих
Аджика | 5,90 | Острая паста из овечьего сыра с восточными специями
Хумус | 5,90 | Крем из нута

# Салаты
Малый салат | 5,90 | Зелёный салат с огурцом, морковью, капустой, сыром и йогуртово-сливочной заправкой
Большой салат | 9,90 | Большая порция: зелёный салат с огурцом, морковью, капустой, сыром и йогуртово-сливочной заправкой
Чобан салат | 10,50 | Помидоры, огурцы, лук, петрушка и сыр с уксусно-масляной заправкой
Салат из баклажанов | 7,50 | Нежный салат из баклажанов с перцем, помидорами и чесноком
Сезонный салат | 9,50 | Яркий сезонный салат
Салат с тунцом | 10,90 | Тунец, помидоры, оливки, кукуруза, огурцы, листья салата и домашняя йогуртовая заправка
Салат с индейкой | 11,90 | Микс салатов с ломтиками грудки индейки и домашней йогуртовой заправкой
Деревенский салат | 9,50 | Яркий салат по-деревенски с оливковым маслом

# Восточные блюда
Патлыджан эзме | 12,90 | Жареные баклажаны с чесночно-йогуртовым соусом, сливочным маслом и помидорами
Анадолу пейнир | 16,90 | Томатное рагу с овечьим сыром в глиняном горшочке, с салатом
Карныярык | 18,50 | Запечённые баклажаны с пряным фаршем, томатным соусом и рисом на сливочном масле
Кабак отуртма | 18,50 | Запечённые лодочки из кабачков с фаршем, томатным соусом и рисом
Али Назик | 18,10 | Обжаренный фарш на рагу из баклажанов, перца и помидоров с чесночным йогуртом
Хюнкяр бегенди | 19,90 | Тушёная баранина на пюре из баклажанов с помидорами и петрушкой, со свежей лепёшкой

# С мангала
Кёфте с рисом | 16,90 | Котлеты-кёфте на гриле с рисом и чесночно-йогуртовым соусом
Кёфте с салатом | 16,90 | Кёфте на гриле с деревенским салатом и чесночно-йогуртовым соусом
Кёфте с сыром и чесноком | 17,90 | Кёфте с начинкой из овечьего сыра и чеснока с рисом и чесночно-йогуртовым соусом
Бараньи рёбрышки с рисом | 21,90 | Бараньи котлеты на косточке с рисом и чесночно-йогуртовым соусом
Бараньи рёбрышки с салатом | 21,90 | Бараньи котлеты на косточке с деревенским салатом и чесночно-йогуртовым соусом
Тавук ызгара | 19,90 | Половина цыплёнка без костей с картофелем фри и салатом
Шашлык из баранины | 22,90 | Шашлык из баранины с рисом и чесночно-йогуртовым соусом
Шашлык из индейки | 21,90 | Шашлык из индейки с рисом и чесночно-йогуртовым соусом
Адана-кебаб | 19,90 | Пряный люля-кебаб с рисом или картофелем фри и чесночно-йогуртовым соусом
Ассорти с мангала | 27,90 | Шашлык из баранины, рёбрышки, донер, кёфте и шашлык из индейки с рисом, чесночным йогуртом и салатом
Ассорти с мангала на двоих | 54,90 | Ассорти с мангала на двоих

# Донер-кебаб
Искендер-кебаб | 17,90 | Донер на свежем хлебе с кунжутом, с помидорами, чесночным йогуртом и томатным соусом
Донер с рисом | 14,50 | Донер с рисом по-турецки и чесночно-йогуртовым соусом
Донер с салатом | 14,50 | Донер с деревенским салатом и чесночно-йогуртовым соусом
Донер с картофелем фри | 14,50 | Донер с картофелем фри и чесночно-йогуртовым соусом

# Из каменной печи | Подаётся в глиняной посуде со свежей лепёшкой
Мусака | 15,40 | Пряный фарш на картофеле, баклажанах, кабачках, помидорах, чесноке и луке
Кирэмит с овощами | 14,40 | Овощи, запечённые в глине: картофель, баклажаны, кабачки, цветная капуста, перец, лук, помидоры и чеснок
Менемен | 14,40 | Запечённое рагу из помидоров, перца, лука, петрушки и чеснока с яичницей
Кирэмит с индейкой | 16,90 | Нежная индейка с овощами в томатном соусе
Кирэмит с бараниной | 18,50 | Нежная баранина с овощами в томатном соусе

# Блюда на сковороде | Подаётся с рисом
Индейка тава кавурма | 17,50 | Индейка со свежим перцем, луком и шампиньонами в томатном соусе
Баранина тава кавурма | 19,90 | Баранина со свежим перцем, луком и шампиньонами в томатном соусе
Овощи с рисом | 14,90 | Баклажаны, кабачки и морковь в томатном соусе

# Садж
Садж с чечевицей | 13,50 | Чечевица, свежий перец, картофель, лук и томатный соус
Садж с фасолью | 14,80 | Белая фасоль, макароны, свежий перец, лук, турецкая колбаса суджук и томатный соус
Садж с овощами | 13,50 | Овощи с макаронами в томатном соусе
Садж с донером | 17,90 | Донер со свежими помидорами, перцем, картофелем и томатным соусом
Садж с индейкой | 19,90 | Кусочки индейки со свежими помидорами, перцем, картофелем и томатным соусом
Садж с бараниной | 22,90 | Кусочки баранины со свежими помидорами, перцем, картофелем и томатным соусом

# Пиде
Пиде с сыром и томатами | 14,90 | Томатный соус, петрушка и сыр
Пиде ассорти | 14,90 | Баклажаны, кабачки, морковь, шампиньоны, суджук, томатный соус и сыр
Пиде с грибами | 14,50 | Шампиньоны, томатный соус и сыр
Пиде с овощами | 14,50 | Баклажаны, кабачки, морковь, шампиньоны, перец, томатный соус и сыр
Пиде со шпинатом | 13,90 | Шпинат, яйцо, томатный соус и сыр
Пиде с грибами и суджуком | 15,50 | Шампиньоны, суджук, томатный соус и сыр
Пиде с фаршем и грибами | 15,50 | Говяжий фарш, шампиньоны, лук, петрушка, томатный соус и сыр
Пиде с донером | 15,90 | Донер, томатный соус и сыр

# Лахмаджун и пицца | Настоящая пицца, 33 см
Лахмаджун | 10,50 | Турецкая лепёшка с пряным фаршем и салатом
Маргарита | 10,90 | Томатный соус и сыр
Пицца с тунцом | 13,90 | Тунец, лук, томатный соус и сыр
Пицца с суджуком | 13,90 | Турецкая колбаса суджук, томатный соус и сыр
Пицца со шпинатом | 13,90 | Шпинат, томатный соус и сыр
Пицца с грибами | 13,90 | Шампиньоны, томатный соус и сыр
Пицца с салями | 13,90 | Салями, томатный соус и сыр
Овощная пицца | 13,90 | Баклажаны, кабачки, томатный соус и сыр
Пицца с маринованным перцем | 13,90 | Маринованный перец, томатный соус и сыр
Пицца «Диван» | 14,90 | Фарш, шампиньоны, шпинат, томатный соус и сыр
Пицца с донером | 13,90 | Донер, томатный соус и сыр

# Бёрек | Пироги с начинкой
Бёрек с сыром | 12,90 | С сыром и петрушкой
Бёрек со шпинатом | 13,50 | С сыром и шпинатом
Бёрек с овощами | 15,90 | С сыром, баклажанами, кабачками, морковью и томатным соусом
Бёрек с суджуком | 18,90 | С сыром и турецкой колбасой суджук
Бёрек с фаршем | 14,50 | С сыром и говяжьим фаршем
Бёрек с фаршем и шпинатом | 16,50 | С сыром, говяжьим фаршем и шпинатом
Бёрек «Диван» | 17,90 | С сыром, суджуком, шпинатом, фаршем, кабачками, баклажанами и чесноком
Бёрек с донером | 17,90 | С сыром, донером и томатным соусом

# Погача | Слойки с начинкой
Погача с сыром | 11,60 | С сыром и петрушкой
Погача со шпинатом | 12,50 | С сыром и шпинатом
Погача с овощами | 13,50 | С баклажанами, кабачками, морковью, томатным соусом и сыром
Погача с фаршем | 13,50 | С говяжьим фаршем и томатным соусом
Погача с фаршем и шпинатом | 14,50 | С говяжьим фаршем, шпинатом, сыром и томатным соусом
Погача с суджуком | 14,10 | С суджуком и сыром
Погача с донером | 15,10 | С донером, сыром и томатным соусом

# Паста
Макарна | 11,70 | Паста с томатным соусом и сыром
Паста с грибами | 12,90 | Паста с грибным томатно-сливочным соусом и сыром
Паста со шпинатом | 12,90 | Паста со шпинатом, луком и сыром в томатно-сливочном соусе
Паста с овощами | 11,90 | Паста с овощным томатно-сливочным соусом и сыром
Паста с суджуком и йогуртом | 13,50 | Паста с томатным соусом, суджуком, йогуртовым соусом и сыром
Паста с фаршем | 12,50 | Паста с соусом из фарша, перца, лука и помидоров
Паста с индейкой | 14,50 | Паста с индейкой и сыром в томатно-сливочном соусе
Паста с бараниной | 16,90 | Паста с мелко нарезанной бараниной, перцем, луком и помидорами

# Гарниры
Картофель фри | 3,80 | Домашний
Плов | 2,90 | Рис по-турецки
Чесночно-йогуртовый соус | 2,50
Йогуртово-сливочная заправка | 2,50 | Заправка для салата

# Для маленьких гостей
Детская паста | 5,50
Детская пиде | 5,50
Детский бёрек | 6,50
Детский донер | 7,10

# Десерты
Кюнефе | 7,90 | Тонкие нити теста с тянущимся сыром в сиропе, с фисташками
Пахлава | 7,20 | Слоёная пахлава с фундуком и мороженым
Сютлач | 6,90 | Турецкий рисовый пудинг
Йогурт с мёдом | 6,80 | Йогурт с мёдом и фундуком
Турецкая халва | 5,90 | Халва с лимоном

# Горячие напитки
Турецкий кофе | 3,90
Турецкий чай | 3,10
Турецкий яблочный чай | 3,10
Чай со свежей мятой | 3,90 | Со свежей мятой
Ромашковый чай | 3,10
Чай из шиповника | 3,10
Зелёный чай | 3,10
Эспрессо | 2,10
Эспрессо макиато | 2,70
Кофе | 2,80
Капучино | 3,90
Кофе с молоком | 3,90
Латте макиато | 4,10
Горячий шоколад | 4,20

# Безалкогольные напитки
Айран | 3,30 | Собственного приготовления
Кока-кола | 3,30
Кока-кола лайт | 3,30
Фанта | 3,30
Спрайт | 3,30
Меццо микс | 3,30
Биттер лемон | 3,20
Холодный чай | 3,30
Бионаде красная | 3,40
Карамальц | 3,40 | Безалкогольный солодовый напиток
Яблочный сок с газировкой | 3,30
Апельсиновый сок с газировкой | 3,30
Вода без газа | 2,60
Столовая вода | 2,60

# Соки и нектары | По 0,3 л
Апельсиновый сок | 3,40
Яблочный сок | 3,40
Виноградный сок | 3,40
Мультивитаминный сок | 3,40
Банановый нектар | 3,40
Нектар чёрной смородины | 3,40
Вишнёвый нектар | 3,40
Нектар маракуйи | 3,40
Манговый нектар | 3,40

# Пиво
Эфес Пилсен | 4,20 | Бутылка 0,33 л
Радебергер Пилснер 0,3 л | 3,80 | Разливное
Радебергер Пилснер 0,4 л | 4,30 | Разливное
Радлер 0,3 л | 3,80 | Разливное, пиво с лимонадом
Радлер 0,4 л | 4,30 | Разливное, пиво с лимонадом
Пшеничное светлое | 4,30 | Бутылка 0,5 л
Пшеничное безалкогольное | 4,30 | Бутылка 0,5 л
Пшеничное тёмное | 4,30 | Бутылка 0,5 л
Пшеничное фильтрованное | 4,30 | Бутылка 0,5 л
Пшеничное с бананом | 4,50 | 0,5 л
Пшеничное с вишней | 4,50 | 0,5 л
Пшеничное с колой | 4,50 | 0,5 л
Безалкогольное пиво | 4,20 | Бутылка 0,33 л

# Турецкие вина | Бокал 0,25 л · бутылка 0,75 л
Вилла Долуджа белое сухое · бокал | 6,80 | 0,25 л
Вилла Долуджа белое сухое · бутылка | 18,80 | 0,75 л
Вилла Долуджа красное сухое · бокал | 6,80 | 0,25 л
Вилла Долуджа красное сухое · бутылка | 18,80 | 0,75 л
Якут красное сухое · бокал | 6,40 | 0,25 л
Якут красное сухое · бутылка | 17,90 | 0,75 л
Антик красное сухое · бокал | 8,90 | 0,25 л
Антик красное сухое · бутылка | 20,90 | 0,75 л
Лал розовое сухое · бокал | 6,90 | 0,25 л
Лал розовое сухое · бутылка | 18,90 | 0,75 л
Маленький бокал вина | 3,90 | 0,125 л

# Качественные вина Бадена | По 0,25 л
Граубургундер | 6,20 | Белое
Гутедель | 6,20 | Белое
Мюллер-Тургау | 5,50 | Белое сухое
Вайсхербст | 5,50 | Розовое полусухое
Шпетбургундер | 5,50 | Красное сухое
Вино с газировкой | 4,80 | Красное или белое, сладкое или сухое
Маленький бокал баденского вина | 3,90 | 0,125 л, без газировки

# Аперитивы и крепкие напитки
Апероль шприц | 7,50
Хуго | 6,50
Пикколо | 6,20 | Игристое вино, 0,2 л
Кампари с апельсином | 5,80 | 4 cl
Мартини Бьянко | 5,80 | 5 cl
Бакарди | 5,80 | 4 cl
Бейлис | 5,80 | 4 cl
Асбах | 5,90 | 4 cl
Виски | 7,70 | 4 cl
Фернет-Бранка | 3,10 | 2 cl
Рамаццотти | 3,10 | 2 cl

# Ракы и шнапсы
Ракы 2 cl | 3,70
Ракы 4 cl | 7,10
Ракы 0,25 л | 30,00
Фруктовый шнапс | 3,10 | 2 cl
Вишнёвый шнапс | 3,10 | 2 cl
Грушевый шнапс «Вильямс» | 3,70 | 2 cl$tr$::text
))
where slug = 'divan';

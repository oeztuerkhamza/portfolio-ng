/**
 * Gerichte der Sichelschmiede mit Bildbeschreibung für die Foto-Erzeugung
 * (scripts/generate-dish-photos.mjs). `de` ist der Name auf der Karte, `slug`
 * der Dateiname unter public/menu/sichelschmiede/, `prompt` die englische
 * Beschreibung des Tellers — Bildmodelle verstehen Englisch deutlich besser.
 *
 * Alles, was auf allen Fotos gleich sein soll (Licht, Tisch, Teller, Linse),
 * steht in PROMPT_PREFIX/SUFFIX, damit die Bilder wie aus einem Shooting wirken.
 */
export const PROMPT_PREFIX = 'professional food photography, ';
export const PROMPT_SUFFIX =
  ', rustic dark oak table, white porcelain plate, soft natural window light from the left, shallow depth of field, 85mm lens, appetizing, high detail, magazine quality';
export const NEGATIVE =
  'text, watermark, logo, people, hands, blurry, cartoon, illustration, deformed, overexposed, plastic, oversaturated, cluttered';

export const DISHES = [
  { slug: 'tomatencremesuppe', de: 'Tomatencremesuppe', prompt: 'creamy tomato soup in a white bowl with a melted golden cheese crust on top, fresh basil leaf' },
  { slug: 'maultaschensuppe', de: 'Maultaschensuppe', prompt: 'clear beef broth with sliced Swabian maultaschen, chives and fried onion rings in a deep white soup bowl' },
  { slug: 'schneckenpfaennle', de: 'Badisches Schneckenpfännle', prompt: 'small cast iron pan with six snails baked in garlic herb butter, baguette slices, parsley' },
  { slug: 'beilagensalat', de: 'Gemischter Beilagensalat', prompt: 'small mixed side salad with lettuce, tomato, cucumber and carrot in a white bowl' },
  { slug: 'salatteller', de: 'Großer gemischter Salatteller', prompt: 'large mixed salad plate with colorful raw vegetables, grated carrot, tomato, cucumber, corn, lettuce and house dressing' },
  { slug: 'el-grecco', de: 'Salat „El Grecco“', prompt: "Greek farmer's salad with feta cheese, black olives, pepperoncini, cucumber, tomato and red onion" },
  { slug: 'california', de: 'Salat „California“', prompt: 'salad plate topped with sliced grilled turkey schnitzel and a slice of herb butter, lettuce, tomato, cucumber' },
  { slug: 'salatplatte-lachs', de: 'Salatplatte', prompt: 'salad platter with rolled slices of smoked salmon, lettuce, dill, lemon wedge, cucumber and tomato' },
  { slug: 'filet-mignon', de: 'Filet Mignon', prompt: 'pork tenderloin medallions on toast, surrounded by small colorful side salads' },
  { slug: 'gemuese-kartoffel-gratin', de: 'Gemüse-Kartoffel-Gratin', prompt: 'golden baked potato and vegetable gratin with melted cheese in a ceramic baking dish, zucchini and carrots' },
  { slug: 'freiburger-kaesespaetzle', de: 'Freiburger Käsespätzle', prompt: 'cheese spaetzle with melted cheese and roasted onions, small bowl of green side salad' },
  { slug: 'schwarzwaelder-kaesespaetzle', de: 'Schwarzwälder Käsespätzle', prompt: 'cheese spaetzle with crispy bacon bits and fried onions, small bowl of green side salad' },
  { slug: 'maultaschen', de: 'Schwäbische Maultaschen', prompt: 'Swabian maultaschen with bacon and onion relish, small side salad' },
  { slug: 'tagliatelle-lachs', de: 'Tagliatelle in Sahnesauce', prompt: 'tagliatelle in creamy sauce with smoked salmon and dill, small side salad' },
  { slug: 'grillteller', de: 'Grillteller „Sichelschmiede“', prompt: 'mixed grill plate with beef steak, turkey and pork medallions, pan-fried potatoes and a side salad' },
  { slug: 'schaeufele', de: 'Badisches Schäufele', prompt: 'Baden roast pork shoulder with crispy crackling, pan-fried potatoes and a side salad' },
  { slug: 'schweinesteaks', de: 'Zwei Schweinesteaks', prompt: 'two grilled pork steaks with a slice of herb butter, pan-fried potatoes and a side salad' },
  { slug: 'jaegerschnitzel', de: '„Jägerschnitzel“', prompt: 'plain pork steak with creamy mushroom sauce, spaetzle and a side salad' },
  { slug: 'spanferkelrollbraten', de: 'Spanferkelrollbraten', prompt: 'sliced rolled roast suckling pig with crispy skin, pan-fried potatoes and a side salad' },
  { slug: 'schweinemedaillons', de: 'Schweinemedaillons', prompt: 'pink pork medallions on cognac cream sauce, spaetzle and a side salad' },
  { slug: 'ratsherrenteller', de: '„Ratsherrenteller“', prompt: 'pink roasted pork medallions with spaetzle and steamed vegetables' },
  { slug: 'putenrahmschnitzel', de: 'Putenrahmschnitzel', prompt: 'turkey schnitzel in cream sauce with spaetzle and a side salad' },
  { slug: 'ochsenbaeckle', de: 'Ochsenbäckle', prompt: 'braised beef cheeks with rich dark gravy, spaetzle and a side salad' },
  { slug: 'zwiebelrostbraten', de: 'Zwiebelrostbraten', prompt: 'roast beef steak topped with crispy fried onions and gravy, pan-fried potatoes and a side salad' },
  { slug: 'rumpsteak', de: 'Argentinisches Rumpsteak', prompt: 'Argentinian rump steak cooked medium rare with a slice of herb butter, pan-fried potatoes and a side salad' },
  { slug: 'pfeffersteak', de: 'Pfeffersteak „Madagaskar“', prompt: 'pepper steak with creamy green peppercorn sauce, pan-fried potatoes and a side salad' },
  { slug: 'portion-gemuese', de: 'Portion Gemüse', prompt: 'side dish of steamed seasonal vegetables, carrots, broccoli and cauliflower' },
  { slug: 'portion-braegele', de: 'Portion Brägele', prompt: 'side dish of golden pan-fried potatoes with onions' },
  { slug: 'portion-spaetzle', de: 'Portion Spätzle', prompt: 'side dish of fresh spaetzle with butter and parsley' },
  { slug: 'portion-spaetzle-sauce', de: 'Portion Spätzle mit Sauce', prompt: 'side dish of spaetzle with brown gravy' },
  { slug: 'kinder-spaetzle', de: 'Spätzle mit Bratensauce', prompt: "small children's portion of spaetzle with brown gravy on a small plate" },
  { slug: 'zwei-maultaschen', de: 'Zwei Maultaschen', prompt: 'two maultaschen with a small salad garnish, small portion' },
  { slug: 'kinder-kaesespaetzle', de: 'Käsespätzle', prompt: "small children's portion of cheese spaetzle with a small salad garnish" },
  { slug: 'rote-gruetze', de: 'Rote Grütze', prompt: 'red berry compote dessert with vanilla sauce in a glass bowl' },
  { slug: 'tiramisu', de: 'Tiramisu', prompt: 'a neat square of tiramisu with cocoa dusting' },
  { slug: 'mousse-au-chocolat', de: 'Mousse au Chocolat', prompt: 'chocolate mousse in a glass with whipped cream and chocolate shavings' },
  { slug: 'apfelkuchen', de: 'Stück Apfelkuchen', prompt: 'a slice of apple cake on a plate' },
  { slug: 'apfelkuchen-sahne', de: 'Stück Apfelkuchen mit Sahne', prompt: 'a slice of apple cake with a swirl of whipped cream' },
  { slug: 'oliven', de: 'Portion Oliven', prompt: 'small bowl of mixed marinated olives with herbs' },
  { slug: 'kaeseschuette', de: '„Käseschütte“', prompt: 'diced cheese cubes generously garnished with radish, pickles and onion rings, served with bread on a wooden board' },
  { slug: 'wurstsalat', de: 'Wurstsalat', prompt: 'sausage salad with sliced sausage, onions, pickles and vinaigrette, served with bread' },
  { slug: 'elsaesser-wurstsalat', de: 'Elsässer Wurstsalat', prompt: 'Alsatian sausage salad with sliced sausage, cheese strips and onions, served with bread' },
  { slug: 'muensterkaese', de: 'Elsässer Münsterkäse', prompt: 'Alsatian Munster cheese with caraway seeds, rustic bread and radish' },
  { slug: 'bauernwuerste', de: 'Bauernwürste', prompt: "farmer's sausages with rustic bread and mustard" },
  { slug: 'schinkenspeck', de: 'Schwarzwälder Schinkenspeck', prompt: 'thin slices of Black Forest smoked bacon ham with rustic bread and pickles' },
];

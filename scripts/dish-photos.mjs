/**
 * Gerichte der Sichelschmiede mit Bildbeschreibung für die Foto-Erzeugung
 * (scripts/generate-dish-photos.mjs). `de` ist der Name auf der Karte, `slug`
 * der Dateiname unter public/menu/sichelschmiede/, `prompt` die englische
 * Beschreibung des Tellers — Bildmodelle verstehen Englisch deutlich besser.
 *
 * Alles, was auf allen Fotos gleich sein soll (Licht, Tisch, Teller, Linse),
 * steht in PROMPT_PREFIX/SUFFIX, damit die Bilder wie aus einem Shooting wirken.
 */
export const PROMPT_PREFIX = 'editorial restaurant food photograph, single plated dish, everything served on one single bright white round porcelain plate, ';
export const PROMPT_SUFFIX =
  ', high angle view looking down at 60 degrees, the plate is centered and fills most of the frame, on a rustic dark oak table, soft diffused warm studio light, shallow depth of field, 50mm lens, sharp focus on the food, appetizing, high detail';
export const NEGATIVE =
  'text, watermark, logo, people, hands, blurry, cartoon, illustration, deformed, overexposed, plastic, oversaturated, cluttered, window, landscape, sea, trees, plants, flowers, extra plates, extra bowls, cups, bottles, multiple dishes, pasta, macaroni, side view, wine glass, drinking glass, fork, spoon, knife, cutlery, fried egg, egg yolk, panna cotta, napkin, two plates, multiple plates, side plate, small bowl, sauce cup, casserole dish, baking dish, bread board, dark plate, black plate, grey plate, black spots, berries, candle, vase, flowers, window';

/**
 * Leerer Teller auf dem Tisch: Referenzbild für alle Gerichte. Fooocus nimmt es als
 * „Image Prompt" und übernimmt Teller, Tisch, Wand und Licht; das Gericht kommt allein
 * aus dem Text. So bleiben Hintergrund und Geschirr auf allen Fotos gleich.
 * Erzeugen: node scripts/generate-dish-photos.mjs --url … --make-reference 6
 */
export const REFERENCE_PROMPT =
  'editorial food photography set, high angle view looking down at 60 degrees on one large empty bright white round porcelain dinner plate that fills most of the frame, on a rustic dark oak table with visible wood grain, plain dark charcoal background, soft diffused warm studio light, completely empty plate, nothing else in the picture, shallow depth of field, 50mm lens';

export const DISHES = [
  { slug: 'tomatencremesuppe', de: 'Tomatencremesuppe', prompt: 'creamy tomato soup in a white bowl with a melted golden cheese crust on top, fresh basil leaf' },
  { slug: 'maultaschensuppe', de: 'Maultaschensuppe', prompt: 'clear amber beef consomme in a deep white bowl with sliced round pasta dumplings and fresh chives' },
  { slug: 'schneckenpfaennle', de: 'Badisches Schneckenpfännle', prompt: 'small cast iron pan with six snails baked in garlic herb butter, baguette slices, parsley' },
  { slug: 'beilagensalat', de: 'Gemischter Beilagensalat', prompt: 'small mixed side salad with lettuce, tomato, cucumber and carrot in a white bowl' },
  { slug: 'salatteller', de: 'Großer gemischter Salatteller', prompt: 'large mixed salad plate with colorful raw vegetables, grated carrot, tomato, cucumber, corn, lettuce and house dressing' },
  { slug: 'el-grecco', de: 'Salat „El Grecco“', prompt: "Greek farmer's salad with feta cheese, black olives, pepperoncini, cucumber, tomato and red onion" },
  { slug: 'california', de: 'Salat „California“', prompt: 'salad plate topped with sliced grilled turkey schnitzel and a slice of herb butter, lettuce, tomato, cucumber' },
  { slug: 'salatplatte-lachs', de: 'Salatplatte', prompt: 'thin slices of smoked salmon arranged on the plate with cucumber slices, fresh dill and a lemon wedge' },
  { slug: 'filet-mignon', de: 'Filet Mignon', prompt: 'pork tenderloin medallions on toast, surrounded by small colorful side salads' },
  { slug: 'gemuese-kartoffel-gratin', de: 'Gemüse-Kartoffel-Gratin', prompt: 'a generous portion of golden baked potato and vegetable gratin with melted cheese crust, zucchini and carrot slices, on the plate' },
  { slug: 'freiburger-kaesespaetzle', de: 'Freiburger Käsespätzle', prompt: 'a generous heap of golden cheese spaetzle (small irregular wavy pieces of soft noodle, like fresh spaetzle noodles) with melted cheese and crispy golden fried onions on top, small green salad on the side' },
  { slug: 'schwarzwaelder-kaesespaetzle', de: 'Schwarzwälder Käsespätzle', prompt: 'a generous heap of golden cheese spaetzle (small irregular wavy pieces of soft noodle, like fresh spaetzle noodles) with melted cheese, crispy bacon bits and golden fried onions on top, small green salad on the side' },
  { slug: 'maultaschen', de: 'Schwäbische Maultaschen', prompt: 'Swabian maultaschen with bacon and onion relish, small side salad' },
  { slug: 'tagliatelle-lachs', de: 'Tagliatelle in Sahnesauce', prompt: 'a large generous portion of tagliatelle in creamy sauce with pieces of smoked salmon and dill, filling most of the plate' },
  { slug: 'grillteller', de: 'Grillteller „Sichelschmiede“', prompt: 'sliced beef steak, turkey and pork medallions, pan-fried potatoes and a green salad, all together on the same single plate' },
  { slug: 'schaeufele', de: 'Badisches Schäufele', prompt: 'Baden roast pork shoulder with crispy crackling, pan-fried potatoes and a side salad' },
  { slug: 'schweinesteaks', de: 'Zwei Schweinesteaks', prompt: 'two grilled pork steaks with a slice of herb butter, pan-fried potatoes and a small salad, all on the same single plate' },
  { slug: 'jaegerschnitzel', de: '„Jägerschnitzel“', prompt: 'plain pork steak covered with creamy mushroom sauce, spaetzle noodles and a small salad, all on the same single plate' },
  { slug: 'spanferkelrollbraten', de: 'Spanferkelrollbraten', prompt: 'sliced rolled roast suckling pig with crispy skin, pan-fried potatoes and a small salad, all on the same single plate' },
  { slug: 'schweinemedaillons', de: 'Schweinemedaillons', prompt: 'three pink pork medallions arranged on a pool of cognac cream sauce spread on the plate, with spaetzle and a small side salad' },
  { slug: 'ratsherrenteller', de: '„Ratsherrenteller“', prompt: 'pink roasted pork medallions with spaetzle and steamed vegetables' },
  { slug: 'putenrahmschnitzel', de: 'Putenrahmschnitzel', prompt: 'turkey schnitzel in cream sauce with spaetzle and a side salad' },
  { slug: 'ochsenbaeckle', de: 'Ochsenbäckle', prompt: 'braised beef cheeks with rich dark gravy, spaetzle and a side salad' },
  { slug: 'zwiebelrostbraten', de: 'Zwiebelrostbraten', prompt: 'roast beef steak topped with crispy fried onions and gravy, pan-fried potatoes and a side salad' },
  { slug: 'rumpsteak', de: 'Argentinisches Rumpsteak', prompt: 'Argentinian rump steak cooked medium rare with a slice of herb butter, pan-fried potatoes and a side salad' },
  { slug: 'pfeffersteak', de: 'Pfeffersteak „Madagaskar“', prompt: 'pepper steak with creamy green peppercorn sauce poured over it, pan-fried potatoes and a small salad, all on one plate' },
  { slug: 'portion-gemuese', de: 'Portion Gemüse', prompt: 'side dish of steamed seasonal vegetables, carrots, broccoli and cauliflower' },
  { slug: 'portion-braegele', de: 'Portion Brägele', prompt: 'side dish of golden pan-fried potatoes with onions' },
  { slug: 'portion-spaetzle', de: 'Portion Spätzle', prompt: 'side dish of fresh spaetzle (small irregular wavy pieces of soft noodle, like fresh spaetzle noodles) with butter and parsley' },
  { slug: 'portion-spaetzle-sauce', de: 'Portion Spätzle mit Sauce', prompt: 'side dish of spaetzle with brown gravy' },
  { slug: 'kinder-spaetzle', de: 'Spätzle mit Bratensauce', prompt: 'small portion of spaetzle noodles with a little brown gravy poured over them' },
  { slug: 'zwei-maultaschen', de: 'Zwei Maultaschen', prompt: 'two large square maultaschen pasta pockets, one sliced open showing the filling, with a small salad garnish' },
  { slug: 'kinder-kaesespaetzle', de: 'Käsespätzle', prompt: "small children's portion of cheese spaetzle (small irregular wavy pieces of soft noodle, like fresh spaetzle noodles) with melted cheese and a small salad garnish" },
  { slug: 'rote-gruetze', de: 'Rote Grütze', prompt: 'glossy deep red berry jelly dessert (Rote Gruetze) with red currants and raspberries in a small clear glass bowl standing in the middle of the plate, vanilla sauce' },
  { slug: 'tiramisu', de: 'Tiramisu', prompt: 'a neat square of tiramisu with cocoa dusting' },
  { slug: 'mousse-au-chocolat', de: 'Mousse au Chocolat', prompt: 'chocolate mousse in a glass with whipped cream and chocolate shavings' },
  { slug: 'apfelkuchen', de: 'Stück Apfelkuchen', prompt: 'a slice of apple cake on a plate' },
  { slug: 'apfelkuchen-sahne', de: 'Stück Apfelkuchen mit Sahne', prompt: 'a slice of apple cake with a swirl of whipped cream' },
  { slug: 'oliven', de: 'Portion Oliven', prompt: 'small bowl of mixed marinated olives with herbs' },
  { slug: 'kaeseschuette', de: '„Käseschütte“', prompt: 'diced cheese cubes generously garnished with radish, pickles and onion rings, served with bread on a wooden board' },
  { slug: 'wurstsalat', de: 'Wurstsalat', prompt: 'sausage salad with sliced sausage, onions, pickles and vinaigrette, served with bread' },
  { slug: 'elsaesser-wurstsalat', de: 'Elsässer Wurstsalat', prompt: 'Alsatian sausage salad with sliced sausage, cheese strips and onions, with a slice of bread on the side of the same plate' },
  { slug: 'muensterkaese', de: 'Elsässer Münsterkäse', prompt: 'Alsatian Munster cheese with caraway seeds, rustic bread and radish' },
  { slug: 'bauernwuerste', de: 'Bauernwürste', prompt: "farmer's sausages with rustic bread and mustard" },
  { slug: 'schinkenspeck', de: 'Schwarzwälder Schinkenspeck', prompt: 'thin slices of Black Forest smoked bacon ham with rustic bread and pickles' },
];

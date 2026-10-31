---
id: RES-4285
artifact: research
status: draft
revised: 2026-10-25
elaborates: RES-1200
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Domain G follows the Dutch geometry goals, which place symmetry, nets and coordinates at other groups than the graph does

## Summary

The Dutch goals set each geometry node's group, and four of them differ from the graph. Line symmetry is a group 5 goal, not group 6 (G3). Nets run from group 2 to group 5, with cube and box nets at group 4 (G5). Reading a grid reference such as "vak C5" is a group 6 goal, while the Cartesian axes come only at group 7 (G4). Measuring angles with a protractor and the Cartesian plane appear only in the Russian programme, so they are extensions. The sources support about ten distinct task forms for G1, seven for G3 and nine for G6, and fewer for G2, G4 and G7, so no subtype reaches twenty. Group 1 has no goals of its own, so its templates use the end-of-group-2 goals.

## The question

What must the templates of domain G ask, at which group, so that they cover the Dutch base and mark the Russian extensions, with at least ten distinct task forms per subtype and answer kind? The nodes are G1 (group 1), G2 (7, stretch), G3 (6), G4 (6), G5 (2), G6 (3, with a stretch subtype `blocks`) and G7 (6), from `content/graph.yaml` lines 903 to 986.

## Method

A research agent drafted this record from the extracted source texts; the main session checked a sample of the quotes of the sibling drafts against those texts, and the quotes below were not each rechecked. Read: the SLO tussendoelen with the subdomain tables (lines 2500 to 2650), the per-group geometry blocks (lines 2941, 3173, 4609) and the group 1 note (lines 386 to 395); the SLO concretisation of 1F and 1S, the geometry table (lines 3540 to 3610), the compass and symmetry passages (lines 3859 to 3875, 4021 to 4039), the net passage (line 4095) and the map passages (lines 4267, 4649); the federal programme for grades 1 to 4 (lines 167 to 191, 255 to 305, 399 to 455, 543 to 591) and for grades 5 to 9 (lines 491 to 561, 563 to 642, 664 to 695); the two Moro texts, searched and read at the matches; and the olympiad papers, searched and read at the matches. The RES-1200 geometry rows and RES-0800 node names were read from the repository.

Not obtained or not checked: SPC-0040 was not reopened, so the current answer kinds are taken from the brief; the olympiad papers were read in excerpt, not in full; the Moro texts are OCR and partly garbled; the Russian programme gives content and not tasks, so no Russian task forms are listed except those in the Moro and olympiad texts; and it was not confirmed which column of the concretisation shape table is 1F and which is 1S (the right-hand column carries the longer list and is read as 1S).

## Findings

### The Dutch goals set each node's group

| Node | Graph group | Dutch goal and group | Source (file lines) |
| --- | --- | --- | --- |
| G1 | 1 | end of group 2: "kan de meetkundige figuren cirkel, driehoek, vierkant, rechthoek benoemen" | tussendoelen 2558 to 2559 |
| G2 | 7 (stretch) | group 4: "kan de meetkundige begrippen recht, schuin, dubbel, lijn, hoek, midden, punt gebruiken (zoals bij vouwen)"; no goal for measuring degrees was found | tussendoelen 2559 to 2560, 3488 |
| G3 | 6 (1S) | group 4: "kan van een eenvoudig patroon ... of figuur het spiegelbeeld tekenen"; group 5: "herkent lijnsymmetrie en kan de symmetrieas aanwijzen"; group 7: "kent het begrip puntsymmetrie" | tussendoelen 2565 to 2566, 2560 to 2561, 4631 |
| G4 | 6 (1S) | group 6: "kan plaatsen of objecten op een kaart vinden en aanduiden met een rooster met coördinaten (bv.: De Domtoren ligt in vak C5.)"; group 7: "weet wat een assenstelsel is" | tussendoelen 2588 to 2590, 4647 to 4648 |
| G5 | 2 | group 2: "kan tweedimensionale afbeeldingen van driedimensionale figuren herkennen en omgekeerd"; group 3: "kan bij afbeeldingen van eenvoudige ruimtelijke figuren de bijpassende uitslagen zoeken"; group 4: "kan bouwplaten van driedimensionale figuren herkennen en omgekeerd (zoals een kubus, balk, piramide)"; group 5: "kan een bouwplaat van een eenvoudig object ontwerpen" | tussendoelen 2533, 3201, 2536 to 2537, 2537 to 2538 |
| G6 | 3 | group 3: "kan aangeven hoe een object eruit ziet vanaf een ander standpunt"; group 4: "het voor-, zij- of bovenaanzicht ... herkennen"; group 6: "een blokkenbouwsel construeren en hiervan een plattegrond met hoogtegetallen maken" | tussendoelen 3182 to 3183, 2533 to 2534, 2611 to 2613 |
| G7 | 6 (1F/1S) | group 6: "kent de windrichtingen noord, oost, zuid, west"; group 8: the eight points N to NW; 1S: "legenda, schaallijn en/of een rooster met coördinaten" | tussendoelen 2592 to 2595, 2583 to 2590, 2585 to 2586 |

Group 1 has no goals. The tussendoelen say: "Er is bewust voor gekozen geen beheersingsdoelen voor groep 1 te formuleren." and "De doelen voor groep eind groep 2 horen dan ook bij beide leerjaren." (lines 391 to 393). G1 templates therefore use the end-of-group-2 goal, with its numbers.

### The Russian programme places the same topics about a group later, with extensions

A Russian grade n is Dutch group n + 2.

- Grade 1 (group 3): "распознавание круга, треугольника, прямоугольника, отрезка" (grades 1 to 4 lines 188 to 190), the same level as the Dutch end-of-group-2 goal, though it lists a segment where the Dutch goal lists a square.
- Grade 2 (group 4): "Распознавание и изображение геометрических фигур: точка, прямая, прямой угол, ломаная, многоугольник." (lines 297 to 298), the same level as the Dutch group 4 "recht".
- Grade 4 (group 6): "Наглядные представления о симметрии." (line 584), later than the Dutch line symmetry at group 5. Solids "шар, куб, цилиндр, конус, пирамида" (lines 587 to 588) come later than the Dutch group 4.
- Grade 5 (group 7), extension: "Измерение и построение углов с помощью транспортира." (grades 5 to 9 line 548); no Dutch goal for degrees was found in the texts read. "Развертки куба и параллелепипеда." (line 559) is later than the Dutch group 4 nets.
- Grade 6 (group 8), extensions: "Прямоугольная система координат на плоскости. Координаты точки на плоскости, абсцисса и ордината." (lines 593 to 594), where the Dutch axes come at group 7 and grid references at group 6; "длина маршрута на квадратной сетке" (line 625); "Симметрия: центральная, осевая и зеркальная симметрии." (line 635); "Примеры разверток многогранников, цилиндра и конуса." (line 639).
- A results block, grade not stated in the lines read, extension: "Распознавать параллелепипед, куб, использовать терминологию: вершина, ребро грань" (lines 692 to 693). The Dutch texts read contain no counting of faces, edges or vertices; "zijvlakken van een kubus of balk" appears only in area goals (tussendoelen lines 2057 and 4956).

### Soviet-era evidence is task forms only, with no symmetry, views or plans

Moro grade 1 (1990, OCR): «Сколько кубиков на каждом рисунке?» (line 1203); «Сколько раз по 2 кубика нарисовано? Сколько всего кубиков?» (lines 4641 to 4642); «Найди в наборе два таких треугольника и сложи из них квадрат.» (lines 2153 to 2158).

Moro grade 2 (1977): «22. Сколько треугольников в каждой из этих фигур? Сколько четырёхугольников?» (lines 1783 to 1784); «32. ... вырежи два такие четырёхугольника и два треугольника ... Составь из всех этих фигур: ... 3) шестиугольник.» (lines 1912 to 1919); «278. ... Как провести в каждой из этих фигур один отрезок так, чтобы получился квадрат?» (lines 3290 to 3292); «51. Сколько на чертеже треугольников? четырёхугольников? ... Найди прямые углы и выпиши их названия.» (lines 4356 to 4358); «Противоположные стороны прямоугольника равны.» (lines 4524 to 4525), stated after a compass check. The word for symmetry (симметр) and views and plans are absent from both Moro texts.

### Task forms by node

A form counts once, however its numbers vary.

- G1, about ten forms: name a drawn shape (concretisering lines 3577 to 3578); the difference between two shapes, rectangle and square (line 3579); everyday objects with a given shape (lines 3581 to 3582); draw a named shape (line 3584); sort shapes by two features (tussendoelen lines 2562 to 2563); count triangles and quadrilaterals in a figure (Moro 1977 line 1783); compose a shape from pieces (Moro 1990 line 2153, Moro 1977 line 1912); one segment that makes a square (Moro 1977 line 3290); a property check, opposite sides equal (Moro 1977 line 4524); name the angle kinds in a figure (Moro 1977 line 4356).
- G2, about four forms: name the right angles in a figure (Moro 1977 line 4356); count the right angles on a route with turns (Kangoeroe 396 item 4, lines 811 to 814); angle reasoning in a figure (MCCME 2021 item 8.6, line 983); protractor measuring (Russian grade 5, extension; no task read).
- G3, about seven forms: which letters or digits have an axis (concretisation lines 4033 and 4038); draw a mirror image on a grid (tussendoelen lines 2565 to 2566); complete a symmetric drawing from half (lines 2561 to 2564); explain whether a figure is symmetric (group 8, lines 2629 to 2633); point symmetry (line 4631); flip a card twice (Tartu preecolier item 14, lines 98 to 102); find the axis through a figure (lines 2561 to 2564).
- G4, about five forms: read the grid cell of a place (tussendoelen lines 2589 to 2590); place an object in a cell; read the coordinates of a point (extension, Russian grade 6); place a point at given coordinates (extension); read which quantities the axes carry (lines 4647 to 4648). The sources give too few forms for ten templates.
- G5, about eight forms: name the solid from a 2D picture (tussendoelen line 2533); match a net to a solid («Er zijn foto's van een piramide, een kubus, een balk. Maak van elk figuur een bouwplaat.», concretisering lines 4095 to 4096); which net folds into a cube (Kangoeroe 396 item 5, lines 819 to 823); which parts meet when folded (tussendoelen lines 2534 to 2535); design a net of an object (lines 2537 to 2538); opposite faces (Tartu ecolier item 7, lines 58 to 63, and item 17, line 130); count painted cube faces (Kangoeroe 397 item 18, lines 668 to 672); count faces, edges and vertices (extension, federal programme grades 5 to 9 lines 692 to 693).
- G6, about nine forms: from which side a photo was taken (tussendoelen lines 4617 to 4619); what can be seen from a point (lines 2514 to 2518); front, side or top view of a building (lines 2533 to 2534); the top view of a pyramid (Tartu ecolier item 10, line 85); count the hidden cubes (Tartu preecolier item 7, lines 58 to 59); build from a picture (tussendoelen line 3192); build from a plan with heights (lines 2611 to 2613); sightline in a mirror (lines 4620 to 4621); perspective (lines 4629 to 4630).
- G7, about six forms: a compass point on a map with the eight points («Welke plaats ligt ten NO van Utrecht?», concretisering lines 3871 to 3875); left, right and straight ahead on a route (tussendoelen lines 2589 to 2591); distance by a linear scale (concretisering line 4267); read the legend (tussendoelen lines 2585 to 2586); route length on a grid (extension, federal programme grades 5 to 9 line 625); route on a school plan (tussendoelen lines 3184 to 3185).

### Olympiad and Kangaroo items that fit domain G

The grade and group labels are as the files state them; where a file's grade is not confirmed, that is said.

- Tartu ecolier (grades 3 and 4, per the header at line 3): item 7, «Шесть граней куба имеют различный дизайн» (lines 58 to 63); item 10, «Какой вид сверху может быть у данной пирамиды?» (line 85); item 17, «Сумма точек на противоположных гранях кубика равна 7» (lines 130 to 131); item 23, «Какую фигуру невозможно поделить на три части из 5 серых клеток» (lines 173 to 174).
- Tartu preecolier (younger than grade 3; no grade line read): item 7, «Из белых кубиков и 14 серых кубиков составили одно тело. Сколько серых кубиков на рисунке не видно?» (lines 58 to 59); item 11, «В каждой фигуре грани кубиков склеены между собой» (lines 79 to 80); item 14, a card turned over twice (lines 98 to 102).
- Kangoeroe report 396 (grade version not confirmed): item 4, «Hoeveel rechte hoeken kan Harry daarbij op zijn hoogst maken?» (lines 811 to 814); item 5, the net of a cube (lines 819 to 823); item 2, unfolding a folded paper (lines 791 to 793).
- Kangoeroe report 397 (the 2002 report, grade version not confirmed): item 18, «Een kubus met ribbe 5 ... Hoeveel van de kleine kubusjes hebben nu precies één geverfde kant?» (lines 668 to 672).
- MCCME 2021 (grades 4 to 11): item 5.8, seven cubes with dot counts on the faces glued into a "П" shape (lines 438 to 441); item 8.1, «Квадрат разрезали на четыре равных прямоугольника» (line 888); item 8.6, a quadrilateral with equal angles (line 983). The numbering suggests grades 5 and 8; the headers were not confirmed.

No olympiad item in the extracts read fits G4 or G7 as a geometry item.

### Answer kinds needed beyond the current list

The current list is integer, decimal, fraction, mixed, quotientRemainder, time, point, compare, choice, grid, order, steps, equation and region, plus the approved set, pair and number-line distance.

- `set`: the axes of a figure, and the faces that match a condition (concretisering line 4033).
- `pair`: a coordinate written as (x; y), where the order matters (extension, federal programme grades 5 to 9 lines 593 to 594).
- A grid-cell reference, a letter and a number («vak C5», tussendoelen line 2590). A `pair` with mixed content or a `choice` covers it, but the contract should say so.
- An angle with a tolerance of about 2 degrees (extension, Russian grade 5). No current kind has one.
- One segment drawn on a figure (Moro 1977 task 278). A `grid` or `choice` covers it only when the answer is a picture.

### Conflicts and silences

- G2: the graph places angles at stretch, group 7. The Dutch goals found give vocabulary at group 4 and no measuring. The graph's `slo-meten-1s-13` label, «Измерение и понимание углов», has no Dutch text in the files read.
- G3: the graph puts symmetry at 1S, group 6. The Dutch goal for line symmetry is group 5.
- G4: the graph puts coordinates at 1S, group 6, with a Russian label. The Dutch grid goal is group 6 and the Cartesian axes are group 7. The Russian plane is grade 6, which is group 8.
- G5: the graph puts the node at group 2. The Dutch goals start there with 2D pictures, and nets come at groups 3 to 5. The Russian nets come at grade 5, which is group 7.
- G6: the graph's `blocks` subtype is stretch. The Dutch group 6 goal already asks for a plan with heights.
- G7: the graph's note "8 at 1S" matches the Dutch 1S goal and the group 8 goal.
- The Russian programme text names no views, no plans and no route tasks below grade 6. The Moro texts contain no symmetry, view or plan tasks. The Dutch texts contain no counting of faces, edges or vertices.

## Conclusions

1. Each geometry template carries the Dutch group from the table above and uses only the numbers and contexts of that group's goal.
2. Group 1 templates use the end-of-group-2 goal with its group 2 numbers, because the Dutch document gives group 1 no goals of its own.
3. Protractor measuring of angles is an extension, marked as grade 5 of the Russian programme, and its answers carry a tolerance of about 2 degrees.
4. The Cartesian plane is an extension, marked as grade 6 of the Russian programme. The grid reference at group 6 is the Dutch base, and the axes at group 7 are the next Dutch step.
5. G3's line symmetry is taught at group 5, so its templates use the group 5 range, and the graph's group 6 and 1S placement needs a decision.
6. G5's nets are taught from group 3 (matching) to group 5 (design), so the templates set the range by form, and the graph's group 2 covers only the 2D pictures.
7. G3's symmetry templates use the `set` kind for axes, and G4's coordinates use the `pair` kind.
8. A subtype with fewer than ten distinct forms in these sources, namely G2, G4 and G7, needs a further source before its templates are written, and its record says so.

## Sources

All files are the extracted texts in the session's scratchpad, read 2026-10-24.

- [SLO, Tussendoelen rekenen-wiskunde po 2017](https://www.slo.nl/publish/pages/3176/tussendoelen-rekenen-wiskunde-po-2017_1.pdf), read 2026-10-24 - the Meetkunde subdomain and the group blocks cited above.
- [SLO, Concretisering referentieniveaus 1F en 1S](https://slo.nl/publish/pages/2834/concretisering-referentieniveaus-rekenen-1f-1s.pdf), read 2026-10-24 - the geometry table and passages cited above.
- [Federal working programme, mathematics, grades 1 to 4 (2025)](https://edsoo.ru/wp-content/uploads/2025/07/2025_noo_frp_matematika_1-4.pdf), read 2026-10-24 - lines 167 to 191, 255 to 305, 399 to 455, 543 to 591.
- [Federal working programme, mathematics, grades 5 to 9, base level (2025)](https://edsoo.ru/wp-content/uploads/2025/07/2025_ooo_frp_matematika-5-9_baza.pdf), read 2026-10-24 - lines 491 to 561, 563 to 642, 664 to 695.
- [Moro and Bantova, Mathematics for grade 1 (1990)](https://archive.org/details/1_20240811_20240811_1529) and [for grade 2 (1977)](https://archive.org/details/1977_20220407_202204), read 2026-10-24 - the lines cited above.
- [Kangaroo 2020 papers, University of Tartu](https://teaduskool.ut.ee/sites/default/files/teaduskool/ainevoistlused/kanguru_2019_20_ylesanded_ekolier_vk.pdf), read 2026-10-24 - the grades 3 and 4 paper and the younger paper.
- [Kangoeroe reports 2002 and 2003, w4kangoeroe.nl](https://w4kangoeroe.nl/kangoeroe/index.php/download_file/view/396/405), read 2026-10-24 - reports 396 and 397.
- [MCCME, school stage of the all-Russian olympiad 2021, with solutions](https://olympiads.mccme.ru/vmo/2021/i-sol.pdf), read 2026-10-24 - the items cited above.

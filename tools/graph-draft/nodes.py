# Generates content/graph.yaml and tests/fixtures/res-0800.yaml node rows from
# RES-0800's node tables (levels after the 17 corrections, prerequisites with
# subtype tags). Subtype ids and typical groups are the drafter's reading of
# RES-1200's catalogue and the Utrecht learning lines (TSK-0503 to TSK-0505);
# each typical group is provisional until the parent reviews the diff.
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RES = (ROOT / "project/research/RES-0800-skill-graph.md").read_text(encoding="utf-8")

ROW = re.compile(r"^\| ([NAFDPMGST]\d+a?) \| (.*?) \| (.*?) \| (1F/1S|1F|1S|stretch) \| (.*?) \|$", re.M)
rows = {m.group(1): {"skill": m.group(2), "level": m.group(4), "prereq": m.group(5)} for m in ROW.finditer(RES)}

# Typical group (1-8) and subtypes [(id, level)] per node. Levels of subtypes
# follow the node level; 1F/1S nodes split into 1F and 1S subtypes (RES-0800).
GROUP = {
 "N1":1,"N2":3,"N3":5,"N4":4,"N5":3,"N6":6,"N7":6,"N8":7,
 "A1":1,"A2":2,"A3":3,"A4":4,"A5":3,"A6":4,"A6a":4,"A7":5,"A8":5,"A9":5,"A10":6,
 "A11":6,"A12":7,"A13":6,"A14":7,"A15":8,"A16":8,
 "F1":3,"F2":4,"F3":4,"F4":5,"F5":5,"F6":6,"F7":6,"F8":7,
 "D1":4,"D2":5,"D3":5,"D4":6,"D5":6,"D6":6,"D7":7,
 "P1":5,"P2":6,"P3":7,"P4":6,"P5":6,"P6":7,"P7":8,
 "M1":6,"M2":4,"M3":3,"M4":3,"M5":5,"M6":7,"M7":6,"M8":7,"M9":6,"M10":6,"M11":8,"M12":6,"M13":2,"M14":8,
 "G1":1,"G2":7,"G3":6,"G4":6,"G5":2,"G6":3,"G7":6,
 "S1":2,"S2":4,"S3":6,"S4":7,"S5":6,"S6":5,"S7":8,
 "T1":2,"T2":3,"T3":5,"T4":6,
}
# Subtypes: (id, level). Node levels 1F/1S/stretch give one subtype at that
# level; 1F/1S nodes give one at each level; the stretch subtypes of G6 and S3 are added.
SUB = {
 "N1":["compare","before-after"],"N2":["compose"],"N3":["words-digits","compare-six"],"N4":["round","estimate"],
 "N5":["point","scale"],"N6":["million-decimal","round-million"],"N7":["thermometer","order"],"N8":["operate","scale-operate"],
 "A1":["add-sub-20"],"A2":["mental-100"],"A3":["table"],"A4":["divide-table"],"A5":["column"],"A6":["by-one-digit"],
 "A6a":["round-numbers"],"A7":["by-two-digit"],"A8":["remainder"],"A9":["long-one-digit"],"A10":["by-two-digit-div"],
 "A11":["order-brackets","unknown"],"A12":["divisibility"],"A13":["efficient","properties"],"A14":["calculator"],
 "A15":["one-step-eq"],"A16":["two-step-eq"],
 "F1":["share"],"F2":["fraction-of"],"F3":["same-den","line"],"F4":["equivalent","simplify"],"F5":["add-same-den","mixed"],
 "F6":["add-unlike"],"F7":["times-fraction"],"F8":["divide-fraction"],
 "D1":["place-value"],"D2":["add-sub"],"D3":["shift-10"],"D4":["multiply"],"D5":["divide"],"D6":["convert"],"D7":["order-mixed"],
 "P1":["half-tenth","decimal"],"P2":["percent-of"],"P3":["share-of","vat"],"P4":["ratio","per-one"],"P5":["map-scale"],
 "P6":["compare-offer","relative"],"P7":["successive"],
 "M1":["whole","decimal"],"M2":["clock","calendar"],"M3":["whole","cents"],"M4":["by-squares","by-sides","formula","not-rectangle"],
 "M5":["grid","formula","sides"],"M6":["triangle"],"M7":["by-cubes","formula"],"M8":["speed"],"M9":["area-units"],
 "M10":["capacity"],"M11":["circle"],"M12":["benchmark"],"M13":["instruments"],"M14":["average-speed"],
 "G1":["shapes"],"G2":["angles"],"G3":["symmetry"],"G4":["coordinates"],"G5":["solids-nets"],"G6":["views","blocks"],"G7":["plan"],
 "S1":["tables"],"S2":["bar-line"],"S3":["mean","missing"],"S4":["pie"],"S5":["global"],"S6":["patterns"],"S7":["median-mode"],
 "T1":["one-step"],"T2":["two-step"],"T3":["three-step"],"T4":["four-step"],
}
# Stretch subtypes (G6.blocks, S3.missing) are stretch-level; the rest follow the node.
STRETCH_SUB = {("G6","blocks"),("S3","missing")}
GATE = {"N8":["N6","N7"],"A12":["A11","A13"],"A15":["A11","A13","D4"],"A16":["A11","A13"],"D7":["D4","D5","F7"],
        "P7":["P3","P6"],"M11":["M6","M9"],"M14":["M8","M10","P6"],"G2":["G3","G4"],"S7":["S3","S4"]}
# Subtype-tagged prerequisites (RES-0800's table): node -> [(node, subtype)].
TAGS = {
 "M1":[("N3","whole"),("D3","decimal")],"M3":[("A5","whole"),("D2","cents")],"M5":[("A3","grid"),("A7","formula")],
 "P1":[("F1","half-tenth"),("D6","decimal")],"F3":[("F1","same-den"),("N5","line")],
}
ASSIGN_LEVEL = {"1F":"1F","1S":"1S"}

def prereqs(node):
    out = []
    for m in re.finditer(r"([NAFDPMGST]\d+a?)(?: \(([a-z_]+)\))?", rows[node]["prereq"]):
        if m.group(1) in rows and m.group(1) != node:
            out.append((m.group(1), None))
    tagged = dict(TAGS.get(node, []))
    result = []
    for pid, _ in out:
        sub = None
        for tn, ts in TAGS.get(node, []):
            if tn == pid:
                sub = ts
        result.append((pid, sub))
    # Tag cases written in the table: "F1 (same_den)" etc. keep the subtype tag.
    for m in re.finditer(r"([NAFDPMGST]\d+a?) \(([a-z_]+)\)", rows[node]["prereq"]):
        result = [(p, (m.group(2).replace("_", "-") if p == m.group(1) else s)) for p, s in result]
    return result

def subtype_levels(node):
    level = rows[node]["level"]
    names = SUB[node]
    if level == "1F/1S":
        return [(n, "1F" if i == 0 else "1S") for i, n in enumerate(names)] if len(names) > 1 else [(names[0], "1F"), (names[0] + "-1S", "1S")]
    if level == "stretch":
        return [(n, "stretch") for n in names]
    return [(n, "stretch" if (node, n) in STRETCH_SUB else level) for n in names]

def weights(node, subs):
    # Equal weights across the ordinary subtypes, summing to 1; stretch subtypes
    # carry the same weight and are not counted in the sum (SPC-0050).
    ordinary = [s for s in subs if s[1] != "stretch"] or subs
    w = round(1 / len(ordinary), 6)
    return {s[0]: w for s in subs}

def emit(out):
    out.append("nodes:")
    for node, r in rows.items():
        dom = node[0]
        out.append(f"  {node}:")
        out.append(f"    domain: {dom}")
        out.append(f"    level: \"{r['level']}\"")
        out.append(f"    typicalGroup: {GROUP[node]}")
        if node in GATE:
            out.append("    stretchGate: [" + ", ".join(GATE[node]) + "]")
        out.append("    subtypes:")
        subs = subtype_levels(node)
        ws = weights(node, subs)
        for sid, lvl in subs:
            out.append(f"      - {{ id: {sid}, level: \"{lvl}\", weight: {ws[sid]} }}")
        pr = prereqs(node)
        if not pr:
            out.append("    prereqs: []")
        else:
            out.append("    prereqs:")
            for pid, sub in pr:
                tag = f", subtype: {sub}" if sub else ""
                out.append(f"      - {{ node: {pid}{tag} }}")
    return out

if __name__ == "__main__":
    assert len(rows) == 79, len(rows)
    text = "\n".join(emit([]))
    Path(sys.argv[1]).write_text(text + "\n", encoding="utf-8")
    print(f"wrote {len(rows)} nodes to {sys.argv[1]}")

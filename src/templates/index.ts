// Every compiled template, by domain. A domain's file lists its specs; this module compiles them with the
// strings of the domain, so a spec without strings fails at load.
import { aSpecs1 } from "./a1.js";
import { aSpecs2 } from "./a2.js";
import { aSpecs3 } from "./a3.js";
import { aSpecs4 } from "./a4.js";
import { dSpecs1 } from "./d1.js";
import { dSpecs2 } from "./d2.js";
import { gSpecs1 } from "./g1.js";
import { gSpecs2 } from "./g2.js";
import { gSpecs3 } from "./g3.js";
import { gSpecs4 } from "./g4.js";
import { fSpecs1 } from "./f1.js";
import { fSpecs2 } from "./f2.js";
import { fSpecs3 } from "./f3.js";
import { sSpecs1 } from "./s1.js";
import { sSpecs2 } from "./s2.js";
import { tSpecs1 } from "./t1.js";
import { tSpecs2 } from "./t2.js";
import { pSpecs1 } from "./p1.js";
import { pSpecs2 } from "./p2.js";
import { pSpecs3 } from "./p3.js";
import { mSpecs1 } from "./m1.js";
import { mSpecs2 } from "./m2.js";
import { mSpecs3 } from "./m3.js";
import { mSpecs4 } from "./m4.js";
import { mSpecs5 } from "./m5.js";
import { n1Specs } from "./n1.js";
import { n2Specs } from "./n2.js";
import { n3Specs } from "./n3.js";
import { n4Specs } from "./n4.js";
import { n5Specs } from "./n5.js";
import { n6Specs } from "./n6.js";
import { n7Specs } from "./n7.js";
import { n8Specs } from "./n8.js";
import { PICTURES_A } from "./pictures-a.js";
import { PICTURES_D } from "./pictures-d.js";
import { PICTURES_F } from "./pictures-f.js";
import { PICTURES_G } from "./pictures-g.js";
import { PICTURES_M } from "./pictures-m.js";
import { PICTURES_N } from "./pictures-n.js";
import { PICTURES_P } from "./pictures-p.js";
import { PICTURES_S } from "./pictures-s.js";
import { PICTURES_T } from "./pictures-t.js";
import { PICTURES } from "./pictures.js";
import { compile, type Compiled, type Spec, taskStrings } from "./spec.js";

const ALL_PICTURES = {
  ...PICTURES,
  ...PICTURES_A,
  ...PICTURES_D,
  ...PICTURES_F,
  ...PICTURES_G,
  ...PICTURES_M,
  ...PICTURES_N,
  ...PICTURES_P,
  ...PICTURES_S,
  ...PICTURES_T,
};

const compileAll = (
  domain: string,
  specs: readonly Spec<never>[],
): Compiled[] => {
  const strings = taskStrings(domain);
  return specs.map((spec) => {
    const picture = ALL_PICTURES[spec.id as keyof typeof ALL_PICTURES];
    return compile(
      picture ? ({ ...spec, picture } as unknown as Spec<never>) : spec,
      strings,
    );
  });
};

export const templates: readonly Compiled[] = [
  ...compileAll("n", [
    ...n1Specs,
    ...n2Specs,
    ...n3Specs,
    ...n4Specs,
    ...n5Specs,
    ...n6Specs,
    ...n7Specs,
    ...n8Specs,
  ]),
  ...compileAll("a", [...aSpecs1, ...aSpecs2, ...aSpecs3, ...aSpecs4]),
  ...compileAll("f", [...fSpecs1, ...fSpecs2, ...fSpecs3]),
  ...compileAll("d", [...dSpecs1, ...dSpecs2]),
  ...compileAll("p", [...pSpecs1, ...pSpecs2, ...pSpecs3]),
  ...compileAll("g", [...gSpecs1, ...gSpecs2, ...gSpecs3, ...gSpecs4]),
  ...compileAll("s", [...sSpecs1, ...sSpecs2]),
  ...compileAll("t", [...tSpecs1, ...tSpecs2]),
  ...compileAll("m", [
    ...mSpecs1,
    ...mSpecs2,
    ...mSpecs3,
    ...mSpecs4,
    ...mSpecs5,
  ]),
];

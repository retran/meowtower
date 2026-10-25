// Every compiled template, by domain. A domain's file lists its specs; this module compiles them with the
// strings of the domain, so a spec without strings fails at load.
import { aSpecs1 } from "./a1.js";
import { aSpecs2 } from "./a2.js";
import { aSpecs3 } from "./a3.js";
import { aSpecs4 } from "./a4.js";
import { dSpecs1 } from "./d1.js";
import { dSpecs2 } from "./d2.js";
import { fSpecs1 } from "./f1.js";
import { fSpecs2 } from "./f2.js";
import { fSpecs3 } from "./f3.js";
import { n1Specs } from "./n1.js";
import { n2Specs } from "./n2.js";
import { n3Specs } from "./n3.js";
import { n4Specs } from "./n4.js";
import { n5Specs } from "./n5.js";
import { n6Specs } from "./n6.js";
import { n7Specs } from "./n7.js";
import { n8Specs } from "./n8.js";
import { compile, type Compiled, type Spec, taskStrings } from "./spec.js";

const compileAll = (
  domain: string,
  specs: readonly Spec<never>[],
): Compiled[] => {
  const strings = taskStrings(domain);
  return specs.map((spec) => compile(spec, strings));
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
];

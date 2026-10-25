// Every compiled template, by domain. A domain's file lists its specs; this module compiles them with the
// strings of the domain, so a spec without strings fails at load.
import { n1Specs } from "./n1.js";
import { n2Specs } from "./n2.js";
import { n3Specs } from "./n3.js";
import { compile, type Compiled, type Spec, taskStrings } from "./spec.js";

const compileAll = (
  domain: string,
  specs: readonly Spec<never>[],
): Compiled[] => {
  const strings = taskStrings(domain);
  return specs.map((spec) => compile(spec, strings));
};

export const templates: readonly Compiled[] = [
  ...compileAll("n", [...n1Specs, ...n2Specs, ...n3Specs]),
];

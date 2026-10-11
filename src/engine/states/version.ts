// The version of the state rules (ADR-0060, TSK-0524). It changes with any change to a rule's
// output; the golden test fails when the output changes and this number didn't (REQ-0902).
export const RULES_VERSION = "1";

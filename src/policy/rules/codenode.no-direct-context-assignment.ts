import { codeFieldsOf } from "../selectors.js";
import { executableOnly } from "../codeText.js";
import type { Rule } from "../types.js";

/**
 * cognigyCodeDev: "Always use api.addToContext(...). Never use
 * `context.x = value` directly." Matches a direct assignment (=, +=, -=,
 * *=, /=, %=) into a `context.*` path, dot or bracket form. Deliberately
 * does not match `==`/`===` (a read/comparison) or a bare read such as
 * `context.configuration?.env` used in the standardized catch block.
 */
const ASSIGNMENT_PATTERN =
  /\bcontext(?:\.[A-Za-z_$][\w$]*|\[[^\]]+\])+\s*(?:=(?!=)|[-+*/%]=)/;

export const codenodeNoDirectContextAssignment: Rule = {
  id: "codenode.no-direct-context-assignment",
  kind: "house-opinion",
  severity: "block",
  targets: [
    codeFieldsOf("create_tool"),
    codeFieldsOf("update_tool"),
    codeFieldsOf("manage_flow_nodes"),
  ],
  check: (value) => {
    const code = executableOnly(String(value ?? ""));
    if (!ASSIGNMENT_PATTERN.test(code)) return [];
    return [
      {
        path: [],
        message:
          "Context is written by direct assignment (context.x = value) instead of the API helper.",
        fix: 'Use api.addToContext("path.to.key", value, "simple") instead of assigning to context.path.to.key directly.',
      },
    ];
  },
  retireWhen:
    "Cognigy documents direct context.* assignment as an equivalent, supported alternative to api.addToContext(), or NA PS drops the requirement to always go through the API helper",
};

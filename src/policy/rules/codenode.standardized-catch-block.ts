import { codeFieldsOf } from "../selectors.js";
import { blankComments } from "../codeText.js";
import type { Rule } from "../types.js";

/**
 * cognigyCodeDev mandates one specific catch-block shape (an object with
 * error/errorMessage/errorFlow/errorNode/errorTime/errorSessionId/
 * errorUserId, written via api.addToContext("codeNode", ..., "simple")), so
 * every Code Node's error context is uniform and queryable the same way.
 * Deliberately separate from codenode.try-catch-required: that rule is the
 * correctness-critical one (an uncaught error is fatal); this one is a
 * consistency convention that only matters once a catch block already
 * exists, so it warns rather than blocks.
 *
 * Comments are blanked (a rule name mentioned only in a comment shouldn't
 * count), but strings are left intact - the markers this checks for
 * (errorMessage, errorFlow, ...) are object keys, not string content, so
 * blanking strings would not help and template-literal bodies like
 * `${error}` are fine to leave alone.
 */
const REQUIRED_MARKERS = [
  "errorMessage",
  "errorFlow",
  "errorNode",
  "errorTime",
  "errorSessionId",
  "errorUserId",
];

export const codenodeStandardizedCatchBlock: Rule = {
  id: "codenode.standardized-catch-block",
  kind: "house-opinion",
  severity: "warn",
  targets: [
    codeFieldsOf("create_tool"),
    codeFieldsOf("update_tool"),
    codeFieldsOf("manage_flow_nodes"),
  ],
  check: (value) => {
    const code = blankComments(String(value ?? ""));
    if (!/\bcatch\s*\(/.test(code)) return [];

    const missing = REQUIRED_MARKERS.filter((marker) => !code.includes(marker));
    const writesCodeNodeContext =
      /\bapi\.addToContext\s*\(\s*(['"`])codeNode\1/.test(code);

    if (missing.length === 0 && writesCodeNodeContext) return [];

    return [
      {
        path: [],
        message: `The catch block does not match NA PS's standardized shape${missing.length ? ` (missing: ${missing.join(", ")})` : ""}${writesCodeNodeContext ? "" : ' (no api.addToContext("codeNode", ..., "simple") call found)'}.`,
        fix: 'Use the standardized catch block exactly: build a codeNode object with error, errorMessage, errorFlow, errorNode, errorTime, errorSessionId, errorUserId, errorEnv, then api.addToContext("codeNode", codeNode, "simple").',
      },
    ];
  },
  retireWhen:
    "NA PS changes the standardized error-context shape in cognigyCodeDev.md (update this check to match the new shape), or the team stops mandating a fixed catch-block shape",
};

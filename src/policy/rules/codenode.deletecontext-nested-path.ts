import { codeFieldsOf } from "../selectors.js";
import { blankComments } from "../codeText.js";
import type { Rule } from "../types.js";

/**
 * cognigyCodeDev documents a confirmed platform bug: api.deleteContext()
 * only removes a top-level key - a dotted path such as
 * api.deleteContext("temp.latencyStart") is a silent no-op, unlike
 * api.addToContext()/api.removeFromContext(), which both walk nested paths
 * correctly. This is advisory (warn), not blocking: the heuristic only
 * catches a literal string key containing a `.`, so it can both miss a
 * dynamically-built key and, rarely, flag a top-level key that legitimately
 * contains a literal dot.
 *
 * Comments are blanked but strings are left intact deliberately - the key
 * argument's actual text is exactly what this check needs to read.
 */
const DELETE_CONTEXT_CALL =
  /\bapi\.deleteContext\s*\(\s*(['"`])((?:\\.|(?!\1)[^\\])*)\1/g;

export const codenodeDeletecontextNestedPath: Rule = {
  id: "codenode.deletecontext-nested-path",
  kind: "platform-fact",
  severity: "warn",
  targets: [
    codeFieldsOf("create_tool"),
    codeFieldsOf("update_tool"),
    codeFieldsOf("manage_flow_nodes"),
  ],
  check: (value) => {
    const code = blankComments(String(value ?? ""));
    const findings: { path: string[]; message: string; fix: string }[] = [];
    for (const match of code.matchAll(DELETE_CONTEXT_CALL)) {
      const key = match[2];
      if (!key.includes(".")) continue;
      findings.push({
        path: [],
        message: `api.deleteContext("${key}") looks like a nested/dot-path key. api.deleteContext() only deletes a literal top-level property and silently no-ops on a dotted path.`,
        fix: `For a nested key, use \`delete context.${key};\` or api.removeFromContext("${key}", null, "simple") instead of api.deleteContext("${key}").`,
      });
    }
    return findings;
  },
  docs: "https://docs.cognigy.com/ai/for-developers/code/api-functions",
  retireWhen:
    "Cognigy fixes api.deleteContext() to walk nested paths natively, or NA PS's documented workaround changes",
};

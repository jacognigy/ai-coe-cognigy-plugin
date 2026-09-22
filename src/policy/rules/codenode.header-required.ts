import { codeFieldsOf } from "../selectors.js";
import type { Rule } from "../types.js";

/**
 * cognigyCodeDev: every Code Node begins with a filled-out block comment
 * header (Node Name / Description / Author / Created On / Last Modified /
 * Dependencies / Context Variables set / Notes). Deliberately checks the
 * comment itself - unlike every other rule in this family, blanking
 * comments here would blank away the exact thing being verified - so this
 * looks at the raw source, not executableOnly()/blankComments() output.
 *
 * Warn, not block: this is a documentation convention, not a correctness
 * risk, and the two required markers are a minimum floor, not a strict
 * template match, to keep false positives low.
 */
const REQUIRED_MARKERS = ["Node Name:", "Description:"];

export const codenodeHeaderRequired: Rule = {
  id: "codenode.header-required",
  kind: "house-opinion",
  severity: "warn",
  targets: [
    codeFieldsOf("create_tool"),
    codeFieldsOf("update_tool"),
    codeFieldsOf("manage_flow_nodes"),
  ],
  check: (value) => {
    const code = String(value ?? "");
    const withoutBom = code.charCodeAt(0) === 0xfeff ? code.slice(1) : code;
    const trimmed = withoutBom.trimStart();
    if (!trimmed.startsWith("/**")) {
      return [
        {
          path: [],
          message:
            "Code Node does not start with the mandatory comment header.",
          fix: "Start the Code Node with the standard /** Node Name / Description / Author / Created On / Last Modified / Dependencies / Context Variables set / Notes */ header.",
        },
      ];
    }

    const headerEnd = trimmed.indexOf("*/");
    const header = headerEnd === -1 ? trimmed : trimmed.slice(0, headerEnd);
    const missing = REQUIRED_MARKERS.filter(
      (marker) => !header.includes(marker),
    );
    if (missing.length === 0) return [];

    return [
      {
        path: [],
        message: `The mandatory comment header is missing: ${missing.join(", ")}.`,
        fix: "Fill out the standard header fields: Node Name, Description, Author, Created On, Last Modified, Dependencies, Context Variables set in this code node, and Notes.",
      },
    ];
  },
  retireWhen:
    "NA PS drops the mandatory comment-header requirement, or replaces it with a different documentation convention",
};

import { codeFieldsOf } from "../selectors.js";
import { executableOnly } from "../codeText.js";
import type { Rule } from "../types.js";

/**
 * cognigyCodeDev: "Wrap all logic in a try/catch block - errors are fatal."
 * An uncaught throw in a Code Node halts the flow, so this is treated as a
 * correctness rule (block), not a style preference. Whether the catch body
 * matches NA PS's specific error-context shape is a separate, softer check -
 * see codenode.standardized-catch-block.
 */
export const codenodeTryCatchRequired: Rule = {
  id: "codenode.try-catch-required",
  kind: "house-opinion",
  severity: "block",
  targets: [
    codeFieldsOf("create_tool"),
    codeFieldsOf("update_tool"),
    codeFieldsOf("manage_flow_nodes"),
  ],
  check: (value) => {
    const code = executableOnly(String(value ?? ""));
    const hasTry = /\btry\s*\{/.test(code);
    const hasCatch = /\bcatch\s*\(/.test(code);
    if (hasTry && hasCatch) return [];
    return [
      {
        path: [],
        message:
          "Code Node logic is not wrapped in a try/catch block. An uncaught error is fatal in Cognigy's Code Node runtime.",
        fix: "Wrap all statements in try { ... } catch (error) { ... }, using NA PS's standardized catch block to record the error to context.",
      },
    ];
  },
  retireWhen:
    "Cognigy's Code Node runtime stops treating an uncaught error as fatal, or NA PS formally drops the try/catch mandate",
};

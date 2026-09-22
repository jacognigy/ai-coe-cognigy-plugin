import { codeFieldsOf } from "../selectors.js";
import { executableOnly } from "../codeText.js";
import type { Rule } from "../types.js";

/**
 * cognigyCodeDev: "No functions - do not define or call JavaScript functions
 * ... inside a Code Node. Cognigy Code Nodes run synchronously and do not
 * support reliable return semantics outside the top-level execution scope.
 * Write all logic as flat, sequential statements."
 *
 * Three narrow patterns, not a general "no function syntax" scan, so an
 * inline callback passed to a built-in array method (`items.map(x => ...)`)
 * is not flagged - only a function that is DEFINED (named, assigned to a
 * variable, or immediately invoked) is:
 *
 *   1. a named function declaration
 *   2. a function expression or arrow function assigned to a variable
 *   3. an IIFE - detected by its distinctive closing `})()`, since matching
 *      an IIFE's opening is indistinguishable from an ordinary callback
 *      argument (`.map(x => ...)` also opens with `(x =>`)
 */
const NAMED_FUNCTION_DECLARATION = /\bfunction\s+[A-Za-z_$][\w$]*\s*\(/;
const FUNCTION_ASSIGNED_TO_VARIABLE =
  /\b(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*(?:async\s+)?(?:function\b|\([^()]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/;
const IIFE_INVOCATION = /\}\s*\)\s*\(\s*\)/;

export const codenodeNoFunctionDefinitions: Rule = {
  id: "codenode.no-function-definitions",
  kind: "house-opinion",
  severity: "block",
  targets: [
    codeFieldsOf("create_tool"),
    codeFieldsOf("update_tool"),
    codeFieldsOf("manage_flow_nodes"),
  ],
  check: (value) => {
    const code = executableOnly(String(value ?? ""));
    const findings: { path: string[]; message: string; fix: string }[] = [];

    if (NAMED_FUNCTION_DECLARATION.test(code)) {
      findings.push({
        path: [],
        message: "A named function is defined inside the Code Node.",
        fix: "Do not define `function myFn() {}`. Write the logic as flat, sequential statements in the try block instead.",
      });
    }
    if (FUNCTION_ASSIGNED_TO_VARIABLE.test(code)) {
      findings.push({
        path: [],
        message:
          "A function or arrow function is assigned to a variable inside the Code Node.",
        fix: "Do not assign a reusable function to a variable. Write the logic as flat, sequential statements in the try block instead.",
      });
    }
    if (IIFE_INVOCATION.test(code)) {
      findings.push({
        path: [],
        message:
          "An immediately-invoked function expression (IIFE) pattern was found inside the Code Node.",
        fix: "Do not wrap logic in an IIFE. Write the logic as flat, sequential statements in the try block instead.",
      });
    }
    return findings;
  },
  retireWhen:
    "Cognigy's Code Node runtime adds reliable return/closure semantics outside top-level scope, or NA PS lifts the no-functions restriction",
};

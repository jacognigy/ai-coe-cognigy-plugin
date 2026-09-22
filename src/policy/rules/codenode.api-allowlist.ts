import { codeFieldsOf } from "../selectors.js";
import { executableOnly } from "../codeText.js";
import type { Rule } from "../types.js";

/**
 * NA PS's cognigyCodeDev skill ships a curated allowlist of api.* functions
 * ("Allowed API Functions ... use ONLY these") that is narrower than what
 * upstream's codenode.runtime-apis rule checks: that rule states what the
 * Code Node runtime does not have at all (a platform fact); this one states
 * which of the methods that DO exist the team has vetted as safe to build
 * on. A call outside this set is not automatically broken - it may simply be
 * a method NA PS has not reviewed yet - which is why this is house-opinion,
 * not platform-fact, and why it ships with a soft-gate override.
 */
const ALLOWED_METHODS = new Set([
  "addToContext",
  "getContext",
  "setContext",
  "deleteContext",
  "removeFromContext",
  "resetContext",
  "say",
  "output",
  "addToInput",
  "updateProfile",
  "setNextNode",
  "resetNextNodes",
  "stopExecution",
  "log",
  "logDebugMessage",
  "logDebugError",
  "setAppState",
  "handover",
  "thinkV2",
  "base64Encode",
  "base64Decode",
  "completeGoal",
  "parseCognigyScript",
  "trackAnalyticsStep",
]);

export const codenodeApiAllowlist: Rule = {
  id: "codenode.api-allowlist",
  kind: "house-opinion",
  severity: "block",
  targets: [
    codeFieldsOf("create_tool"),
    codeFieldsOf("update_tool"),
    codeFieldsOf("manage_flow_nodes"),
  ],
  check: (value) => {
    const code = executableOnly(String(value ?? ""));
    const reported = new Set<string>();
    const findings: { path: string[]; message: string; fix: string }[] = [];
    for (const match of code.matchAll(/\bapi\.([A-Za-z_$][\w$]*)\s*\(/g)) {
      const method = match[1];
      if (ALLOWED_METHODS.has(method) || reported.has(method)) continue;
      reported.add(method);
      findings.push({
        path: [],
        message: `api.${method}() is not on the NA PS Code Node allowlist.`,
        fix: `Use one of the approved api.* functions (addToContext, getContext, setContext, deleteContext, removeFromContext, resetContext, say, output, addToInput, updateProfile, setNextNode, resetNextNodes, stopExecution, log, logDebugMessage, logDebugError, setAppState, handover, thinkV2, base64Encode, base64Decode, completeGoal, parseCognigyScript, trackAnalyticsStep) instead of api.${method}().`,
      });
    }
    return findings;
  },
  retireWhen:
    "NA PS's cognigyCodeDev allowlist is retired in favor of upstream publishing its own canonical, versioned list of supported api.* methods",
};

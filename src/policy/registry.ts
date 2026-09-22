import type { Rule } from "./types.js";
import { upstreamCodeNodeRuntimeApis } from "./rules/upstream-code-node-hints.js";
import { codenodeApiAllowlist } from "./rules/codenode.api-allowlist.js";
import { codenodeTryCatchRequired } from "./rules/codenode.try-catch-required.js";
import { codenodeStandardizedCatchBlock } from "./rules/codenode.standardized-catch-block.js";
import { codenodeNoDirectContextAssignment } from "./rules/codenode.no-direct-context-assignment.js";
import { codenodeNoFunctionDefinitions } from "./rules/codenode.no-function-definitions.js";
import { codenodeNoLocaleBrowserApis } from "./rules/codenode.no-locale-browser-apis.js";
import { codenodeDeletecontextNestedPath } from "./rules/codenode.deletecontext-nested-path.js";
import { codenodeHeaderRequired } from "./rules/codenode.header-required.js";

/**
 * The rule list. The ONE file a new rule is added to (§2.2). The NA PS
 * Code Node standards (docs/ai-coe/architecture/06-Policy-Layer-Design.md
 * §11) are re-derived from the cognigyCodeDev skill source, not ported from
 * the fork's old POC.
 */
export const REGISTRY: Rule[] = [
  upstreamCodeNodeRuntimeApis,
  codenodeApiAllowlist,
  codenodeTryCatchRequired,
  codenodeStandardizedCatchBlock,
  codenodeNoDirectContextAssignment,
  codenodeNoFunctionDefinitions,
  codenodeNoLocaleBrowserApis,
  codenodeDeletecontextNestedPath,
  codenodeHeaderRequired,
];

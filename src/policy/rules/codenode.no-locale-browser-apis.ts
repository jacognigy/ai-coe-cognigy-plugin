import { codeFieldsOf } from "../selectors.js";
import { executableOnly } from "../codeText.js";
import type { Rule } from "../types.js";

/**
 * cognigyCodeDev, Environment Constraints: "Do NOT use toLocaleString(),
 * toLocaleDateString(), or any browser-only APIs." A platform fact, not a
 * style choice - the Code Node runtime is plain Node.js without full
 * ICU/Intl data, so these produce environment-dependent, not
 * environment-agnostic, results. Scoped to the locale-formatting family the
 * skill names explicitly, mirroring upstream's own narrow, named patterns in
 * codeNodeHints.ts rather than a broad, unstated "no browser APIs" scan.
 */
const LOCALE_API_PATTERN =
  /\.toLocaleString\s*\(|\.toLocaleDateString\s*\(|\.toLocaleTimeString\s*\(/;

export const codenodeNoLocaleBrowserApis: Rule = {
  id: "codenode.no-locale-browser-apis",
  kind: "platform-fact",
  severity: "block",
  targets: [
    codeFieldsOf("create_tool"),
    codeFieldsOf("update_tool"),
    codeFieldsOf("manage_flow_nodes"),
  ],
  check: (value) => {
    const code = executableOnly(String(value ?? ""));
    if (!LOCALE_API_PATTERN.test(code)) return [];
    return [
      {
        path: [],
        message:
          "toLocaleString()/toLocaleDateString()/toLocaleTimeString() are used - the Code Node runtime lacks full ICU/Intl data, so these do not format reliably.",
        fix: "Use deterministic string/date handling instead (e.g. substring, a regex, or explicit formatting), not locale-aware Intl/Date methods.",
      },
    ];
  },
  docs: "https://docs.cognigy.com/ai/for-developers/code/overview",
  retireWhen:
    "Cognigy's Code Node runtime ships full ICU/Intl data so locale-aware formatting behaves predictably, or NA PS accepts the risk",
};

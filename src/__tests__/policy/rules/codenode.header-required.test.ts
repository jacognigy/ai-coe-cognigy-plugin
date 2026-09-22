import { describe, it, expect } from "@jest/globals";
import { codenodeHeaderRequired as rule } from "../../../policy/rules/codenode.header-required.js";

const VALID_HEADER = `/**
 * Node Name: Example
 * Description: Does a thing
 * Author: Placeholder
 * Created On: 2026-09-22
 * Last Modified: 2026-09-22
 *
 * Dependencies:
 * - None
 *
 * Context Variables set in this code node:
 *
 * Notes:
 * - none
 */
try {
  api.log("hi");
} catch (error) {
  api.log(\`\${error}\`);
}
`;

describe("codenode.header-required", () => {
  it("fires when the code has no leading comment header at all", () => {
    const findings = rule.check('api.log("hi");', {
      tool: "manage_flow_nodes",
      args: {},
    });

    expect(findings.length).toBe(1);
  });

  it("fires when the header is missing required fields", () => {
    const findings = rule.check("/**\n * some comment\n */\napi.log('hi');", {
      tool: "manage_flow_nodes",
      args: {},
    });

    expect(findings.length).toBe(1);
    expect(findings[0].message).toMatch(/Node Name/);
  });

  it("does not fire on a fully filled-out header", () => {
    const findings = rule.check(VALID_HEADER, {
      tool: "manage_flow_nodes",
      args: {},
    });

    expect(findings).toEqual([]);
  });
});

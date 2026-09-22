import { describe, it, expect } from "@jest/globals";
import { codenodeNoLocaleBrowserApis as rule } from "../../../policy/rules/codenode.no-locale-browser-apis.js";

describe("codenode.no-locale-browser-apis", () => {
  it("fires on toLocaleString()", () => {
    const findings = rule.check("const s = (1234).toLocaleString();", {
      tool: "manage_flow_nodes",
      args: {},
    });

    expect(findings.length).toBe(1);
  });

  it("fires on toLocaleDateString()", () => {
    const findings = rule.check("const s = new Date().toLocaleDateString();", {
      tool: "manage_flow_nodes",
      args: {},
    });

    expect(findings.length).toBe(1);
  });

  it("does not fire on deterministic date/string handling", () => {
    const findings = rule.check(
      "const s = input.currentTime.plain.substring(0, 10);",
      { tool: "manage_flow_nodes", args: {} },
    );

    expect(findings).toEqual([]);
  });

  it("ignores the pattern inside a comment or string", () => {
    const findings = rule.check(
      "// avoid toLocaleString() here\napi.log('toLocaleString()');",
      { tool: "manage_flow_nodes", args: {} },
    );

    expect(findings).toEqual([]);
  });
});

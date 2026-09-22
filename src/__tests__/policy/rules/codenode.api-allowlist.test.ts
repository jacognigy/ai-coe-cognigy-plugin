import { describe, it, expect } from "@jest/globals";
import { codenodeApiAllowlist as rule } from "../../../policy/rules/codenode.api-allowlist.js";

describe("codenode.api-allowlist", () => {
  it("fires on an api.* call not on the NA PS allowlist", () => {
    const findings = rule.check("api.someUnvettedMethod(1);", {
      tool: "manage_flow_nodes",
      args: {},
    });

    expect(findings.length).toBe(1);
    expect(findings[0].message).toMatch(/someUnvettedMethod/);
  });

  it("does not fire on allowlisted api.* calls", () => {
    const findings = rule.check(
      'api.addToContext("a.b", 1, "simple"); api.log("hi"); api.completeGoal("x");',
      { tool: "manage_flow_nodes", args: {} },
    );

    expect(findings).toEqual([]);
  });

  it("ignores a disallowed method name inside a comment or string", () => {
    const findings = rule.check(
      "// api.notAllowed() would be flagged\napi.log('api.notAllowed()');",
      { tool: "manage_flow_nodes", args: {} },
    );

    expect(findings).toEqual([]);
  });

  it("reports each disallowed method only once", () => {
    const findings = rule.check("api.foo(1); api.foo(2); api.bar(3);", {
      tool: "create_tool",
      args: {},
    });

    expect(findings.length).toBe(2);
  });
});

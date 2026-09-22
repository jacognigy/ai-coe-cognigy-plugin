import { describe, it, expect } from "@jest/globals";
import { codenodeDeletecontextNestedPath as rule } from "../../../policy/rules/codenode.deletecontext-nested-path.js";

describe("codenode.deletecontext-nested-path", () => {
  it("fires on a dotted-path key", () => {
    const findings = rule.check('api.deleteContext("temp.latencyStart");', {
      tool: "manage_flow_nodes",
      args: {},
    });

    expect(findings.length).toBe(1);
    expect(findings[0].message).toMatch(/temp\.latencyStart/);
  });

  it("does not fire on a top-level key", () => {
    const findings = rule.check('api.deleteContext("flag");', {
      tool: "manage_flow_nodes",
      args: {},
    });

    expect(findings).toEqual([]);
  });

  it("ignores a dotted key inside a comment", () => {
    const findings = rule.check(
      '// api.deleteContext("temp.latencyStart") looks wrong\napi.deleteContext("flag");',
      { tool: "manage_flow_nodes", args: {} },
    );

    expect(findings).toEqual([]);
  });
});

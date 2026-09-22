import { describe, it, expect } from "@jest/globals";
import { codenodeNoFunctionDefinitions as rule } from "../../../policy/rules/codenode.no-function-definitions.js";

describe("codenode.no-function-definitions", () => {
  it("fires on a named function declaration", () => {
    const findings = rule.check("function doThing() { return 1; }", {
      tool: "manage_flow_nodes",
      args: {},
    });

    expect(findings.some((f) => f.message.match(/named function/))).toBe(true);
  });

  it("fires on a function/arrow assigned to a variable", () => {
    const findings = rule.check("const doThing = (x) => x + 1;", {
      tool: "manage_flow_nodes",
      args: {},
    });

    expect(
      findings.some((f) => f.message.match(/assigned to a variable/)),
    ).toBe(true);
  });

  it("fires on an IIFE", () => {
    const findings = rule.check("(function () {\n  api.log('hi');\n})();", {
      tool: "manage_flow_nodes",
      args: {},
    });

    expect(findings.some((f) => f.message.match(/IIFE/))).toBe(true);
  });

  it("does not fire on an inline callback passed to a built-in method", () => {
    const findings = rule.check(
      "const doubled = [1, 2, 3].map(x => x * 2).filter(x => x > 2);",
      { tool: "manage_flow_nodes", args: {} },
    );

    expect(findings).toEqual([]);
  });

  it("does not fire on flat, sequential statements", () => {
    const findings = rule.check(
      'api.addToContext("x", 1, "simple");\napi.log("done");',
      { tool: "manage_flow_nodes", args: {} },
    );

    expect(findings).toEqual([]);
  });
});

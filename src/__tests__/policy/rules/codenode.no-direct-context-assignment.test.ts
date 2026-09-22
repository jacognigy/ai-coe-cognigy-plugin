import { describe, it, expect } from "@jest/globals";
import { codenodeNoDirectContextAssignment as rule } from "../../../policy/rules/codenode.no-direct-context-assignment.js";

describe("codenode.no-direct-context-assignment", () => {
  it("fires on a direct context assignment", () => {
    const findings = rule.check("context.orchestration.flag = true;", {
      tool: "manage_flow_nodes",
      args: {},
    });

    expect(findings.length).toBe(1);
  });

  it("fires on a bracket-notation context assignment", () => {
    const findings = rule.check('context["flag"] = true;', {
      tool: "manage_flow_nodes",
      args: {},
    });

    expect(findings.length).toBe(1);
  });

  it("does not fire on api.addToContext usage or a context read/comparison", () => {
    const findings = rule.check(
      'api.addToContext("flag", true, "simple");\nif (context.flag === true) { api.log("yes"); }\nconst env = context.configuration?.env;',
      { tool: "manage_flow_nodes", args: {} },
    );

    expect(findings).toEqual([]);
  });

  it("ignores an assignment-looking pattern inside a comment or string", () => {
    const findings = rule.check(
      "// context.flag = true would be flagged\napi.log('context.flag = true');",
      { tool: "manage_flow_nodes", args: {} },
    );

    expect(findings).toEqual([]);
  });
});

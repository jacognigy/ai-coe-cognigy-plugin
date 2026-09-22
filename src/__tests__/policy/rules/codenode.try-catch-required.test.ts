import { describe, it, expect } from "@jest/globals";
import { codenodeTryCatchRequired as rule } from "../../../policy/rules/codenode.try-catch-required.js";

describe("codenode.try-catch-required", () => {
  it("fires when logic is not wrapped in try/catch", () => {
    const findings = rule.check('api.addToContext("x", 1, "simple");', {
      tool: "manage_flow_nodes",
      args: {},
    });

    expect(findings.length).toBe(1);
    expect(findings[0].message).toMatch(/try\/catch/);
  });

  it("does not fire when logic is wrapped in try/catch", () => {
    const findings = rule.check(
      'try {\n  api.addToContext("x", 1, "simple");\n} catch (error) {\n  api.log(`${error}`);\n}',
      { tool: "manage_flow_nodes", args: {} },
    );

    expect(findings).toEqual([]);
  });

  it("ignores the word try/catch inside a comment or string", () => {
    const findings = rule.check(
      "// remember to try/catch this\napi.log('try { } catch (e) {}');",
      { tool: "manage_flow_nodes", args: {} },
    );

    expect(findings.length).toBe(1);
  });
});

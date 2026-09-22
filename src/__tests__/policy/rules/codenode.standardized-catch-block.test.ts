import { describe, it, expect } from "@jest/globals";
import { codenodeStandardizedCatchBlock as rule } from "../../../policy/rules/codenode.standardized-catch-block.js";

const STANDARD_CATCH = `
try {
  api.addToContext("x", 1, "simple");
} catch (error) {
  let codeNode = {
    error: true,
    errorMessage: \`\${error}\`,
    errorFlow: \`\${input.flowName}\`,
    errorNode: "NODE NAME",
    errorTime: input.currentTime.plain,
    errorSessionId: input.sessionId,
    errorUserId: input.userId,
    errorEnv: input.URLToken,
  };
  api.addToContext("codeNode", codeNode, "simple");
}
`;

describe("codenode.standardized-catch-block", () => {
  it("does not fire when there is no catch block at all (try-catch-required owns that)", () => {
    const findings = rule.check('api.addToContext("x", 1, "simple");', {
      tool: "manage_flow_nodes",
      args: {},
    });

    expect(findings).toEqual([]);
  });

  it("fires when the catch block does not match the standardized shape", () => {
    const findings = rule.check(
      'try {\n  api.addToContext("x", 1, "simple");\n} catch (error) {\n  api.log(`${error}`);\n}',
      { tool: "manage_flow_nodes", args: {} },
    );

    expect(findings.length).toBe(1);
    expect(findings[0].message).toMatch(/errorMessage/);
  });

  it("does not fire on the standardized catch block", () => {
    const findings = rule.check(STANDARD_CATCH, {
      tool: "manage_flow_nodes",
      args: {},
    });

    expect(findings).toEqual([]);
  });
});

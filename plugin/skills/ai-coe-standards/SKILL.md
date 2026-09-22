---
name: ai-coe-standards
description: "AI COE standards this fork enforces at write time (blocking) or warns about (advisory) - generated from src/policy/registry.ts. Read when a manage_flow_nodes / create_tool / update_tool call is refused with error: policy_violation, or before writing Code Node / tool code, to know what will be checked before you write it."
---

# AI COE Standards

This file is **generated in full by `src/policy/generate-docs.ts`** from the
rule registry at `src/policy/registry.ts`. Never hand-edit it - the next
generation overwrites it, and `docs-fresh.test.ts` fails the build if this
file drifts from the registry.

These standards are enforced by the AI COE policy layer, not by upstream. A
call that violates a `block`-severity rule returns
`{ error: "policy_violation", changed: false, findings: [...] }` and nothing
is written.

## Overriding a false positive

If a finding is wrong for your specific case, retry the exact same call with
the offending rule id(s) listed in `_policyOverride`, for example:

```
manage_flow_nodes { flowId, operation: "create", nodeType: "code",
                    config: {...}, _policyOverride: ["<ruleId>"] }
```

State in one short line which rule you are overriding and why. The override
then applies for that rule, for that project, for the rest of the session -
you do not need to repeat it on every retry.

## Enforced rules

## `codenode.runtime-apis`

- **Severity:** block
- **Kind:** Platform fact - states something the Cognigy platform cannot do. A candidate for an upstream PR.
- **Docs:** https://docs.cognigy.com/ai/for-developers/code/api-functions
- **Retires when:** upstream makes these blocking, or the team accepts advisory severity for them

## `codenode.api-allowlist`

- **Severity:** block
- **Kind:** House opinion - encodes how this team believes code should be written. Stays fork-only.
- **Retires when:** NA PS's cognigyCodeDev allowlist is retired in favor of upstream publishing its own canonical, versioned list of supported api.* methods

## `codenode.try-catch-required`

- **Severity:** block
- **Kind:** House opinion - encodes how this team believes code should be written. Stays fork-only.
- **Retires when:** Cognigy's Code Node runtime stops treating an uncaught error as fatal, or NA PS formally drops the try/catch mandate

## `codenode.standardized-catch-block`

- **Severity:** warn
- **Kind:** House opinion - encodes how this team believes code should be written. Stays fork-only.
- **Retires when:** NA PS changes the standardized error-context shape in cognigyCodeDev.md (update this check to match the new shape), or the team stops mandating a fixed catch-block shape

## `codenode.no-direct-context-assignment`

- **Severity:** block
- **Kind:** House opinion - encodes how this team believes code should be written. Stays fork-only.
- **Retires when:** Cognigy documents direct context.* assignment as an equivalent, supported alternative to api.addToContext(), or NA PS drops the requirement to always go through the API helper

## `codenode.no-function-definitions`

- **Severity:** block
- **Kind:** House opinion - encodes how this team believes code should be written. Stays fork-only.
- **Retires when:** Cognigy's Code Node runtime adds reliable return/closure semantics outside top-level scope, or NA PS lifts the no-functions restriction

## `codenode.no-locale-browser-apis`

- **Severity:** block
- **Kind:** Platform fact - states something the Cognigy platform cannot do. A candidate for an upstream PR.
- **Docs:** https://docs.cognigy.com/ai/for-developers/code/overview
- **Retires when:** Cognigy's Code Node runtime ships full ICU/Intl data so locale-aware formatting behaves predictably, or NA PS accepts the risk

## `codenode.deletecontext-nested-path`

- **Severity:** warn
- **Kind:** Platform fact - states something the Cognigy platform cannot do. A candidate for an upstream PR.
- **Docs:** https://docs.cognigy.com/ai/for-developers/code/api-functions
- **Retires when:** Cognigy fixes api.deleteContext() to walk nested paths natively, or NA PS's documented workaround changes

## `codenode.header-required`

- **Severity:** warn
- **Kind:** House opinion - encodes how this team believes code should be written. Stays fork-only.
- **Retires when:** NA PS drops the mandatory comment-header requirement, or replaces it with a different documentation convention

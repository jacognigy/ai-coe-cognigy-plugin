/**
 * Shared text-scanning helpers for rules that pattern-match Code Node /
 * preProcessCode / postProcessCode source. Every rule that scans for a
 * banned identifier or call MUST blank comments and string/template literal
 * contents first - matching raw source is the exact bug the fork's old POC
 * (`codeNodeValidation.ts`, commit 030e9c6) carried: a rule name appearing
 * inside a comment or a string produced a false positive. See
 * docs/ai-coe/architecture/06-Policy-Layer-Design.md §1.1 and §2.1.
 *
 * `blankComments` alone (strings left intact) is for rules that need to read
 * a string literal's actual content, such as the key argument to
 * api.deleteContext(), or that check for documentation markers that
 * legitimately live inside a comment (the mandatory header).
 */

/** Blanks /* *\/ and // comments only; string and template literals survive. */
export function blankComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, " ");
}

/**
 * Blanks comments and string/template literal contents, so neither can be
 * mistaken for executable code. Mirrors upstream's private executableOnly()
 * in src/tools/codeNodeHints.ts, which is not exported so cannot be reused
 * directly - kept in lockstep with it deliberately.
 */
export function executableOnly(code: string): string {
  return code.replace(
    /\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`/g,
    " ",
  );
}

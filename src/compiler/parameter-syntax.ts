import ts from "typescript";

/** Keep parameter binding restrictions identical in the compiler and syntax-only lint rule. */
export function parameterBindingIssue(node: ts.Node): string | undefined {
  if (!ts.isParameter(node)) return undefined;
  if (node.dotDotDotToken) return "rest parameters";
  if (ts.isIdentifier(node.name)) return undefined;
  if (!ts.isObjectBindingPattern(node.name)) return "array parameter destructuring";
  if (node.initializer) return "defaults on destructured parameters";
  for (const element of node.name.elements) {
    if (element.dotDotDotToken) return "rest properties in destructured parameters";
    if (element.initializer) return "defaults in destructured parameters";
    if (!ts.isIdentifier(element.name)) return "nested parameter destructuring";
    if (element.propertyName && ts.isComputedPropertyName(element.propertyName))
      return "computed keys in destructured parameters";
  }
  return undefined;
}

import ts from "typescript";

/** Shared by the lowerer and ESLint so editor diagnostics describe the accepted loop syntax. */
export function runtimeLoopIssue(node: ts.Node): string | undefined {
  if (ts.isBreakStatement(node)) return "break statements";
  if (ts.isContinueStatement(node)) return "continue statements";
  if (!ts.isWhileStatement(node) && !ts.isForStatement(node)) return undefined;
  if (!ts.findAncestor(node, ts.isFunctionLike)) return "runtime loops outside effect callbacks";
  if (ts.isForStatement(node)) {
    const init = node.initializer;
    if (
      !init ||
      !ts.isVariableDeclarationList(init) ||
      !(init.flags & ts.NodeFlags.Let) ||
      init.declarations.length !== 1 ||
      !ts.isIdentifier(init.declarations[0].name) ||
      !init.declarations[0].initializer ||
      !node.condition ||
      !node.incrementor
    )
      return "for loops without one initialized let counter, a condition and an update";
    const counter = init.declarations[0].name.text;
    const update = node.incrementor;
    const operand =
      (ts.isPrefixUnaryExpression(update) || ts.isPostfixUnaryExpression(update)) &&
      (update.operator === ts.SyntaxKind.PlusPlusToken ||
        update.operator === ts.SyntaxKind.MinusMinusToken)
        ? update.operand
        : ts.isBinaryExpression(update) &&
            [
              ts.SyntaxKind.EqualsToken,
              ts.SyntaxKind.PlusEqualsToken,
              ts.SyntaxKind.MinusEqualsToken,
            ].includes(update.operatorToken.kind)
          ? update.left
          : undefined;
    if (!operand || !ts.isIdentifier(operand) || operand.text !== counter)
      return "for loops whose update does not assign, increment or decrement their counter";
  }
  return undefined;
}

import { hasChildNodes, isElement } from "@yamadayuki/parse5-is";
import {
  DefaultTreeCommentNode,
  DefaultTreeDocument,
  DefaultTreeDocumentFragment,
  DefaultTreeDocumentType,
  DefaultTreeElement,
  DefaultTreeNode,
  DefaultTreeParentNode,
  DefaultTreeTextNode,
} from "parse5";

export type VisitorFunction<T> = (node: T, parent?: DefaultTreeParentNode) => T;

export type Visitor = {
  Element?: VisitorFunction<DefaultTreeElement>;
  Document?: VisitorFunction<DefaultTreeDocument>;
  TextNode?: VisitorFunction<DefaultTreeTextNode>;
  CommentNode?: VisitorFunction<DefaultTreeCommentNode>;
  DocumentFragment?: VisitorFunction<DefaultTreeDocumentFragment>;
  DocumentType?: VisitorFunction<DefaultTreeDocumentType>;
};

export function validateVisitorMethod<T>(visitor: VisitorFunction<T>): void {
  if (typeof visitor !== "function") {
    throw new TypeError(`Non-function found with type ${typeof visitor}`);
  }
}

export function validateVisitorMethods(visitor: Visitor): void {
  for (const fn of Object.values(visitor)) {
    if (typeof fn !== "function") {
      throw new TypeError(`Non-function found with type ${typeof fn}`);
    }
  }
}

export function visitElement(
  node: DefaultTreeElement,
  visitor: VisitorFunction<DefaultTreeElement>,
  parent?: DefaultTreeParentNode
): DefaultTreeElement {
  validateVisitorMethod(visitor);

  return visitor(node, parent);
}

export function visit(ast: DefaultTreeNode, visitor: Visitor) {
  validateVisitorMethods(visitor);

  if (visitor.Element && isElement(ast)) {
    visitElement(ast, visitor.Element);
  }

  if (hasChildNodes(ast) && ast.childNodes.length > 0) {
    ast.childNodes.forEach(node => {
      visit(node, visitor);
    });
  }
}

import {
  DefaultTreeCommentNode,
  DefaultTreeDocument,
  DefaultTreeDocumentFragment,
  DefaultTreeDocumentType,
  DefaultTreeElement,
  DefaultTreeNode,
  DefaultTreeTextNode,
  DefaultTreeParentNode,
} from "parse5";

import { isElement, hasChildNodes } from "@yamadayuki/parse5-is";

type VisitorFunction<T> = (node: T, parent?: DefaultTreeParentNode) => T;

interface Visitor {
  Element?: VisitorFunction<DefaultTreeElement>;
  Document?: VisitorFunction<DefaultTreeDocument>;
  TextNode?: VisitorFunction<DefaultTreeTextNode>;
  CommentNode?: VisitorFunction<DefaultTreeCommentNode>;
  DocumentFragment?: VisitorFunction<DefaultTreeDocumentFragment>;
  DocumentType?: VisitorFunction<DefaultTreeDocumentType>;
}

function validateVisitorMethod<T>(visitor: VisitorFunction<T>): void {
  if (typeof visitor !== "function") {
    throw new TypeError(`Non-function found with type ${typeof visitor}`);
  }
}

function validateVisitorMethods(visitor: Visitor): void {
  for (const fn in visitor) {
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

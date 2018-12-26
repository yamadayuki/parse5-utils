import {
  hasChildNodes,
  isCommentNode,
  isDocument,
  isDocumentFragment,
  isDocumentType,
  isElement,
  isTextNode,
} from "@yamadayuki/parse5-is";
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

export function validateVisitorMethods(visitor: Visitor): void {
  for (const fn of Object.values(visitor)) {
    if (typeof fn !== "function") {
      throw new TypeError(`Non-function found with type ${typeof fn}`);
    }
  }
}

export function applyVisitor<T extends DefaultTreeNode>(
  node: T,
  visitor: VisitorFunction<T>,
  parent?: DefaultTreeParentNode
): T {
  return visitor(node, parent);
}

export function traverse(node: DefaultTreeNode, visitor: Visitor) {
  validateVisitorMethods(visitor);

  if (visitor.Document && isDocument(node)) {
    node = applyVisitor(node, visitor.Document);
  }
  if (visitor.DocumentFragment && isDocumentFragment(node)) {
    node = applyVisitor(node, visitor.DocumentFragment);
  }
  if (visitor.DocumentType && isDocumentType(node)) {
    node = applyVisitor(node, visitor.DocumentType);
  }
  if (visitor.Element && isElement(node)) {
    node = applyVisitor(node, visitor.Element);
  }
  if (visitor.CommentNode && isCommentNode(node)) {
    node = applyVisitor(node, visitor.CommentNode);
  }
  if (visitor.TextNode && isTextNode(node)) {
    node = applyVisitor(node, visitor.TextNode);
  }

  if (hasChildNodes(node) && node.childNodes.length > 0) {
    const newChildNodes = node.childNodes.map(childNode =>
      traverse(childNode, visitor)
    );
    node.childNodes = newChildNodes;
  }

  return node;
}

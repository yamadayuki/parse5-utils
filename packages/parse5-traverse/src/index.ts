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
  Visitor,
  VisitorFunction,
  validateVisitorMethods,
} from "@yamadayuki/parse5-visitor";
import { DefaultTreeNode, DefaultTreeParentNode } from "parse5";

function applyVisitor<T extends DefaultTreeNode>(
  node: T,
  visitor: VisitorFunction<T>,
  parent?: DefaultTreeParentNode
): DefaultTreeNode {
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

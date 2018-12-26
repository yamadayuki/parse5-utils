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

export interface DefaultTreeTag extends DefaultTreeNode {
  tagName?: string;
}

export function isElement(node: DefaultTreeTag): node is DefaultTreeElement {
  return node.tagName !== undefined && node.tagName !== null;
}

export function isDocument(node: DefaultTreeNode): node is DefaultTreeDocument {
  return node.nodeName === "#document";
}

export function isTextNode(node: DefaultTreeNode): node is DefaultTreeTextNode {
  return node.nodeName === "#text";
}

export function isCommentNode(
  node: DefaultTreeNode
): node is DefaultTreeCommentNode {
  return node.nodeName === "#comment";
}

export function isDocumentFragment(
  node: DefaultTreeNode
): node is DefaultTreeDocumentFragment {
  return node.nodeName === "#document-fragment";
}

export function isDocumentType(
  node: DefaultTreeNode
): node is DefaultTreeDocumentType {
  return node.nodeName === "#documentType";
}

export function hasSourceCodeLocation(
  node: DefaultTreeElement | DefaultTreeTextNode
): node is Required<typeof node> {
  return node.sourceCodeLocation !== undefined;
}

export function hasParentNode(
  node: DefaultTreeNode
): node is DefaultTreeNode & { parentNode: DefaultTreeParentNode } {
  return !(
    isDocument(node) ||
    isDocumentFragment(node) ||
    isDocumentType(node)
  );
}

export function hasChildNodes(
  node: DefaultTreeNode
): node is DefaultTreeNode & DefaultTreeParentNode {
  return isDocument(node) || isDocumentFragment(node) || isElement(node);
}
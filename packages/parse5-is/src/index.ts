import {
  CommentNode,
  DefaultTreeCommentNode,
  DefaultTreeDocument,
  DefaultTreeDocumentFragment,
  DefaultTreeDocumentType,
  DefaultTreeElement,
  DefaultTreeTextNode,
  Document,
  DocumentFragment,
  Element,
  Node,
  TextNode,
  DefaultTreeParentNode,
} from "parse5";

export function isElement(node: Node): node is Element {
  return !!(node as DefaultTreeElement).tagName;
}

export function isDocument(node: Node): node is Document {
  return (node as DefaultTreeDocument).nodeName === "#document";
}

export function isTextNode(node: Node): node is TextNode {
  return (node as DefaultTreeTextNode).nodeName === "#text";
}

export function isCommentNode(node: Node): node is CommentNode {
  return (node as DefaultTreeCommentNode).nodeName === "#comment";
}

export function isDocumentFragment(node: Node): node is DocumentFragment {
  return (node as DefaultTreeDocumentFragment).nodeName === "#document-fragment";
}

export function isDocumentType(node: Node): node is DocumentType {
  return (node as DefaultTreeDocumentType).nodeName === "#documentType";
}

export function hasSourceCodeLocation(node: Node): node is Required<Element | TextNode | CommentNode> {
  return (node as (DefaultTreeElement | DefaultTreeTextNode | DefaultTreeCommentNode)).sourceCodeLocation !== undefined;
}

export function hasParentNode(node: Node): node is Element | TextNode | CommentNode {
  return !(isDocument(node) || isDocumentFragment(node) || isDocumentType(node));
}

export function hasChildNodes(node: Node): node is DefaultTreeParentNode {
  return isDocument(node) || isDocumentFragment(node) || isElement(node);
}

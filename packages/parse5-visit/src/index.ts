import {
  hasChildNodes,
  isCommentNode,
  isDocument,
  isDocumentFragment,
  isDocumentType,
  isElement,
  isTextNode,
} from "@yamadayuki/parse5-is";
import { DefaultTreeNode, DefaultTreeParentNode, DefaultTreeDocument, DefaultTreeElement } from "parse5";

export type VisitorFunction<T> = (node: T, parent?: DefaultTreeParentNode) => T;

export type Visitor<T> = {
  Element?: VisitorFunction<T> extends VisitorFunction<infer R> ? VisitorFunction<R> : VisitorFunction<T>;
  Document?: VisitorFunction<T> extends VisitorFunction<infer R> ? VisitorFunction<R> : VisitorFunction<T>;
  TextNode?: VisitorFunction<T> extends VisitorFunction<infer R> ? VisitorFunction<R> : VisitorFunction<T>;
  CommentNode?: VisitorFunction<T> extends VisitorFunction<infer R> ? VisitorFunction<R> : VisitorFunction<T>;
  DocumentFragment?: VisitorFunction<T> extends VisitorFunction<infer R> ? VisitorFunction<R> : VisitorFunction<T>;
  DocumentType?: VisitorFunction<T> extends VisitorFunction<infer R> ? VisitorFunction<R> : VisitorFunction<T>;
};

export function validateVisitorMethods(visitor: Visitor<any>): void {
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

export function visitDocument<T extends DefaultTreeDocument>(
  node: T,
  {
    onEnter,
    onLeave,
  }: {
    onEnter?: VisitorFunction<T>;
    onLeave?: VisitorFunction<T>;
  }
) {
  if (isDocument(node) && typeof onEnter === "function") {
    onEnter(node);
  }

  if (node.childNodes && node.childNodes.length > 0) {
    node.childNodes.forEach(childNode => {
      visitDocument(childNode as T, { onEnter, onLeave });
    });
  }

  if (isDocument(node) && typeof onLeave === "function") {
    onLeave(node);
  }

  return node;
}

export function visitElement<T extends DefaultTreeElement>(
  node: T,
  {
    onEnter,
    onLeave,
  }: {
    onEnter?: VisitorFunction<T>;
    onLeave?: VisitorFunction<T>;
  }
) {
  if (isElement(node) && typeof onEnter === "function") {
    onEnter(node, node.parentNode);
  }

  if (node.childNodes && node.childNodes.length > 0) {
    node.childNodes.forEach(childNode => {
      visitElement(childNode as T, { onEnter, onLeave });
    });
  }

  if (isElement(node) && typeof onLeave === "function") {
    onLeave(node, node.parentNode);
  }

  return node;
}

export function traverse<T extends DefaultTreeNode>(node: T, visitor: Visitor<T>) {
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
    const newChildNodes = node.childNodes.map(childNode => traverse(childNode, visitor as Visitor<typeof childNode>));
    node.childNodes = newChildNodes;
  }

  return node;
}

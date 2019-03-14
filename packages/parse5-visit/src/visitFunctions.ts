import {
  hasChildNodes,
  isCommentNode,
  isDocument,
  isDocumentFragment,
  isDocumentType,
  isElement,
  isTextNode,
} from "@yamadayuki/parse5-is";
import { CommentNode, Document, DocumentFragment, DocumentType, Element, Node } from "parse5";
import { VisitorFunction } from "./types";

export function visitDocument(
  node: Node,
  {
    onEnter,
    onLeave,
  }: {
    onEnter?: VisitorFunction<Document>;
    onLeave?: VisitorFunction<Document>;
  }
) {
  if (isDocument(node) && typeof onEnter === "function") {
    onEnter(node);
  }

  if (hasChildNodes(node)) {
    if (node.childNodes && node.childNodes.length > 0) {
      node.childNodes.forEach(childNode => {
        visitDocument(childNode, { onEnter, onLeave });
      });
    }
  }

  if (isDocument(node) && typeof onLeave === "function") {
    onLeave(node);
  }

  return node;
}

export function visitDocumentFragment(
  node: Node,
  {
    onEnter,
    onLeave,
  }: {
    onEnter?: VisitorFunction<DocumentFragment>;
    onLeave?: VisitorFunction<DocumentFragment>;
  }
) {
  if (isDocumentFragment(node) && typeof onEnter === "function") {
    onEnter(node);
  }

  if (hasChildNodes(node)) {
    node.childNodes.forEach(childNode => {
      visitDocumentFragment(childNode, { onEnter, onLeave });
    });
  }

  if (isDocumentFragment(node) && typeof onLeave === "function") {
    onLeave(node);
  }

  return node;
}

export function visitDocumentType(
  node: Node,
  {
    onEnter,
    onLeave,
  }: {
    onEnter?: VisitorFunction<DocumentType>;
    onLeave?: VisitorFunction<DocumentType>;
  }
) {
  if (isDocumentType(node) && typeof onEnter === "function") {
    onEnter(node);
  }

  if (hasChildNodes(node)) {
    if (node.childNodes && node.childNodes.length > 0) {
      node.childNodes.forEach(childNode => {
        visitDocumentType(childNode, { onEnter, onLeave });
      });
    }
  }

  if (isDocumentType(node) && typeof onLeave === "function") {
    onLeave(node);
  }

  return node;
}

export function visitElement(
  node: Node,
  {
    onEnter,
    onLeave,
  }: {
    onEnter?: VisitorFunction<Element>;
    onLeave?: VisitorFunction<Element>;
  }
) {
  if (isElement(node) && typeof onEnter === "function") {
    onEnter(node);
  }

  if (hasChildNodes(node)) {
    node.childNodes.forEach(childNode => {
      visitElement(childNode, { onEnter, onLeave });
    });
  }

  if (isElement(node) && typeof onLeave === "function") {
    onLeave(node);
  }

  return node;
}

export function visitCommentNode(
  node: Node,
  {
    onEnter,
    onLeave,
  }: {
    onEnter?: VisitorFunction<CommentNode>;
    onLeave?: VisitorFunction<CommentNode>;
  }
) {
  if (isCommentNode(node) && typeof onEnter === "function") {
    onEnter(node);
  }

  if (hasChildNodes(node)) {
    node.childNodes.forEach(childNode => {
      visitCommentNode(childNode, { onEnter, onLeave });
    });
  }

  if (isCommentNode(node) && typeof onLeave === "function") {
    onLeave(node);
  }

  return node;
}

export function visitTextNode(
  node: Node,
  {
    onEnter,
    onLeave,
  }: {
    onEnter?: VisitorFunction<Node>;
    onLeave?: VisitorFunction<Node>;
  }
) {
  if (isTextNode(node) && typeof onEnter === "function") {
    onEnter(node);
  }

  if (hasChildNodes(node)) {
    node.childNodes.forEach(childNode => {
      visitTextNode(childNode, { onEnter, onLeave });
    });
  }

  if (isTextNode(node) && typeof onLeave === "function") {
    onLeave(node);
  }

  return node;
}

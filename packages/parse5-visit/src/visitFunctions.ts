import {
  hasChildNodes,
  isCommentNode,
  isDocument,
  isDocumentFragment,
  isDocumentType,
  isElement,
  isTextNode,
  hasParentNode,
} from "@yamadayuki/parse5-is";
import { CommentNode, Document, DocumentFragment, DocumentType, Element, Node, TextNode } from "parse5";
import { VisitorFunction } from "./types";

export function visitDocument(
  node: Node,
  {
    onEnter,
    onLeave,
    visitChildNodes,
  }: {
    onEnter?: VisitorFunction<Document>;
    onLeave?: VisitorFunction<Document>;
    visitChildNodes?: boolean;
  }
) {
  if (isDocument(node) && typeof onEnter === "function") {
    if (hasParentNode(node)) {
      onEnter(node, node.parentNode);
    } else {
      onEnter(node);
    }
  }

  if (visitChildNodes && hasChildNodes(node)) {
    if (node.childNodes && node.childNodes.length > 0) {
      node.childNodes.forEach(childNode => {
        visitDocument(childNode, { onEnter, onLeave, visitChildNodes });
      });
    }
  }

  if (isDocument(node) && typeof onLeave === "function") {
    if (hasParentNode(node)) {
      onLeave(node, node.parentNode);
    } else {
      onLeave(node);
    }
  }

  return node;
}

export function visitDocumentFragment(
  node: Node,
  {
    onEnter,
    onLeave,
    visitChildNodes,
  }: {
    onEnter?: VisitorFunction<DocumentFragment>;
    onLeave?: VisitorFunction<DocumentFragment>;
    visitChildNodes?: boolean;
  }
) {
  if (isDocumentFragment(node) && typeof onEnter === "function") {
    if (hasParentNode(node)) {
      onEnter(node, node.parentNode);
    } else {
      onEnter(node);
    }
  }

  if (visitChildNodes && hasChildNodes(node)) {
    node.childNodes.forEach(childNode => {
      visitDocumentFragment(childNode, { onEnter, onLeave, visitChildNodes });
    });
  }

  if (isDocumentFragment(node) && typeof onLeave === "function") {
    if (hasParentNode(node)) {
      onLeave(node, node.parentNode);
    } else {
      onLeave(node);
    }
  }

  return node;
}

export function visitDocumentType(
  node: Node,
  {
    onEnter,
    onLeave,
    visitChildNodes,
  }: {
    onEnter?: VisitorFunction<DocumentType>;
    onLeave?: VisitorFunction<DocumentType>;
    visitChildNodes?: boolean;
  }
) {
  if (isDocumentType(node) && typeof onEnter === "function") {
    if (hasParentNode(node)) {
      onEnter(node, node.parentNode);
    } else {
      onEnter(node);
    }
  }

  if (visitChildNodes && hasChildNodes(node)) {
    if (node.childNodes && node.childNodes.length > 0) {
      node.childNodes.forEach(childNode => {
        visitDocumentType(childNode, { onEnter, onLeave, visitChildNodes });
      });
    }
  }

  if (isDocumentType(node) && typeof onLeave === "function") {
    if (hasParentNode(node)) {
      onLeave(node, node.parentNode);
    } else {
      onLeave(node);
    }
  }

  return node;
}

export function visitElement(
  node: Node,
  {
    onEnter,
    onLeave,
    visitChildNodes,
  }: {
    onEnter?: VisitorFunction<Element>;
    onLeave?: VisitorFunction<Element>;
    visitChildNodes?: boolean;
  }
) {
  if (isElement(node) && typeof onEnter === "function") {
    if (hasParentNode(node)) {
      onEnter(node, node.parentNode);
    } else {
      onEnter(node);
    }
  }

  if (visitChildNodes && hasChildNodes(node)) {
    node.childNodes.forEach(childNode => {
      visitElement(childNode, { onEnter, onLeave, visitChildNodes });
    });
  }

  if (isElement(node) && typeof onLeave === "function") {
    if (hasParentNode(node)) {
      onLeave(node, node.parentNode);
    } else {
      onLeave(node);
    }
  }

  return node;
}

export function visitCommentNode(
  node: Node,
  {
    onEnter,
    onLeave,
    visitChildNodes,
  }: {
    onEnter?: VisitorFunction<CommentNode>;
    onLeave?: VisitorFunction<CommentNode>;
    visitChildNodes?: boolean;
  }
) {
  if (isCommentNode(node) && typeof onEnter === "function") {
    if (hasParentNode(node)) {
      onEnter(node, node.parentNode);
    } else {
      onEnter(node);
    }
  }

  if (visitChildNodes && hasChildNodes(node)) {
    node.childNodes.forEach(childNode => {
      visitCommentNode(childNode, { onEnter, onLeave, visitChildNodes });
    });
  }

  if (isCommentNode(node) && typeof onLeave === "function") {
    if (hasParentNode(node)) {
      onLeave(node, node.parentNode);
    } else {
      onLeave(node);
    }
  }

  return node;
}

export function visitTextNode(
  node: Node,
  {
    onEnter,
    onLeave,
    visitChildNodes,
  }: {
    onEnter?: VisitorFunction<TextNode>;
    onLeave?: VisitorFunction<TextNode>;
    visitChildNodes?: boolean;
  }
) {
  if (isTextNode(node) && typeof onEnter === "function") {
    if (hasParentNode(node)) {
      onEnter(node, node.parentNode);
    } else {
      onEnter(node);
    }
  }

  if (visitChildNodes && hasChildNodes(node)) {
    node.childNodes.forEach(childNode => {
      visitTextNode(childNode, { onEnter, onLeave, visitChildNodes });
    });
  }

  if (isTextNode(node) && typeof onLeave === "function") {
    if (hasParentNode(node)) {
      onLeave(node, node.parentNode);
    } else {
      onLeave(node);
    }
  }

  return node;
}

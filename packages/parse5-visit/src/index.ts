import {
  hasChildNodes,
  hasParentNode,
  isCommentNode,
  isDocument,
  isDocumentFragment,
  isDocumentType,
  isElement,
  isTextNode,
} from "@yamadayuki/parse5-is";
import { DefaultTreeNode, Node } from "parse5";
import { Visitors } from "./types";
export * from "./visitFunctions";

export function traverse(
  node: Node,
  {
    onEnterDocument,
    onLeaveDocument,
    onEnterDocumentFragment,
    onLeaveDocumentFragment,
    onEnterDocumentType,
    onLeaveDocumentType,
    onEnterElement,
    onLeaveElement,
    onEnterCommentNode,
    onLeaveCommentNode,
    onEnterTextNode,
    onLeaveTextNode,
  }: Visitors
) {
  if (isDocument(node) && typeof onEnterDocument === "function") {
    if (hasParentNode(node)) {
      onEnterDocument(node, node.parentNode);
    } else {
      onEnterDocument(node);
    }
  }

  if (isDocumentFragment(node) && typeof onEnterDocumentFragment === "function") {
    if (hasParentNode(node)) {
      onEnterDocumentFragment(node, node.parentNode);
    } else {
      onEnterDocumentFragment(node);
    }
  }

  if (isDocumentType(node) && typeof onEnterDocumentType === "function") {
    if (hasParentNode(node)) {
      onEnterDocumentType(node, node.parentNode);
    } else {
      onEnterDocumentType(node);
    }
  }

  if (isElement(node) && typeof onEnterElement === "function") {
    if (hasParentNode(node)) {
      onEnterElement(node, node.parentNode);
    } else {
      onEnterElement(node);
    }
  }

  if (isCommentNode(node) && typeof onEnterCommentNode === "function") {
    if (hasParentNode(node)) {
      onEnterCommentNode(node, node.parentNode);
    } else {
      onEnterCommentNode(node);
    }
  }

  if (isTextNode(node) && typeof onEnterTextNode === "function") {
    if (hasParentNode(node)) {
      onEnterTextNode(node, node.parentNode);
    } else {
      onEnterTextNode(node);
    }
  }

  if (hasChildNodes(node)) {
    const newChildNodes = node.childNodes.map(
      childNode =>
        traverse(childNode, {
          onEnterDocument,
          onLeaveDocument,
          onEnterDocumentFragment,
          onLeaveDocumentFragment,
          onEnterDocumentType,
          onLeaveDocumentType,
          onEnterElement,
          onLeaveElement,
          onEnterCommentNode,
          onLeaveCommentNode,
          onEnterTextNode,
          onLeaveTextNode,
        }) as DefaultTreeNode
    );
    node.childNodes = newChildNodes;
  }

  if (isTextNode(node) && typeof onLeaveTextNode === "function") {
    if (hasParentNode(node)) {
      onLeaveTextNode(node, node.parentNode);
    } else {
      onLeaveTextNode(node);
    }
  }

  if (isCommentNode(node) && typeof onLeaveCommentNode === "function") {
    if (hasParentNode(node)) {
      onLeaveCommentNode(node, node.parentNode);
    } else {
      onLeaveCommentNode(node);
    }
  }

  if (isElement(node) && typeof onLeaveElement === "function") {
    if (hasParentNode(node)) {
      onLeaveElement(node, node.parentNode);
    } else {
      onLeaveElement(node);
    }
  }

  if (isDocumentType(node) && typeof onLeaveDocumentType === "function") {
    if (hasParentNode(node)) {
      onLeaveDocumentType(node, node.parentNode);
    } else {
      onLeaveDocumentType(node);
    }
  }

  if (isDocumentFragment(node) && typeof onLeaveDocumentFragment === "function") {
    if (hasParentNode(node)) {
      onLeaveDocumentFragment(node, node.parentNode);
    } else {
      onLeaveDocumentFragment(node);
    }
  }

  if (isDocument(node) && typeof onLeaveDocument === "function") {
    if (hasParentNode(node)) {
      onLeaveDocument(node, node.parentNode);
    } else {
      onLeaveDocument(node);
    }
  }

  return node;
}

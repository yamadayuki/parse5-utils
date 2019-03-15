import {
  hasChildNodes,
  isCommentNode,
  isDocument,
  isDocumentFragment,
  isDocumentType,
  isElement,
  isTextNode,
} from "@yamadayuki/parse5-is";
import { DefaultTreeNode, Node } from "parse5";
import { Visitors } from "./types";
import * as visitFunctions from "./visitFunctions";

export function validateVisitorMethods(visitors: Visitors): void {
  for (const fn of Object.values(visitors)) {
    if (typeof fn !== "function") {
      throw new TypeError(`Non-function found with type ${typeof fn}`);
    }
  }
}

export function traverse(node: Node, visitors: Visitors) {
  validateVisitorMethods(visitors);

  node = visitFunctions.visitDocument(node, { onEnter: visitors.onEnterDocument, onLeave: visitors.onLeaveDocument });
  node = visitFunctions.visitDocumentFragment(node, {
    onEnter: visitors.onEnterDocumentFragment,
    onLeave: visitors.onLeaveDocumentFragment,
  });
  node = visitFunctions.visitDocumentType(node, {
    onEnter: visitors.onEnterDocumentType,
    onLeave: visitors.onLeaveDocumentType,
  });
  node = visitFunctions.visitElement(node, { onEnter: visitors.onEnterElement, onLeave: visitors.onLeaveElement });
  node = visitFunctions.visitCommentNode(node, {
    onEnter: visitors.onEnterCommentNode,
    onLeave: visitors.onLeaveCommentNode,
  });
  node = visitFunctions.visitTextNode(node, { onEnter: visitors.onEnterTextNode, onLeave: visitors.onLeaveTextNode });

  return node;
}

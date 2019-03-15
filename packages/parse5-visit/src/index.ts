import { Node } from "parse5";
import { Visitors } from "./types";
import {
  visitCommentNode,
  visitDocument,
  visitDocumentFragment,
  visitDocumentType,
  visitElement,
  visitTextNode,
} from "./visitFunctions";

export function validateVisitorMethods(visitors: Visitors): void {
  for (const fn of Object.values(visitors)) {
    if (typeof fn !== "function") {
      throw new TypeError(`Non-function found with type ${typeof fn}`);
    }
  }
}

export function traverse(node: Node, visitors: Visitors) {
  validateVisitorMethods(visitors);

  node = visitDocument(node, { onEnter: visitors.onEnterDocument, onLeave: visitors.onLeaveDocument });
  node = visitDocumentFragment(node, {
    onEnter: visitors.onEnterDocumentFragment,
    onLeave: visitors.onLeaveDocumentFragment,
  });
  node = visitDocumentType(node, {
    onEnter: visitors.onEnterDocumentType,
    onLeave: visitors.onLeaveDocumentType,
  });
  node = visitElement(node, { onEnter: visitors.onEnterElement, onLeave: visitors.onLeaveElement });
  node = visitCommentNode(node, {
    onEnter: visitors.onEnterCommentNode,
    onLeave: visitors.onLeaveCommentNode,
  });
  node = visitTextNode(node, { onEnter: visitors.onEnterTextNode, onLeave: visitors.onLeaveTextNode });

  return node;
}

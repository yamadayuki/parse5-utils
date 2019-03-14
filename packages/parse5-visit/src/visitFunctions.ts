import { isDocument, isDocumentFragment, isElement, isDocumentType, isCommentNode } from "@yamadayuki/parse5-is";
import {
  DefaultTreeDocument,
  DefaultTreeDocumentFragment,
  DefaultTreeElement,
  DefaultTreeDocumentType,
  DefaultTreeParentNode,
  DefaultTreeCommentNode,
} from "parse5";
import { VisitorFunction } from "./types";

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

export function visitDocumentFragment<T extends DefaultTreeDocumentFragment>(
  node: T,
  {
    onEnter,
    onLeave,
  }: {
    onEnter?: VisitorFunction<T>;
    onLeave?: VisitorFunction<T>;
  }
) {
  if (isDocumentFragment(node) && typeof onEnter === "function") {
    onEnter(node);
  }

  if (node.childNodes && node.childNodes.length > 0) {
    node.childNodes.forEach(childNode => {
      visitDocumentFragment(childNode as T, { onEnter, onLeave });
    });
  }

  if (isDocumentFragment(node) && typeof onLeave === "function") {
    onLeave(node);
  }

  return node;
}

export function visitDocumentType(
  node: DefaultTreeDocumentType & DefaultTreeParentNode,
  {
    onEnter,
    onLeave,
  }: {
    onEnter?: VisitorFunction<DefaultTreeDocumentType & DefaultTreeParentNode>;
    onLeave?: VisitorFunction<DefaultTreeDocumentType & DefaultTreeParentNode>;
  }
) {
  if (isDocumentType((node as any) as DefaultTreeDocumentType) && typeof onEnter === "function") {
    onEnter(node);
  }

  if (!isDocumentType((node as any) as DefaultTreeDocumentType)) {
    if (node.childNodes && node.childNodes.length > 0) {
      (node.childNodes as DefaultTreeDocumentType[]).forEach(childNode => {
        // @ts-ignore Fix type error
        visitDocumentType(childNode, { onEnter, onLeave });
      });
    }
  }

  if (isDocumentType((node as any) as DefaultTreeDocumentType) && typeof onLeave === "function") {
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

export function visitCommentNode(
  node: DefaultTreeDocumentType & DefaultTreeParentNode,
  {
    onEnter,
    onLeave,
  }: {
    onEnter?: VisitorFunction<DefaultTreeDocumentType & DefaultTreeParentNode>;
    onLeave?: VisitorFunction<DefaultTreeDocumentType & DefaultTreeParentNode>;
  }
) {
  if (isCommentNode(node) && typeof onEnter === "function") {
    onEnter(node, node.parentNode);
  }

  if (node.childNodes && node.childNodes.length > 0) {
    node.childNodes.forEach(childNode => {
      visitCommentNode(childNode as DefaultTreeDocumentType & DefaultTreeParentNode, { onEnter, onLeave });
    });
  }

  if (isCommentNode(node) && typeof onLeave === "function") {
    onLeave(node, node.parentNode);
  }

  return node;
}

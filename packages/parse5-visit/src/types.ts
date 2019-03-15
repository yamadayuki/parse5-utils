import {
  CommentNode,
  DefaultTreeParentNode,
  Document,
  DocumentFragment,
  DocumentType,
  Element,
  TextNode,
} from "parse5";

export type VisitorFunction<T> = (node: T, parent?: DefaultTreeParentNode) => T;

export type Visitors = {
  onEnterDocument?: VisitorFunction<Document>;
  onLeaveDocument?: VisitorFunction<Document>;
  onEnterDocumentFragment?: VisitorFunction<DocumentFragment>;
  onLeaveDocumentFragment?: VisitorFunction<DocumentFragment>;
  onEnterDocumentType?: VisitorFunction<DocumentType>;
  onLeaveDocumentType?: VisitorFunction<DocumentType>;
  onEnterElement?: VisitorFunction<Element>;
  onLeaveElement?: VisitorFunction<Element>;
  onEnterCommentNode?: VisitorFunction<CommentNode>;
  onLeaveCommentNode?: VisitorFunction<CommentNode>;
  onEnterTextNode?: VisitorFunction<TextNode>;
  onLeaveTextNode?: VisitorFunction<TextNode>;
};

import { DefaultTreeParentNode } from "parse5";

export type VisitorFunction<T> = (node: T, parent?: DefaultTreeParentNode) => T;

export type Visitor<T> = {
  Element?: VisitorFunction<T> extends VisitorFunction<infer R> ? VisitorFunction<R> : VisitorFunction<T>;
  Document?: VisitorFunction<T> extends VisitorFunction<infer R> ? VisitorFunction<R> : VisitorFunction<T>;
  TextNode?: VisitorFunction<T> extends VisitorFunction<infer R> ? VisitorFunction<R> : VisitorFunction<T>;
  CommentNode?: VisitorFunction<T> extends VisitorFunction<infer R> ? VisitorFunction<R> : VisitorFunction<T>;
  DocumentFragment?: VisitorFunction<T> extends VisitorFunction<infer R> ? VisitorFunction<R> : VisitorFunction<T>;
  DocumentType?: VisitorFunction<T> extends VisitorFunction<infer R> ? VisitorFunction<R> : VisitorFunction<T>;
};

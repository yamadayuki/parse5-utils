import {
  DefaultTreeDocument,
  DefaultTreeDocumentFragment,
  DefaultTreeElement,
  parse,
  parseFragment,
  DefaultTreeNode,
} from "parse5";
import { applyVisitor, traverse, validateVisitorMethods, VisitorFunction } from "../index";

describe("validateVisitorMethods", () => {
  it("should throw no errors", () => {
    const fn = jest.fn((node: any) => node);
    expect(() => validateVisitorMethods({ Element: fn })).not.toThrow();
  });

  it("should throw an error", () => {
    expect(() => validateVisitorMethods({ Element: 2 as any })).toThrow();
  });
});

describe("applyVisitor", () => {
  const html = "<h1>My First Heading</h1>";

  test("should apply the received function", () => {
    const transformH1ToH2 = (node: DefaultTreeElement) => {
      if (node.nodeName === "h1") {
        node.nodeName = "h2";
        node.tagName = "h2";
      }
      return node;
    };

    const parsed = parseFragment(html) as DefaultTreeDocumentFragment; // #document-fragment
    const h1 = parsed.childNodes[0] as DefaultTreeElement;
    const transformed = applyVisitor(h1, transformH1ToH2);

    expect(transformed.nodeName).toBe("h2");
    expect(transformed.tagName).toBe("h2");
  });

  test("should throw error when the recieved visitor function is invalid", () => {
    const parsed = parseFragment(html) as DefaultTreeDocumentFragment; // #document-fragment
    const h1 = parsed.childNodes[0];

    expect(() => {
      applyVisitor(h1, (2 as any) as VisitorFunction<DefaultTreeNode>);
    }).toThrow();
  });
});

describe("traverse", () => {
  const html = `<!DOCTYPE html>
  <html>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
  </body>
  </html>`;

  it("should affect only element", () => {
    const visitor = jest.fn((node: DefaultTreeElement) => node);

    const parsed = parse(html);
    traverse(parsed, { Element: visitor });
    /**
     * the visitor is called 5 times in this suite.
     * #document
     *   html    <- call!
     *     head  <- call!
     *     body  <- call!
     *       h1  <- call!
     *       p   <- call!
     */
    expect(visitor.mock.calls.length).toBe(5);
  });

  it("should affect document object", () => {
    const visitor = jest.fn((node: DefaultTreeElement) => node);

    const parsed = parse(html);
    traverse(parsed as DefaultTreeDocument, { Document: visitor });
    /**
     * the visitor is called only one time in this suite.
     * #document <- call!
     *   html
     *     head
     *     body
     *       h1
     *       p
     */
    expect(visitor.mock.calls.length).toBe(1);
  });
});

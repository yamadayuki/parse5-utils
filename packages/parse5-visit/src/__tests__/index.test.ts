import {
  DefaultTreeDocument,
  DefaultTreeDocumentFragment,
  DefaultTreeElement,
  DefaultTreeNode,
  parse,
  parseFragment,
} from "parse5";
import { applyVisitor, traverse, validateVisitorMethods, VisitorFunction, visitDocument, visitElement } from "../index";
import { hasParentNode } from "@yamadayuki/parse5-is";

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
    traverse(parsed as DefaultTreeDocument, { Element: (visitor as any) as VisitorFunction<DefaultTreeNode> });
    /**
     * the visitor is called 5 times in this suite.
     * #document
     *   html    <- call!
     *     head  <- call!
     *     body  <- call!
     *       h1  <- call!
     *       p   <- call!
     */
    expect(visitor).toHaveBeenCalledTimes(5);
  });

  it("should affect document object", () => {
    const visitor = jest.fn((node: DefaultTreeElement) => node);

    const parsed = parse(html);
    traverse(parsed as DefaultTreeDocument, { Document: (visitor as any) as VisitorFunction<DefaultTreeNode> });
    /**
     * the visitor is called only one time in this suite.
     * #document <- call!
     *   html
     *     head
     *     body
     *       h1
     *       p
     */
    expect(visitor).toHaveBeenCalledTimes(1);
  });
});

describe("visitDocument", () => {
  const html = `<!DOCTYPE html>
  <html>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
  </body>
  </html>`;
  const parsed = parse(html);

  it("doesn't throw", () => {
    const visitor = jest.fn((node: DefaultTreeDocument) => node);

    expect(() => {
      visitDocument(parsed as DefaultTreeDocument, { onEnter: visitor });
    }).not.toThrow();
  });

  it("calls `onEnter` only once", () => {
    const visitor = jest.fn((node: DefaultTreeDocument) => node);

    visitDocument(parsed as DefaultTreeDocument, { onEnter: visitor });
    /**
     * the visitor is called only one time in this suite.
     * #document <- call!
     *   html
     *     head
     *     body
     *       h1
     *       p
     */
    expect(visitor).toHaveBeenCalledTimes(1);
  });

  it("matches snapshot", () => {
    const affectedNodeName: string[] = [];
    const onEnter = jest.fn((node: DefaultTreeDocument) => {
      affectedNodeName.push(`-> ${node.nodeName}`);
      return node;
    });
    const onLeave = jest.fn((node: DefaultTreeDocument) => {
      affectedNodeName.push(`<- ${node.nodeName}`);
      return node;
    });

    visitDocument(parsed as DefaultTreeDocument, { onEnter, onLeave });
    expect(affectedNodeName).toMatchSnapshot();
  });
});

describe("visitElement", () => {
  const html = `<!DOCTYPE html>
  <html>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
  </body>
  </html>`;
  const parsed = parse(html);

  it("doesn't throw", () => {
    const visitor = jest.fn((node: DefaultTreeElement) => node);

    expect(() => {
      visitElement(parsed as DefaultTreeElement, { onEnter: visitor });
    }).not.toThrow();
  });

  it("calls `onEnter` only once", () => {
    const visitor = jest.fn((node: DefaultTreeElement) => node);

    visitElement(parsed as DefaultTreeElement, { onEnter: visitor });
    /**
     * the visitor is called only one time in this suite.
     * #document
     *   html    <- call!
     *     head  <- call!
     *     body  <- call!
     *       h1  <- call!
     *       p   <- call!
     */
    expect(visitor).toHaveBeenCalledTimes(5);
  });

  it("matches snapshot", () => {
    const affectedNodeName: string[] = [];
    let depth = 0;
    const onEnter = jest.fn((node: DefaultTreeElement) => {
      if (hasParentNode(node)) {
        depth = depth + 1;
      }
      affectedNodeName.push(`${"".padStart(depth * 2, " ")}-> ${node.nodeName}`);
      return node;
    });
    const onLeave = jest.fn((node: DefaultTreeElement) => {
      affectedNodeName.push(`${"".padStart(depth * 2, " ")}<- ${node.nodeName}`);
      if (hasParentNode(node)) {
        depth = depth - 1;
      }
      return node;
    });

    visitElement(parsed as DefaultTreeElement, { onEnter, onLeave });
    expect(affectedNodeName).toMatchSnapshot();
  });
});

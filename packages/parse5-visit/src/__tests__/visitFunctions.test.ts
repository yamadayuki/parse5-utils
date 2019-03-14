import { hasParentNode } from "@yamadayuki/parse5-is";
import {
  DefaultTreeDocument,
  DefaultTreeDocumentFragment,
  DefaultTreeElement,
  parse,
  parseFragment,
  DefaultTreeDocumentType,
  TreeAdapter,
  DefaultTreeParentNode,
  DefaultTreeCommentNode,
} from "parse5";
import {
  visitDocument,
  visitDocumentFragment,
  visitElement,
  visitDocumentType,
  visitCommentNode,
} from "../visitFunctions";
// @ts-ignore for testing
import * as defaultTreeAdapter from "parse5/lib/tree-adapters/default";

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

describe("visitDocumentFragment", () => {
  const html = `<!DOCTYPE html>
  <html>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
  </body>
  </html>`;
  const parsed = parseFragment(html);

  it("doesn't throw", () => {
    const visitor = jest.fn((node: DefaultTreeDocumentFragment) => node);

    expect(() => {
      visitDocumentFragment(parsed as DefaultTreeDocumentFragment, { onEnter: visitor });
    }).not.toThrow();
  });

  it("calls `onEnter` only once", () => {
    const visitor = jest.fn((node: DefaultTreeDocumentFragment) => node);

    visitDocumentFragment(parsed as DefaultTreeDocumentFragment, { onEnter: visitor });
    /**
     * the visitor is called only one time in this suite.
     * #document-fragment <- call!
     *   h1
     *   p
     */
    expect(visitor).toHaveBeenCalledTimes(1);
  });

  it("matches snapshot", () => {
    const affectedNodeName: string[] = [];
    const onEnter = jest.fn((node: DefaultTreeDocumentFragment) => {
      affectedNodeName.push(`-> ${node.nodeName}`);
      return node;
    });
    const onLeave = jest.fn((node: DefaultTreeDocumentFragment) => {
      affectedNodeName.push(`<- ${node.nodeName}`);
      return node;
    });

    visitDocumentFragment(parsed as DefaultTreeDocumentFragment, { onEnter, onLeave });
    expect(affectedNodeName).toMatchSnapshot();
  });
});

describe("visitDocumentType", () => {
  const html = `<!DOCTYPE html>
  <html>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
  </body>
  </html>`;
  const parsed = parse(html, {
    treeAdapter: {
      ...defaultTreeAdapter,
      setDocumentType: function(document, name, publicId, systemId) {
        defaultTreeAdapter.appendChild(document, {
          nodeName: "#documentType",
          name: name,
          publicId: publicId,
          systemId: systemId,
        });
      },
    } as TreeAdapter,
  });

  it("doesn't throw", () => {
    const visitor = jest.fn(node => node);

    expect(() => {
      visitDocumentType(parsed as any, { onEnter: visitor });
    }).not.toThrow();
  });

  it("calls `onEnter` only once", () => {
    const visitor = jest.fn(node => node);

    visitDocumentType(parsed as any, { onEnter: visitor });
    /**
     * the visitor is called only one time in this suite.
     * #document
     *   #documentType  <- call!
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
    const onEnter = jest.fn(node => {
      affectedNodeName.push(`-> ${node.nodeName}`);
      return node;
    });
    const onLeave = jest.fn(node => {
      affectedNodeName.push(`<- ${node.nodeName}`);
      return node;
    });

    visitDocumentType(parsed as (DefaultTreeDocumentType & DefaultTreeParentNode), { onEnter, onLeave });
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

describe("visitCommentNode", () => {
  const html = `<!DOCTYPE html>
  <html>
  <body>
    <h1>My First Heading</h1>
    <!-- Comment -->
    <p>My first paragraph.</p>
  </body>
  </html>`;
  const parsed = parse(html);

  it("doesn't throw", () => {
    const visitor = jest.fn(node => node);

    expect(() => {
      visitCommentNode(parsed as DefaultTreeCommentNode & DefaultTreeParentNode, { onEnter: visitor });
    }).not.toThrow();
  });

  it("calls `onEnter` only once", () => {
    const visitor = jest.fn(node => node);

    visitCommentNode(parsed as DefaultTreeCommentNode & DefaultTreeParentNode, { onEnter: visitor });
    /**
     * the visitor is called only one time in this suite.
     * #document
     *   html
     *     head
     *     body
     *       h1
     *       comment  <- call!
     *       p
     */
    expect(visitor).toHaveBeenCalledTimes(5);
  });

  it("matches snapshot", () => {
    const affectedNodeName: string[] = [];
    let depth = 0;
    const onEnter = jest.fn(node => {
      if (hasParentNode(node)) {
        depth = depth + 1;
      }
      affectedNodeName.push(`${"".padStart(depth * 2, " ")}-> ${node.nodeName}`);
      return node;
    });
    const onLeave = jest.fn(node => {
      affectedNodeName.push(`${"".padStart(depth * 2, " ")}<- ${node.nodeName}`);
      if (hasParentNode(node)) {
        depth = depth - 1;
      }
      return node;
    });

    visitCommentNode(parsed as DefaultTreeCommentNode & DefaultTreeParentNode, { onEnter, onLeave });
    expect(affectedNodeName).toMatchSnapshot();
  });
});

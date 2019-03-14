import { hasParentNode } from "@yamadayuki/parse5-is";
import { parse, parseFragment, TreeAdapter } from "parse5";
// @ts-ignore for testing
import * as defaultTreeAdapter from "parse5/lib/tree-adapters/default";
import {
  visitCommentNode,
  visitDocument,
  visitDocumentFragment,
  visitDocumentType,
  visitElement,
  visitTextNode,
} from "../visitFunctions";

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
    const visitor = jest.fn(node => node);

    expect(() => {
      visitDocument(parsed, { onEnter: visitor });
    }).not.toThrow();
  });

  it("calls `onEnter` only once", () => {
    const visitor = jest.fn(node => node);

    visitDocument(parsed, { onEnter: visitor });
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
    const onEnter = jest.fn(node => {
      affectedNodeName.push(`-> ${node.nodeName}`);
      return node;
    });
    const onLeave = jest.fn(node => {
      affectedNodeName.push(`<- ${node.nodeName}`);
      return node;
    });

    visitDocument(parsed, { onEnter, onLeave });
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
    const visitor = jest.fn(node => node);

    expect(() => {
      visitDocumentFragment(parsed, { onEnter: visitor });
    }).not.toThrow();
  });

  it("calls `onEnter` only once", () => {
    const visitor = jest.fn(node => node);

    visitDocumentFragment(parsed, { onEnter: visitor });
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
    const onEnter = jest.fn(node => {
      affectedNodeName.push(`-> ${node.nodeName}`);
      return node;
    });
    const onLeave = jest.fn(node => {
      affectedNodeName.push(`<- ${node.nodeName}`);
      return node;
    });

    visitDocumentFragment(parsed, { onEnter, onLeave });
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
      visitDocumentType(parsed, { onEnter: visitor });
    }).not.toThrow();
  });

  it("calls `onEnter` only once", () => {
    const visitor = jest.fn(node => node);

    visitDocumentType(parsed, { onEnter: visitor });
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

    visitDocumentType(parsed, { onEnter, onLeave });
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
    const visitor = jest.fn(node => node);

    expect(() => {
      visitElement(parsed, { onEnter: visitor });
    }).not.toThrow();
  });

  it("calls `onEnter` only once", () => {
    const visitor = jest.fn(node => node);

    visitElement(parsed, { onEnter: visitor });
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

    visitElement(parsed, { onEnter, onLeave });
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
      visitCommentNode(parsed, { onEnter: visitor });
    }).not.toThrow();
  });

  it("calls `onEnter` only once", () => {
    const visitor = jest.fn(node => node);

    visitCommentNode(parsed, { onEnter: visitor });
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
    expect(visitor).toHaveBeenCalledTimes(1);
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

    visitCommentNode(parsed, { onEnter, onLeave });
    expect(affectedNodeName).toMatchSnapshot();
  });
});

describe("visitTextNode", () => {
  const html = "<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>";
  const parsed = parse(html);

  it("doesn't throw", () => {
    const visitor = jest.fn(node => node);

    expect(() => {
      visitTextNode(parsed, { onEnter: visitor });
    }).not.toThrow();
  });

  it("calls `onEnter` only once", () => {
    const visitor = jest.fn(node => node);

    visitTextNode(parsed, { onEnter: visitor });
    /**
     * the visitor is called only one time in this suite.
     * #document
     *   html
     *     head
     *     body
     *       h1
     *         text  <- call!
     *       p
     *         text  <- call!
     */
    expect(visitor).toHaveBeenCalledTimes(2);
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

    visitTextNode(parsed, { onEnter, onLeave });
    expect(affectedNodeName).toMatchSnapshot();
  });
});

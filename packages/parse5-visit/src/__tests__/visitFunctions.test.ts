import { hasParentNode } from "@yamadayuki/parse5-is";
import {
  DefaultTreeCommentNode,
  DefaultTreeElement,
  DefaultTreeParentNode,
  DefaultTreeTextNode,
  parse,
  parseFragment,
  TreeAdapter,
} from "parse5";
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
    const onEnter = jest.fn(node => node);

    visitDocument(parsed, { onEnter });
    /**
     * the onEnter is called only one time in this suite.
     * #document <- call!
     *   html
     *     head
     *     body
     *       h1
     *       p
     */
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it("calls `onLeave` only once", () => {
    const onLeave = jest.fn(node => node);

    visitDocument(parsed, { onLeave });
    /**
     * the onLeave is called only one time in this suite.
     * #document <- call!
     *   html
     *     head
     *     body
     *       h1
     *       p
     */
    expect(onLeave).toHaveBeenCalledTimes(1);
  });

  it("matches snapshot", () => {
    const memo: string[] = [];
    let depth = 0;
    const onEnter = jest.fn((node, parentNode) => {
      if (hasParentNode(node)) {
        depth = depth + 1;
      }
      memo.push(`${"".padStart(depth * 2, " ")}${parentNode ? parentNode.nodeName : ""} -> ${node.nodeName}`);
      return node;
    });
    const onLeave = jest.fn((node, parentNode) => {
      memo.push(`${"".padStart(depth * 2, " ")}${parentNode ? parentNode.nodeName : ""} <- ${node.nodeName}`);
      if (hasParentNode(node)) {
        depth = depth - 1;
      }
      return node;
    });

    visitDocument(parsed, { onEnter, onLeave });
    expect(memo).toMatchSnapshot();
  });

  it("onEnter and onLeave are called with expected arguments", () => {
    const documentNode = parsed as any;
    documentNode.parentNode = (parsed as any).childNodes[0];
    const parentNode = documentNode.parentNode;
    const onEnter = jest.fn(node => node);
    const onLeave = jest.fn(node => node);

    visitDocument(documentNode, { onEnter, onLeave });
    expect(onEnter).toHaveBeenCalledWith(documentNode, parentNode);
    expect(onLeave).toHaveBeenCalledWith(documentNode, parentNode);
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
    const onEnter = jest.fn(node => node);

    visitDocumentFragment(parsed, { onEnter });
    /**
     * the onEnter is called only one time in this suite.
     * #document-fragment <- call!
     *   h1
     *   p
     */
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it("calls `onLeave` only once", () => {
    const onLeave = jest.fn(node => node);

    visitDocumentFragment(parsed, { onLeave });
    /**
     * the onLeave is called only one time in this suite.
     * #document-fragment <- call!
     *   h1
     *   p
     */
    expect(onLeave).toHaveBeenCalledTimes(1);
  });

  it("matches snapshot", () => {
    const memo: string[] = [];
    let depth = 0;
    const onEnter = jest.fn((node, parentNode) => {
      if (hasParentNode(node)) {
        depth = depth + 1;
      }
      memo.push(`${"".padStart(depth * 2, " ")}${parentNode ? parentNode.nodeName : ""} -> ${node.nodeName}`);
      return node;
    });
    const onLeave = jest.fn((node, parentNode) => {
      memo.push(`${"".padStart(depth * 2, " ")}${parentNode ? parentNode.nodeName : ""} <- ${node.nodeName}`);
      if (hasParentNode(node)) {
        depth = depth - 1;
      }
      return node;
    });

    visitDocumentFragment(parsed, { onEnter, onLeave });
    expect(memo).toMatchSnapshot();
  });

  it("onEnter and onLeave are called with expected arguments", () => {
    const documentFragmentNode = parsed as any;
    documentFragmentNode.parentNode = (parsed as any).childNodes[0];
    const parentNode = documentFragmentNode.parentNode;
    const onEnter = jest.fn(node => node);
    const onLeave = jest.fn(node => node);

    visitDocumentFragment(documentFragmentNode, { onEnter, onLeave });
    expect(onEnter).toHaveBeenCalledWith(documentFragmentNode, parentNode);
    expect(onLeave).toHaveBeenCalledWith(documentFragmentNode, parentNode);
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
    const onEnter = jest.fn(node => node);

    visitDocumentType(parsed, { onEnter });
    /**
     * the onEnter is called only one time in this suite.
     * #document
     *   #documentType  <- call!
     *   html
     *     head
     *     body
     *       h1
     *       p
     */
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it("calls `onLeave` only once", () => {
    const onLeave = jest.fn(node => node);

    visitDocumentType(parsed, { onLeave });
    /**
     * the onLeave is called only one time in this suite.
     * #document
     *   #documentType  <- call!
     *   html
     *     head
     *     body
     *       h1
     *       p
     */
    expect(onLeave).toHaveBeenCalledTimes(1);
  });

  it("matches snapshot", () => {
    const memo: string[] = [];
    let depth = 0;
    const onEnter = jest.fn((node, parentNode) => {
      if (hasParentNode(node)) {
        depth = depth + 1;
      }
      memo.push(`${"".padStart(depth * 2, " ")}${parentNode ? parentNode.nodeName : ""} -> ${node.nodeName}`);
      return node;
    });
    const onLeave = jest.fn((node, parentNode) => {
      memo.push(`${"".padStart(depth * 2, " ")}${parentNode ? parentNode.nodeName : ""} <- ${node.nodeName}`);
      if (hasParentNode(node)) {
        depth = depth - 1;
      }
      return node;
    });

    visitDocumentType(parsed, { onEnter, onLeave });
    expect(memo).toMatchSnapshot();
  });

  it("onEnter and onLeave are called with expected arguments", () => {
    const documentTypeNode = (parsed as DefaultTreeParentNode).childNodes[0];
    delete (documentTypeNode as DefaultTreeElement).parentNode;
    const onEnter = jest.fn(node => node);
    const onLeave = jest.fn(node => node);

    visitDocumentType(documentTypeNode, { onEnter, onLeave });
    expect(onEnter).toHaveBeenCalledWith(documentTypeNode);
    expect(onLeave).toHaveBeenCalledWith(documentTypeNode);
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

  it("calls `onEnter` only five times", () => {
    const onEnter = jest.fn(node => node);

    visitElement(parsed, { onEnter });
    /**
     * the onEnter is called only one time in this suite.
     * #document
     *   html    <- call!
     *     head  <- call!
     *     body  <- call!
     *       h1  <- call!
     *       p   <- call!
     */
    expect(onEnter).toHaveBeenCalledTimes(5);
  });

  it("calls `onLeave` only five times", () => {
    const onLeave = jest.fn(node => node);

    visitElement(parsed, { onLeave });
    /**
     * the onLeave is called only one time in this suite.
     * #document
     *   html    <- call!
     *     head  <- call!
     *     body  <- call!
     *       h1  <- call!
     *       p   <- call!
     */
    expect(onLeave).toHaveBeenCalledTimes(5);
  });

  it("matches snapshot", () => {
    const memo: string[] = [];
    let depth = 0;
    const onEnter = jest.fn((node, parentNode) => {
      if (hasParentNode(node)) {
        depth = depth + 1;
      }
      memo.push(`${"".padStart(depth * 2, " ")}${parentNode ? parentNode.nodeName : ""} -> ${node.nodeName}`);
      return node;
    });
    const onLeave = jest.fn((node, parentNode) => {
      memo.push(`${"".padStart(depth * 2, " ")}${parentNode ? parentNode.nodeName : ""} <- ${node.nodeName}`);
      if (hasParentNode(node)) {
        depth = depth - 1;
      }
      return node;
    });

    visitElement(parsed, { onEnter, onLeave });
    expect(memo).toMatchSnapshot();
  });

  it("onEnter and onLeave are called with expected arguments", () => {
    const parsed = parseFragment("<p>Hello</p>");
    const elementNode = (parsed as DefaultTreeParentNode).childNodes[0];
    delete (elementNode as DefaultTreeElement).parentNode;
    const onEnter = jest.fn(node => node);
    const onLeave = jest.fn(node => node);

    visitElement(elementNode, { onEnter, onLeave });
    expect(onEnter).toHaveBeenCalledWith(elementNode);
    expect(onLeave).toHaveBeenCalledWith(elementNode);
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
    const onEnter = jest.fn(node => node);
    const onLeave = jest.fn(node => node);

    expect(() => {
      visitCommentNode(parsed, { onEnter, onLeave });
    }).not.toThrow();
  });

  it("calls `onEnter` only once", () => {
    const onEnter = jest.fn((node, _parentNode) => node);

    visitCommentNode(parsed, { onEnter });
    /**
     * the onEnter is called only one time in this suite.
     * #document
     *   html
     *     head
     *     body
     *       h1
     *       comment  <- call!
     *       p
     */
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it("calls `onLeave` only once", () => {
    const onLeave = jest.fn((node, _parentNode) => node);

    visitCommentNode(parsed, { onLeave });
    /**
     * the onLeave is called only one time in this suite.
     * #document
     *   html
     *     head
     *     body
     *       h1
     *       comment  <- call!
     *       p
     */
    expect(onLeave).toHaveBeenCalledTimes(1);
  });

  it("matches snapshot", () => {
    const memo: string[] = [];
    let depth = 0;
    const onEnter = jest.fn((node, parentNode) => {
      if (hasParentNode(node)) {
        depth = depth + 1;
      }
      memo.push(`${"".padStart(depth * 2, " ")}${parentNode ? parentNode.nodeName : ""} -> ${node.nodeName}`);
      return node;
    });
    const onLeave = jest.fn((node, parentNode) => {
      memo.push(`${"".padStart(depth * 2, " ")}${parentNode ? parentNode.nodeName : ""} <- ${node.nodeName}`);
      if (hasParentNode(node)) {
        depth = depth - 1;
      }
      return node;
    });

    visitCommentNode(parsed, { onEnter, onLeave });
    expect(memo).toMatchSnapshot();
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

  it("calls `onEnter` only twice", () => {
    const onEnter = jest.fn(node => node);

    visitTextNode(parsed, { onEnter });
    /**
     * the onEnter is called only one time in this suite.
     * #document
     *   html
     *     head
     *     body
     *       h1
     *         text  <- call!
     *       p
     *         text  <- call!
     */
    expect(onEnter).toHaveBeenCalledTimes(2);
  });

  it("calls `onLeave` only twice", () => {
    const onLeave = jest.fn(node => node);

    visitTextNode(parsed, { onLeave });
    /**
     * the onLeave is called only one time in this suite.
     * #document
     *   html
     *     head
     *     body
     *       h1
     *         text  <- call!
     *       p
     *         text  <- call!
     */
    expect(onLeave).toHaveBeenCalledTimes(2);
  });

  it("matches snapshot", () => {
    const memo: string[] = [];
    let depth = 0;
    const onEnter = jest.fn((node, parentNode) => {
      if (hasParentNode(node)) {
        depth = depth + 1;
      }
      memo.push(`${"".padStart(depth * 2, " ")}${parentNode ? parentNode.nodeName : ""} -> ${node.nodeName}`);
      return node;
    });
    const onLeave = jest.fn((node, parentNode) => {
      memo.push(`${"".padStart(depth * 2, " ")}${parentNode ? parentNode.nodeName : ""} <- ${node.nodeName}`);
      if (hasParentNode(node)) {
        depth = depth - 1;
      }
      return node;
    });

    visitTextNode(parsed, { onEnter, onLeave });
    expect(memo).toMatchSnapshot();
  });

  it("onEnter and onLeave are called with expected arguments", () => {
    const parsed = parseFragment("Hello");
    const textNode = (parsed as DefaultTreeParentNode).childNodes[0];
    delete (textNode as DefaultTreeTextNode).parentNode;
    const onEnter = jest.fn(node => node);
    const onLeave = jest.fn(node => node);

    visitTextNode(textNode, { onEnter, onLeave });
    expect(onEnter).toHaveBeenCalledWith(textNode);
    expect(onLeave).toHaveBeenCalledWith(textNode);
  });
});

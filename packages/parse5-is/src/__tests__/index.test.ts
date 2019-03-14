import { DefaultTreeParentNode, parse, parseFragment, TreeAdapter, DefaultTreeElement } from "parse5";
// @ts-ignore for testing
import * as defaultTreeAdapter from "parse5/lib/tree-adapters/default";
import {
  hasChildNodes,
  isCommentNode,
  isDocument,
  isDocumentFragment,
  isDocumentType,
  isElement,
  isTextNode,
  hasParentNode,
} from "../index";
import { hasSourceCodeLocation } from "../../lib";

describe("isDocument", () => {
  const html = `<!DOCTYPE html>
  <html>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
  </body>
  </html>`;

  it("should return true only when the received node is document object", () => {
    const ast = parse(html);

    expect(isDocument(ast)).toBe(true);
    if (hasChildNodes(ast)) {
      expect(isDocument(ast.childNodes[0])).toBe(false);
    }
  });
});

describe("isDocumentFragment", () => {
  const html = `<!DOCTYPE html>
  <html>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
  </body>
  </html>`;

  it("should return true only when the received node is document fragment object", () => {
    const ast = parseFragment(html);

    expect(isDocumentFragment(ast)).toBe(true);
    if (hasChildNodes(ast)) {
      expect(isDocumentFragment(ast.childNodes[0])).toBe(false);
    }
  });
});

describe("isDocumentType", () => {
  const html = `<!DOCTYPE html>
  <html>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
  </body>
  </html>`;

  it("should return true only when the received node is document type object", () => {
    const ast = (parse(html, {
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
    }) as DefaultTreeParentNode).childNodes[0];

    expect(isDocumentType(ast)).toBe(true);
    if (hasChildNodes(ast)) {
      expect(isDocumentType(ast.childNodes[0])).toBe(false);
    }
  });
});

describe("isElement", () => {
  it("should return true only when the received node is element object", () => {
    const ast = (parseFragment("<p>Hello</p>") as DefaultTreeParentNode).childNodes[0];

    expect(isElement(ast)).toBe(true);
    if (hasChildNodes(ast)) {
      expect(isElement(ast.childNodes[0])).toBe(false);
    }
  });
});

describe("isCommentNode", () => {
  it("should return true only when the received node is comment node object", () => {
    const ast = (parseFragment("<!-- Hello -->") as DefaultTreeParentNode).childNodes[0];

    expect(isCommentNode(ast)).toBe(true);
    if (hasChildNodes(ast)) {
      expect(isCommentNode(ast.childNodes[0])).toBe(false);
    }
  });
});

describe("isTextNode", () => {
  it("should return true only when the received node is text node object", () => {
    const ast = (parseFragment("Hello") as DefaultTreeParentNode).childNodes[0];

    expect(isTextNode(ast)).toBe(true);
    if (hasChildNodes(ast)) {
      expect(isTextNode(ast.childNodes[0])).toBe(false);
    }
  });
});

describe("hasSourceCodeLocation", () => {
  const html = `<!DOCTYPE html>
  <html>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
  </body>
  </html>`;

  it("should return true if the node has source code location", () => {
    const ast = parse(html, { sourceCodeLocationInfo: true });

    expect(hasSourceCodeLocation(ast)).toBe(false);
    if (hasChildNodes(ast)) {
      expect(hasSourceCodeLocation(ast.childNodes[0])).toBe(true);
    }
  });
});

describe("hasParentNode", () => {
  const html = `<!DOCTYPE html>
  <html>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
  </body>
  </html>`;

  it("should return true if the node has source code location", () => {
    const ast = parse(html, { sourceCodeLocationInfo: true });

    expect(hasParentNode(ast)).toEqual(false);
    if (hasChildNodes(ast)) {
      expect(hasParentNode(ast.childNodes[0])).toBe(true);
    }
  });
});

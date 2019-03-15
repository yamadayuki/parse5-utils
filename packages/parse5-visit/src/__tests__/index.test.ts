import {
  DefaultTreeDocument,
  DefaultTreeDocumentFragment,
  DefaultTreeElement,
  DefaultTreeNode,
  parse,
  parseFragment,
} from "parse5";
import { traverse, validateVisitorMethods } from "../index";
import { VisitorFunction } from "../types";

describe("validateVisitorMethods", () => {
  it("should throw no errors", () => {
    const onEnterElement = jest.fn((node: any) => node);
    expect(() => validateVisitorMethods({ onEnterElement })).not.toThrow();
  });

  it("should throw an error", () => {
    expect(() => validateVisitorMethods({ onEnterElement: 2 as any })).toThrow();
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
    const onEnterElement = jest.fn(node => node);

    const parsed = parse(html);
    traverse(parsed, { onEnterElement });
    /**
     * the onEnterElement is called 5 times in this suite.
     * #document
     *   html    <- call!
     *     head  <- call!
     *     body  <- call!
     *       h1  <- call!
     *       p   <- call!
     */
    expect(onEnterElement).toHaveBeenCalledTimes(5);
  });

  it("should affect document object", () => {
    const onEnterDocument = jest.fn(node => node);

    const parsed = parse(html);
    traverse(parsed, { onEnterDocument });
    /**
     * the onEnterDocument is called only one time in this suite.
     * #document <- call!
     *   html
     *     head
     *     body
     *       h1
     *       p
     */
    expect(onEnterDocument).toHaveBeenCalledTimes(1);
  });
});

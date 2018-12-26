import { DefaultTreeDocument, DefaultTreeElement, parse } from "parse5";
import { traverse } from "../index";

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
    traverse(parsed as DefaultTreeDocument, { Element: visitor });
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

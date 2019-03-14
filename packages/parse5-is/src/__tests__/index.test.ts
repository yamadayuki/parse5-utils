import { parse } from "parse5";
import { hasChildNodes, isDocument } from "../index";

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

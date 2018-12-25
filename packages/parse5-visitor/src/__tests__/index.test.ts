import {
  DefaultTreeDocumentFragment,
  DefaultTreeElement,
  parseFragment,
} from "parse5";
import { visitElement, VisitorFunction } from "../index";

describe("visitElement", () => {
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
    const transformed = visitElement(h1, transformH1ToH2);

    expect(transformed.nodeName).toBe("h2");
    expect(transformed.tagName).toBe("h2");
  });

  test("should throw error when the recieved visitor function is invalid", () => {
    const parsed = parseFragment(html) as DefaultTreeDocumentFragment; // #document-fragment
    const h1 = parsed.childNodes[0] as DefaultTreeElement;

    expect(() => {
      visitElement(h1, (2 as any) as VisitorFunction<DefaultTreeElement>);
    }).toThrow();
  });
});

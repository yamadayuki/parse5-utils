import { parse } from "parse5";
import { traverse, validateVisitorMethods } from "../index";
import { hasParentNode } from "@yamadayuki/parse5-is";

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
    const parsed = parse(html);

    traverse(parsed, {
      onEnterDocument: onEnter,
      onLeaveDocument: onLeave,
      onEnterDocumentFragment: onEnter,
      onLeaveDocumentFragment: onLeave,
      onEnterDocumentType: onEnter,
      onLeaveDocumentType: onLeave,
      onEnterElement: onEnter,
      onLeaveElement: onLeave,
      onEnterCommentNode: onEnter,
      onLeaveCommentNode: onLeave,
      onEnterTextNode: onEnter,
      onLeaveTextNode: onLeave,
    });
    expect(memo).toMatchSnapshot();
  });
});

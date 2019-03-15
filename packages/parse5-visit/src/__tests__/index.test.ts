import { hasParentNode } from "@yamadayuki/parse5-is";
import { DefaultTreeElement, parse } from "parse5";
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
    const memo: {
      depth: number;
      paths: string[];
      updateDepth: (d: number) => void;
      pushPath: (node: DefaultTreeElement, parentNode: DefaultTreeElement, event: "enter" | "leave") => void;
    } = {
      depth: 0,
      paths: [],
      updateDepth(d) {
        this.depth = this.depth + d;
      },
      pushPath(node, parentNode, event) {
        this.paths.push(
          `${"".padStart(memo.depth * 2, " ")}${parentNode ? parentNode.nodeName : ""} ${
            event === "enter" ? "->" : "<-"
          } ${node.nodeName}`
        );
      },
    };
    const onEnter = jest.fn((node, parentNode) => {
      if (hasParentNode(node)) {
        memo.updateDepth(1);
      }
      memo.pushPath(node, parentNode, "enter");
      return node;
    });
    const onLeave = jest.fn((node, parentNode) => {
      memo.pushPath(node, parentNode, "leave");
      if (hasParentNode(node)) {
        memo.updateDepth(-1);
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
    expect(memo.paths).toMatchSnapshot();
  });
});

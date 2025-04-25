import { parseDocument } from "htmlparser2";

// This function extracts text from a node and its children recursively
const getText = (node: any): string => {
  if (node.type === "text") return node.data;
  if (node.children) return node.children.map(getText).join("");
  return "";
};

// This function parses HTML and extracts text from <li> and <p> tags
export const htmlParser = (html: string): string[] => {
  const doc = parseDocument(html);
  const steps: string[] = [];

  const traverse = (nodes: any[]) => {
    for (const node of nodes) {
      if (node.type === "tag" && (node.name === "li" || node.name === "p")) {
        const text = getText(node).trim();
        if (text) steps.push(text);
      } else if (node.children) {
        traverse(node.children);
      }
    }
  };

  traverse(doc.children);
  return steps;
};

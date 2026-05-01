import { FC } from "react";

type CustomParagraph = {
  paragraph: string;
  options: {
    color?: string;
    tokens: Record<string, string>;
  };
};

export const CustomParagraph: FC<CustomParagraph> = ({
  paragraph,
  options,
}) => {
  const { tokens, color } = options;

  const createElement = (content: string, index: number) => {
    if (!color) {
      return (
        <span key={index} className="text-bold text-[#475569]">
          {content}
        </span>
      );
    }
    return (
      <span 
        key={index}
        style={{color, fontWeight: 'bold'}}
      >
        {content}
      </span>
    );
  };
  return (
    <p className="text-gray-600">
      {paragraph.split(/(\{.*?\})/g).map((element, index) => {
        const keys = Object.keys(tokens);
        const purgedElement = element.startsWith("{")
          ? element.slice(1, -1)
          : element;

        if (keys.includes(purgedElement)) {
          return createElement(tokens[purgedElement], index);
        }
        return element;
      })}
    </p>
  );
};

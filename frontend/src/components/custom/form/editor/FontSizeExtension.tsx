import { TextStyle } from '@tiptap/extension-text-style';

const FontSizeExtension = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null, // Default font size is null
        parseHTML: (element) => {
          // console.log('Parsing font size:', element.style.fontSize);
          return element.style.fontSize || null; // Parse font-size from the HTML
        },
        renderHTML: (attributes) => {
          // console.log('Rendering font size:', attributes.fontSize);
          if (!attributes.fontSize) return {}; // Skip if no fontSize attribute
          return {
            style: `font-size: ${attributes.fontSize}`, // Add inline font-size style
          };
        },
      },
    };
  },
});

export default FontSizeExtension;

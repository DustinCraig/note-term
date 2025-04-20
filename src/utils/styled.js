// A simplified version of styled-components' styled function
function styled(element) {
  return function (strings, ...values) {
    // Create a new component
    return function StyledComponent(props) {
      // Process the template literal
      let css = "";
      for (let i = 0; i < strings.length; i++) {
        css += strings[i];
        if (values[i] !== undefined) {
          css += values[i];
        }
      }

      // Create a unique class name
      const className = `styled-${Math.random().toString(36).substr(2, 9)}`;

      // Create a style element
      const style = document.createElement("style");
      style.textContent = `.${className} { ${css} }`;
      document.head.appendChild(style);

      // Create the element with the class
      const el = document.createElement(element);
      el.className = className;

      // Add children if provided
      if (props.children) {
        el.appendChild(props.children);
      }

      return el;
    };
  };
}

// Example usage:
const StyledDiv = styled("div")`
  color: red;
  font-size: 20px;
  padding: 10px;
`;

// Create a component that extends another
const ExtendedDiv = styled(StyledDiv)`
  background-color: blue;
`;

// Example with dynamic values
const DynamicDiv = styled("div")`
  color: ${(props) => props.color || "black"};
  font-size: ${(props) => props.size || "16px"};
`;

export { styled };

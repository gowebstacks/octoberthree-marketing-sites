export   const getBackgroundImagePositionClass = (backgroundImagePosition: string) => {
  switch (backgroundImagePosition) {
    case "top":
      return "object-top";

    case "bottom":
      return "object-bottom";

    case "left":
      return "object-left";

    case "right":
      return "object-right";

    case "top-left":
      return "object-[left_top]";

    case "top-right":
      return "object-[right_top]";

    case "bottom-left":
      return "object-[left_bottom]";

    case "bottom-right":
      return "object-[right_bottom]";

    case "center":
    default:
      return "object-center";
  }
};
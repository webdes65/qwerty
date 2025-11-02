import { create } from "zustand";

export const UseShapeStyle = create((set) => ({
  borderType: "solid", // solid, dotted, dashed, double
  setBorderType: (borderType) => set({ borderType }),

  borderWidth: 3,
  setBorderWidth: (borderWidth) => set({ borderWidth }),
}));

export const getBorderStyle = (borderType, borderWidth = 3) => {
  const styles = {
    solid: null,
    dotted: `1, ${borderWidth * 2}`,
    dashed: `${borderWidth * 4}, ${borderWidth * 2}`,
    double: `${borderWidth * 2}, ${borderWidth}, ${borderWidth}, ${borderWidth}`,
  };

  return styles[borderType] || null;
};

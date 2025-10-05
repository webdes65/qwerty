import { useEffect, useState } from "react";

export function useSystemTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const checkSystemTheme = () => {
      setIsDark(mediaQuery.matches);
    };

    checkSystemTheme();

    const handleChange = (e) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isDark;
}

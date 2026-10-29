import { useEffect, useState } from "react";

export function useFooterVisible() {
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );

    observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  return footerVisible;
}
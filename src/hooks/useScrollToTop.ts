import { useEffect } from 'react';

export const useScrollToTop = (smooth: boolean = true) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }, [smooth]);
}; 
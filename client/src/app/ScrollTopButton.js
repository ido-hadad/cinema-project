import React, { useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';

const ScrollTopButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = useCallback(() => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 200) {
      setVisible(true);
    } else if (scrolled <= 200) {
      setVisible(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible);
    return () => {
      window.removeEventListener('scroll', toggleVisible);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      variant="dark"
      className="rounded-circle position-fixed floating-button"
      onClick={scrollToTop}
      style={{ display: visible ? 'inline-block' : 'none', right: '20px', bottom: '20px' }}
    >
      <i className="fa fa-arrow-up" aria-hidden="true"></i>
    </Button>
    // <Button
    //   onClick={scrollToTop}
    //   style={{ display: visible ? 'inline-block' : 'none', right: '20px', bottom: '20px' }}
    //   className="position-fixed floating-button fs-2 rounded-circle p-0 m-0"
    // >
    //   <i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
    // </Button>
  );
};

export default ScrollTopButton;

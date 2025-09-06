import { useRef, useState } from 'react';
import './App.css';

import img1 from './assets/pages/DR Wedding Invite1.jpg';
import img2 from './assets/pages/DR Wedding Invite2.jpg';
import img3 from './assets/pages/DR Wedding Invite3.jpg';
import img4 from './assets/pages/DR Wedding Invite4.jpg';
import img5 from './assets/pages/DR Wedding Invite5.jpg';
import img6 from './assets/pages/DR Wedding Invite6.jpg';
import img7 from './assets/pages/DR Wedding Invite7.jpg';
import img8 from './assets/pages/DR Wedding Invite8.jpg';
import img9 from './assets/pages/DR Wedding Invite9.jpg';
import img10 from './assets/pages/DR Wedding Invite10.jpg';

const PAGES = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

export default function App() {
  const MAX_PAGE = 10;
  const MIN_PAGE = 1;
  const THRESHOLD = 50;

  const [page, setPage] = useState(1);

  const isTracking = useRef(false);
  const sawMultiTouch = useRef(false);
  const startX = useRef(0);
  const lastX = useRef(0);

  const onTouchStart = (e) => {
    if (e.touches.length > 1) {
      // Pinch began (or became multi-touch) -> mark and let browser handle zoom
      sawMultiTouch.current = true;
      return;
    }
    // Begin a new single-finger track only if not already tracking
    if (!isTracking.current && e.touches.length === 1) {
      isTracking.current = true;
      sawMultiTouch.current = false;
      startX.current = e.touches[0].clientX;
      lastX.current = startX.current;
    }
  };

  const onTouchMove = (e) => {
    if (!isTracking.current) return;
    if (e.touches.length > 1) {
      // Became multi-touch mid-gesture -> treat as pinch, not swipe
      sawMultiTouch.current = true;
      return;
    }
    lastX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    // Only evaluate when all fingers are up
    if (e.touches.length > 0) return;

    if (!isTracking.current) {
      sawMultiTouch.current = false;
      return;
    }

    const dx = lastX.current - startX.current;

    // reset tracking for next interaction
    isTracking.current = false;

    // If any multi-touch happened, don't treat as swipe
    if (sawMultiTouch.current) {
      sawMultiTouch.current = false;
      return;
    }

    if (Math.abs(dx) < THRESHOLD) return;

    if (dx < 0) {
      // left swipe -> next
      setPage((p) => Math.min(MAX_PAGE, p + 1));
    } else {
      // right swipe -> prev
      setPage((p) => Math.max(MIN_PAGE, p - 1));
    }
  };

  // const src = PAGES[page - 1];
  const offset = -(page - 1) * 100;

  return (
    <div
      className="swipeArea"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="sliderTrack"
        style={{ transform: `translate3d(${offset}vw, 0, 0)` }}
      >
        {PAGES.map((src, i) => (
          <img
            key={i}
            className="slideImage"
            src={src}
            alt={`Invite page ${i + 1}`}
            draggable="false"
          />
        ))}
      </div>
    </div>
  );
}


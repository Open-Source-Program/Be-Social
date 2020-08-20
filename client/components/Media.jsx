import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';

export default function Media(props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
  }, [src]);

  return {
    loaded,
  }
};


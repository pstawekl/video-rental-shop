import React from 'react';

import Logo from './Logo';

const Hero = () => (
  <div className="hero my-5 text-center" data-testid="hero">
    <p style={{fontSize: '64px', fontWeight: 1000}}>VTS</p>
    <h1 className="mb-4" data-testid="hero-title">
      Wypożyczalnia kaset wideo
    </h1>

    <p className="lead" data-testid="hero-lead">
      Odkryj nowy wymiar rozrywki! Wypożyczaj najświeższe hity filmowe już dziś i przenieś się w świat niezapomnianych emocji.
    </p>
  </div>
);

export default Hero;

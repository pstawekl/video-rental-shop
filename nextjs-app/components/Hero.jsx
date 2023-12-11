import React from 'react';
import { Button } from 'reactstrap';
import Link from 'next/link';
import Logo from './Logo';

const Hero = () => (
  <div className="hero my-5 text-center" data-testid="hero">
    <p style={{ fontSize: '64px', fontWeight: 1000 }}>VTS</p>
    <h1 className="mb-3" data-testid="hero-title">
      Wypożyczalnia kaset wideo
    </h1>

    <p className="lead mb-5" data-testid="hero-lead">
      Odkryj nowy wymiar rozrywki! Wypożyczaj najświeższe hity filmowe już dziś i przenieś się w świat niezapomnianych emocji.
    </p>

      <Link href="/vt-list"><Button>Wypożycz kasetę</Button></Link>
  </div>
);

export default Hero;

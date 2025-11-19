import React from 'react';

export default function Section({ children, className = "", id = "" }) {
  return (
    <section id={id} className={`py-20 ${className}`}>
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  );
}
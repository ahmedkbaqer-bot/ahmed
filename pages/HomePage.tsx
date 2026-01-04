import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl md:text-6xl font-bold text-yellow-800 mb-4" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
        Loloma! Welcome!
      </h1>
      <p className="text-lg md:text-2xl text-yellow-700">
        Let's learn the Hopi language and culture together!
      </p>
    </div>
  );
};

export default HomePage;

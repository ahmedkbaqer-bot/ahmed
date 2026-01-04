import React, { useState, useEffect } from 'react';

interface Greeting {
  hopi: string;
  english: string;
  audio: string;
  image: string;
}

const LessonPage: React.FC = () => {
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGreetings = async () => {
      try {
        const response = await fetch('/greetings.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGreetings(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGreetings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Greetings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {greetings.map((greeting, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{greeting.hopi}</h2>
            <p className="text-gray-600">{greeting.english}</p>
            <button className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-md">
              Play Audio
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonPage;

// Example from https://beta.reactjs.org/learn

import { useState } from 'react';
import { Button } from './ui/button';

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <Button onClick={handleClick} variant="outline">
        Clicked {count} times
      </Button>
    </div>
  );
}

export default function MyApp() {
  return <MyButton />;
}

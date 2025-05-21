import { useEffect, useState } from 'react'

const Typewriter = ({
  sentence,
  speed,
  text,
}: {
  sentence: string;
  speed: number;
  text: string;
}) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    let typingText = '';

    const timer = setInterval(() => {
      if (i < sentence.length) {
        typingText += sentence.charAt(i);
        setDisplayText(typingText);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [sentence, speed]);

  return (
    <span className={`${text}`}>{displayText}</span>
  );
};

export default Typewriter;
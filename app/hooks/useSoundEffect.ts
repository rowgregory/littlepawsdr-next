import { useEffect, useState } from "react";
import UIFx from "uifx";

const useSoundEffect = (soundFilePath: string, playSound: boolean) => {
  const [soundEffect, setSoundEffect] = useState<UIFx | null>(null);

  useEffect(() => {
    if (soundFilePath) {
      setSoundEffect(new UIFx(soundFilePath));
    }
  }, [soundFilePath]);

  const play = () => {
    if (playSound && soundEffect) {
      soundEffect.play();
    }
  };

  return { play };
};

export default useSoundEffect;

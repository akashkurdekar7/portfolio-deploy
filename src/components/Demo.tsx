import { Lottie } from "lottie-react";

import catLove from "../assets/gifs/Cat feeling love emotionsexpression. Emojisticker animation/animations/12345.json";
import catPlaying from "../assets/gifs/Cat playing animation/animations/4c65d4b8-cda4-4975-8270-6e10c8c56173.json";
import rocketLaunch from "../assets/gifs/Rocket launch animation _Space exploration (2)/animations/12345.json";
import tourists from "../assets/gifs/Tourists on the road/animations/12345.json";

const animations = [
  { name: "Cat feeling love", data: catLove },
  { name: "Cat playing", data: catPlaying },
  { name: "Rocket launch", data: rocketLaunch },
  { name: "Tourists on the road", data: tourists },
];

const Demo = () => {
  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 p-8 sm:grid-cols-2">
      {animations.map((anim) => (
        <div key={anim.name} className="rounded-xl border border-black/10 p-4">
          <p className="mb-2 text-center font-medium">{anim.name}</p>
          <Lottie src={anim.data} loop autoplay className="w-full" />
        </div>
      ))}
    </div>
  );
};

export default Demo;

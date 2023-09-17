//              LIGHTS

import { PointLight, PointLightHelper, RectAreaLight } from "three";

export const lights = () => {
  //ambient

  //point1
  const pointLight = new PointLight("white", 6);
  const pointLightHelper = new PointLightHelper(pointLight);
  pointLight.position.set(0, 4, 0.5);

  //point2
  const pointLight2 = new PointLight("pink", 4);
  pointLight2.position.set(0, 1, -3);
  const pointLightHelper2 = new PointLightHelper(pointLight2);

  //rect
  const rectAreaLight = new RectAreaLight(0x4e00ff, 2, 1, 1);

  return {
    pointLight,
    pointLight2,
    pointLightHelper,
    pointLightHelper2,
    rectAreaLight,
  };
};

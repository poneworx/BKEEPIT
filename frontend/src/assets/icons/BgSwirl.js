import * as React from "react";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Ellipse,
} from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SvgBgSwirl = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 2000" {...props}>
    <Defs>
      <LinearGradient id="bg-swirl_svg__a" x1={0} x2={1} y1={0} y2={1}>
        <Stop offset="0%" stopColor="#ffae4a" />
        <Stop offset="50%" stopColor="#3aa8ff" />
        <Stop offset="100%" stopColor="#8a5cff" />
      </LinearGradient>
    </Defs>
    <Path fill="#0b0b0c" d="M0 0h1200v2000H0z" />
    <Ellipse
      cx={300}
      cy={300}
      fill="url(#bg-swirl_svg__a)"
      filter="url(#bg-swirl_svg__b)"
      opacity={0.6}
      rx={500}
      ry={250}
    />
    <Ellipse
      cx={1000}
      cy={900}
      fill="url(#bg-swirl_svg__a)"
      filter="url(#bg-swirl_svg__b)"
      opacity={0.45}
      rx={600}
      ry={300}
    />
    <Ellipse
      cx={200}
      cy={1500}
      fill="url(#bg-swirl_svg__a)"
      filter="url(#bg-swirl_svg__b)"
      opacity={0.35}
      rx={700}
      ry={350}
    />
  </Svg>
);
export default SvgBgSwirl;

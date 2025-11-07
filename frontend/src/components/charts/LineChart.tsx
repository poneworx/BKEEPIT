import React from "react";
import { View } from "react-native";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryArea, VictoryAxis } from "victory-native";

type P = { dataA?: {x:number,y:number}[]; dataB?: {x:number,y:number}[]; colorA?: string; colorB?: string; };
export default function LineChartMini({ dataA, dataB, colorA = "#39ABAE", colorB = "#E6457C" }: P){
  const a = dataA ?? [{x:1,y:420},{x:2,y:460},{x:3,y:500},{x:4,y:560}];
  const b = dataB ?? [{x:1,y:380},{x:2,y:410},{x:3,y:470},{x:4,y:750}];
  return (
    <View style={{ height: 180 }}>
      <VictoryChart theme={VictoryTheme.material} height={180} padding={{ top:20,left:40,right:20,bottom:30 }}>
        <VictoryAxis tickFormat={() => ""} />
        <VictoryAxis dependentAxis style={{ tickLabels:{ fontSize: 10 } }} />
        <VictoryArea data={a} style={{ data:{ fill: colorA+"33", stroke: colorA, strokeWidth: 2 }}} />
        <VictoryLine data={b} style={{ data:{ stroke: colorB, strokeWidth: 2 }}} />
      </VictoryChart>
    </View>
  );
}
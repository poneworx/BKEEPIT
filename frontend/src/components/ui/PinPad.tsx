import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
export default function PinPad({onSubmit}:{onSubmit:(pin:string)=>void}) {
  const [pin,setPin]=useState('');
  function press(n:string){ if(pin.length<4) setPin(pin+n); }
  function del(){ setPin(pin.slice(0,-1)); }
  function submit(){ if(pin.length===4) onSubmit(pin); }
  const keys=['1','2','3','4','5','6','7','8','9','del','0','ok'];
  return (
    <View>
      <Text style={s.pin}>{pin.replace(/./g,'â€¢')}</Text>
      <View style={s.grid}>
        {keys.map(k=>(
          <TouchableOpacity key={k} style={s.key} onPress={()=>k==='del'?del():k==='ok'?submit():press(k)}>
            <Text style={s.kt}>{k.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
const s=StyleSheet.create({
  pin:{ textAlign:'center', fontSize:28, marginBottom:12, color:'#f6f7f8' },
  grid:{ flexDirection:'row', flexWrap:'wrap', justifyContent:'center' },
  key:{ width:90, height:56, borderRadius:12, borderWidth:1, borderColor:'rgba(255,255,255,0.2)', margin:6, alignItems:'center', justifyContent:'center', backgroundColor:'rgba(255,255,255,0.06)' },
  kt:{ color:'#f6f7f8', fontSize:16 }
});
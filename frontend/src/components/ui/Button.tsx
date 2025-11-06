import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
export default function Button({title,onPress}:{title:string;onPress:()=>void}) {
  return <TouchableOpacity onPress={onPress} style={s.b}><Text style={s.t}>{title}</Text></TouchableOpacity>;
}
const s=StyleSheet.create({ b:{ backgroundColor:'#ffae4a', padding:14, borderRadius:12, alignItems:'center', marginTop:8 }, t:{ color:'#0b0b0c', fontWeight:'600' }});
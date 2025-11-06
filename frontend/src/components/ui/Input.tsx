import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
export default function Input(props:any) {
  return <TextInput placeholderTextColor='#b9bcc2' style={styles.i} {...props} />;
}
const styles=StyleSheet.create({ i:{ borderWidth:1, borderColor:'rgba(255,255,255,0.2)', borderRadius:12, padding:12, color:'#f6f7f8', marginBottom:12, backgroundColor:'rgba(0,0,0,0.25)'}});
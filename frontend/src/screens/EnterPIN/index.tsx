import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Screen from '../../components/layout/Screen';
import Card from '../../components/ui/Card';
import PinPad from '../../components/ui/PinPad';
export default function EnterPIN(){
  const [ok,setOk]=useState(false);
  function onSubmit(pin:string){ if(pin.length===4) setOk(true); }
  return <Screen><View style={{flex:1,justifyContent:'center'}}><Card><Text style={{fontSize:18, color:'#f6f7f8', marginBottom:8}}>Enter PIN</Text><PinPad onSubmit={onSubmit}/><Text style={{ color:'#b9bcc2', marginTop:8 }}>{ok?'Unlocked':''}</Text></Card></View></Screen>;
}
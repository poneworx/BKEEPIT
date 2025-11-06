import React from 'react';
import { View, Text } from 'react-native';
import Screen from '../../components/layout/Screen';
import Card from '../../components/ui/Card';
import PinPad from '../../components/ui/PinPad';
import { setPin } from '../../services/auth';
import { useAuthStore } from '../../store/authStore';
import { usePinStore } from '../../store/pinStore';
export default function SetPIN(){
  const userId=useAuthStore(s=>s.userId)||''; const setHasPin=usePinStore(s=>s.setHasPin);
  async function onSubmit(pin:string){ await setPin(pin,userId); setHasPin(true); }
  return <Screen><View style={{flex:1,justifyContent:'center'}}><Card><Text style={{fontSize:18, color:'#f6f7f8', marginBottom:8}}>Set a 4 digit PIN</Text><PinPad onSubmit={onSubmit}/></Card></View></Screen>;
}
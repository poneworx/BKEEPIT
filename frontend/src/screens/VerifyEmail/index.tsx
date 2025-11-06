import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Screen from '../../components/layout/Screen';
import Card from '../../components/ui/Card';
import { confirmEmail } from '../../services/email';
export default function VerifyEmail(){
  const [status,setStatus]=useState('Waiting for token...');
  useEffect(()=>{ const url=globalThis.location?.href||''; const token=(url.split('token=')[1]||'').split('&')[0]; if(token){ confirmEmail(token).then(()=>setStatus('Email verified. You can log in.')).catch(()=>setStatus('Invalid or expired token')); }},[]);
  return <Screen><View style={{flex:1,justifyContent:'center'}}><Card><Text style={{fontSize:18, color:'#f6f7f8'}}>{status}</Text></Card></View></Screen>;
}
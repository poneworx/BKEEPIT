import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Screen from '../../components/layout/Screen';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { login } from '../../services/auth';
import { useAuthStore } from '../../store/authStore';
export default function LoginScreen(){
  const [email,setEmail]=useState('test@bkeepit.dev'); const [password,setPassword]=useState('Password123'); const [msg,setMsg]=useState('');
  const set=useAuthStore(s=>s.set);
  async function onGo(){ try{ const r=await login(email,password); set({ userId: r.data.userId, verified: r.data.emailVerified }); setMsg('Logged in'); } catch{ setMsg('Auth error'); } }
  return <Screen><View style={{flex:1,justifyContent:'center'}}><Card><Text style={{fontSize:22, color:'#f6f7f8', marginBottom:12}}>Welcome back</Text><Input placeholder='Email' value={email} onChangeText={setEmail}/><Input placeholder='Password' secureTextEntry value={password} onChangeText={setPassword}/><Button title='Login' onPress={onGo}/><Text style={{marginTop:8, color:'#b9bcc2'}}>{msg}</Text></Card></View></Screen>;
}
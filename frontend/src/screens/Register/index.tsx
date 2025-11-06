import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Screen from '../../components/layout/Screen';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { register } from '../../services/auth';
export default function RegisterScreen(){
  const [email,setEmail]=useState('test@bkeepit.dev'); const [password,setPassword]=useState('Password123'); const [msg,setMsg]=useState('');
  async function onGo(){ try{ await register(email,password); setMsg('Check your email to verify.'); } catch(e:any){ setMsg('Error registering'); } }
  return <Screen><View style={{flex:1,justifyContent:'center'}}><Card><Text style={{fontSize:22, color:'#f6f7f8', marginBottom:12}}>Create account</Text><Input placeholder='Email' value={email} onChangeText={setEmail}/><Input placeholder='Password' secureTextEntry value={password} onChangeText={setPassword}/><Button title='Register' onPress={onGo}/><Text style={{marginTop:8, color:'#b9bcc2'}}>{msg}</Text></Card></View></Screen>;
}
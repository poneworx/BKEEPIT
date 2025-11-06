import React, { useState } from 'react';
import Register from './screens/Register';
import VerifyEmail from './screens/VerifyEmail';
import Login from './screens/Login';
import SetPIN from './screens/SetPIN';
import EnterPIN from './screens/EnterPIN';
import Dashboard from './screens/Dashboard';

export default function App(){
  const [stage,setStage]=useState<'reg'|'verify'|'login'|'setpin'|'enterpin'|'dash'>('reg');
  const stages = { reg:<Register/>, verify:<VerifyEmail/>, login:<Login/>, setpin:<SetPIN/>, enterpin:<EnterPIN/>, dash:<Dashboard/> };
  return stages[stage];
}
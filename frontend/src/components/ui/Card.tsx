import React from 'react';
import { View, StyleSheet } from 'react-native';
const s = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }
  }
});
export default function Card({children}:{children:React.ReactNode}) { return <View style={s.card}>{children}</View>; }
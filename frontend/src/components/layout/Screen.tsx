import React from 'react';
import { ImageBackground, View } from 'react-native';
export default function Screen({children}:{children:React.ReactNode}) {
  return (
    <ImageBackground source={require('../../public/images/bg-swirl.svg')} resizeMode='cover' style={{flex:1}}>
      <View style={{flex:1, padding:16}}>{children}</View>
    </ImageBackground>
  );
}
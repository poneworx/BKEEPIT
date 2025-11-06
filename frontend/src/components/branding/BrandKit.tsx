import React from 'react';
import { View, Text } from 'react-native';
import Theme from '../../styles/globals';
import BkeepitPrimary from '../../assets/icons/BkeepitPrimary';
import PoneworxPartner from '../../assets/icons/PoneworxPartner';

export default function BrandKit() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <BkeepitPrimary width={160} height={50} />
      <Text style={[Theme.TextPresets.p, { color: Theme.Colors.poneMid, marginTop: 8 }]}>
        Powered by
      </Text>
      <PoneworxPartner width={120} height={30} />
    </View>
  );
}
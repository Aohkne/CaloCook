import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@contexts/ThemeProvider';

export default function Choice({ type }) {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  return (
    <View style={[styles.container, styles[type]]}>
      <Text style={[styles.text, styles[type]]}>{type}</Text>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      borderWidth: 2,
      borderRadius: 10,
      backgroundColor: 'rgba(252,252,252,0.5)',
      overflow: 'hidden'
    },
    text: {
      fontSize: 30,
      fontWeight: 'bold',
      paddingHorizontal: 15,
      textTransform: 'uppercase',
      letterSpacing: 4
    },
    like: {
      color: colors.green,
      backgroundColor: colors.lightGreen,
      borderColor: colors.green
    },
    nope: {
      color: colors.red,
      backgroundColor: colors.lightRed,
      borderColor: colors.red
    }
  });

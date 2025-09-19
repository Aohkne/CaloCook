import { StyleSheet, Text, SafeAreaView } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';

import { useTheme } from '@contexts/ThemeProvider';

export default function ChatScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Chat Screen</Text>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    }
  });

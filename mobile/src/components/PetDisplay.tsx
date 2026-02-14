import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon, { IconName } from './Icon';
import { Pet } from '../types';
import { PetStageNames, MoodLabels, MoodColors } from '../constants/petAssets';
import { Colors, Radius, Spacing } from '../constants/colors';

const PET_ICONS: Record<number, IconName> = {
  1: 'egg-outline',
  2: 'bird',
  3: 'feather',
  4: 'bird',
};

const MOOD_ICONS: Record<string, IconName> = {
  happy: 'emoticon-happy-outline',
  neutral: 'emoticon-neutral-outline',
  sad: 'emoticon-sad-outline',
  sleeping: 'moon-waning-crescent',
};

interface Props {
  pet: Pet;
}

export default function PetDisplay({ pet }: Props) {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -8, duration: 1200, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const moodColor = MoodColors[pet.mood] || Colors.textSecondary;

  return (
    <View style={styles.container}>
      <View style={styles.outerRing}>
        <View style={styles.innerRing}>
          <Animated.View style={[styles.petCircle, { transform: [{ translateY: bounceAnim }] }]}>
            <Icon name={PET_ICONS[pet.evolution_stage] || 'egg-outline'} size={48} color={Colors.primary} />
          </Animated.View>
        </View>
      </View>

      <Text style={styles.petName}>{pet.name}</Text>
      <Text style={styles.stageText}>{PetStageNames[pet.evolution_stage]}</Text>

      <View style={[styles.moodBadge, { backgroundColor: moodColor + '12' }]}>
        <Icon name={MOOD_ICONS[pet.mood] || 'emoticon-neutral-outline'} size={14} color={moodColor} />
        <Text style={[styles.moodText, { color: moodColor }]}>{MoodLabels[pet.mood]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: Spacing.lg },
  outerRing: {
    width: 152, height: 152, borderRadius: 76,
    borderWidth: 2, borderColor: Colors.accentSurface,
    justifyContent: 'center', alignItems: 'center',
  },
  innerRing: {
    width: 132, height: 132, borderRadius: 66,
    borderWidth: 1.5, borderColor: Colors.accentLight,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: Colors.accentSurface,
  },
  petCircle: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: Colors.card,
    justifyContent: 'center', alignItems: 'center',
  },
  petName: { fontSize: 22, fontWeight: '700', color: Colors.text, marginTop: Spacing.lg, letterSpacing: -0.3 },
  stageText: { fontSize: 13, color: Colors.textSecondary, marginTop: 2, fontWeight: '500' },
  moodBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full, marginTop: Spacing.sm,
  },
  moodText: { fontSize: 13, fontWeight: '600' },
});

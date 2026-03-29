import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { uiTokens } from './tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface UIButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  block?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: { minHeight: 40, paddingHorizontal: 14 },
  md: { minHeight: 48, paddingHorizontal: 18 },
  lg: { minHeight: 56, paddingHorizontal: 22 },
};

const labelSizes: Record<ButtonSize, TextStyle> = {
  sm: { fontSize: 14 },
  md: { fontSize: 16 },
  lg: { fontSize: 17 },
};

export const UIButton = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  block = true,
  leading,
  trailing,
  style,
  textStyle,
  ...rest
}: UIButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        block && styles.block,
        variantStyles[variant],
        pressed && !isDisabled && pressedStyles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      <View style={styles.content}>
        {loading ? <ActivityIndicator color={spinnerColors[variant]} /> : leading}
        <Text style={[styles.label, labelSizes[size], labelStyles[variant], textStyle]}>{title}</Text>
        {!loading && trailing}
      </View>
    </Pressable>
  );
};

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: uiTokens.colors.primary,
    borderWidth: 1,
    borderColor: uiTokens.colors.primary,
  },
  secondary: {
    backgroundColor: uiTokens.colors.primarySoft,
    borderWidth: 1,
    borderColor: '#B2D4FB',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: uiTokens.colors.border,
  },
  danger: {
    backgroundColor: uiTokens.colors.danger,
    borderWidth: 1,
    borderColor: uiTokens.colors.danger,
  },
};

const pressedStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: uiTokens.colors.primaryPressed },
  secondary: { backgroundColor: '#D7E9FD' },
  ghost: { backgroundColor: '#F2F4F7' },
  danger: { backgroundColor: '#B42318' },
};

const labelStyles: Record<ButtonVariant, TextStyle> = {
  primary: { color: '#FFFFFF' },
  secondary: { color: uiTokens.colors.primary },
  ghost: { color: uiTokens.colors.text },
  danger: { color: '#FFFFFF' },
};

const spinnerColors: Record<ButtonVariant, string> = {
  primary: '#FFFFFF',
  secondary: uiTokens.colors.primary,
  ghost: uiTokens.colors.text,
  danger: '#FFFFFF',
};

const styles = StyleSheet.create({
  base: {
    borderRadius: uiTokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: uiTokens.spacing.sm,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default UIButton;

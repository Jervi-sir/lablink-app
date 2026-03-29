import React, { forwardRef, useMemo, useState } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { uiTokens } from './tokens';

type InputState = 'default' | 'error' | 'success';

export interface UIInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  hint?: string;
  error?: string;
  state?: InputState;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export const UIInput = forwardRef<TextInput, UIInputProps>(function UIInput(
  {
    label,
    hint,
    error,
    state = 'default',
    secureTextEntry,
    containerStyle,
    inputStyle,
    labelStyle,
    leftSlot,
    rightSlot,
    multiline,
    editable = true,
    ...rest
  },
  ref
) {
  const [isSecure, setIsSecure] = useState(Boolean(secureTextEntry));
  const resolvedState = error ? 'error' : state;
  const showSecureToggle = Boolean(secureTextEntry);
  const message = error || hint;

  const containerStateStyle = useMemo(() => {
    if (resolvedState === 'error') {
      return styles.errorBorder;
    }

    if (resolvedState === 'success') {
      return styles.successBorder;
    }

    return styles.defaultBorder;
  }, [resolvedState]);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
      <View
        style={[
          styles.container,
          multiline && styles.multilineContainer,
          !editable && styles.disabled,
          containerStateStyle,
          containerStyle,
        ]}
      >
        {leftSlot ? <View style={styles.leftSlot}>{leftSlot}</View> : null}
        <TextInput
          ref={ref}
          editable={editable}
          multiline={multiline}
          placeholderTextColor="#98A2B3"
          secureTextEntry={showSecureToggle ? isSecure : secureTextEntry}
          style={[styles.input, multiline && styles.multilineInput, inputStyle]}
          {...rest}
        />
        {showSecureToggle ? (
          <Pressable onPress={() => setIsSecure((value) => !value)} hitSlop={10}>
            <Text style={styles.toggleText}>{isSecure ? 'Show' : 'Hide'}</Text>
          </Pressable>
        ) : rightSlot ? (
          <View style={styles.rightSlot}>{rightSlot}</View>
        ) : null}
      </View>
      {message ? (
        <Text style={[styles.message, resolvedState === 'error' ? styles.errorText : styles.hintText]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: uiTokens.spacing.xs,
  },
  label: {
    color: uiTokens.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    minHeight: 52,
    borderRadius: uiTokens.radius.md,
    paddingHorizontal: uiTokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: uiTokens.colors.surface,
    gap: uiTokens.spacing.sm,
  },
  multilineContainer: {
    alignItems: 'flex-start',
    paddingVertical: uiTokens.spacing.md,
  },
  input: {
    flex: 1,
    color: uiTokens.colors.text,
    fontSize: 15,
    paddingVertical: 0,
  },
  multilineInput: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  leftSlot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSlot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    color: uiTokens.colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  message: {
    fontSize: 12,
    paddingHorizontal: 4,
  },
  hintText: {
    color: uiTokens.colors.textMuted,
  },
  errorText: {
    color: uiTokens.colors.danger,
  },
  defaultBorder: {
    borderWidth: 1,
    borderColor: uiTokens.colors.border,
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: uiTokens.colors.danger,
    backgroundColor: uiTokens.colors.dangerSoft,
  },
  successBorder: {
    borderWidth: 1,
    borderColor: uiTokens.colors.success,
    backgroundColor: uiTokens.colors.successSoft,
  },
  disabled: {
    opacity: 0.65,
  },
});

export default UIInput;

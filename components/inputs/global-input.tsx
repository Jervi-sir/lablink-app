import EyeIcon from '@/assets/icons/eye-icon';
import React, { useState, forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';

type InputKind = 'text' | 'password' | 'email' | 'number' | 'phone' | 'multiline';
type InputStatus = 'default' | 'valid' | 'error' | 'empty';

type Props = {
  label?: string;
  labelStyle?: TextStyle;
  rightLabelComponent?: React.ReactElement | null;
  kind?: InputKind; // only used for password toggle + multiline styling
  helperText?: string;
  helperTextStyle?: TextStyle;
  errorText?: string;

  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  style?: ViewStyle;        // outer wrapper
  left?: React.ReactNode;
  right?: React.ReactNode;
  valueComponent?: React.ReactNode;

  status?: InputStatus;     // still here if you want to use it later
  onPress?: () => void;
} & Omit<TextInputProps, 'style' | 'secureTextEntry'>; // style is for outer View, secureTextEntry handled internally

const GlobalInput = forwardRef<TextInput, Props>(
  (
    {
      label,
      labelStyle,
      rightLabelComponent,
      kind = 'text',
      helperText,
      helperTextStyle,
      errorText,
      valueComponent,
      value,
      onChangeText,
      containerStyle,
      inputStyle,
      style,
      left,
      right,
      status = 'default',
      onPress,
      ...rest
    },
    ref
  ) => {
    const isRTL = false
    const [visible, setVisible] = useState(false);
    const disabled = rest.editable === false;

    const isMultiline = kind === 'multiline' || rest.multiline === true;
    const isPassword = kind === 'password';

    const placeholderColor = disabled ? '#b3b5bd' : '#8b8b8f';
    const textColor = disabled ? '#80838a' : '#1a1a1a';

    return (
      <View style={[style ? style : { width: '100%' }]}>
        {(!!label || rightLabelComponent) && (
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
            }}
          >
            {!!label && (
              <Text
                style={{
                  marginBottom: 8,
                  fontSize: 13,
                  color: '#111',
                  fontWeight: 500,
                  ...labelStyle,
                }}
              >
                {label}
              </Text>
            )}
            {rightLabelComponent}
          </View>
        )}

        <Pressable
          onPress={onPress}
          disabled={disabled || !onPress}
          style={({ pressed }) => [
            {
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 14, borderWidth: 1, borderColor: '#D9D9D9',
              paddingHorizontal: 16,
              minHeight: 50,
              opacity: disabled ? 0.9 : (pressed && onPress ? 0.7 : 1),
            },
            containerStyle,
          ]}
          accessibilityState={{ disabled }}
        >
          {!!left && <View style={{ marginRight: 8 }}>{left}</View>}
          <View style={{ flex: 1 }} pointerEvents={onPress ? 'none' : 'auto'}>
            {valueComponent ? (
              <View style={{ paddingVertical: isMultiline ? 10 : 0, minHeight: isMultiline ? 96 : 40, justifyContent: 'center' }}>
                {valueComponent}
              </View>
            ) : (
              <TextInput
                ref={ref}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor={placeholderColor}
                style={[
                  {
                    fontSize: 15,
                    color: textColor,
                    paddingVertical: isMultiline ? 10 : 0,
                    textAlignVertical: isMultiline ? 'top' : 'center',
                    minHeight: isMultiline ? 96 : 40,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                  inputStyle,
                ]}
                multiline={isMultiline}
                secureTextEntry={isPassword ? !visible : undefined}
                editable={onPress ? false : !disabled}
                {...rest} // you control keyboardType, autoCapitalize, etc.
              />
            )}
          </View>

          {isPassword ? (
            <Pressable
              onPress={() => !disabled && setVisible(v => !v)}
              hitSlop={12}
              disabled={disabled || !!onPress}
              style={{
                height: 28,
                width: 28,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: (disabled || !!onPress) ? 0.4 : 1,
              }}
            >
              <EyeIcon size={20} color="#2a2a2a" />
            </Pressable>
          ) : (
            !!right && (
              <View
                style={{
                  marginLeft: 8,
                  opacity: disabled ? 0.6 : 1,
                }}
              >
                {right}
              </View>
            )
          )}
        </Pressable>

        {!!helperText && !errorText && (
          <Text
            style={{
              marginTop: 6,
              color: '#6b7280',
              fontSize: 12,
              paddingHorizontal: 12,
              ...helperTextStyle,
            }}
          >
            {helperText}
          </Text>
        )}
        {!!errorText && (
          <Text
            style={{
              marginTop: 6,
              color: '#c62828',
              fontSize: 12,
              paddingHorizontal: 12,
            }}
          >
            {errorText}
          </Text>
        )}
      </View>
    );
  }
);

export default GlobalInput;

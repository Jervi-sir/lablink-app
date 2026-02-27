import React from 'react';
import ActionSheet, { SheetProps, SheetManager } from "react-native-actions-sheet";
import { View, Text, TouchableOpacity } from 'react-native';

export default function LogoutSheet(props: SheetProps<'logout-sheet'>) {
  const { onLogout } = props.payload || {};

  return (
    <ActionSheet id={props.sheetId} containerStyle={{ borderTopLeftRadius: 32, borderTopRightRadius: 32, backgroundColor: '#FFF' }}>
      <View style={{ padding: 24, paddingBottom: 40, paddingTop: 32 }}>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 24 }}>🚪</Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 8, textAlign: 'center' }}>Log Out Account?</Text>
          <Text style={{ fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 22 }}>
            Are you sure you want to log out? You will need to enter your credentials again to access your account.
          </Text>
        </View>

        <View style={{ gap: 12 }}>
          <TouchableOpacity
            style={{ height: 56, backgroundColor: '#EF4444', borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowColor: "#EF4444", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
            activeOpacity={0.8}
            onPress={async () => {
              await SheetManager.hide(props.sheetId);
              onLogout?.();
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>Yes, Log Out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ height: 56, backgroundColor: '#F1F5F9', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
            activeOpacity={0.8}
            onPress={() => SheetManager.hide(props.sheetId)}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#475569' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ActionSheet>
  );
}

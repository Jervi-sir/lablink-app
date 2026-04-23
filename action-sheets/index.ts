import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';

// registerSheet('logout-sheet', LogoutSheet);

export { };

declare module 'react-native-actions-sheet' {
  interface Sheets {
    // 'logout-sheet': SheetDefinition<{
    //   payload: {
    //     onLogout: () => void;
    //   };
    //   returnValue: boolean;
    // }>;

  }
}

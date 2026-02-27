import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import LogoutSheet from './logout-sheet';
import LaboratoryTypeSheet, { LaboratoryCategory } from './laboratory-type-sheet';
import TaxonomySelectorSheet, { TaxonomyItem } from './taxonomy-selector-sheet';

registerSheet('logout-sheet', LogoutSheet);
registerSheet('laboratory-type-sheet', LaboratoryTypeSheet);
registerSheet('taxonomy-selector-sheet', TaxonomySelectorSheet);

export { };

declare module 'react-native-actions-sheet' {
  interface Sheets {
    'logout-sheet': SheetDefinition<{
      payload: {
        onLogout: () => void;
      };
      returnValue: boolean;
    }>;
    'laboratory-type-sheet': SheetDefinition<{
      payload: {
        categories: LaboratoryCategory[];
        onSelect: (category: LaboratoryCategory) => void;
        selectedId?: number | null;
      };
    }>;
    'taxonomy-selector-sheet': SheetDefinition<{
      payload: {
        title?: string;
        items: TaxonomyItem[];
        onSelect: (item: TaxonomyItem) => void;
        selectedId?: number | null;
      };
    }>;
  }
}

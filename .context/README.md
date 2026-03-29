# Portable UI components

Reusable React Native building blocks collected in one place so they can be copied into another project with minimal cleanup.

## Included

- `components/ui-button.tsx`: configurable button with variants, sizes, loading state, and accessory slots.
- `components/ui-input.tsx`: labeled input with hint/error states, multiline support, and password visibility toggle.
- `components/ui-card.tsx`: flexible card wrapper for content blocks and tappable surfaces.
- `components/ui-select.tsx`: simple modal-based selector for string or typed values.
- `components/tokens.ts`: shared spacing, radius, color, and shadow tokens.
- `components/index.ts`: barrel export for the component set.

## Example

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { UIButton, UICard, UIInput, UISelect } from './components';

export function ExampleForm() {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'lab'>('student');

  return (
    <UICard title="Profile" subtitle="Portable form primitives">
      <View style={{ gap: 16 }}>
        <UIInput label="Full name" value={name} onChangeText={setName} placeholder="Jane Doe" />
        <UISelect
          label="Role"
          value={role}
          options={[
            { label: 'Student', value: 'student' },
            { label: 'Lab', value: 'lab' },
          ]}
          onChange={(value) => setRole(value)}
        />
        <UIButton title="Save" onPress={() => undefined} />
      </View>
    </UICard>
  );
}
```

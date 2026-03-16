---
description: How to add a shared UI component to Foundation Projects
---

# Adding a Shared UI Component

1. Create the component folder:
   `src/components/ComponentName/`

2. Create the component file:
   `src/components/ComponentName/ComponentName.tsx`
   ```tsx
   // Only add 'use client' if the component uses hooks, browser APIs, or event handlers
   import './ComponentName.css';
   
   interface ComponentNameProps {
     children: React.ReactNode;
     variant?: 'default' | 'primary';
   }
   
   /** Brief description of what this component does */
   export default function ComponentName({ children, variant = 'default' }: ComponentNameProps) {
     return (
       <div className={`component-name component-name--${variant}`}>
         {children}
       </div>
     );
   }
   ```

3. Create the CSS file:
   `src/components/ComponentName/ComponentName.css`
   ```css
   .component-name {
     /* Always use design tokens */
     padding: var(--space-md);
     border-radius: var(--radius-md);
   }
   
   .component-name--primary {
     background: var(--gradient-primary);
     color: var(--text-inverse);
   }
   ```

4. Rules:
   - Always use design tokens from `src/styles/tokens/`
   - BEM-like naming: `.component__element--modifier`
   - Co-locate CSS with component
   - Add JSDoc comment on the component
   - Use TypeScript interfaces for props

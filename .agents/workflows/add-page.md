---
description: How to add a new page to the Foundation Projects site
---

# Adding a New Page

1. Create the page file:  
   `src/app/page-name/page.tsx`

2. Add metadata export at the top:
   ```tsx
   import type { Metadata } from 'next';
   
   export const metadata: Metadata = {
     title: 'Page Title',
     description: 'Description for SEO.',
   };
   ```

3. Use the standard layout pattern:
   ```tsx
   export default function PageName() {
     return (
       <section className="section">
         <div className="container container--narrow">
           <h1 style={{ font: 'var(--font-h1)', marginBottom: 'var(--space-lg)' }}>
             Page Title
           </h1>
           {/* Content here */}
         </div>
       </section>
     );
   }
   ```

4. Add nav link in `src/config/nav.ts`:
   ```ts
   // Add to routes object
   newPage: '/page-name',
   
   // Add to navLinks array
   { label: 'Page Name', href: routes.newPage },
   ```

// turbo
5. Verify:
   ```bash
   npm run lint && npm run build
   ```

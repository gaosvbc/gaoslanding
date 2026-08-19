# Workspace Guidelines

IMPORTANT: This project is connected to a live production site (gaos.es) deployed on Vercel with Resend for email. Follow these rules strictly at all times:

1. NEVER push, sync, or export code to GitHub automatically or on your own initiative.

2. These files are FROZEN — never modify them under any circumstances:
   - api/contact.ts (Resend email function — do not touch)
   - src/components/Contact.tsx (live contact form — do not touch)
   - vercel.json (Vercel deployment config — do not touch)
   - package.json (dependencies — do not touch)
   - public/ (favicon and og-image files — do not touch)

3. You CAN freely modify any other file: components, styles, layout, text, animations, Footer, Hero, WhatsAppFloating, etc.

4. Before making any change, read the current file content first and build on top of what already exists — do not rewrite from scratch.

5. After each change, show me the complete modified file and tell me exactly what lines changed. Wait for my approval before touching anything else.

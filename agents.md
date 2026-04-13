# 🚀 Frontend Architecture & Coding Standards

This project is a modern web application built using:

* **Next.js 16 (App Router)**
* **React 19**
* **TypeScript 5**
* **Tailwind CSS 4**
* **Shadcn UI (Radix UI primitives)**
* **Framer Motion (animations)**
* **Recharts (data visualization)**
* **Supabase (DB + Storage)**

The codebase follows **strict type safety**, **clean architecture**, and **scalable component design principles**.

---

# 🧠 Core Principles

* Write **type-safe**, maintainable, and scalable code
* Follow **separation of concerns**
* Prefer **composition over complexity**
* Keep UI consistent using **design systems (MDS / Shadcn)**

---

# 📐 Tech Stack Responsibilities

| Layer      | Technology               |
| ---------- | ------------------------ |
| Framework  | Next.js (App Router)     |
| UI Library | React 19                 |
| Styling    | Tailwind CSS + Shadcn UI |
| Animations | Framer Motion            |
| Charts     | Recharts                 |
| Backend    | Supabase                 |
| Language   | TypeScript               |

---

# 🧾 General Coding Standards

## ✅ Must Follow

* Use **TypeScript with strict typing**
* Use **ES6+ modern JavaScript**
* Use **functional components only**
* Prefer **stateless components**
* Use **camelCase** for:

  * Files
  * Variables
  * Functions
  * Components
* Prefer **named exports**

---

## ❌ Avoid

* Class components
* `any` type (unless unavoidable)
* Inline styles
* Mixing logic + styles
* Untyped props

---

# 🧩 Component Architecture

Each component must follow a **modular folder structure**:

```
src/
└── components/
    └── componentName/
        ├── componentName.tsx
        ├── componentName.types.ts
        ├── componentName.style.ts (if needed)
        └── index.ts
```

---

## 📦 Rules

* Folder name = component name
* Use **camelCase**
* Separate:

  * Logic (`.tsx`)
  * Types (`.types.ts`)
  * Styles (`.style.ts`)
* Export via `index.ts`

---

## 📌 Example

```ts
// index.ts
export { default as Filters } from "./filters";
```

---

# 🎨 Styling Guidelines

## ✅ Use

* **Tailwind CSS** → Primary styling
* **Shadcn UI** → Component primitives
* **styled-components** → Only when necessary (legacy / scoped cases)
* **SASS** → Global styles only

## ❌ Avoid

```tsx
<div style={{ color: "red" }} />
```

---

# 🧱 UI Component Strategy

## 1. Priority Order

1. ✅ **MDS Components (if available)**
2. ✅ **Shadcn UI Components**
3. ✅ Custom components

---

## 2. MDS Component Usage (Important ⚠️)

### ✅ Correct

```tsx
import { McButton } from "@maersk-global/mds-react-wrapper/mc-button";

<McButton click={handleClick}>
  Click me
</McButton>
```

### ❌ Incorrect

```tsx
<McButton onClick={handleClick} />
```

---

## 📌 MDS Rules

* Use **individual imports** (tree-shaking)
* Do NOT use:

  * default imports
  * namespace imports
* Use MDS event props:

  * `click`
  * `focus`
  * `blur`
  * `change`
  * `input`

---

## 📌 Typed Props Example

```ts
import { IconPosition } from "@maersk-global/mds-components-core-button/types";

const [iconPosition, setIconPosition] =
  React.useState<IconPosition>("left");
```

---

# ⚛️ React Best Practices

* Use hooks properly:

  * `useState`
  * `useEffect`
  * `useMemo`
  * `useCallback`
* Avoid unnecessary re-renders
* Keep components small and reusable

---

# 🔌 API & Backend Integration

* Use **Next.js API routes / server actions**
* Integrate with **Supabase**
* Never expose secrets on client
* Keep:

  * API logic separate
  * UI clean

---

# 📊 Animations & Charts

## Animations

* Use **Framer Motion**
* Keep animations subtle and performant

## Charts

* Use **Recharts**
* Ensure responsiveness

---

# 🔐 Clean Architecture

## Separation Layers

* UI Components
* Hooks / Logic
* Services (API)
* Types
* Styles

---

# 🧪 Example Production Component

## 📁 filters/

### filters.types.ts

```ts
export interface FiltersProps {
  options: {
    id: string;
    label: string;
  }[];
}
```

---

### filters.tsx

```tsx
"use client";

import React from "react";
import type { FiltersProps } from "./filters.types";

const Filters: React.FC<FiltersProps> = ({ options }) => {
  return (
    <div className="flex gap-4 p-4">
      {options.map(opt => (
        <span
          key={opt.id}
          className="px-3 py-1 rounded-md bg-gray-100 text-sm"
        >
          {opt.label}
        </span>
      ))}
    </div>
  );
};

export default Filters;
```

---

### index.ts

```ts
export { default as Filters } from "./filters";
```

---

# ⚡ Performance Guidelines

* Use dynamic imports when needed
* Avoid large bundle imports
* Prefer tree-shaking
* Optimize images (Next.js Image)


---

# 🏁 Conclusion

This project enforces:

* **Scalability**
* **Consistency**
* **Performance**
* **Maintainability**

Follow these guidelines strictly to ensure a **production-grade codebase**.

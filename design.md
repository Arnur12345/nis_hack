Below is a **developer-ready design system extraction** based on the provided UI screenshot.

---

# 🎨 1. COLOR PALETTE

The UI uses a **soft pastel + neutral system** with high-contrast dark accents.

## 🎯 Core Brand Colors

| Role                           | HEX       | RGB           | Usage                        |
| ------------------------------ | --------- | ------------- | ---------------------------- |
| **Primary (Lavender)**         | `#B9A7F6` | 185, 167, 246 | Main cards, highlights, tags |
| **Primary Dark**               | `#9B87F5` | 155, 135, 245 | Hover states                 |
| **Secondary (Soft Yellow)**    | `#F4DE9E` | 244, 222, 158 | Secondary cards              |
| **Dark Surface**               | `#1E1F23` | 30, 31, 35    | Dark cards, CTA button       |
| **Background Gradient Top**    | `#E9E3F3` | 233, 227, 243 | App background               |
| **Background Gradient Bottom** | `#EBDCCB` | 235, 220, 203 | App background               |
| **Surface Light**              | `#F8F7FB` | 248, 247, 251 | Card backgrounds             |
| **White**                      | `#FFFFFF` | 255, 255, 255 | Content surfaces             |
| **Muted Text**                 | `#8E8E98` | 142, 142, 152 | Secondary text               |
| **Primary Text**               | `#1A1A1A` | 26, 26, 26    | Main typography              |

---

## 🚦 Semantic Colors

| Type        | HEX       | Usage         |
| ----------- | --------- | ------------- |
| **Success** | `#34C759` | Checkmarks    |
| **Warning** | `#FFCC00` | Highlights    |
| **Error**   | `#FF3B30` | Badges        |
| **Info**    | `#5AC8FA` | Notifications |

---

# 🔠 2. TYPOGRAPHY

### Font Family (Closest Google Font Match)

* **Primary Font:** `Inter`
* Alternative: `SF Pro Display` (Apple-style look)

---

## Typography Scale

### Headings

| Level  | Size | Weight | Line Height | Letter Spacing |
| ------ | ---- | ------ | ----------- | -------------- |
| **H1** | 32px | 600    | 40px        | -0.02em        |
| **H2** | 24px | 600    | 32px        | -0.01em        |
| **H3** | 20px | 500    | 28px        | -0.01em        |
| **H4** | 18px | 500    | 26px        | 0              |
| **H5** | 16px | 500    | 24px        | 0              |

### Body

| Type             | Size | Weight | Line Height |
| ---------------- | ---- | ------ | ----------- |
| **Body Large**   | 16px | 400    | 24px        |
| **Body Regular** | 14px | 400    | 22px        |
| **Caption**      | 12px | 400    | 18px        |

---

# 📐 3. SPACING & GRID

### Grid System

* **Mobile-first**
* ~375px layout width
* 8pt spacing system

### Spacing Scale

| Token | Value |
| ----- | ----- |
| xs    | 4px   |
| sm    | 8px   |
| md    | 12px  |
| lg    | 16px  |
| xl    | 24px  |
| 2xl   | 32px  |
| 3xl   | 40px  |

### Layout Patterns

* Cards use **16–20px padding**
* Section spacing ~24–32px
* Rounded containers with generous whitespace

---

# 🧩 4. COMPONENT ANATOMY

## 🔘 Buttons

### Primary Button (Dark CTA)

* **Background:** `#1E1F23`
* **Text:** White
* **Border Radius:** 20px
* **Padding:** 14px 20px
* **Font Weight:** 500
* **Shadow:** none (flat modern style)

### Secondary (Soft Card Buttons)

* **Border Radius:** 18px
* **Background:** Pastel gradient or soft color
* **Hover:** Slight darken (4–6%)

---

## 🧾 Cards

* **Background:** White or pastel
* **Border Radius:** 24px
* **Padding:** 20px
* **Shadow:** Very soft elevation

```css
box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.06);
```

---

## 🧠 Chat Bubble

* Border Radius: 18px
* Sender bubble uses lavender
* Receiver bubble uses white
* Subtle drop shadow

---

## 🔎 Inputs

* Border radius: 20px
* Background: `#F1F1F4`
* Border: none
* Focus: subtle glow

---

# 🖼 5. ICONOGRAPHY & ASSETS

### Icon Style

* Rounded
* Minimal
* Solid fill or simple stroke
* 20–24px size
* Circular container background (soft pastel)

### Imagery Treatment

* Circular avatars
* Gradient decorative ribbons
* Soft neumorphic feel
* Floating UI controls

---

# 🧱 6. DESIGN TOKENS (Tailwind Theme)

## Tailwind Config Example

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#B9A7F6",
          dark: "#9B87F5"
        },
        secondary: "#F4DE9E",
        surface: {
          light: "#F8F7FB",
          dark: "#1E1F23"
        },
        text: {
          primary: "#1A1A1A",
          muted: "#8E8E98"
        },
        semantic: {
          success: "#34C759",
          warning: "#FFCC00",
          error: "#FF3B30",
          info: "#5AC8FA"
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      },
      borderRadius: {
        xl: "18px",
        '2xl': "20px",
        '3xl': "24px"
      },
      boxShadow: {
        card: "0px 10px 30px rgba(0,0,0,0.06)"
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        '2xl': "32px",
        '3xl': "40px"
      }
    }
  }
}
```

---

# 💎 PROMINENT COMPONENT: Subscription Card

### Tailwind Implementation

```html
<div class="bg-primary rounded-3xl p-xl shadow-card text-white w-full max-w-sm">
  <div class="flex items-center justify-between mb-lg">
    <h3 class="text-lg font-semibold">Monthly Plan</h3>
    <span class="bg-white text-text-primary text-xs px-sm py-xs rounded-xl">
      Free ads
    </span>
  </div>

  <p class="text-sm opacity-80 mb-xl">$8.99/month</p>

  <ul class="space-y-sm text-sm">
    <li class="flex items-center gap-sm">
      <span class="w-4 h-4 bg-semantic-success rounded-full"></span>
      Chat unlimited
    </li>
    <li class="flex items-center gap-sm">
      <span class="w-4 h-4 bg-semantic-success rounded-full"></span>
      Notify automatic
    </li>
  </ul>
</div>
```

---

# 🏗 Architectural Summary

* **Design Language:** Soft minimalism + pastel neumorphism
* **Interaction Style:** Gentle elevation, no harsh borders
* **Visual Hierarchy:** Typography + color grouping
* **System Type:** Token-driven scalable mobile-first UI
* **Implementation Strategy:** Utility-first (Tailwind) or CSS variables for theming

---

If you'd like, I can now:

* Generate full SCSS variables
* Convert this into a Figma-ready token sheet
* Build a complete React component library scaffold
* Or produce a Design System documentation structure 🚀

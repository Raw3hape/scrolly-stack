# SPV Stack — JSON Structure Guide

## Purpose

This document explains the structure and intent of `spv-stack-v2.json` for the design and AI implementation team. The JSON contains all copy, labels, and layout instructions needed to populate the scrolly stack tile component.

---

## Stack Orientation

The stack is ordered **bottom to top**. Index 0 in the array is the **bottom** of the visual stack. The final entry (the crown) is the **top**.

When rendering the scroll animation or building the tile layers, treat position 1 as the foundation and build upward to position 14.

---

## Layout Types

There are three layout types used in this stack. Each entry in the array includes a `layout` field that declares which type applies.

### `single`
One tile occupying its own row. This is the standard layout used for the majority of the stack. The tile fields (`tile_label`, `id`, `heading`, `copy`) sit directly on the object.

### `triple`
Three tiles sharing a single row. This occurs at **position 4** (Systems · Playbooks · Training). The three tiles are contained in a `blocks` array within the position object. Each block has its own `tile_label`, `id`, `heading`, and `copy`.

### `crown`
Four tiles sharing the top row of the stack. This occurs at **position 14** and represents the summit of the stack. Like the triple, the four tiles are contained in a `blocks` array. The crown tiles are: Exit Plan · Robotics · Growth · IPO.

---

## Field Definitions

Each tile — whether standalone or inside a `blocks` array — uses the following fields:

| Field | Display Location | Length |
|---|---|---|
| `tile_label` | Face of the cube tile | 1–2 words |
| `id` | Left panel label when tile is active/expanded | 2–3 words |
| `heading` | Subheadline in the expanded content panel | Short phrase |
| `copy` | Body copy in the expanded content panel | 1–3 sentences |

---

## Full Stack Reference

| Position | Layout | Tile Label(s) | ID |
|---|---|---|---|
| 1 — Bottom | Single | Partnership | Partnership Alignment |
| 2 | Single | People | People & Culture |
| 3 | Single | Data | Unified Data Model |
| 4 | **Triple** | Systems · Playbooks · Training | Systems Implementation · Process Playbooks · Training Engine |
| 5 | Single | Sales | Pod Sales |
| 6 | Single | Production | Production Frameworks |
| 7 | Single | Marketing | Marketing Accountability |
| 8 | Single | Automation | Workflow Automation |
| 9 | Single | Finance | Finance Ops |
| 10 | Single | Intelligence | Data Intelligence |
| 11 | Single | AI Agents | Agentic Workforce |
| 12 | Single | Procurement | Procurement Leverage |
| 13 | Single | ESO | Employee Stock Ownership |
| 14 — Top | **Crown** | Exit Plan · Robotics · Growth · IPO | Exit Planning · Robotics Integration · Growth by Design · IPO |

---

## Key Notes for Implementation

1. **Position 4 is a triple block.** Systems, Playbooks, and Training are three separate tiles rendered side by side in a single stack layer. Each has its own expandable content. Do not merge them into one tile.

2. **Position 14 is the crown.** Four tiles at the top of the stack: Exit Plan, Robotics, Growth, and IPO. Same rules as the triple — each is independently expandable with its own content.

3. **`tile_label` ≠ `id`.** The tile face shows the short label only. The expanded left-panel label uses the longer `id` value. These are intentionally different and should not be swapped.

4. **Stack order is bottom to top.** Array index 0 = bottom. Do not reverse this when building the scroll sequence.

5. **`_note` fields** on the triple and crown objects are for implementation guidance only. They are not displayed to end users.

---

## Source

All copy originates from the SPV Stack Copy master document. The JSON is the single source of truth for implementation. Any copy edits should be made in the JSON and this guide updated to match.

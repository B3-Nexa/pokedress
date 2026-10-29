# Feature Specification: 001-household-inventory-core

**Feature Branch**: `001-household-inventory-core`

**Created**: 2026-10-29

**Status**: Ready for Planning

**Input**: Product Vision (`vision-produit-inventaire.md`) & Research (`docs/recherche-terrain.md`, `docs/personas.md`): Complete household inventory system for newly formed or existing households (Personas: Léa, Marc, Sarah), designed to eliminate duplicate purchases, exploit neglected dressings, and catalog all belongings via frictionless fast-add (< 10s).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Frictionless Fast-Add (< 10s per item) & Chained Entry (Priority: P1) 🎯 Core Value

As a member of a household (Léa) sorting through items during or after moving in, I want to record an item in under 10 seconds by entering its name, selecting a room, and choosing a category—with photo and all other fields strictly optional—and have the room/category remembered when chaining entries, so that I can catalog 50+ items in a row without friction or fatigue.

**Why this priority**: The #1 cause of abandonment across all inventory and wardrobe apps is tedious data entry. Fast-Add (< 10s) and Chained Entry are the core differentiators preventing user drop-off.

**Independent Test**: An item can be recorded with just a name ("Grille-pain"), a room ("Cuisine"), and a category ("Électroménager"). Submitting via "Ajouter un autre objet" leaves the modal open with "Cuisine" and "Électroménager" pre-selected and the cursor directly in the name input.

**Acceptance Scenarios**:

1. **Given** the Fast-Add modal, **When** the user enters "Pull col roulé noir", selects room "Chambre", selects category "Dressing & Vêtements", and leaves photo and optional fields empty, **Then** the item is persisted in < 100ms.
2. **Given** the user submits an item via "Ajouter un autre objet" (Ajout enchaîné), **Then** the previous room ("Chambre") and category ("Dressing & Vêtements") remain pre-selected, allowing the next item to be added with only a name input.
3. **Given** a user who chooses to attach a photo, **When** they take or upload a photo, **Then** the raw photo is attached directly without requiring manual or buggy automated background removal (détourage).

---

### User Story 2 - Complete Household Overview by Room & Category (Priority: P1)

As a household member, I want to see a clear overview of everything our household owns, toggleable by Room (Salon, Cuisine, Dressing, Cave) and by Category (Meubles, Électroménager, Dressing & Vêtements, Vaisselle, High-Tech, Outils), so that our household has an instant answer to "What do we actually have at home?".

**Why this priority**: Directly solves the primary user pain: *"On ne sait pas ce qu'on possède dans le foyer"*.

**Independent Test**: Open the Overview page, switch between "Vue par Pièce" and "Vue par Catégorie", and see accurate item counts, photos (if present), and sub-totals.

**Acceptance Scenarios**:

1. **Given** cataloged items across multiple rooms, **When** the user views the "Par Pièce" tab, **Then** the system displays cards for each room (e.g. "Salon (14 objets)", "Cuisine (28 objets)", "Dressing (45 pièces)") expandable to view items.
2. **Given** cataloged items, **When** the user views the "Par Catégorie" tab, **Then** items are aggregated by category with sub-totals and item cards.

---

### User Story 3 - Proactive Anti-Duplicate Detection (Priority: P1)

As a household member considering buying an item or cataloging belongings, I want the app to alert me if an identical or similar item already exists in our household (e.g. "⚠️ Vous possédez déjà 2 rallonges dans 'Salon' et 'Cave'"), so that we avoid buying duplicates and wasting money.

**Why this priority**: Tangible financial and anti-clutter benefit. Research demonstrates that seeing an already-owned item significantly reduces the intention to purchase duplicates.

**Independent Test**: Type "Rallonge" in the Fast-Add name field or search bar; when a matching item exists in the household, an informative banner appears showing existing items and their locations.

**Acceptance Scenarios**:

1. **Given** an existing item "Rallonge 5m" in "Salon", **When** a user types "Rallonge" in the Fast-Add name field, **Then** an inline banner appears: *"⚠️ 1 objet similaire trouvé : Rallonge 5m (Salon)"*.
2. **Given** the duplicate banner, **When** the user intentionally wants to add another item of the same kind, **Then** the alert does NOT block saving.
3. **Given** a user in a store checking before an purchase, **When** they search "jean noir", **Then** all matching black jeans in the household appear in < 200ms with their photos.

---

### User Story 4 - Dressing Category & Wardrobe Lifecycle (Priority: P2)

As a household member with an overflowing wardrobe (Sarah / Léa), I want to track clothing items in the "Dressing & Vêtements" category with usage lifecycle statuses (`Porté régulièrement`, `Dormant / Jamais porté depuis 6 mois`, `À donner ou revendre`), so that I can easily identify what to declutter or list on Vinted.

**Why this priority**: Clothing represents the largest volume of household possessions (> 150 items on average) and the main trigger for reaching the 100-item threshold.

**Independent Test**: Filter the Dressing category by "Dormant / À revendre", select neglected clothes, and update their status to "À donner ou revendre" with an optional resale price.

**Acceptance Scenarios**:

1. **Given** clothes in the Dressing category, **When** the user filters by status "Dormant", **Then** all clothes marked as un-worn for 6+ months are displayed together.
2. **Given** a dormant clothing item, **When** the user updates its status to "À donner ou revendre", **Then** it appears in the decluttering list with its optional target resale price.

---

### User Story 5 - Shared Household Collaboration ("Le Foyer") (Priority: P2)

As a household creator (Léa), I want to invite other household members (Marc, colocataires, conjoint) via a 6-character code, so that all members access, search, and update our joint household inventory from their own phones for free (up to 2 members in the free tier).

**Why this priority**: An inventory maintained by only one member remains incomplete and leads to abandonment.

**Independent Test**: User A creates a household, copies the 6-character code, User B registers with that code, and both immediately see the same items in real-time.

**Acceptance Scenarios**:

1. **Given** an existing household, **When** a member navigates to Settings, **Then** a 6-character invite code is displayed with a 1-click copy button.
2. **Given** a second household member joining with the invite code, **When** they complete registration, **Then** they join the same household and access all rooms and belongings.

---

### User Story 6 - Household Dashboard, Factures & 100-Item Cap (Priority: P3)

As a household member, I want to view our North Star Metric (total cataloged items), track room progress, enrich items later with receipts/warranties ("compléter plus tard"), and see an estimated total value for home insurance, with the guarantee that passing 100 items never blocks reading existing data.

**Why this priority**: Secondary motivation (insurance, warranty tracking for Marc) and clear freemium governance.

**Independent Test**: Open Dashboard, view total item count card, progress bars, optional total value sum, and verify already cataloged items remain 100% readable even above 100 items.

**Acceptance Scenarios**:

1. **Given** high-tech or appliance items, **When** a user (Marc) edits an item later to attach a receipt photo and warranty expiration date, **Then** these details are saved under the item without having slowed down initial creation.
2. **Given** a household with 100+ items on the free tier, **When** members browse, search, or view existing items, **Then** all read and search actions remain fully functional, and a non-intrusive upgrade banner is shown for new additions.

---

### Edge Cases

- **Chained Add Room/Category Switch**: When adding in chained mode, can the user change room or category? Yes, changing either field immediately updates the retained context for subsequent items.
- **Photo Upload Failure or Offline**: If photo compression or upload fails, the item's metadata (name, room, category) is still saved safely.
- **Multiple Duplicate Matches**: If 5 similar items exist, the duplicate banner shows the count and top 2 with a "Voir tout" popover.
- **Non-blocking 100-Item Freemium Wall**: When hitting 100 items, the user is politely prompted to upgrade for unlimited items, but existing items are never locked or hidden.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Fast-Add form MUST require only 3 mandatory fields: `name` (nom), `room_id` (pièce), and `category` (catégorie), and complete in < 10 seconds.
- **FR-002**: Photo attachment MUST remain strictly OPTIONAL; photos MUST be compressed client-side and saved as raw images without mandatory background removal (détourage).
- **FR-003**: All detailed and financial fields (`purchase_price`, `purchase_date`, `warranty_expiry`, `receipt_photo`, `brand`, `notes`) MUST remain optional ("compléter plus tard").
- **FR-004**: The system MUST structure inventory under a 3-level model: `Room / Pièce` (mandatory) -> `Container / Meuble` (optional) -> `Item / Objet`.
- **FR-005**: The system MUST perform real-time, debounced similarity checks on item names to surface potential duplicates during item creation and search.
- **FR-006**: The "Dressing & Vêtements" category MUST support clothing lifecycle statuses (`active`, `dormant`, `to_sell_or_donate`) with 1-click status transitions.
- **FR-007**: The system MUST scope all inventory data to a `Household` (Foyer) entity, supporting shared collaboration (free tier includes 2 members).
- **FR-008**: The system MUST generate a 6-character alphanumeric invite code allowing household members to join in < 30 seconds.
- **FR-009**: The Fast-Add flow MUST support Chained Add ("Ajouter un autre objet"), retaining the previous `room_id` and `category` across sequential additions.
- **FR-010**: The system MUST calculate and display the North Star Metric (total cataloged items in the household) and room cataloging progress on the dashboard.
- **FR-011**: The system MUST provide instant full-text search across all household items by name, room, category, or tag in < 200ms.
- **FR-012**: The system MUST support pre-configured home categories: `Dressing & Vêtements`, `Meubles & Déco`, `Électroménager`, `Vaisselle & Cuisine`, `High-Tech`, `Bricolage & Outils`, `Loisirs & Livres`, `Autre`.
- **FR-013**: The system MUST enforce a 100-item creation cap for free households without ever blocking read, view, or search access to existing items.

### Key Entities

- **Household**: The shared living unit ("Le Foyer" : couple, colocation, famille, personne seule).
  - Attributes: `id`, `name`, `invite_code`, `created_at`.
- **User**: Member of a household.
  - Attributes: `id`, `email`, `name`, `household_id`, `role` (`owner` | `member`).
- **Room**: Physical room in the accommodation.
  - Attributes: `id`, `household_id`, `name` (e.g. "Salon", "Cuisine", "Chambre", "Dressing", "Cave"), `icon`, `order`.
- **Container**: Optional furniture, wardrobe, or box inside a room.
  - Attributes: `id`, `household_id`, `room_id`, `name` (e.g. "Vaisselier", "Penderie", "Caisse n°1"), `type`.
- **Item**: Any cataloged possession.
  - Attributes: `id`, `household_id`, `room_id`, `container_id` (nullable), `name`, `category`, `photo_url` (nullable), `quantity` (default 1), `dressing_status` (nullable: `active` | `dormant` | `to_sell_or_donate`), `purchase_price` (nullable), `purchase_date` (nullable), `warranty_expiry` (nullable), `receipt_photo_url` (nullable), `brand` (nullable), `notes` (nullable), `created_at`, `updated_at`.

## Success Criteria *(mandatory)*

- **SC-001**: **Saisie ultra-rapide** : Average time to add an item is < 10 seconds.
- **SC-002**: **Ajout enchaîné fluide** : In chained mode, room and category are pre-filled, reducing subsequent additions to < 5 seconds.
- **SC-003**: **Anti-doublon** : 100% of duplicate name queries display existing matches in real-time without blocking the user.
- **SC-004**: **North Star Metric** : Real-time count of total household items is visible on the dashboard.
- **SC-005**: **Dressing valorisé** : Users can filter dormant clothes in 1 click and flag them for donation or Vinted resale.
- **SC-006**: **Partage du foyer** : A second household member can join via invite code in under 30 seconds.
- **SC-007**: **Freemium non bloquant** : Existing items remain 100% searchable and viewable when the 100-item ceiling is reached.

## Assumptions

- **A-001**: Web application responsive on mobile browsers (allowing on-the-spot camera usage in rooms) and desktop browsers.
- **A-002**: Photo storage in development uses local file upload (Multer to `backend/uploads/`), swappable for S3/Cloudinary in production.
- **A-003**: Personas: Léa (21 ans, communicante, emménagement récent, persona primaire), Marc (31 ans, technicien réseau, second membre du foyer, factures/garanties), Sarah (25 ans, foyer solo, dressing et mur des 100 objets).

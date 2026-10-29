# Feature Specification: 001-household-inventory-core

**Feature Branch**: `001-household-inventory-core`

**Created**: 2026-10-29

**Status**: Ready for Planning

**Input**: Product Vision from `vision-produit-inventaire.md`: Complete household inventory system for young couples/roommates moving in together (Léa & partner), designed to end duplicate purchases, exploit neglected dressings, and catalog all belongings via frictionless fast-add (< 10s).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Frictionless Fast-Add (< 10s per item) (Priority: P1) 🎯 Core Value

As a user (Léa) unpacking boxes or reorganizing a room, I want to add an item in under 10 seconds by taking a photo, typing its name, choosing a room/container, and picking a category, with everything else remaining optional, so that I don't abandon my inventory halfway through.

**Why this priority**: The #1 failure factor in inventory apps is abandonment. Rapid data entry is the unique value proposition and the riskiest hypothesis to validate.

**Independent Test**: An item can be recorded with just a photo, name ("Grille-pain"), room ("Cuisine"), and category ("Électroménager") in a single lightweight form submitted in < 10 seconds.

**Acceptance Scenarios**:

1. **Given** the user is in the "Fast-Add" view, **When** they take/upload a photo, enter "Pull col roulé noir", select room "Chambre > Dressing", and select category "Dressing / Vêtements", **Then** the item is persisted immediately and a success toast appears with an option to immediately add another item.
2. **Given** the Fast-Add modal, **When** the user leaves optional fields (price, purchase date, brand, notes) blank, **Then** the item is saved without error or blocking prompts.

---

### User Story 2 - Complete Household Overview by Room & Category (Priority: P1)

As a user who just moved in with my partner, I want to see a clear, organized overview of everything we own grouped by Room (Salon, Cuisine, Dressing, Cave) and by Category (Meubles, Électroménager, Dressing, Vaisselle, High-Tech, Outils), so that we have an immediate answer to "What do we actually have at home?".

**Why this priority**: Directly solves the core pain: *"On ne sait pas ce qu'on possède"*.

**Independent Test**: Navigate to the Overview page, toggle between "Vue par Pièce" and "Vue par Catégorie", and see accurate item counts and item cards with photos and breadcrumbs.

**Acceptance Scenarios**:

1. **Given** cataloged items across multiple rooms, **When** the user views the "Par Pièce" tab, **Then** the system displays cards for each room (e.g. "Salon (14 objets)", "Cuisine (28 objets)", "Dressing (45 vêtements)") expandable to see contents.
2. **Given** cataloged items, **When** the user views the "Par Catégorie" tab, **Then** items are aggregated by category (e.g., "Électroménager", "Dressing", "Vaisselier / Arts de la table") with sub-totals.

---

### User Story 3 - Proactive Anti-Duplicate Detection (Priority: P1)

As a user considering buying an item (or cataloging merged apartments), I want the app to alert me if an identical or similar item already exists in our household (e.g. "Vous possédez déjà 2 rallonges dans 'Salon' et 'Garage'"), so that we avoid buying duplicates and wasting money.

**Why this priority**: Tangible financial benefit and immediate proof of value for users.

**Independent Test**: Type "Rallonge électrique" in the Fast-Add form or search bar; when a matching or similar item exists, display an alert banner showing existing instances and their locations.

**Acceptance Scenarios**:

1. **Given** an existing item "Rallonge 5m" in "Salon", **When** the user types "Rallonge" in the Fast-Add name field, **Then** an inline badge appears: *"⚠️ 1 objet similaire trouvé : Rallonge 5m (Salon)"*.
2. **Given** the user is shopping at a store, **When** they type "Pull noir" in the search bar, **Then** all existing black sweaters in the dressing appear instantly with their pictures.

---

### User Story 4 - Actionable Dressing & Clothes Lifecycle (Priority: P2)

As a fashion-conscious user with an overflowing wardrobe, I want to categorize my clothes and assign them an usage status (`Porté régulièrement`, `Dormant / Jamais porté depuis 6 mois`, `À donner ou revendre`), so that I can identify what to declutter or sell on Vinted.

**Why this priority**: Key differentiator addressing the "Dressing sous-exploité" pain point from the product vision.

**Independent Test**: Filter the dressing view by "Dormant / À revendre", select 5 neglected sweaters, and update their status to "À donner ou revendre" with an estimated resale price.

**Acceptance Scenarios**:

1. **Given** clothing items in the dressing, **When** the user marks an item's status as "Dormant", **Then** it is highlighted in the "Dressing sous-exploité" section.
2. **Given** the Dressing view, **When** the user filters by status "À donner ou revendre", **Then** only decluttering candidates are displayed with their total potential resale value.

---

### User Story 5 - Shared Household Collaboration ("Chez Nous") (Priority: P2)

As Léa, I want to invite my partner to our shared Household via a simple invite link or household code, so that both of us can view, add, and search our joint inventory from our respective phones.

**Why this priority**: Couples moving in together require a single shared inventory space.

**Independent Test**: Léa creates a household "Chez Léa & Marc", generates an invite code, Marc inputs the code, and both immediately see the same items in real-time.

**Acceptance Scenarios**:

1. **Given** an existing household, **When** the creator accesses settings, **Then** a 6-character household invite code is displayed.
2. **Given** a new user joining with the invite code, **When** they register, **Then** they are linked to the same household and see all existing rooms and belongings.

---

### User Story 6 - Household Dashboard & Insurance Value (Priority: P3)

As a user wanting an executive summary of our home belongings, I want to view total cataloged items (North Star Metric), room completion progress, and an optional total value estimation with PDF export for home insurance.

**Why this priority**: Secondary value for insurance and milestone tracking.

**Independent Test**: Open the Dashboard, observe the North Star Metric (e.g., "142 objets inventoriés"), see total optional insured value (e.g., "7 850 €"), and click "Exporter pour assurance" to generate a clean summary.

**Acceptance Scenarios**:

1. **Given** items with optional purchase prices filled, **When** viewing the Dashboard, **Then** the system calculates the sum of all item values per room and overall.
2. **Given** items without a price, **When** the total is calculated, **Then** unpriced items do not break the calculation and are counted in item totals.

---

### Edge Cases

- **Offline / Spotty Connectivity**: When cataloging in a basement (cave) without Wi-Fi, the app should queue fast-add photos or gracefully inform the user without losing typed inputs.
- **Duplicate Item Names with Different Purposes**: What if a user really has 3 distinct extension cords? The duplicate warning must remain informative and NOT block the user from proceeding if they intentionally want to add another.
- **Empty Rooms / First-Time Experience**: When an onboarding user opens the app, display quick-starter room suggestions ("Salon", "Cuisine", "Chambre", "Salle de bain", "Cave/Garage") to eliminate the blank-page syndrome.
- **Large Photo Uploads**: High-resolution smartphone photos (5MB+) must be compressed on the client before upload to preserve speed and bandwidth.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a Fast-Add flow requiring only Name, Room/Location, and Category, capable of being completed in under 10 seconds.
- **FR-002**: The system MUST allow uploading or capturing a photo for any item.
- **FR-003**: All financial and detailed fields (price, purchase date, warranty expiration, brand, receipt photo, notes) MUST remain strictly optional.
- **FR-004**: The system MUST organize items into a clean 3-level containment: Room (Pièce) -> Container/Furniture (Dressing, Vaisselier, Caisse - optional) -> Item.
- **FR-005**: The system MUST perform real-time similarity checks on item names to surface potential duplicates during item creation and search.
- **FR-006**: The system MUST support a dedicated Dressing module with clothing attributes (type, season, color) and usage lifecycle status (`active`, `dormant`, `to_sell_or_donate`).
- **FR-007**: The system MUST scope all inventory data to a `Household` entity, allowing multiple user accounts to collaborate on the same shared inventory.
- **FR-008**: The system MUST generate a 6-character invite code allowing household members to join seamlessly.
- **FR-009**: The system MUST calculate and display the North Star Metric (total cataloged items per household) and progress by room.
- **FR-010**: The system MUST calculate total household value based on optional item purchase prices and support an exportable summary view for insurance.
- **FR-011**: The system MUST provide instant full-text search across all items by name, category, room, or tag in < 200ms.
- **FR-012**: The system MUST support pre-configured home categories: `Dressing & Vêtements`, `Meubles & Déco`, `Électroménager`, `Vaisselle & Cuisine`, `High-Tech`, `Bricolage & Outils`, `Loisirs & Livres`.

### Key Entities

- **Household**: The collaborative boundary representing "Chez nous".
  - Attributes: `id`, `name`, `invite_code`, `created_at`.
- **User**: Individual member of a household.
  - Attributes: `id`, `email`, `name`, `household_id`, `role` (`owner` | `member`).
- **Room**: Physical room or space in the home.
  - Attributes: `id`, `household_id`, `name` (e.g. "Salon", "Cuisine", "Chambre", "Dressing"), `icon`, `created_at`.
- **Container**: Optional furniture or box inside a room.
  - Attributes: `id`, `household_id`, `room_id`, `name` (e.g. "Vaisselier", "Penderie", "Caisse n°2"), `type`.
- **Item**: The cataloged belonging.
  - Attributes: `id`, `household_id`, `room_id`, `container_id` (nullable), `name`, `category`, `photo_url` (nullable), `quantity` (default 1), `dressing_status` (nullable: `active` | `dormant` | `to_sell_or_donate`), `purchase_price` (nullable number), `purchase_date` (nullable date), `warranty_expiry` (nullable date), `brand` (nullable), `notes` (nullable), `created_at`, `updated_at`.

## Success Criteria *(mandatory)*

### Measurable Outcomes (aligned with Vision Produit)

- **SC-001**: **Saisie ultra-rapide** : Average time to add an item is < 10 seconds.
- **SC-002**: **Adoption initiale** : A household can catalog > 30 items within their first week.
- **SC-003**: **Anti-doublon** : 100% of duplicate name queries display existing matches in real-time during typing.
- **SC-004**: **North Star** : Real-time count of total household items is displayed prominently on the dashboard.
- **SC-005**: **Dressing valorisé** : Users can identify dormant clothes in 1 click via the dedicated dressing filter.
- **SC-006**: **Partage du foyer** : A partner can join the household via invite code in under 30 seconds.

## Assumptions

- **A-001**: Web application responsive on both mobile (smartphone camera for fast room cataloging) and desktop browsers.
- **A-002**: Image storage in development uses local file upload (via Multer) or base64 storage in MongoDB/uploads folder, easily swappable for S3/Cloudinary in production.
- **A-003**: Free plan allows up to 100 items per household; premium gating is modeled in configuration for future billing integration.

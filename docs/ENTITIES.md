# Entities & Ownership Rules

In the domain model, understanding entity ownership is critical for maintaining consistency, managing cascades (e.g., deletes), and enforcing transactional boundaries. An "owned" entity lifecycle is strictly bound to its parent.

## The Entities

- **Restaurant (Tenant)**: The top-level account representing the business entity.
- **Branch (Location)**: A physical or virtual location belonging to a Restaurant.
- **Table**: A physical dining spot within a Branch.
- **Category**: A logical grouping of Products (e.g., "Starters", "Mains").
- **Product (Menu Item)**: A specific sellable item.
- **Modifier**: Customization options for a Product (e.g., "Extra Cheese", "Size").
- **Order**: The aggregate representation of a customer's purchase.
- **Order Item**: A specific Product (and chosen Modifiers) within an Order.
- **Payment**: A financial transaction fulfilling an Order.
- **Customer**: An end-user purchasing from the Restaurant.
- **Address**: A physical location associated with a Customer (for delivery) or Branch.
- **Coupon**: A discount rule applicable to Orders.
- **Review**: Customer feedback for an Order or Product.
- **Employee**: A staff member working for a Restaurant or Branch.
- **Role**: A collection of permissions.
- **Permission**: A granular access right.

## Ownership Rules (Lifecycle Management)

- **Restaurant Ownership**:
  - *Owns*: Branches, Categories, Products, Modifiers, Coupons, Roles, Employees (Global).
  - *Rule*: Deleting a Restaurant cascades to all its owned entities. These entities cannot exist without a Restaurant.

- **Branch Ownership**:
  - *Owns*: Tables, Orders, Payments, Employees (Local).
  - *Rule*: Tables are strictly bound to a Branch. Orders belong to the Branch where they are fulfilled.

- **Order Ownership**:
  - *Owns*: Order Items, Payments.
  - *Rule*: Order Items have no meaning outside their parent Order. A Payment is strictly bound to an Order's lifecycle. If an Order is voided, Payments must be refunded or canceled.

- **Customer Ownership**:
  - *Owns*: Addresses, Reviews.
  - *Rule*: An Address is part of the Customer profile. Reviews are authored by Customers.

- **Catalog Ownership (Shared Lifecycles)**:
  - *Categories, Products, Modifiers*: Owned by the Restaurant (to allow sharing across Branches).
  - *Rule*: A Product can belong to multiple Categories. Deleting a Category does not delete the Product, but deleting a Product removes it from all Categories.

- **IAM Ownership**:
  - *Role Owns*: Permissions (Association).
  - *Employee Owns*: Roles (Association).
  - *Rule*: Permissions are global constants. Roles are defined per Restaurant. Employees are assigned Roles.

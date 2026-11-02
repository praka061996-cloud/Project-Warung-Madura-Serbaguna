# Security Specification & Invariants - MADURA SERBAGUNA

## 1. Data Invariants

1. **User Identity Invariant**: A user document at `/users/{userId}` can only be created by the authenticated user whose `request.auth.uid == userId`. A non-admin user cannot promote themselves to role `admin`.
2. **Shop Ownership & Approval Invariant**: A user can only register a shop with `status: "pending"`. Only administrators can transition a shop to `status: "approved"`. Only approved shops are publicly visible to customers.
3. **Product Inventory Invariant**: Only the verified owner of a shop can add, update, or delete products for their shop. Customers have read-only access.
4. **Order Authorization Invariant**: Only the customer who created an order, the shop owner, the assigned courier, or an administrator can read order details. Couriers can only claim orders that have `status == "waiting_courier"`.
5. **Chat Privacy Invariant**: Conversations and messages can strictly be read or written only by participants listed in the conversation's `participants` array or an administrator.
6. **Stock Partnership Invariant**: Stock collaboration requests can only be initiated by the requesting shop owner and acted upon by the destination shop owner.

## 2. Dirty Dozen Security Payloads (Rejected by Security Invariants)

1. **Payload 1 (Self-Promotion to Admin)**:
   `POST /users/attacker123 { "role": "admin", "name": "Hacker" }` -> REJECTED (Role cannot be set to 'admin' by non-admin).
2. **Payload 2 (Ghost Field Injection / Shadow Update)**:
   `PATCH /shops/shop456 { "status": "approved" }` by regular owner -> REJECTED (Owner cannot approve their own shop).
3. **Payload 3 (Cross-Shop Product Tampering)**:
   `POST /products/prod999 { "shopId": "shopB", "ownerId": "attacker" }` where shopB belongs to userA -> REJECTED.
4. **Payload 4 (Fake Order Injection)**:
   `POST /orders/ord123 { "customerId": "victim789" }` by attacker123 -> REJECTED (customerId must match auth.uid).
5. **Payload 5 (Unassigned Courier Status Jump)**:
   `PATCH /orders/ord123 { "status": "completed" }` by courier not assigned to ord123 -> REJECTED.
6. **Payload 6 (Eavesdropping on Private Chat)**:
   `GET /conversations/conv456` by user who is not in participants list -> REJECTED.
7. **Payload 7 (Impersonating Chat Sender)**:
   `POST /conversations/conv1/messages/msg1 { "senderId": "victim" }` by attacker -> REJECTED (senderId must match auth.uid).
8. **Payload 8 (Arbitrary Shop Deletion)**:
   `DELETE /shops/shopXYZ` by unauthorized user -> REJECTED.
9. **Payload 9 (Negative Price or Quantity Injection)**:
   `POST /products/p1 { "price": -5000, "stock": -10 }` -> REJECTED by schema and app validation.
10. **Payload 10 (Unauthorized Courier Reassignment)**:
    `PATCH /orders/ord123 { "courierId": "thiefCourier" }` when order is already in delivery -> REJECTED.
11. **Payload 11 (Stealing Customer Delivery Address via list scan)**:
    `GET /orders` without query filtering by current user's role -> REJECTED.
12. **Payload 12 (Unauthorized Partnership Approval)**:
    `PATCH /partnershipRequests/req1 { "status": "accepted" }` by unrelated third party -> REJECTED.

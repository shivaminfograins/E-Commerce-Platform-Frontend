/**
 * cartService.js
 *
 * All cart-related API calls in one place.
 * Every method returns the raw Axios response so the caller can
 * read response.data.cart_items, response.data.cart_total, etc.
 *
 * Backend API contract (after ProductVariant migration):
 *
 *  GET    /cart/                → { cart_items, cart_total, item_count, [guest_id] }
 *  POST   /cart/                → same shape;  body: { variant, quantity }
 *  PATCH  /cart/<variant_id>/   → same shape;  body: { quantity }
 *  DELETE /cart/<variant_id>/   → same shape + message
 *  DELETE /cart/clear/          → { message, cart_items: [], cart_total: 0, item_count: 0 }
 *  POST   /cart/merge/          → same as GET shape + message
 *
 * The `variant` field in the POST body is the ProductVariant PK (integer).
 * PATCH and DELETE use the variant_id in the URL, NOT the CartItem id.
 *
 * Cart item shape returned by the backend:
 *  {
 *    id,           // CartItem row PK
 *    product_id,
 *    product_name,
 *    variant_id,
 *    variant_name,
 *    sku,
 *    price,        // string decimal e.g. "1299.00"
 *    stock,
 *    image,        // absolute URL or null
 *    quantity,
 *    subtotal,     // float
 *    created_at,
 *    updated_at
 *  }
 */

import api from "../api/axios";

const cartService = {
  /**
   * Fetch the current cart (user or guest).
   * The axios interceptor automatically attaches the JWT Bearer token
   * and/or the X-Guest-ID header so no extra arguments are needed.
   */
  getCart() {
    return api.get("/cart/");
  },

  /**
   * Add a variant to the cart (or increment its quantity if already present).
   *
   * @param {number} variantId  - ProductVariant PK
   * @param {number} quantity   - units to add (default 1)
   */
  addToCart(variantId, quantity = 1) {
    return api.post("/cart/", { variant: variantId, quantity });
  },

  /**
   * Set (replace) the quantity of a specific cart item.
   * The URL param is the variant_id, matching the backend route:
   *   PATCH /cart/<variant_id>/
   *
   * @param {number} variantId  - ProductVariant PK
   * @param {number} quantity   - new absolute quantity (must be ≥ 1)
   */
  updateQuantity(variantId, quantity) {
    return api.patch(`/cart/${variantId}/`, { quantity });
  },

  /**
   * Remove a specific variant from the cart.
   *   DELETE /cart/<variant_id>/
   *
   * @param {number} variantId  - ProductVariant PK
   */
  removeFromCart(variantId) {
    return api.delete(`/cart/${variantId}/`);
  },

  /**
   * Wipe all items from the current owner's cart.
   *   DELETE /cart/clear/
   */
  clearCart() {
    return api.delete("/cart/clear/");
  },

  /**
   * Merge a guest cart into the authenticated user's cart.
   * Call this immediately after a successful login.
   *   POST /cart/merge/
   *
   * @param {string} guestId  - guest UUID token stored in localStorage
   */
  mergeCart(guestId) {
    return api.post("/cart/merge/", { guest_id: guestId });
  },
};

export default cartService;

/**
 * cartService.js
 *
 * Vendor-aware Cart API service matching multi-vendor backend contract.
 *
 * Backend API contract:
 *  GET    /cart/                -> { cart_items, cart_total, item_count, [guest_id] }
 *  POST   /cart/                -> body: { vendor_product_variant: <id>, quantity } OR { vendor_product: <id>, quantity }
 *  PATCH  /cart/<cart_item_id>/ -> body: { quantity }
 *  DELETE /cart/<cart_item_id>/ -> { message, cart_items, cart_total, item_count }
 *  DELETE /cart/clear/          -> { message, cart_items: [], cart_total: 0, item_count: 0 }
 *  POST   /cart/merge/          -> body: { guest_id }
 */

import api from "../api/axios";

const cartService = {
  getCart() {
    return api.get("/cart/");
  },

  /**
   * Add a vendor product or variant offer to cart.
   * Accepts object options: addToCart({ vendorProductId, vendorProductVariantId, quantity })
   * Or fallback parameters: addToCart(vendorProductVariantId, quantity)
   */
  addToCart(params, quantity = 1) {
    let payload = {};
    if (typeof params === "object" && params !== null) {
      const q = params.quantity || quantity || 1;
      if (params.vendorProductVariantId || params.vendor_product_variant) {
        payload = {
          vendor_product_variant: params.vendorProductVariantId || params.vendor_product_variant,
          quantity: q,
        };
      } else if (params.vendorProductId || params.vendor_product) {
        payload = {
          vendor_product: params.vendorProductId || params.vendor_product,
          quantity: q,
        };
      } else if (params.variantId || params.variant) {
        payload = {
          vendor_product_variant: params.variantId || params.variant,
          quantity: q,
        };
      }
    } else if (typeof params === "number" || typeof params === "string") {
      payload = {
        vendor_product_variant: params,
        quantity: quantity,
      };
    }

    return api.post("/cart/", payload);
  },

  /**
   * Set absolute quantity of a specific CartItem (by cart_item_id PK).
   */
  updateQuantity(cartItemId, quantity) {
    return api.patch(`/cart/${cartItemId}/`, { quantity });
  },

  /**
   * Remove a specific CartItem by cart_item_id PK.
   */
  removeFromCart(cartItemId) {
    return api.delete(`/cart/${cartItemId}/`);
  },

  clearCart() {
    return api.delete("/cart/clear/");
  },

  mergeCart(guestId) {
    return api.post("/cart/merge/", { guest_id: guestId });
  },
};

export default cartService;


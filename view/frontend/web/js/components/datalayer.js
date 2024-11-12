/* global ga */
(function () {
    'use strict';

    $.widget('gtmDatalayer', {
        component: 'DMTQ_GoogleTagManager/js/datalayer',

        create: function () {
            window.dataLayerConfig = {
                userDataEnabled: false
            };
            this.start();
        },


        start: function () {

            if (!window.dataLayer) {
                return;
            }

            const customer = customerData.get('customer');

            const isLoggedIn = function () {
                return customer() && customer().firstname && customer().firstname.length > 0;
            };

            const findItem = function (productInfo) {
                if (!productInfo) {
                    return null;
                }

                const cartData = customerData.get('cart')();
                const hasOptions = productInfo?.optionValues?.length > 0;

                return _.find(cartData.items, function (item) {
                    if (item.product_type === 'configurable' && hasOptions) {
                        const values = item.options.map((option) => {
                            return option.option_value;
                        });

                        return item.product_id === productInfo.id
                            && JSON.stringify(values.sort()) === JSON.stringify(productInfo.optionValues.sort());
                    }

                    return item.product_id = productInfo.id;
                });
            };

            const that = this
            let wasAddToCartCalled = false;
            const cartData = customerData.get('cart');
            const lastAddedProduct = ko.observable(null);
            window.dataLayerConfig.userDataEnabled = this.options.isUserDataEnabled || false;
            window.dataLayer = window.dataLayer || [];

            if (this.options.isUserDataEnabled && isLoggedIn()) {
                this.options.data.user_data = Object.assign(this.options.data.user_data || {}, {
                    email: customer().email,
                    first_name: customer().firstname,
                    last_name: customer().lastname,
                    customer_id: customer().id
                });
            }

            dataLayer.push({ecommerce: null});
            if (this.options.data && this.options.data.event) {
                dataLayer.push(this.options.data);
            }
            cartData.subscribe(function () {
                const itemDetails = findItem(lastAddedProduct())
                if (wasAddToCartCalled) {
                    dataLayer.push({ecommerce: null});
                    window.dataLayer.push({
                        event: 'add_to_cart',
                        ecommerce: {
                            currency: that.options?.data?.ecommerce?.currency,
                            items: [
                                {
                                    'item_name': itemDetails.product_name,
                                    'item_id': itemDetails.product_id,
                                    'item_sku': itemDetails.product_sku,
                                    'item_category': itemDetails.category,
                                    'price': itemDetails.product_price_value,
                                    'quantity': itemDetails.qty,
                                    'variation_id': itemDetails.child_product_id ? itemDetails.child_product_id : undefined
                                }
                            ]
                        }
                    });
                }
                wasAddToCartCalled = false;
                lastAddedProduct(null);
            });

            $(document).on('ajax:addToCart', function (e, data) {
                wasAddToCartCalled = true;
                lastAddedProduct({id: data.productIds[data.productIds.length - 1]});
            });

            $(document).on('ajax:removeFromCart', function (e, data) {
                const itemDetails = findItem(data.productInfo[0]);
                if (itemDetails) {
                    dataLayer.push({ecommerce: null});
                    window.dataLayer.push({
                        event: 'remove_from_cart',
                        ecommerce: {
                            currency: that.options?.data?.ecommerce?.currency,
                            items: [
                                {
                                    'item_name': itemDetails.product_name,
                                    'item_id': itemDetails.product_id,
                                    'item_sku': itemDetails.product_sku,
                                    'item_category': itemDetails.category,
                                    'price': itemDetails.product_price_value,
                                    'quantity': itemDetails.qty,
                                    'variation_id': itemDetails.child_product_id ? itemDetails.child_product_id : undefined,
                                }
                            ]
                        }
                    });
                }
            });
        }
    });
})();

define([
    'jquery',
    'underscore',
    'ko',
    'Magento_Customer/js/customer-data'
], function($, _, ko, customerData) {
    'use strict';
    window.dataLayerConfig = {
        userDataEnabled: false
    };

    const customer = customerData.get('customer');

    function isLoggedIn() {
        return customer() && customer().firstname && customer().firstname.length > 0;
    }

    /**
     * Find product info from cart
     *
     * @param productInfo
     * @returns {*|null}
     */
    function findItem(productInfo) {

        if (!productInfo) {
            return null;
        }

        const cartData = customerData.get('cart')();
        const hasOptions = productInfo?.optionValues?.length > 0;

        return _.find(cartData.items, function(item) {
            if (item.product_type === 'configurable' && hasOptions) {
                const values = item.options.map((option) => {
                    return option.option_value;
                });

                return item.product_id === productInfo.id
                    && JSON.stringify(values.sort()) === JSON.stringify(productInfo.optionValues.sort());
            }

            return item.product_id = productInfo.id;
        });
    }

    return function(config) {
        if (!window.dataLayer) {
            return;
        }
        let wasAddToCartCalled = false;
        const cartData = customerData.get('cart');
        const lastAddedProduct = ko.observable(null);
        window.dataLayerConfig.userDataEnabled = config.isUserDataEnabled || false;
        window.dataLayer = window.dataLayer || [];

        if (config.isUserDataEnabled && isLoggedIn()) {
            config.data.user_data = Object.assign(config.data.user_data || {}, {
                email: customer().email,
                first_name: customer().firstname,
                last_name: customer().lastname,
                customer_id: customer().id
            });
        }

        dataLayer.push({ecommerce: null});
        if (config.data && config.data.event) {
            dataLayer.push(config.data);
        }
        cartData.subscribe(function() {
            const itemDetails = findItem(lastAddedProduct())
            if (wasAddToCartCalled) {
                dataLayer.push({ecommerce: null});
                window.dataLayer.push({
                    event: 'add_to_cart',
                    ecommerce: {
                        currency: config?.data?.ecommerce?.currency,
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

        $(document).on('ajax:addToCart', function(e, data) {
            wasAddToCartCalled = true;
            lastAddedProduct({id:data.productIds[data.productIds.length - 1]});
        });

        $(document).on('ajax:removeFromCart', function(e, data) {
            const itemDetails = findItem(data.productInfo[0]);
            if (itemDetails) {
                dataLayer.push({ecommerce: null});
                window.dataLayer.push({
                    event: 'remove_from_cart',
                    ecommerce: {
                        currency: config?.data?.ecommerce?.currency,
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

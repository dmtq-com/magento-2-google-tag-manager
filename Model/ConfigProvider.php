<?php

namespace DMTQ\GoogleTagManager\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;

class ConfigProvider
{
    /*
     * XPATH for module enabled
     */
    public const XPATH_GTM_ACTIVE = 'dmtq_gtm/general/active';

    /*
     * XPATH for GTM container id config value
     */
    public const XPATH_GTM_CONTAINER_ID = 'dmtq_gtm/general/container_id';

    /*
     * XPATH for data layer e-commerce events
     */
    public const XPATH_ECOM_EVENTS_ENABLED = 'dmtq_gtm/datalayer/ecom';

    /*
     * XPATH for adding user data to e-com events
     */
    public const XPATH_USER_DATA_ENABLED = 'dmtq_gtm/datalayer/userdata';


    /**
     * @var ScopeConfigInterface $scopeConfig
     */
    private $scopeConfig;

    /**
     * Define class dependencies
     *
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(ScopeConfigInterface $scopeConfig)
    {
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * Check if module is active
     *
     * @param string $scopeCode
     * @return bool
     */
    public function isActive($scopeCode = null)
    {
        return $this->scopeConfig->isSetFlag(self::XPATH_GTM_ACTIVE, ScopeInterface::SCOPE_STORE, $scopeCode);
    }

    /**
     * Retrieve GTM container id
     *
     * @param string $scopeCode
     * @return string
     */
    public function getContainerId($scopeCode = null)
    {
        return $this->scopeConfig->getValue(self::XPATH_GTM_CONTAINER_ID, ScopeInterface::SCOPE_STORE, $scopeCode);
    }

    /**
     * Check if datalayer e-commerce events tracking is enabled
     *
     * @param string|null $scopeCode
     * @return bool
     */
    public function ecommerceEventsEnabled($scopeCode = null)
    {
        return $this->scopeConfig->isSetFlag(self::XPATH_ECOM_EVENTS_ENABLED, ScopeInterface::SCOPE_STORE, $scopeCode);
    }

    /**
     * Check if user data should be added to datalayer e-commerce events
     *
     * @param string|null $scopeCode
     * @return bool
     */
    public function canAddUserData($scopeCode = null)
    {
        return $this->scopeConfig->isSetFlag(self::XPATH_USER_DATA_ENABLED, ScopeInterface::SCOPE_STORE, $scopeCode);
    }
}

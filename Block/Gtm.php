<?php

namespace DMTQ\GoogleTagManager\Block;

use Magento\Framework\View\Element\Template;
use DMTQ\GoogleTagManager\Model\ConfigProvider;

class Gtm extends \Magento\Framework\View\Element\Template
{
    /**
     * Config provider model
     *
     * @var ConfigProvider $configProvider
     */
    protected $configProvider;

    /**
     * Define class dependencies
     *
     * @param Template\Context $context
     * @param ConfigProvider $configProvider
     * @param array $data
     */
    public function __construct(
        Template\Context $context,
        ConfigProvider $configProvider,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->configProvider = $configProvider;
    }


    /**
     * Retrieve GTM container id
     *
     * @return string
     */
    public function getContainerId()
    {
        return $this->configProvider->getContainerId();
    }


    /**
     * Check if datalayer is enabled
     *
     * @return bool
     */
    public function isDataLayerEnabled()
    {
        return $this->configProvider->isActive() && $this->configProvider->ecommerceEventsEnabled();
    }

    /**
     * Check if user data tracking is enabled
     *
     * @return bool
     */
    public function isUserDataEnabled()
    {
        return $this->configProvider->canAddUserData();
    }
}

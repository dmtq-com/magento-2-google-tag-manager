<?php

namespace DMTQ\GoogleTagManager\Plugin\CustomerData;

use DMTQ\GoogleTagManager\Model\Data\DataProviderInterface;

class CartPlugin
{
    /**
     * @var DataProviderInterface
     */
    private $dataProvider;

    /**
     * @param DataProviderInterface $dataProvider
     */
    public function __construct(DataProviderInterface $dataProvider)
    {
        $this->dataProvider = $dataProvider;
    }

    /**
     * Add gtm_events data to the cart section data
     *
     * @param $subject
     * @param $result
     * @return mixed
     */
    public function afterGetSectionData($subject, $result)
    {
        $eventsData = $this->dataProvider->get();
        $this->dataProvider->clear();

        if (!empty($eventsData)) {
            $result['gtm_events'] = $eventsData;
        }

        return $result;
    }
}

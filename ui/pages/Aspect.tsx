import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from '../shared/Tabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import AspectDetails from 'ui/aspect/AspectDetails';
import TextAd from 'ui/shared/ad/TextAd';
import EntityTags from 'ui/shared/EntityTags';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';

import AddressTxs from '../address/AddressTxs';
import RoutedTabs from '../shared/Tabs/RoutedTabs';

const AddressPageContent = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const appProps = useAppContext();

  const tabsScrollRef = React.useRef<HTMLDivElement>(null);
  const hash = getQueryParamString(router.query.hash);

  const addressQuery = useApiQuery('aspects', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
      // placeholderData: ADDRESS_INFO,
    },
  });

  const tabs: Array<RoutedTab> = React.useMemo(() => {
    return [
      { id: 'txs', title: 'Processed Transactions', component: <AddressTxs scrollRef={ tabsScrollRef }/> },
      { id: 'properties', title: 'Properties', component: <AddressTxs scrollRef={ tabsScrollRef }/> },
      { id: 'bind', title: 'Bindings', component: <AddressTxs scrollRef={ tabsScrollRef }/> },
    ].filter(Boolean);
  }, []);

  const tags = (
    <EntityTags
      data={ addressQuery.data }
      isLoading={ addressQuery.isPlaceholderData }
      tagsBefore={ [
        { label: 'aspect', display_name: 'ASPECT' },
      ] }
      contentAfter={
        <NetworkExplorers type="address" pathParam={ hash } ml="auto" hideText={ isMobile }/>
      }
    />
  );

  const content = addressQuery.isError ? null : <RoutedTabs tabs={ tabs } tabListProps={{ mt: 8 }}/>;

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/accounts');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to top accounts list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  console.log(addressQuery.data);

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Address details"
        backLink={ backLink }
        contentAfter={ tags }
        isLoading={ addressQuery.isPlaceholderData }
      />
      <AspectDetails aspectQuery={ addressQuery } scrollRef={ tabsScrollRef }/>
      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ tabsScrollRef }></Box>
      { content }
    </>
  );
};

export default AddressPageContent;

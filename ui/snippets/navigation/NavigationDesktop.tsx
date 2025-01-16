import { Flex, Box, VStack, Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import chevronIcon from 'icons/arrows/east-mini.svg';
import governanceIcon from 'icons/gov.svg';
import aivinIcon from 'icons/networks/aivinci.svg';
import exchangeIcon from 'icons/networks/exchange.svg';
import stakingIcon from 'icons/staking.svg';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';
import useHasAccount from 'lib/hooks/useHasAccount';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import NetworkMenu from 'ui/snippets/networkMenu/NetworkMenu';

import NavLink from './NavLink';
import NavLinkGroupDesktop from './NavLinkGroupDesktop';

const NavigationDesktop = () => {
  const appProps = useAppContext();
  const cookiesString = appProps.cookies;

  const isNavBarCollapsedCookie = cookies.get(cookies.NAMES.NAV_BAR_COLLAPSED, cookiesString);
  let isNavBarCollapsed;
  if (isNavBarCollapsedCookie === 'true') {
    isNavBarCollapsed = true;
  }
  if (isNavBarCollapsedCookie === 'false') {
    isNavBarCollapsed = false;
  }

  const { mainNavItems, accountNavItems } = useNavItems();

  const hasAccount = useHasAccount();

  const [ isCollapsed, setCollapsedState ] = React.useState<boolean | undefined>(isNavBarCollapsed);

  const handleTogglerClick = React.useCallback(() => {
    setCollapsedState((flag) => !flag);
    cookies.set(cookies.NAMES.NAV_BAR_COLLAPSED, isCollapsed ? 'false' : 'true');
  }, [ isCollapsed ]);

  const chevronIconStyles = {
    bgColor: useColorModeValue('white', 'black'),
    color: useColorModeValue('blackAlpha.400', 'whiteAlpha.400'),
    borderColor: 'divider',
  };

  const isExpanded = isCollapsed === false;

  const handleExplorerClick = React.useCallback(() => {
    const url = config.chain.isTestnet ?
      'https://betanet-scan.artela.network/' :
      'https://artscan.artela.network/';
    window.open(url);
  }, []);

  const getExplorerText = () => {
    if (isCollapsed) {
      return '';
    }
    return config.chain.isTestnet ? 'Artela Mainnet' : 'Artela Testnet';
  };

  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      position="relative"
      flexDirection="column"
      alignItems="stretch"
      borderRight="1px solid"
      borderColor="divider"
      px={{ lg: isExpanded ? 6 : 4, xl: isCollapsed ? 4 : 6 }}
      py={ 12 }
      width={{ lg: isExpanded ? '229px' : '92px', xl: isCollapsed ? '92px' : '229px' }}
      { ...getDefaultTransitionProps({ transitionProperty: 'width, padding' }) }
    >
      <Box
        as="header"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="row"
        w="100%"
        pl={{ lg: isExpanded ? 3 : '15px', xl: isCollapsed ? '15px' : 3 }}
        pr={{ lg: isExpanded ? 0 : '15px', xl: isCollapsed ? '15px' : 0 }}
        h={ 10 }
        transitionProperty="padding"
        transitionDuration="normal"
        transitionTimingFunction="ease"
      >
        <NetworkLogo isCollapsed={ isCollapsed }/>
        { Boolean(config.UI.sidebar.featuredNetworks) && <NetworkMenu isCollapsed={ isCollapsed }/> }
      </Box>

      <Box as="div" mt={ 4 } w="100%"
        h="32px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          onClick={ handleExplorerClick }
          as="span"
          w={{ lg: isCollapsed ? '40px' : '150px', xl: isCollapsed ? '40px' : '150px' }}
          h="36px"
          border="1px solid"
          display="flex"
          justifyContent="center"
          gap="4px"
          alignItems="center"
          borderColor="#0000002B"
          cursor="pointer"
          fontSize={ 16 }
        >
          { getExplorerText() }
          <Icon as={ exchangeIcon } boxSize="20px"/>
        </Box>
      </Box>
      <Box as="nav" mt={ 8 } w="100%">
        <VStack as="ul" spacing="1" alignItems="flex-start">
          { mainNavItems.map((item) => {
            if (isGroupItem(item)) {
              return <NavLinkGroupDesktop key={ item.text } item={ item } isCollapsed={ isCollapsed }/>;
            } else {
              return <NavLink key={ item.text } item={ item } isCollapsed={ isCollapsed }/>;
            }
          }) }
          <NavLink key="staking" item={{
            text: 'Staking',
            url: config.chain.isTestnet ? 'https://portal-beta.artela.network/Artela/home' : 'https://portal.artela.network/Artela/home',
            isActive: false,
            icon: () => <Icon as={ stakingIcon } boxSize="26px"/>,
          }} isCollapsed={ isCollapsed }/>
          <NavLink key="gov" item={{
            text: 'Governance',
            url: config.chain.isTestnet ? 'https://portal-beta.artela.network/Artela/gov' : 'https://portal.artela.network/Artela/gov',
            isActive: false,
            icon: () => <Icon as={ governanceIcon } boxSize="24px"/>,
          }} isCollapsed={ isCollapsed }/>
          <NavLink key="aivin" item={{
            text: 'Aivinci',
            url: 'https://aiagent.artela.network/explore',
            isActive: false,
            icon: () => <Icon as={ aivinIcon } boxSize="24px"/>,
          }} isCollapsed={ isCollapsed }/>
        </VStack>
      </Box>
      { hasAccount && (
        <Box as="nav" borderTopWidth="1px" borderColor="divider" w="100%" mt={ 6 } pt={ 6 }>
          <VStack as="ul" spacing="1" alignItems="flex-start">
            { accountNavItems.map((item) => <NavLink key={ item.text } item={ item } isCollapsed={ isCollapsed }/>) }
          </VStack>
        </Box>
      ) }
      <Icon
        as={ chevronIcon }
        width={ 6 }
        height={ 6 }
        border="1px"
        _hover={{ color: 'link_hovered' }}
        borderRadius="base"
        { ...chevronIconStyles }
        transform={{ lg: isExpanded ? 'rotate(0)' : 'rotate(180deg)', xl: isCollapsed ? 'rotate(180deg)' : 'rotate(0)' }}
        { ...getDefaultTransitionProps({ transitionProperty: 'transform, left' }) }
        transformOrigin="center"
        position="absolute"
        top="104px"
        left={{ lg: isExpanded ? '216px' : '80px', xl: isCollapsed ? '80px' : '216px' }}
        cursor="pointer"
        onClick={ handleTogglerClick }
        aria-label="Expand/Collapse menu"
      />
    </Flex>
  );
};

export default NavigationDesktop;

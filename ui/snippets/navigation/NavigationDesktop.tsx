import { Flex, Box, VStack, Icon, useColorModeValue, Menu, MenuButton, MenuList, MenuItem, Text } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import chevronIcon from 'icons/arrows/east-mini.svg';
import governanceIcon from 'icons/gov.svg';
import aivinIcon from 'icons/networks/aivinci.svg';
import artIcon from 'icons/networks/art.svg';
import menuIcon from 'icons/networks/menu.svg';
import successIcon from 'icons/networks/success.svg';
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

  const getExplorerText = () => {
    return config.chain.isTestnet ? 'Testnet' : 'Mainnet';
  };

  const handleMainnetClick = React.useCallback(() => {
    if (!config.chain.isTestnet) {
      window.open('https://artscan.artela.network/');
    }
  }, []);

  const handleTestnetClick = React.useCallback(() => {
    if (config.chain.isTestnet) {
      window.open('https://betanet-scan.artela.network/');
    }
  }, []);

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
        flexDirection={{ lg: isExpanded ? 'row' : 'column', xl: isCollapsed ? 'column' : 'row' }}
        w="100%"
        mt={ 2 }
        pl={{ lg: isExpanded ? 3 : '15px', xl: isCollapsed ? '15px' : 3 }}
        pr={{ lg: isExpanded ? 0 : '15px', xl: isCollapsed ? '15px' : 0 }}
        h={ isCollapsed ? 'auto' : 10 }
        gap={ isCollapsed ? 2 : 0 }
        transitionProperty="padding"
        transitionDuration="normal"
        transitionTimingFunction="ease"
      >
        <NetworkLogo isCollapsed={ isCollapsed }/>
        <Menu>
          <MenuButton p={ 0 } mt={ 2 }>
            <Icon
              as={ menuIcon }
              width="24px"
              height="24px"
              cursor="pointer"
              _hover={{ color: 'gray.600' }}
            />
          </MenuButton>
          <MenuList>
            <MenuItem
              onClick={ handleMainnetClick }
              cursor={ !config.chain.isTestnet ? 'default' : 'pointer' }
            >
              <Flex align="center" gap={ 3 } justify="space-between" width="100%">
                <Flex align="center" gap={ 3 }>
                  <Icon as={ artIcon } boxSize="24px"/>
                  <Text color={ !config.chain.isTestnet ? 'blue.500' : 'inherit' }>
                    Artela Mainnet
                  </Text>
                </Flex>
                { !config.chain.isTestnet && <Icon as={ successIcon } boxSize="20px" color="blue.500"/> }
              </Flex>
            </MenuItem>
            <MenuItem
              onClick={ handleTestnetClick }
              cursor={ config.chain.isTestnet ? 'default' : 'pointer' }
            >
              <Flex align="center" gap={ 3 } justify="space-between" width="100%">
                <Flex align="center" gap={ 3 }>
                  <Icon as={ artIcon } boxSize="24px"/>
                  <Text color={ config.chain.isTestnet ? 'blue.500' : 'inherit' }>
                    Artela Testnet
                  </Text>
                </Flex>
                { config.chain.isTestnet && <Icon as={ successIcon } boxSize="20px" color="blue.500"/> }
              </Flex>
            </MenuItem>
          </MenuList>
        </Menu>
        { Boolean(config.UI.sidebar.featuredNetworks) && <NetworkMenu isCollapsed={ isCollapsed }/> }
      </Box>

      <Box as="div" ml={ !isCollapsed ? 4 : 2 } w="100%"
        h="32px"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Box
          as="span"
          w={{ lg: isExpanded ? '50px' : '40px' }}
          h="18px"
          border="1px solid"
          display="flex"
          justifyContent="center"
          gap="4px"
          alignItems="center"
          borderRadius="4px"
          borderColor="#ED4E00"
          fontSize={ isExpanded ? 12 : 10 }
          p="0 4px"
          color="#ED4E00"
        >
          { getExplorerText() }
        </Box>
      </Box>
      <Box as="nav" mt={ 4 } w="100%">
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

import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import AperturasSidebarContent from './AperturasSidebarContent';
import ContactsHeader from './AperturasHeader';
import AperturasTable from './AperturasTable';
import reducer from './store';
import { getTiposreunion } from './store/sesionesSlice';
import { getIntegrantes } from './store/alumnosSlice';
import { getAperturas } from './store/aperturasSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function AperturasApp(props) {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  useDeepCompareEffect(() => {
    dispatch(getAperturas());
    dispatch(getIntegrantes());
    dispatch(getTiposreunion());
  }, [dispatch]);

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  return (
    <Root
      header={<ContactsHeader pageLayout={pageLayout} />}
      content={<AperturasTable />}
      ref={pageLayout}
      rightSidebarContent={<AperturasSidebarContent />}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={640}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('aperturasApp', reducer)(AperturasApp);

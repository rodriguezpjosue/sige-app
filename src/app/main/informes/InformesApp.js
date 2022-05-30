import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import InformesSidebarContent from './InformesSidebarContent';
import ContactsHeader from './InformesHeader';
// import InformesList from './InformesList';
import InformesTable from './InformesTable';
import reducer from './store';
import { getTiposreunion } from './store/tiposreunionSlice';
import { getIntegrantes } from './store/integrantesSlice';
import { getInformes } from './store/informesSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function InformesApp(props) {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  useDeepCompareEffect(() => {
    dispatch(getInformes());
    dispatch(getIntegrantes());
    dispatch(getTiposreunion());
  }, [dispatch]);

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  return (
    <Root
      header={<ContactsHeader pageLayout={pageLayout} />}
      content={<InformesTable />}
      ref={pageLayout}
      rightSidebarContent={<InformesSidebarContent />}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={640}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('informesApp', reducer)(InformesApp);

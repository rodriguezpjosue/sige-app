import * as React from 'react';
import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Chip from '@mui/material/Chip';
import format from 'date-fns/format';
import stringOperations from '../../../shared-components/stringOperations';
import { getApertura, selectApertura } from '../store/aperturaSlice';
import { getSesiones, selectSesiones } from '../store/sesionesSlice';

const AperturaView = () => {
  const apertura = useSelector(selectApertura);
  const sesiones = useSelector(selectSesiones);
  const routeParams = useParams();
  const dispatch = useDispatch();

  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function getChipColor(sesionState) {
    switch (sesionState) {
      case 'cerrado':
        return 'error';
      case 'abierto':
        return 'success';
      default:
        return 'default';
    }
  }

  function changeStateText(state) {
    switch (state) {
      case 'closed':
        return 'Cerrado';
      case 'actas':
        return 'Actas';
      case 'open':
        return 'Abierto';
      default:
        return 'Cerrado';
    }
  }

  useEffect(() => {
    dispatch(getApertura(routeParams.id)).then((res) => {
      dispatch(getSesiones(routeParams.id));
    });;
  }, [dispatch, routeParams]);

  if (!apertura) {
    return <FuseLoading />;
  }
  return (
    <>
      <div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
        <div className="w-full max-w-3xl" style={{ paddingTop: '3.0em' }}>
          <div className="flex flex-col space-y-32">
            <div className="flex flex-row">
              {apertura.curso_id.length > 0 && (
                <div className="flex items-center">
                  <FuseSvgIcon>heroicons-outline:annotation</FuseSvgIcon>
                  <div className="ml-24 leading-6">
                    {stringOperations.capitalizeWords(apertura.curso_id[0].name)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-row">
              {apertura.state && (
                <div className="flex items-center">
                  <FuseSvgIcon>heroicons-outline:exclamation-circle</FuseSvgIcon>
                  <div className="ml-24 leading-6">
                    {stringOperations.capitalizeWords(changeStateText(apertura.state))}
                  </div>
                </div>
              )}
            </div>

            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="Alumnos" value="1" />
                    <Tab label="Sesiones" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  {apertura.alumnos_ids.length > 0 && (
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <FuseSvgIcon>heroicons-outline:user-group</FuseSvgIcon>
                        <div className="ml-24 leading-6">Alumnos:</div>
                      </div>
                      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {apertura.alumnos_ids.map((alumno) => (
                          <>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="flex-start">
                              <ListItemAvatar>
                                <Avatar alt={alumno.name} src="/static/images/avatar/3.jpg" />
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <>
                                    <Typography
                                      sx={{ display: 'inline' }}
                                      component="span"
                                      variant="body2"
                                      color="text.primary"
                                    >
                                      {alumno.name}
                                    </Typography>
                                  </>
                                }
                              />
                            </ListItem>
                          </>
                        ))}
                      </List>
                    </div>
                  )}
                </TabPanel>
                <TabPanel value="2">
                  {sesiones.length > 0 && (
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <FuseSvgIcon>heroicons-outline:book-open</FuseSvgIcon>
                        <div className="ml-24 leading-6">Sesiones:</div>
                      </div>
                      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {sesiones.map((sesion) => (
                          <>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="flex-start">
                              <ListItemAvatar>
                                <Avatar alt={sesion.name} src="/static/images/avatar/3.jpg" />
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <>
                                    <Typography
                                      sx={{ display: 'inline' }}
                                      component="span"
                                      variant="body2"
                                      color="text.primary"
                                    >
                                      {sesion.name}
                                    </Typography>
                                  </>
                                }
                              />
                              <Chip
                                key={sesion.id}
                                label={stringOperations.capitalizeFirst(sesion.state)}
                                className="mr-12 mb-12 ml-12"
                                size="small"
                                icon={
                                  <>
                                    <FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>
                                  </>
                                }
                                color={getChipColor(sesion.state)}
                                component={NavLinkAdapter}
                                to={`/aperturas/sesiones/${sesion.id}`}
                              />
                            </ListItem>
                          </>
                        ))}
                      </List>
                    </div>
                  )}
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
};

export default AperturaView;

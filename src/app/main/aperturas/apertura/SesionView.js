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
import { getSesion, selectSesion } from '../store/sesionSlice';
import { getAsistenciasBySesion, selectAsistencias } from '../store/asistenciaSlice';

const SesionView = () => {
  const sesion = useSelector(selectSesion);
  const routeParams = useParams();
  const dispatch = useDispatch();

  function getChipColor(sesionState) {
    switch (sesionState) {
      case 'F':
        return 'error';
      case 'A':
        return 'success';
      case 'T':
        return 'warning';
      default:
        return 'default';
    }
  }

  useEffect(() => {
    dispatch(getSesion(routeParams.id));
    dispatch(getAsistenciasBySesion(routeParams.id));
  }, [dispatch, routeParams]);

  if (!sesion) {
    return <FuseLoading />;
  }
  return (
    <>
      <div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
        <div className="w-full max-w-3xl" style={{ paddingTop: '3.0em' }}>
          <div className="flex flex-col space-y-32">
            <div className="flex flex-row">
              {sesion.name > 0 && (
                <div className="flex items-center">
                  <FuseSvgIcon>heroicons-outline:annotation</FuseSvgIcon>
                  <div className="ml-24 leading-6">
                    {stringOperations.capitalizeWords(sesion.name)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-row">
              {sesion.state && (
                <div className="flex items-center">
                  <FuseSvgIcon>heroicons-outline:exclamation-circle</FuseSvgIcon>
                  <div className="ml-24 leading-6">
                    {stringOperations.capitalizeWords(sesion.state)}
                  </div>
                </div>
              )}
            </div>

            {sesion.alumno_asistencia.length > 0 && (
              <div className="flex flex-col">
                <div className="flex items-center">
                  <FuseSvgIcon>heroicons-outline:user-group</FuseSvgIcon>
                  <div className="ml-24 leading-6">Asistencia:</div>
                </div>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  {sesion.alumno_asistencia.map((alumnoAsistencia) => (
                    <>
                      <Divider variant="inset" component="li" />
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar alt={alumnoAsistencia.name} src="/static/images/avatar/3.jpg" />
                        </ListItemAvatar>
                        <ListItemText
                          secondary={alumnoAsistencia.seleccion_asistencia}
                          primary={
                            <>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {alumnoAsistencia.name}
                              </Typography>
                            </>
                          }
                        />
                        <Chip
                          key={alumnoAsistencia.id}
                          label={stringOperations.capitalizeFirst(alumnoAsistencia.seleccion_asistencia)}
                          className="mr-12 mb-12"
                          size="small"
                          color={getChipColor(alumnoAsistencia.seleccion_asistencia)}
                        />
                        {alumnoAsistencia.seleccion_asistencia}
                      </ListItem>
                    </>
                  ))}
                </List>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SesionView;

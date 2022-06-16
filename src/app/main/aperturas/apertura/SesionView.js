import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import stringOperations from '../../../shared-components/stringOperations';
import { getSesion, selectSesion } from '../store/sesionSlice';
import { getAsistencias, selectAsistencias } from '../store/asistenciasSlice';
import { selectAsistencia, updateAsistencia } from '../store/asistenciaSlice';

const SesionView = () => {
  const sesion = useSelector(selectSesion);
  const asistencias = useSelector(selectAsistencias);
  const [asistencia, setAsistencia] = useState(useSelector(selectAsistencia));
  const routeParams = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSesion(routeParams.id)).then((res) => {
      dispatch(getAsistencias(routeParams.id));
    });
  }, [dispatch, routeParams]);

  const handleAsistenciaValue = (event, newAsistenciaValue) => {
    if (newAsistenciaValue) {
      const aV = newAsistenciaValue.split('-');
      setAsistencia({ id: parseInt(aV[1], 10), seleccion_asistencia: aV[0] });
    }
  };

  useEffect(() => {
    dispatch(updateAsistencia(asistencia));
  }, [dispatch, asistencia]);

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
              {sesion.fecha && (
                <div className="flex items-center">
                  <FuseSvgIcon>heroicons-outline:calendar</FuseSvgIcon>
                  <div className="ml-24 leading-6">
                    {format(parseISO(sesion.fecha), 'dd/MM/yyyy')}
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

            {asistencias.length > 0 && (
              <div className="flex flex-col">
                <div className="flex items-center">
                  <FuseSvgIcon>heroicons-outline:user-group</FuseSvgIcon>
                  <div className="ml-24 leading-6">Asistencia:</div>
                </div>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  {asistencias.map((alumnoAsistencia) => (
                    <>
                      <Divider variant="inset" component="li" />
                      <ListItem key={alumnoAsistencia.id} alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar alt={alumnoAsistencia.name} src="/static/images/avatar/3.jpg" />
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
                                {alumnoAsistencia.name}
                              </Typography>
                            </>
                          }
                          secondary={
                            <>
                              {`Asistencia: `}
                              <ToggleButtonGroup
                                value={
                                  alumnoAsistencia.seleccion_asistencia
                                    ? `${alumnoAsistencia.seleccion_asistencia}-${alumnoAsistencia.id}`
                                    : `F-${alumnoAsistencia.id}`
                                }
                                exclusive
                                onChange={handleAsistenciaValue}
                                aria-label="Cambiar asistencia"
                                disabled={sesion.state === 'cerrado'}
                              >
                                <ToggleButton
                                  value={`F-${alumnoAsistencia.id}`}
                                  color="error"
                                  aria-label="Inasistencia"
                                >
                                  F
                                </ToggleButton>
                                <ToggleButton
                                  value={`T-${alumnoAsistencia.id}`}
                                  color="warning"
                                  aria-label="Tardanza"
                                >
                                  T
                                </ToggleButton>
                                <ToggleButton
                                  value={`A-${alumnoAsistencia.id}`}
                                  color="success"
                                  aria-label="Asistencia"
                                >
                                  A
                                </ToggleButton>
                              </ToggleButtonGroup>
                            </>
                          }
                        />
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

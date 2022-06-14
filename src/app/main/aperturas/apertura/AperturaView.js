import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import format from 'date-fns/format';
import stringOperations from '../../../shared-components/stringOperations';
import { getApertura, selectApertura } from '../store/aperturaSlice';

const AperturaView = () => {
  const apertura = useSelector(selectApertura);
  const routeParams = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getApertura(routeParams.id));
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
                    {stringOperations.capitalizeWords(apertura.state)}
                  </div>
                </div>
              )}
            </div>

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
                          secondary="Oui Oui"
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
                              {' — Do you have Paris recommendations? Have you ever…'}
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

export default AperturaView;

import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import format from 'date-fns/format';
import stringOperations from '../../../shared-components/stringOperations';
import { getInforme, selectInforme } from '../store/informeSlice';
import { selectIntegrantes } from '../store/integrantesSlice';
import { selectTiposreunion } from '../store/tiposreunionSlice';

const InformeView = () => {
  const informe = useSelector(selectInforme);
  const integrantes = useSelector(selectIntegrantes);
  const tiposreunion = useSelector(selectTiposreunion);
  const routeParams = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInforme(routeParams.id));
  }, [dispatch, routeParams]);

  function getIntegranteById(id) {
    return integrantes.find((integrante) => integrante.id === id);
  }

  function getTiporeunionById(id) {
    const tr = tiposreunion.find((tiporeunion) => tiporeunion.id === id);
    if (typeof tr === 'object' && tr !== null) {
      return tr.name;
    }
    return ``;
  }

  function getCheckedIntegranteById(id) {
    if (informe.asistentes_ids.find((asistente) => asistente === id)) {
      return true;
    }
    return false;
  }

  if (!informe) {
    return <FuseLoading />;
  }
  return (
    <>
      <div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
        <div className="w-full max-w-3xl" style={{ paddingTop: '3.0em' }}>
          {informe.state === 'draft' && (
            <div className="flex flex-auto items-end">
              <div className="flex items-center ml-auto mb-4">
                <Button variant="contained" color="secondary" component={NavLinkAdapter} to="edit">
                  <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
                  <span className="mx-8">Editar</span>
                </Button>
              </div>
            </div>
          )}

          <Typography className="mt-12 text-2xl font-bold" style={{ wordWrap: 'break-word' }}>
            {informe.fechareunion.toLocaleString()}
          </Typography>

          <Divider className="mt-16 mb-24" />

          <div className="flex flex-col space-y-32">
            <div className="flex flex-row">
              {informe.tema && (
                <div className="flex items-center">
                  <FuseSvgIcon>heroicons-outline:annotation</FuseSvgIcon>
                  <div className="ml-24 leading-6">
                    {stringOperations.capitalizeWords(informe.tema)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-row">
              {informe.state && (
                <div className="flex items-center">
                  <FuseSvgIcon>heroicons-outline:exclamation-circle</FuseSvgIcon>
                  <div className="ml-24 leading-6">
                    {stringOperations.capitalizeWords(informe.state)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-row">
              {informe.tiporeunion_id && (
                <div className="flex items-center">
                  <FuseSvgIcon>heroicons-outline:tag</FuseSvgIcon>
                  <div className="ml-24 leading-6">
                    {getTiporeunionById(informe.tiporeunion_id)}
                  </div>
                </div>
              )}
            </div>

            {integrantes.length > 0 && (
              <div className="flex flex-col">
                <div className="flex items-center">
                  <FuseSvgIcon>heroicons-outline:user-group</FuseSvgIcon>
                  <div className="ml-24 leading-6">Asistieron:</div>
                </div>
                {integrantes.map((integrante) => (
                  <FormControlLabel
                    className="flex flex-row"
                    style={{ marginLeft: '20px' }}
                    key={integrante.id}
                    control={
                      <Checkbox
                        value={integrante.id}
                        key={integrante.id}
                        checked={getCheckedIntegranteById(integrante.id)}
                        disabled
                      />
                    }
                    label={stringOperations.capitalizeWords(integrante.name)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InformeView;

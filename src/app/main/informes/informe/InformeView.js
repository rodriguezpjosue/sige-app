import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import format from 'date-fns/format';
import _ from '@lodash';
import stringOperations from '../../../shared-components/stringOperations';
import { getInforme, selectInforme } from '../store/informeSlice';
import { selectIntegrantes } from '../store/integrantesSlice';
// import { selectTags } from '../store/tagsSlice';

const InformeView = () => {
  const informe = useSelector(selectInforme);
  console.log(informe);
  const integrantes = useSelector(selectIntegrantes);
  console.log(integrantes);
  // const tags = useSelector(selectTags);
  const routeParams = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInforme(routeParams.id));
  }, [dispatch, routeParams]);

  function getIntegranteById(id) {
    return integrantes.find((integrante) => integrante.id === id);
  }

  if (!informe) {
    return <FuseLoading />;
  }
  return (
    <>
      <div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
        <div className="w-full max-w-3xl">
          {informe.state === 'borrador' && (
            <div className="flex flex-auto items-end -mt-64">
              <div className="flex items-center ml-auto mb-4">
                <Button variant="contained" color="secondary" component={NavLinkAdapter} to="edit">
                  <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
                  <span className="mx-8">Edit</span>
                </Button>
              </div>
            </div>
          )}

          <Typography className="mt-12 text-4xl font-bold truncate">
            {stringOperations.capitalizeWords(informe.tema)}
          </Typography>

          <Divider className="mt-16 mb-24" />

          <div className="flex flex-col space-y-32">
            <div className="flex flex-row">
              {informe.fechareunion && (
                <div className="flex items-center">
                  <FuseSvgIcon>heroicons-outline:cake</FuseSvgIcon>
                  <div className="ml-24 leading-6">
                    {format(new Date(informe.fechareunion), 'MMMM d, y')}
                  </div>
                </div>
              )}
            </div>

            {integrantes.length > 0 && (
              <div className="flex flex-col">
                <FuseSvgIcon>heroicons-outline:user-group</FuseSvgIcon>
                {integrantes.map((integrante) => (
                  <FormControlLabel
                    className="flex flex-row"
                    control={
                      <Checkbox
                        value={integrante.id}
                        key={integrante.id}
                        checked={informe.asistentes_ids.find((el) => el.id === integrante.id)}
                      />
                    }
                    label={integrante.name}
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

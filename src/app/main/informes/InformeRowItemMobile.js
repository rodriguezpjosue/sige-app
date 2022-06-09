import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Chip from '@mui/material/Chip';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { procesoOficinaInforme } from './store/informeSlice';
import { getInformes } from './store/informesSlice';
import stringOperations from '../../shared-components/stringOperations';

function InformeListItem(props) {
  const { informe } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleProcesoOficinaInforme() {
    dispatch(procesoOficinaInforme(informe.id)).then(() => {
      dispatch(getInformes()).then(() => {
        navigate(`/informes/${informe.id}`);
      });
    });
  }

  function getChipColor(informeState) {
    switch (informeState) {
      case 'pendiente':
        return 'warning';
      case 'observado':
        return 'error';
      case 'aprobado':
        return 'success';
      default:
        return 'default';
    }
  }

  return (
    <>
      <TableRow
        key={[informe.id, '-', informe.state].join()}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        className="MuiButtonBase-root"
      >
        <TableCell>
          {stringOperations.getLocaleDateTime(informe.fechareunion).toLocaleString()}
          <Chip
            key={informe.id}
            label={stringOperations.capitalizeFirst(informe.state)}
            className="mr-12 mb-12"
            size="small"
            color={getChipColor(informe.state)}
          />
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            color="secondary"
            component={NavLinkAdapter}
            to={`/informes/${informe.id}`}
          >
            <FuseSvgIcon size={20}>heroicons-outline:eye</FuseSvgIcon>
          </Button>
        </TableCell>
        <TableCell>
          {informe.state === 'draft' && (
            <Button variant="contained" color="secondary" onClick={handleProcesoOficinaInforme}>
              <FuseSvgIcon size={20}>heroicons-outline:arrow-sm-up</FuseSvgIcon>
            </Button>
          )}
        </TableCell>
      </TableRow>
    </>
  );
}

export default InformeListItem;

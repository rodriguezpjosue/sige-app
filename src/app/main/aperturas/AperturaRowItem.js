import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Chip from '@mui/material/Chip';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { procesoOficinaApertura } from './store/aperturaSlice';
import { getAperturas } from './store/aperturasSlice';
import stringOperations from '../../shared-components/stringOperations';

function AperturaListItem(props) {
  const { apertura } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleProcesoOficinaApertura() {
    dispatch(procesoOficinaApertura(apertura.id)).then(() => {
      dispatch(getAperturas()).then(() => {
        navigate(`/aperturas/${apertura.id}`);
      });
    });
  }

  function getChipColor(aperturaState) {
    switch (aperturaState) {
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
        key={[apertura.id, '-', apertura.state].join()}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        className="MuiButtonBase-root"
      >
        <TableCell>
          {stringOperations.getLocaleDateTime(apertura.fechareunion).toLocaleString()}
        </TableCell>
        <TableCell>{stringOperations.capitalizeFirst(apertura.tema)}</TableCell>
        <TableCell>
          {apertura.tiporeunion_id.length > 0 ? apertura.tiporeunion_id[0].name : ``}
        </TableCell>
        <TableCell>
          {apertura.state && (
            <Chip
              key={apertura.id}
              label={stringOperations.capitalizeFirst(apertura.state)}
              className="mr-12 mb-12"
              size="small"
              color={getChipColor(apertura.state)}
            />
          )}
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            color="secondary"
            component={NavLinkAdapter}
            to={`/aperturas/${apertura.id}`}
          >
            <FuseSvgIcon size={20}>heroicons-outline:eye</FuseSvgIcon>
            <span className="mx-8">Ver</span>
          </Button>
        </TableCell>
        <TableCell>
          {apertura.state === 'draft' && (
            <Button variant="contained" color="secondary" onClick={handleProcesoOficinaApertura}>
              <FuseSvgIcon size={20}>heroicons-outline:arrow-sm-up</FuseSvgIcon>
              <span className="mx-8">Procesar</span>
            </Button>
          )}
        </TableCell>
      </TableRow>
    </>
  );
}

export default AperturaListItem;

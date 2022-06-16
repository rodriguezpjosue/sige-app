import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Chip from '@mui/material/Chip';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
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
      case 'closed':
        return 'warning';
      case 'actas':
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
          {format(parseISO(apertura.fecha_inicio), 'dd/MM/yyyy')}
          <Chip
            key={apertura.id}
            label={stringOperations.capitalizeFirst(apertura.state)}
            className="mr-12 mb-12 ml-12"
            size="small"
            color={getChipColor(apertura.state)}
          />
        </TableCell>
        <TableCell>
          {apertura.curso_id[0].name} <br />
          {apertura.programa_id[0].name} <br />
          {apertura.modalidad} <br />
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            color="secondary"
            component={NavLinkAdapter}
            to={`/aperturas/${apertura.id}`}
          >
            <FuseSvgIcon size={20}>heroicons-outline:eye</FuseSvgIcon>
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}

export default AperturaListItem;

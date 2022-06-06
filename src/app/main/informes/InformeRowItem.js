import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
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

  return (
    <>
      <TableRow
        key={[informe.id, '-', informe.state].join()}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        className="MuiButtonBase-root"
      >
        <TableCell>
          {stringOperations.getLocaleDateTime(informe.fechareunion).toLocaleString()}
        </TableCell>
        <TableCell>{stringOperations.capitalizeFirst(informe.tema)}</TableCell>
        <TableCell>
          {informe.tiporeunion_id.length > 0 ? informe.tiporeunion_id[0].name : ``}
        </TableCell>
        <TableCell>{stringOperations.capitalizeFirst(informe.state)}</TableCell>
        <TableCell>
          <Button
            variant="contained"
            color="secondary"
            component={NavLinkAdapter}
            to={`/informes/${informe.id}`}
          >
            <FuseSvgIcon size={20}>heroicons-outline:eye</FuseSvgIcon>
            <span className="mx-8">Ver</span>
          </Button>
        </TableCell>
        <TableCell>
          {informe.state === 'draft' && (
            <Button variant="contained" color="secondary" onClick={handleProcesoOficinaInforme}>
              <FuseSvgIcon size={20}>heroicons-outline:arrow-sm-up</FuseSvgIcon>
              <span className="mx-8">Procesar</span>
            </Button>
          )}
        </TableCell>
      </TableRow>
    </>
  );
}

export default InformeListItem;

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { selectFilteredInformes, selectGroupedFilteredInformes } from './store/informesSlice';
import InformeRowItem from './InformeRowItem';

function InformesTable(props) {
  const filteredData = useSelector(selectFilteredInformes);
  const groupedFilteredInformes = useSelector(selectGroupedFilteredInformes);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="text.secondary" variant="h5">
          No has reportado informes aún.
        </Typography>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full max-h-full"
      style={{ padding: '1.2em' }}
    >
      {Object.entries(groupedFilteredInformes)
        .reverse()
        .map(([key, group]) => {
          return (
            <div key={key} className="relative">
              <Typography color="text.secondary" className="px-32 py-4 text-14 font-medium">
                {key}
              </Typography>
              <Divider />
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table" key={key}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Fecha de reunión</TableCell>
                        <TableCell>Tema</TableCell>
                        <TableCell>Tipo reunión</TableCell>
                        <TableCell>Situación</TableCell>
                        <TableCell>&nbsp;</TableCell>
                        <TableCell>&nbsp;</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {group.children.map((item) => (
                        <InformeRowItem key={item.id} informe={item} />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </div>
          );
        })}
    </motion.div>
  );
}

export default InformesTable;

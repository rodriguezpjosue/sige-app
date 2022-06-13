import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { BrowserView, MobileView } from 'react-device-detect';
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
import { selectFilteredAperturas, selectGroupedFilteredAperturas } from './store/aperturasSlice';
import AperturaRowItem from './AperturaRowItem';
import AperturaRowItemMobile from './AperturaRowItemMobile';

function AperturasTable(props) {
  const filteredData = useSelector(selectFilteredAperturas);
  const groupedFilteredAperturas = useSelector(selectGroupedFilteredAperturas);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="text.secondary" variant="h5">
          No tienes cursos a cargo aún.
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
      {Object.entries(groupedFilteredAperturas)
        .reverse()
        .map(([key, group]) => {
          return (
            <div key={key} className="relative">
              <Typography color="text.secondary" className="px-32 py-4 text-14 font-medium">
                {key}
              </Typography>
              <Divider />
              <Grid item xs={12}>
                <BrowserView>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table" key={key}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Fecha de inicio</TableCell>
                          <TableCell>Curso</TableCell>
                          <TableCell>Programa</TableCell>
                          <TableCell>Modalidad</TableCell>
                          <TableCell>Alumnos matriculados</TableCell>
                          <TableCell>Situación</TableCell>
                          <TableCell>&nbsp;</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.children.map((item) => (
                          <AperturaRowItem key={item.id} apertura={item} />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </BrowserView>
                <MobileView>
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table" key={key}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Fecha de inicio</TableCell>
                          <TableCell>Curso / Matriculados</TableCell>
                          <TableCell>&nbsp;</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.children.map((item) => (
                          <AperturaRowItemMobile key={item.id} apertura={item} />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </MobileView>
              </Grid>
            </div>
          );
        })}
    </motion.div>
  );
}

export default AperturasTable;

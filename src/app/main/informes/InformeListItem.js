import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import stringOperations from '../../shared-components/stringOperations';

function InformeListItem(props) {
  const { informe } = props;
  return (
    <>
      <ListItem
        className="px-32 py-16"
        sx={{ bgcolor: 'background.paper' }}
        button
        component={NavLinkAdapter}
        to={`/informes/${informe.id}`}
      >
        <ListItemAvatar>
          <Avatar alt={informe.name} src={`data:image/png;base64,${informe.image_small}`} />
        </ListItemAvatar>
        <ListItemText
          classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
          primary={stringOperations.capitalizeWords(informe.name)}
          secondary={
            <>
              <Typography
                className="inline"
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {informe.mobile ? informe.mobile : ``}
                <br />
                {informe.profesion_id.length > 0
                  ? stringOperations.capitalizeWords(informe.profesion_id[0].name)
                  : ``}
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider />
    </>
  );
}

export default InformeListItem;

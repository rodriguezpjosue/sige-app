import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import stringOperations from '../../shared-components/stringOperations';

function ContactListItem(props) {
  const { contact } = props;
  return (
    <>
      <ListItem
        className="px-32 py-16"
        sx={{ bgcolor: 'background.paper' }}
        button
        component={NavLinkAdapter}
        to={`/integrantes/${contact.id}`}
      >
        <ListItemAvatar>
          <Avatar alt={contact.name} src={`data:image/png;base64,${contact.image_small}`} />
        </ListItemAvatar>
        <ListItemText
          classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
          primary={stringOperations.capitalizeWords(contact.name)}
          secondary={
            <>
              <Typography
                className="inline"
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {contact.mobile ? contact.mobile : ``}
                <br />
                {contact.profesion_id.length > 0
                  ? stringOperations.capitalizeWords(contact.profesion_id[0].name)
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

export default ContactListItem;

import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/system/Box';
import format from 'date-fns/format';
import _ from '@lodash';
import stringOperations from '../../../shared-components/stringOperations';
import { getContact, selectContact } from '../store/integranteSlice';
import { selectCountries } from '../store/countriesSlice';
import { selectTags } from '../store/tagsSlice';

const ContactView = () => {
  const contact = useSelector(selectContact);
  const countries = useSelector(selectCountries);
  const tags = useSelector(selectTags);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const whiteSpace = ` `;

  useEffect(() => {
    dispatch(getContact(routeParams.id));
  }, [dispatch, routeParams]);

  function getCountryByIso(iso) {
    return countries.find((country) => country.iso === iso);
  }

  if (!contact) {
    return <FuseLoading />;
  }
  return (
    <>
      <Box
        className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
        sx={{
          backgroundColor: 'background.default',
        }}
      >
        {contact.background ? (
          <img
            className="absolute inset-0 object-cover w-full h-full"
            src={contact.background}
            alt="user background"
          />
        ) : (
          <img
            className="absolute inset-0 object-cover w-full h-full"
            src="https://react-material.fusetheme.com/assets/images/cards/14-640x480.jpg"
            alt="user background"
          />
        )}
      </Box>
      <div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
        <div className="w-full max-w-3xl">
          <div className="flex flex-auto items-end -mt-64">
            <Avatar
              sx={{
                borderWidth: 4,
                borderStyle: 'solid',
                borderColor: 'background.paper',
                backgroundColor: 'background.default',
                color: 'text.secondary',
              }}
              className="object-cover w-128 h-128 text-64 font-bold"
              src={`data:image/png;base64,${contact.image_small}`}
              alt={contact.name}
            >
              {stringOperations.capitalizeWords(contact.name.charAt(0))}
            </Avatar>
            <div className="flex items-center ml-auto mb-4">
              <Button variant="contained" color="secondary" component={NavLinkAdapter} to="edit">
                <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
                <span className="mx-8">Editar</span>
              </Button>
            </div>
          </div>

          <Typography className="mt-12 text-4xl font-bold truncate">
            {stringOperations.capitalizeWords(contact.nombre1) +
              whiteSpace +
              stringOperations.capitalizeWords(contact.apellido_paterno)}
          </Typography>

          <div className="flex flex-wrap items-center mt-8">
            {contact.cursos.map((curso) => (
              <Chip key={curso.id} label={curso.name} className="mr-12 mb-12" size="small" />
            ))}
          </div>

          <Divider className="mt-16 mb-24" />

          <div className="flex flex-col space-y-32">
            {contact.profesion_id.length > 0 && (
              <div className="flex items-center">
                <FuseSvgIcon>heroicons-outline:briefcase</FuseSvgIcon>
                <div className="ml-24 leading-6">{contact.profesion_id[0].name}</div>
              </div>
            )}

            {contact.lugar_trabajo && (
              <div className="flex items-center">
                <FuseSvgIcon>heroicons-outline:office-building</FuseSvgIcon>
                <div className="ml-24 leading-6">{contact.lugar_trabajo}</div>
              </div>
            )}

            {contact.email && (
              <div className="flex items-center">
                <FuseSvgIcon>heroicons-outline:mail</FuseSvgIcon>
                <div className="ml-24 leading-6">{contact.email.toLowerCase()}</div>
              </div>
            )}

            {contact.mobile && (
              <div className="flex items-center">
                <FuseSvgIcon>heroicons-outline:phone</FuseSvgIcon>
                <div className="ml-24 leading-6">{contact.mobile}</div>
              </div>
            )}

            {contact.street && (
              <div className="flex items-center">
                <FuseSvgIcon>heroicons-outline:location-marker</FuseSvgIcon>
                <div className="ml-24 leading-6">{contact.street}</div>
              </div>
            )}

            {contact.fecha_nacimiento && (
              <div className="flex items-center">
                <FuseSvgIcon>heroicons-outline:cake</FuseSvgIcon>
                <div className="ml-24 leading-6">
                  {format(new Date(contact.fecha_nacimiento), 'dd/MM/yyyy')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactView;
